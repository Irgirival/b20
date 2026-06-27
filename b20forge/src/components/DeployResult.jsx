export default function DeployResult({ status, txHash, tokenAddress, error, onReset }) {
  if (status === 'idle') return null

  const basescanTx = txHash ? `https://basescan.org/tx/${txHash}` : null
  const basescanToken = tokenAddress ? `https://basescan.org/token/${tokenAddress}` : null

  if (status === 'pending') {
    return (
      <div className="mt-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-zinc-300 border-t-[#0052FF] rounded-full animate-spin flex-shrink-0" />
        <div>
          <div className="text-sm font-medium text-zinc-800">Menunggu konfirmasi wallet…</div>
          <div className="text-xs text-zinc-400 mt-0.5">Cek MetaMask / wallet kamu</div>
        </div>
      </div>
    )
  }

  if (status === 'confirming') {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-blue-200 border-t-[#0052FF] rounded-full animate-spin flex-shrink-0" />
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
  }

  if (status === 'success') {
    return (
      <div className="mt-4 p-5 bg-green-50 rounded-xl border border-green-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm font-bold">✓</div>
          <div className="font-semibold text-green-800">Token berhasil di-deploy!</div>
        </div>

        {tokenAddress && (
          <div className="mb-2">
            <div className="text-xs text-green-600 font-medium mb-1">Alamat Token</div>
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-green-100">
              <code className="text-xs font-mono text-zinc-700 flex-1 truncate">{tokenAddress}</code>
              <button
                onClick={() => navigator.clipboard.writeText(tokenAddress)}
                className="text-xs text-[#0052FF] border-0 bg-transparent cursor-pointer font-medium hover:underline"
              >
                Salin
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          {basescanTx && (
            <a href={basescanTx} target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors no-underline font-medium">
              Lihat Tx ↗
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
            className="text-xs px-3 py-1.5 bg-white border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer font-medium ml-auto"
          >
            Deploy Lagi
          </button>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold flex-shrink-0 mt-0.5">✕</div>
          <div className="flex-1">
            <div className="text-sm font-medium text-red-800 mb-1">Deploy gagal</div>
            <div className="text-xs text-red-600 leading-relaxed">{error}</div>
            <button
              onClick={onReset}
              className="text-xs px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer font-medium mt-2"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
