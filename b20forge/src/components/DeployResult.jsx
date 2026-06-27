import { useState } from 'react'
import MintPanel from './MintPanel'

export default function DeployResult({ status, txHash, tokenAddress, error, onReset, tokenSymbol, decimals }) {
  const [mintDone, setMintDone] = useState(false)

  if (status === 'idle') return null

  const basescanTx    = txHash       ? `https://basescan.org/tx/${txHash}`          : null
  const basescanToken = tokenAddress ? `https://basescan.org/token/${tokenAddress}` : null

  if (status === 'checking') return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
      <Spinner />
      <div>
        <div className="text-sm font-medium text-[#0052FF]">Memeriksa aktivasi B20…</div>
        <div className="text-xs text-blue-400 mt-0.5">Verifikasi dengan Base Activation Registry</div>
      </div>
    </div>
  )

  if (status === 'pending') return (
    <div className="mt-4 p-4 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center gap-3">
      <Spinner color="#71717a" />
      <div>
        <div className="text-sm font-medium text-zinc-700">Menunggu konfirmasi wallet…</div>
        <div className="text-xs text-zinc-400 mt-0.5">Cek MetaMask atau wallet kamu</div>
      </div>
    </div>
  )

  if (status === 'confirming') return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
      <Spinner />
      <div>
        <div className="text-sm font-medium text-[#0052FF]">Transaksi terkirim, menunggu konfirmasi…</div>
        {basescanTx && (
          <a href={basescanTx} target="_blank" rel="noopener noreferrer"
            className="text-xs text-[#0052FF] underline mt-0.5 block opacity-70 hover:opacity-100">
            Lihat di Basescan ↗
          </a>
        )}
      </div>
    </div>
  )

  if (status === 'success') return (
    <div className="mt-4 flex flex-col gap-3">
      {/* Banner sukses */}
      <div className="p-5 bg-green-50 border border-green-100 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm font-bold flex-shrink-0">✓</div>
          <div className="font-semibold text-green-800 text-sm">Token berhasil di-deploy!</div>
        </div>

        {tokenAddress && (
          <div className="mb-3">
            <div className="text-xs text-green-600 font-medium mb-1.5">Alamat Token</div>
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-green-100">
              <code className="text-xs font-mono text-zinc-700 flex-1 break-all">{tokenAddress}</code>
              <button
                onClick={() => navigator.clipboard.writeText(tokenAddress)}
                className="text-xs text-[#0052FF] bg-transparent border-0 cursor-pointer font-medium hover:underline flex-shrink-0"
              >
                Salin
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {basescanTx && (
            <a href={basescanTx} target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors no-underline font-medium">
              Lihat Transaksi ↗
            </a>
          )}
          {basescanToken && (
            <a href={basescanToken} target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors no-underline font-medium">
              Lihat Token ↗
            </a>
          )}
          <button
            onClick={onReset}
            className="text-xs px-3 py-1.5 bg-white border border-zinc-200 text-zinc-500 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer font-medium ml-auto"
          >
            Deploy Lagi
          </button>
        </div>
      </div>

      {/* MintPanel — supply masih 0 setelah deploy */}
      {!mintDone && tokenAddress && (
        <MintPanel
          tokenAddress={tokenAddress}
          tokenSymbol={tokenSymbol || 'TOKEN'}
          decimals={decimals || 18}
          onNext={() => setMintDone(true)}
        />
      )}

      {/* Next steps setelah mint */}
      {mintDone && (
        <div className="bg-white border border-zinc-100 rounded-xl p-4">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Langkah Selanjutnya</div>
          <div className="flex flex-col gap-2">
            <a href={`https://aerodrome.finance/liquidity?token=${tokenAddress}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2.5 border border-zinc-100 rounded-lg hover:bg-zinc-50 transition-colors no-underline">
              <div>
                <div className="text-sm font-medium text-zinc-900">Tambah Likuiditas</div>
                <div className="text-xs text-zinc-400 mt-0.5">Aerodrome Finance — DEX terbesar di Base</div>
              </div>
              <span className="text-zinc-300 text-sm">↗</span>
            </a>
            <a href="#/history"
              className="flex items-center justify-between px-3 py-2.5 border border-zinc-100 rounded-lg hover:bg-zinc-50 transition-colors no-underline">
              <div>
                <div className="text-sm font-medium text-zinc-900">Token Saya</div>
                <div className="text-xs text-zinc-400 mt-0.5">Lihat semua token yang sudah kamu deploy</div>
              </div>
              <span className="text-zinc-300 text-sm">→</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )

  if (status === 'error') return (
    <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl">
      <div className="flex items-start gap-2">
        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xs font-bold flex-shrink-0 mt-0.5">✕</div>
        <div className="flex-1">
          <div className="text-sm font-medium text-red-700 mb-1">Deploy gagal</div>
          <div className="text-xs text-red-500 leading-relaxed">{error}</div>
          <button
            onClick={onReset}
            className="mt-2 text-xs px-3 py-1.5 bg-white border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer font-medium"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  )

  return null
}

function Spinner({ color = '#0052FF' }) {
  return (
    <div style={{
      width: 18, height: 18,
      borderRadius: '50%',
      border: `2px solid ${color}22`,
      borderTopColor: color,
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  )
}
