import { useState } from 'react'
import { useWalletClient, usePublicClient, useAccount } from 'wagmi'
import { base } from '../lib/wagmi'
import {
  B20_FACTORY_ADDRESS,
  ACTIVATION_REGISTRY_ADDRESS,
  ACTIVATION_REGISTRY_ABI,
  buildCreateB20Calldata,
  parseTokenAddressFromReceipt,
  B20_VARIANT,
} from '../lib/b20'
import { keccak256, toBytes } from 'viem'

export function useDeployToken() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient({ chainId: base.id })

  const [status, setStatus]           = useState('idle') // idle | checking | pending | confirming | success | error
  const [txHash, setTxHash]           = useState(null)
  const [tokenAddress, setTokenAddress] = useState(null)
  const [error, setError]             = useState(null)

  async function deploy(formData) {
    if (!walletClient || !address) {
      setError('Wallet tidak terhubung')
      setStatus('error')
      return
    }

    setStatus('checking')
    setError(null)
    setTxHash(null)
    setTokenAddress(null)

    try {
      // ── 1. Cek apakah B20 sudah aktif di Base Mainnet ──────────────────
      const featureKey =
        formData.variant === B20_VARIANT.STABLECOIN
          ? keccak256(toBytes('base.b20_stablecoin'))
          : keccak256(toBytes('base.b20_asset'))

      const isActivated = await publicClient.readContract({
        address: ACTIVATION_REGISTRY_ADDRESS,
        abi: ACTIVATION_REGISTRY_ABI,
        functionName: 'isActivated',
        args: [featureKey],
      })

      if (!isActivated) {
        throw new Error(
          'B20 belum aktif di Base Mainnet. Coba lagi dalam beberapa menit setelah aktivasi selesai.'
        )
      }

      // ── 2. Build calldata dengan encoding yang benar ────────────────────
      setStatus('pending')

      const calldata = buildCreateB20Calldata({
        ...formData,
        adminAddress: address,
      })

      // ── 3. Kirim transaksi ke factory precompile ────────────────────────
      const hash = await walletClient.sendTransaction({
        to: B20_FACTORY_ADDRESS,
        data: calldata,
        gas: 500_000n,
        chain: base,
      })

      setTxHash(hash)
      setStatus('confirming')

      // ── 4. Tunggu konfirmasi ────────────────────────────────────────────
      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      if (receipt.status === 'success') {
        const tokenAddr = parseTokenAddressFromReceipt(receipt)
        setTokenAddress(tokenAddr)
        setStatus('success')
        saveToHistory({
          name:         formData.name,
          symbol:       formData.symbol,
          variant:      formData.variant,
          txHash:       hash,
          tokenAddress: tokenAddr,
          timestamp:    Date.now(),
        })
      } else {
        throw new Error('Transaksi ditolak di blockchain')
      }
    } catch (e) {
      setStatus('error')
      const msg = e?.shortMessage || e?.message || 'Terjadi kesalahan tidak diketahui'
      setError(msg.slice(0, 300))
    }
  }

  function reset() {
    setStatus('idle')
    setTxHash(null)
    setTokenAddress(null)
    setError(null)
  }

  return { deploy, status, txHash, tokenAddress, error, reset }
}

// ─── History (localStorage) ───────────────────────────────────────────────────

function saveToHistory(data) {
  try {
    const existing = JSON.parse(localStorage.getItem('b20forge_history') || '[]')
    existing.unshift(data)
    localStorage.setItem('b20forge_history', JSON.stringify(existing.slice(0, 50)))
  } catch (_) {}
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('b20forge_history') || '[]')
  } catch {
    return []
  }
}
