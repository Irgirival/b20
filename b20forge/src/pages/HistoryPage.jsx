import { useState, useEffect } from 'react'

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('b20forge_history') || '[]')
  } catch {
    return []
  }
}

function clearHistory() {
  localStorage.removeItem('b20forge_history')
}

export default function HistoryPage() {
  const [items, setItems] = useState([])
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    setItems(getHistory())
  }, [])

  function copyAddress(addr) {
    navigator.clipboard.writeText(addr).then(() => {
      setCopied(addr)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  function handleClear() {
    if (!confirm('Hapus semua history? Data di blockchain tetap aman, hanya catatan lokal yang dihapus.')) return
    clearHistory()
    setItems([])
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">📋</div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">Belum ada history</h2>
        <p className="text-sm text-zinc-400">Token yang kamu deploy akan muncul di sini. History disimpan di browser kamu.</p>
        <a href="/" className="inline-block mt-6 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors">
          Deploy token pertama →
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Token kamu</h1>
          <p className="text-xs text-zinc-400 mt-0.5">{items.length} token · Tersimpan di browser</p>
        </div>
        <button
          onClick={handleClear}
          className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
        >
          Hapus semua
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4">
              {/* Token header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#0052FF] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {(item.symbol || item.name || '?').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-zinc-900 text-sm">{item.name}</div>
                  <div className="text-xs text-zinc-400">
                    {item.symbol} · {item.variant === 1 ? 'Stablecoin' : 'Asset'} · {item.decimals} desimal
                  </div>
                </div>
                <div className="text-xs text-zinc-300">
                  {new Date(item.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              {/* Addresses */}
              <div className="flex flex-col gap-1.5">
                {item.tokenAddress && (
                  <div className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-[10px] text-zinc-400 mb-0.5">Alamat token</div>
                      <div className="font-mono text-xs text-zinc-700 truncate max-w-[200px] sm:max-w-none">
                        {item.tokenAddress}
                      </div>
                    </div>
                    <button
                      onClick={() => copyAddress(item.tokenAddress)}
                      className="flex-shrink-0 text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
                    >
                      {copied === item.tokenAddress ? '✓' : '⎘'}
                    </button>
                  </div>
                )}
                {item.txHash && (
                  <div className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-[10px] text-zinc-400 mb-0.5">Transaction hash</div>
                      <div className="font-mono text-xs text-zinc-500 truncate max-w-[200px] sm:max-w-none">
                        {item.txHash}
                      </div>
                    </div>
                    <a
                      href={`https://basescan.org/tx/${item.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-xs text-[#0052FF] hover:underline"
                    >
                      ↗
                    </a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                {item.tokenAddress && (
                  <>
                    <a
                      href={`https://basescan.org/token/${item.tokenAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-zinc-600 hover:bg-gray-50 transition-colors"
                    >
                      Basescan ↗
                    </a>
                    <a
                      href={`https://aerodrome.finance/liquidity?token=${item.tokenAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-zinc-600 hover:bg-gray-50 transition-colors"
                    >
                      Add Liquidity ↗
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-zinc-300 mt-6">
        History hanya tersimpan di browser ini. Token di blockchain tidak terpengaruh.
      </p>
    </div>
  )
}
