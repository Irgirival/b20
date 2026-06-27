export default function Toggle({ checked, onChange, label, description }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
      <div style={{ position: 'relative', flexShrink: 0, marginTop: 2 }}>
        <input type="checkbox" style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
          checked={checked} onChange={e => onChange(e.target.checked)} />
        <div style={{
          width: 38, height: 20, borderRadius: 10,
          background: checked ? '#0052FF' : '#2A2A3D',
          transition: 'background 0.2s',
          border: `1px solid ${checked ? '#0052FF' : '#3A3A55'}`,
        }} />
        <div style={{
          position: 'absolute', top: 2, left: checked ? 19 : 2,
          width: 16, height: 16, borderRadius: '50%',
          background: 'white', transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#F0F0FF', lineHeight: 1.3 }}>{label}</div>
        {description && <div style={{ fontSize: 12, color: '#8888AA', marginTop: 3, lineHeight: 1.5 }}>{description}</div>}
      </div>
    </label>
  )
}
