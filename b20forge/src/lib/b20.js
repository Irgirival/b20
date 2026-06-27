/**
 * B20 Forge — Factory helpers
 * Referensi: https://docs.base.org/get-started/launch-b20-token
 *
 * B20 adalah native precompile di Base — bukan smart contract biasa.
 * Factory address: 0xB20f000000000000000000000000000000000000 (sama di semua network Base)
 * Token yang dicreate akan punya address prefix 0xB200...
 */

import {
  encodeFunctionData,
  encodeAbiParameters,
  parseAbiParameters,
  parseUnits,
  keccak256,
  toBytes,
  toHex,
} from 'viem'

// ─── Konstanta ───────────────────────────────────────────────────────────────

/**
 * B20 Factory — native precompile Base
 * Sama di Base Mainnet, Base Sepolia, dan Vibenet
 */
export const B20_FACTORY_ADDRESS = '0xB20f000000000000000000000000000000000000'

/**
 * Activation Registry precompile — untuk cek apakah B20 sudah aktif
 */
export const ACTIVATION_REGISTRY_ADDRESS = '0x8453000000000000000000000000000000000001'

/**
 * Role constants (keccak256 dari nama role)
 * Sama persis dengan yang ada di kontrak B20
 */
export const B20_ROLES = {
  DEFAULT_ADMIN: '0x0000000000000000000000000000000000000000000000000000000000000000',
  MINT_ROLE: keccak256(toBytes('MINT_ROLE')),
  BURN_ROLE: keccak256(toBytes('BURN_ROLE')),
  FREEZE_ROLE: keccak256(toBytes('FREEZE_ROLE')),
  ALLOWLIST_ROLE: keccak256(toBytes('ALLOWLIST_ROLE')),
}

/**
 * Supply cap sentinel: type(uint128).max = tidak terbatas
 */
export const NO_SUPPLY_CAP = 2n ** 128n - 1n

export const B20_VARIANT = {
  ASSET: 0,       // ERC-20 dengan decimals 6–18, fleksibel
  STABLECOIN: 1,  // Fixed 6 decimals, ada fiat currency code (mis: "USD")
}

// ─── ABI ─────────────────────────────────────────────────────────────────────

/**
 * ABI B20 Factory precompile.
 * Fungsi utama: createB20(variant, salt, params, initCalls)
 */
export const B20_FACTORY_ABI = [
  {
    name: 'createB20',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'variant',   type: 'uint8'   },
      { name: 'salt',      type: 'bytes32' },
      { name: 'params',    type: 'bytes'   },
      { name: 'initCalls', type: 'bytes[]' },
    ],
    outputs: [{ name: 'token', type: 'address' }],
  },
  // Event yang di-emit factory saat token berhasil dibuat
  {
    name: 'B20Created',
    type: 'event',
    inputs: [
      { name: 'token',   type: 'address', indexed: true  },
      { name: 'variant', type: 'uint8',   indexed: false },
      { name: 'admin',   type: 'address', indexed: true  },
    ],
  },
]

/**
 * ABI untuk fungsi-fungsi pada token B20 yang sudah dibuat
 * (dipakai untuk initCalls dan interaksi post-deploy)
 */
export const B20_TOKEN_ABI = [
  {
    name: 'grantRole',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'role',    type: 'bytes32' },
      { name: 'account', type: 'address' },
    ],
    outputs: [],
  },
  {
    name: 'updateSupplyCap',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'newCap', type: 'uint128' }],
    outputs: [],
  },
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to',     type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
]

/**
 * ABI Activation Registry — untuk cek apakah B20 sudah aktif di network
 */
export const ACTIVATION_REGISTRY_ABI = [
  {
    name: 'isActivated',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'featureKey', type: 'bytes32' }],
    outputs: [{ name: '', type: 'bool' }],
  },
]

// ─── Encoding Helpers ─────────────────────────────────────────────────────────

/**
 * Encode params untuk ASSET token.
 * Format: abi.encode(string name, string symbol, address admin, uint8 decimals)
 * Decimals harus dalam range [6, 18].
 */
export function encodeAssetParams({ name, symbol, adminAddress, decimals = 18 }) {
  const dec = Math.min(18, Math.max(6, Number(decimals)))
  return encodeAbiParameters(
    parseAbiParameters('string, string, address, uint8'),
    [name, symbol, adminAddress, dec]
  )
}

/**
 * Encode params untuk STABLECOIN token.
 * Format: abi.encode(string name, string symbol, address admin, string currencyCode)
 * currencyCode: 3-char ISO uppercase, mis: "USD", "IDR", "EUR"
 */
export function encodeStablecoinParams({ name, symbol, adminAddress, currencyCode = 'USD' }) {
  const code = currencyCode.toUpperCase().slice(0, 3)
  return encodeAbiParameters(
    parseAbiParameters('string, string, address, string'),
    [name, symbol, adminAddress, code]
  )
}

/**
 * Encode initCall untuk grantRole.
 * Dipanggil atomically saat createB20 — sebelum token exist sebagai contract address.
 */
export function encodeGrantRole(role, accountAddress) {
  return encodeFunctionData({
    abi: B20_TOKEN_ABI,
    functionName: 'grantRole',
    args: [role, accountAddress],
  })
}

/**
 * Encode initCall untuk set supply cap.
 * Gunakan NO_SUPPLY_CAP untuk tidak terbatas.
 */
export function encodeUpdateSupplyCap(capAmount) {
  return encodeFunctionData({
    abi: B20_TOKEN_ABI,
    functionName: 'updateSupplyCap',
    args: [BigInt(capAmount)],
  })
}

// ─── Main Builder ─────────────────────────────────────────────────────────────

/**
 * Build calldata lengkap untuk createB20.
 *
 * @param {object} opts
 * @param {number}  opts.variant      - B20_VARIANT.ASSET atau B20_VARIANT.STABLECOIN
 * @param {string}  opts.name         - Nama token, mis: "My Token"
 * @param {string}  opts.symbol       - Simbol token, mis: "MTK"
 * @param {string}  opts.adminAddress - Wallet yang jadi admin & minter
 * @param {number}  opts.decimals     - 6–18 (ASSET only, STABLECOIN fixed 6)
 * @param {string}  opts.currencyCode - "USD"/"IDR"/dll (STABLECOIN only)
 * @param {string}  opts.supplyCap    - Supply maksimum (string angka), "" = tidak terbatas
 * @param {boolean} opts.allowlist    - Aktifkan allowlist role
 * @param {boolean} opts.freeze       - Aktifkan freeze role
 * @param {boolean} opts.memos        - Aktifkan memos di transfer
 * @param {boolean} opts.permit       - Aktifkan ERC-2612 permit
 */
export function buildCreateB20Calldata({
  variant = B20_VARIANT.ASSET,
  name,
  symbol,
  adminAddress,
  decimals = 18,
  currencyCode = 'USD',
  supplyCap = '',
  allowlist = false,
  freeze = false,
  memos = false,
  permit = true,
}) {
  // 1. Salt unik per token — pakai symbol + timestamp
  const saltInput = `b20forge:${symbol}:${Date.now()}`
  const salt = keccak256(toBytes(saltInput))

  // 2. Encode params sesuai variant
  const params =
    variant === B20_VARIANT.STABLECOIN
      ? encodeStablecoinParams({ name, symbol, adminAddress, currencyCode })
      : encodeAssetParams({ name, symbol, adminAddress, decimals })

  // 3. Build initCalls — dieksekusi atomically saat create
  const initCalls = []

  // Grant MINT_ROLE ke admin agar bisa mint setelah deploy
  initCalls.push(encodeGrantRole(B20_ROLES.MINT_ROLE, adminAddress))

  // Set supply cap jika diisi
  if (supplyCap && supplyCap !== '0') {
    const finalDecimals = variant === B20_VARIANT.STABLECOIN ? 6 : Number(decimals)
    const cleanCap = supplyCap.replace(/,/g, '')
    const capBigInt = parseUnits(cleanCap, finalDecimals)
    // Cap tidak boleh melebihi uint128.max
    const safeCap = capBigInt > NO_SUPPLY_CAP ? NO_SUPPLY_CAP : capBigInt
    initCalls.push(encodeUpdateSupplyCap(safeCap))
  }

  // Grant role tambahan sesuai toggle
  if (allowlist) initCalls.push(encodeGrantRole(B20_ROLES.ALLOWLIST_ROLE, adminAddress))
  if (freeze)    initCalls.push(encodeGrantRole(B20_ROLES.FREEZE_ROLE, adminAddress))
  if (permit) {
    // Permit tidak perlu role khusus — sudah built-in di B20
    // (flag ini untuk UI preview saja, tidak ada initCall yang diperlukan)
  }
  if (memos) {
    // Memos juga built-in — tidak perlu role, selalu aktif di B20
  }

  // 4. Encode calldata final
  return encodeFunctionData({
    abi: B20_FACTORY_ABI,
    functionName: 'createB20',
    args: [variant, salt, params, initCalls],
  })
}

// ─── Receipt Parser ───────────────────────────────────────────────────────────

/**
 * Parse token address dari receipt logs setelah createB20.
 * B20Created event: topics[1] = token address (indexed)
 */
export function parseTokenAddressFromReceipt(receipt) {
  if (!receipt?.logs?.length) return null

  // Cari log dari factory address
  const factoryLog = receipt.logs.find(
    (l) => l.address?.toLowerCase() === B20_FACTORY_ADDRESS.toLowerCase()
  )

  if (factoryLog?.topics?.[1]) {
    // topics[1] adalah token address, padded 32 bytes
    return '0x' + factoryLog.topics[1].slice(-40)
  }

  // Fallback: token B20 punya address prefix 0xB200
  const b20Log = receipt.logs.find(
    (l) => l.address?.toLowerCase().startsWith('0xb200')
  )
  if (b20Log) return b20Log.address

  // Last resort: ambil address dari log pertama
  return receipt.logs[0]?.address || null
}
