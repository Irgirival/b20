import { useState } from 'react'
import { useWalletClient, usePublicClient, useAccount } from 'wagmi'
import { base } from '../lib/wagmi'
import { B20_TOKEN_ABI } from '../lib/b20'
import { parseUnits } from 'viem'

// Convert raw viem/wallet errors to human-readable Indonesian messages
export function parseError(err) {
  if (!err) return 'Terjadi kesalahan tidak diketahui'
  const msg = err.message || err.toString()

  if (err.code === 4001 || msg.includes('User rejected') || msg.includes('user rejected'))
    return 'Transaksi dibatalkan di wallet kamu'
  if (msg.includes('insufficient funds') || msg.includes('insufficient balance'))
    return 'Saldo ETH di wallet tidak cukup untuk membayar gas'
  if (msg.includes('nonce too low') || msg.includes('nonce'))
    return 'Konflik transaksi. Coba reset nonce di MetaMask (Settings → Advanced → Reset Account)'
  if (msg.includes('gas required exceeds allowance') || msg.includes('out of gas'))
    return 'Gas limit terlalu kecil. Coba lagi, transaksi akan diestimasi ulang'
  if (msg.includes('execution reverted') || msg.includes('reverted'))
    return 'Transaksi gagal di blockchain. Kemungkinan kamu bukan admin/minter token ini'
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('RPC'))
    return 'Koneksi ke jaringan Base bermasalah. Periksa koneksi internet dan coba lagi'
  if (msg.includes('already known') || msg.includes('replacement transaction'))
    return 'Transaksi dengan nonce sama sudah ada. Tunggu atau percepat transaksi sebelumnya'
  if (msg.includes('unpredictable gas limit'))
    return 'Tidak bisa mengestimasi gas. Pastikan kamu punya izin untuk aksi ini'
  if (msg.includes('wrong chain') || msg.includes('chain mismatch'))
    return 'Jaringan salah. Pastikan wallet kamu di Base Mainnet'

  // Fallback: shorten long technical messages
  if (msg.length > 120) return msg.slice(0, 120) + '...'
  return msg
}

export function useMintToken() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient({ chainId: base.id })

  const [status, setStatus] = useState('idle') // idle | pending | confirming | success | error
  const [txHash, setTxHash] = useState(null)
  const [error, setError] = useState(null)

  async function mint({ tokenAddress, toAddress, amount, decimals }) {
    if (!walletClient || !address) throw new Error('Wallet tidak terhubung')
    setStatus('pending')
    setError(null)
    setTxHash(null)

    try {
      const amountWei = parseUnits(amount.toString(), Number(decimals))

      const hash = await walletClient.writeContract({
        address: tokenAddress,
        abi: B20_TOKEN_ABI,
        functionName: 'mint',
        args: [toAddress, amountWei],
        chain: base,
      })

      setTxHash(hash)
      setStatus('confirming')

      await publicClient.waitForTransactionReceipt({ hash })
      setStatus('success')
    } catch (e) {
      setStatus('error')
      setError(parseError(e))
    }
  }

  function reset() {
    setStatus('idle')
    setTxHash(null)
    setError(null)
  }

  return { mint, status, txHash, error, reset }
}
