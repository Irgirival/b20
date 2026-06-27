export default function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      {/* Track */}
      <div className="relative mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-9 h-5 rounded-full transition-colors duration-200 ${
            checked ? 'bg-[#0052FF]' : 'bg-zinc-200'
          }`}
        />
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>

      {/* Label */}
      <div>
        <div className="text-sm font-medium text-zinc-800 leading-tight">{label}</div>
        {description && (
          <div className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{description}</div>
        )}
      </div>
    </label>
  )
}
