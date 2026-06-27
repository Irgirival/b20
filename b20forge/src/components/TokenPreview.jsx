import { B20_VARIANT } from '../lib/b20'

export default function TokenPreview({ form, toggles }) {
  const { name, symbol, decimals, supplyCap, variant } = form
  const hasData = name || symbol

  if (!hasData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center gap-2">
        <div className="w-12 h-12 rounded-xl border-2 border-dashed border-zinc-200 flex items-center justify-center text-zinc-300 text-xl">
          ◻
        </div>
        <p className="text-sm text-zinc-400">Isi form untuk melihat preview token</p>
      </div>
    )
  }

  const initial = (symbol || name || '?').slice(0, 2).toUpperCase()
  const finalDecimals = variant === B20_VARIANT.STABLECOIN ? 6 : decimals

  const capDisplay = supplyCap && supplyCap !== '0'
    ? Number(supplyCap.replace(/,/g, '')).toLocaleString('id-ID')
    : '∞ Tidak terbatas'

  const Row = ({ label, children }) => (
    <div className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-50 last:border-0">
      <span className="text-zinc-400">{label}</span>
      {children}
    </div>
  )

  const Badge = ({ on }) => (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
      on ? 'bg-blue-50 text-[#0052FF]' : 'bg-zinc-100 text-zinc-400'
    }`}>
      {on ? 'Aktif' : 'Nonaktif'}
    </span>
  )

  return (
    <div className="p-5">
      {/* Token identity */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0052FF] to-[#004AE3] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
          {initial}
        </div>
        <div>
          <div className="font-semibold text-zinc-900 text-base leading-tight">{name || '—'}</div>
          <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1.5">
            <span className="font-mono">{symbol || '—'}</span>
            <span>·</span>
            <span>{variant === B20_VARIANT.STABLECOIN ? 'Stablecoin' : 'Asset'}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-zinc-50 rounded-lg px-3 py-1">
        <Row label="Desimal">
          <span className="font-mono text-[11px] text-zinc-700">{finalDecimals}</span>
        </Row>
        <Row label="Supply cap">
          <span className="font-mono text-[11px] text-zinc-700">{capDisplay}</span>
        </Row>
        <Row label="Allowlist"><Badge on={toggles.allowlist} /></Row>
        <Row label="Freeze"><Badge on={toggles.freeze} /></Row>
        <Row label="Memos"><Badge on={toggles.memos} /></Row>
        <Row label="Permit (ERC-2612)"><Badge on={toggles.permit} /></Row>
        <Row label="Jaringan">
          <span className="bg-blue-50 text-[#0052FF] text-[11px] font-medium px-2 py-0.5 rounded-full">
            Base Mainnet
          </span>
        </Row>
      </div>
    </div>
  )
}
