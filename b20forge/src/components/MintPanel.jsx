import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useMintToken } from '../hooks/useMintToken'

export default function MintPanel({ tokenAddress, tokenSymbol, decimals, onNext }) {
  const { address } = useAccount()
  const { mint, status, txHash, error, reset } = useMintToken()

  const [toAddress, setToAddress] = useState(address || '')
  const [amount, setAmount] = useState('1000000')

  const isLoading = status === 'pending' || status === 'confirming'
  const isSuccess = status === 'success'

  async function handleMint() {
    if (!toAddress || !amount) return
    await mint({ tokenAddress, toAddress, amount, decimals })
  }

  if (isSuccess) {
    return (
      <div className="p-5 bg-green-50 border border-green-100 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-600 text-lg">✓</span>
          <span className="font-semibold text-green-800 text-sm">Mint berhasil!</span>
        </div>
        <p className="text-xs text-green-700 mb-3">
          <strong>{Number(amount).toLocaleString('id-ID')} {tokenSymbol}</strong> sudah terkirim ke wallet.
        </p>
        {txHash && (
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-green-700 underline block mb-3"
          >
            Lihat transaksi ↗
          </a>
        )}
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="flex-1 py-2 text-xs font-medium border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            Mint lagi
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-2 text-xs font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Selesai →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-amber-50 border border-amber-100 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-amber-100 flex items-center gap-2">
        <span className="text-amber-500">⚠</span>
        <span className="text-sm font-semibold text-amber-800">Supply token masih 0</span>
      </div>

      <div className="p-4">
        <p className="text-xs text-amber-700 mb-4 leading-relaxed">
          Token kamu sudah live, tapi belum ada supply. Mint sekarang agar token bisa didistribusikan dan listing di DEX.
        </p>

        {/* Form */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-medium text-amber-800 mb-1.5">
              Kirim ke alamat
            </label>
            <input
              type="text"
              value={toAddress}
              onChange={e => setToAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 text-xs border border-amber-200 rounded-lg bg-white text-zinc-900 placeholder-zinc-300 focus:border-amber-400 focus:outline-none font-mono"
            />
            <button
              onClick={() => setToAddress(address || '')}
              className="text-[11px] text-amber-600 mt-1 hover:underline"
            >
              Pakai wallet saya ({address?.slice(0,6)}...{address?.slice(-4)})
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-amber-800 mb-1.5">
              Jumlah {tokenSymbol}
            </label>
            <input
              type="text"
              value={amount}
              onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="1000000"
              className="w-full px-3 py-2 text-xs border border-amber-200 rounded-lg bg-white text-zinc-900 placeholder-zinc-300 focus:border-amber-400 focus:outline-none"
            />
            <div className="flex gap-2 mt-1.5">
              {['1000000', '100000000', '1000000000'].map(v => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                >
                  {Number(v).toLocaleString('id-ID')}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg">
              <span className="text-red-400 text-xs mt-0.5 flex-shrink-0">✕</span>
              <span className="text-xs text-red-700">{error}</span>
            </div>
          )}

          <button
            onClick={handleMint}
            disabled={isLoading || !toAddress || !amount}
            className="w-full py-2.5 rounded-lg bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                {status === 'confirming' ? 'Menunggu konfirmasi...' : 'Kirim transaksi...'}
              </>
            ) : (
              `Mint ${tokenSymbol} sekarang`
            )}
          </button>

          <button
            onClick={onNext}
            className="text-xs text-zinc-400 hover:text-zinc-600 text-center"
          >
            Lewati, mint nanti →
          </button>
        </div>
      </div>
    </div>
  )
}
