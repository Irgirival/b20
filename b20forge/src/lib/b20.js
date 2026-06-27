/**
 * B20 Forge — Factory helpers
 * Menggunakan viem untuk ABI encoding yang aman dan benar.
 *
 * Catatan: B20_FACTORY_ADDRESS di bawah adalah placeholder.
 * Ganti dengan alamat factory yang benar setelah deploy kontrak kamu sendiri,
 * atau gunakan alamat factory resmi jika tersedia.
 */

import { encodeFunctionData, parseUnits } from 'viem'

// ─── Konstanta ──────────────────────────────────────────────────────────────

/** Ganti dengan alamat factory B20 yang kamu gunakan */
export const B20_FACTORY_ADDRESS = '0x0000000000000000000000000000000000000000'

export const B20_VARIANT = {
  ASSET: 0,       // ERC-20 standar dengan fitur compliance opsional
  STABLECOIN: 1,  // ERC-20 dengan 6 desimal fixed, cocok untuk stablecoin
}

// ─── ABI ────────────────────────────────────────────────────────────────────

/**
 * ABI minimal untuk B20 Factory.
 * Sesuaikan dengan ABI kontrak factory yang kamu deploy.
 */
export const B20_FACTORY_ABI = [
  {
    name: 'createToken',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'variant',      type: 'uint8'   },
      { name: 'name',         type: 'string'  },
      { name: 'symbol',       type: 'string'  },
      { name: 'decimals',     type: 'uint8'   },
      { name: 'admin',        type: 'address' },
      { name: 'supplyCap',    type: 'uint256' },
      { name: 'allowlist',    type: 'bool'    },
      { name: 'freeze',       type: 'bool'    },
      { name: 'memos',        type: 'bool'    },
      { name: 'permit',       type: 'bool'    },
    ],
    outputs: [{ name: 'token', type: 'address' }],
  },
  {
    name: 'TokenCreated',
    type: 'event',
    inputs: [
      { name: 'token',    type: 'address', indexed: true  },
      { name: 'variant',  type: 'uint8',   indexed: false },
      { name: 'admin',    type: 'address', indexed: true  },
      { name: 'name',     type: 'string',  indexed: false },
      { name: 'symbol',   type: 'string',  indexed: false },
    ],
  },
]

// ─── Helper ──────────────────────────────────────────────────────────────────

/**
 * Build calldata untuk createToken menggunakan viem encodeFunctionData.
 */
export function buildCreateTokenCalldata({
  variant = B20_VARIANT.ASSET,
  name,
  symbol,
  adminAddress,
  decimals = 18,
  supplyCap = '0',
  allowlist = false,
  freeze = false,
  memos = false,
  permit = false,
}) {
  // Stablecoin selalu pakai 6 desimal
  const finalDecimals = variant === B20_VARIANT.STABLECOIN ? 6 : Number(decimals)

  // Parse supply cap: 0 = tidak terbatas
  let capBigInt = 0n
  if (supplyCap && supplyCap !== '0') {
    const clean = supplyCap.replace(/,/g, '')
    capBigInt = parseUnits(clean, finalDecimals)
  }

  return encodeFunctionData({
    abi: B20_FACTORY_ABI,
    functionName: 'createToken',
    args: [variant, name, symbol, finalDecimals, adminAddress, capBigInt, allowlist, freeze, memos, permit],
  })
}

/**
 * Parse token address dari receipt logs (event TokenCreated).
 * Ambil dari topics[1] (indexed address).
 */
export function parseTokenAddressFromReceipt(receipt) {
  const log = receipt?.logs?.find(
    (l) => l.topics?.[0] && l.address
  )
  if (!log) return null
  // address ada di topics[1], padded 32 bytes — ambil 20 byte terakhir
  const topic = log.topics[1]
  if (!topic) return log.address || null
  return '0x' + topic.slice(-40)
}
