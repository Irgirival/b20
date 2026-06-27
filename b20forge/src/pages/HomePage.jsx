import DeployForm from '../components/DeployForm'

export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-[2rem] font-bold tracking-tight text-zinc-900 leading-tight mb-2">
          Deploy token B20<br />
          <span className="text-[#0052FF]">di Base Mainnet</span>
        </h1>
        <p className="text-zinc-500 text-[15px] max-w-lg">
          Buat dan deploy token ERC-20 dengan fitur compliance profesional dalam beberapa detik.
          Tanpa coding, langsung live.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-5">
          {[
            ['~$0.01', 'Biaya rata-rata'],
            ['<30 detik', 'Waktu deploy'],
            ['ERC-20', 'Standar token'],
            ['Base Mainnet', 'Jaringan'],
          ].map(([val, label]) => (
            <div key={label} className="bg-white border border-zinc-100 rounded-xl px-4 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="font-semibold text-zinc-900 text-sm">{val}</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <DeployForm />
    </main>
  )
}
