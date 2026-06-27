import { useState } from 'react'
import { useWalletClient, usePublicClient, useAccount } from 'wagmi'
import { base } from '../lib/wagmi'
import {
  B20_FACTORY_ADDRESS,
  buildCreateTokenCalldata,
  parseTokenAddressFromReceipt,
} from '../lib/b20'

export function useDeployToken() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient({ chainId: base.id })

  const [status, setStatus] = useState('idle') // idle | pending | confirming | success | error
  const [txHash, setTxHash] = useState(null)
  const [tokenAddress, setTokenAddress] = useState(null)
  const [error, setError] = useState(null)

  async function deploy(formData) {
    if (!walletClient || !address) {
      setError('Wallet tidak terhubung')
      setStatus('error')
      return
    }

    setStatus('pending')
    setError(null)
    setTxHash(null)
    setTokenAddress(null)

    try {
      const calldata = buildCreateTokenCalldata({
        ...formData,
        adminAddress: address,
      })

      const hash = await walletClient.sendTransaction({
        to: B20_FACTORY_ADDRESS,
        data: calldata,
        gas: 500_000n,
        chain: base,
      })

      setTxHash(hash)
      setStatus('confirming')

      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      if (receipt.status === 'success') {
        const tokenAddr = parseTokenAddressFromReceipt(receipt)
        setTokenAddress(tokenAddr)
        setStatus('success')
        saveToHistory({
          name: formData.name,
          symbol: formData.symbol,
          variant: formData.variant,
          txHash: hash,
          tokenAddress: tokenAddr,
          timestamp: Date.now(),
        })
      } else {
        throw new Error('Transaksi ditolak di blockchain')
      }
    } catch (e) {
      setStatus('error')
      // Bersihkan pesan error dari MetaMask agar lebih mudah dibaca
      const msg = e?.shortMessage || e?.message || 'Terjadi kesalahan tidak diketahui'
      setError(msg.slice(0, 200))
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

// ─── History (localStorage) ───────────────────────────────────────────────

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
