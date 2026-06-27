import { useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Toggle from './Toggle'
import TokenPreview from './TokenPreview'
import DeployResult from './DeployResult'
import { useDeployToken } from '../hooks/useDeployToken'
import { B20_VARIANT } from '../lib/b20'
import { base } from '../lib/wagmi'

const DEFAULT_FORM = {
  variant: B20_VARIANT.ASSET,
  name: '',
  symbol: '',
  decimals: 18,
  supplyCap: '',
  currencyCode: 'IDR',
}

const DEFAULT_TOGGLES = {
  allowlist: false,
  freeze: false,
  memos: false,
  permit: true,
}

const inputCls = 'w-full text-sm border border-zinc-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#0052FF] focus:ring-2 focus:ring-blue-50 transition-all bg-white text-zinc-900 placeholder-zinc-300'

export default function DeployForm() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const isBase = chainId === base.id

  const [form, setForm]       = useState(DEFAULT_FORM)
  const [toggles, setToggles] = useState(DEFAULT_TOGGLES)

  const { deploy, status, txHash, tokenAddress, error, reset } = useDeployToken()

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const tog = (key, val) => setToggles(t => ({ ...t, [key]: val }))

  const isStablecoin = form.variant === B20_VARIANT.STABLECOIN
  const isDeploying  = ['checking', 'pending', 'confirming'].includes(status)
  const canDeploy    = form.name && form.symbol && !isDeploying

  const handleDeploy = () => { if (canDeploy) deploy({ ...form, ...toggles }) }
  const handleReset  = () => { reset(); setForm(DEFAULT_FORM); setToggles(DEFAULT_TOGGLES) }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

      {/* ── Kiri: Form ──────────────────────────────────── */}
      <div className="lg:col-span-3 flex flex-col gap-4">

        {/* Jenis token */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Jenis Token</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Asset', sub: 'Desimal fleksibel (6–18) · Serba guna', val: B20_VARIANT.ASSET },
              { label: 'Stablecoin', sub: 'Fixed 6 desimal · Butuh kode mata uang ISO', val: B20_VARIANT.STABLECOIN },
            ].map(({ label, sub, val }) => (
              <button
                key={val}
                onClick={() => set('variant', val)}
                className={`text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                  form.variant === val
                    ? 'border-[#0052FF] bg-blue-50'
                    : 'border-zinc-100 bg-zinc-50 hover:border-zinc-200'
                }`}
              >
                <div className={`text-sm font-semibold mb-0.5 ${form.variant === val ? 'text-[#0052FF]' : 'text-zinc-800'}`}>
                  {label}
                </div>
                <div className="text-[11px] text-zinc-400 leading-relaxed">{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail token */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Detail Token</div>
          <div className="flex flex-col gap-4">

            <div>
              <label className="text-xs font-medium text-zinc-600 block mb-1.5">Nama Token *</label>
              <input
                type="text"
                className={inputCls}
                placeholder="contoh: Rupiah Digital"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                maxLength={64}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-600 block mb-1.5">Simbol *</label>
                <input
                  type="text"
                  className={inputCls + ' font-mono'}
                  placeholder="MTK"
                  value={form.symbol}
                  onChange={e => set('symbol', e.target.value.toUpperCase())}
                  maxLength={12}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-600 block mb-1.5">
                  Desimal {isStablecoin && <span className="text-zinc-300 font-normal">(fixed 6)</span>}
                </label>
                <input
                  type="number"
                  className={inputCls + ' font-mono' + (isStablecoin ? ' opacity-40 cursor-not-allowed' : '')}
                  value={isStablecoin ? 6 : form.decimals}
                  onChange={e => set('decimals', Math.min(18, Math.max(6, Number(e.target.value))))}
                  disabled={isStablecoin}
                  min={6} max={18}
                />
              </div>
            </div>

            {isStablecoin && (
              <div>
                <label className="text-xs font-medium text-zinc-600 block mb-1.5">Kode Mata Uang *</label>
                <input
                  type="text"
                  className={inputCls + ' font-mono tracking-widest'}
                  placeholder="IDR"
                  value={form.currencyCode}
                  onChange={e => set('currencyCode', e.target.value.toUpperCase().slice(0, 3))}
                  maxLength={3}
                />
                <p className="text-[11px] text-zinc-400 mt-1.5">Kode ISO 3 huruf, contoh: IDR, USD, EUR</p>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-zinc-600 block mb-1.5">
                Supply Cap <span className="text-zinc-300 font-normal">(kosongkan = tidak terbatas)</span>
              </label>
              <input
                type="text"
                className={inputCls + ' font-mono'}
                placeholder="1000000000"
                value={form.supplyCap}
                onChange={e => set('supplyCap', e.target.value.replace(/[^0-9]/g, ''))}
              />
              <p className="text-[11px] text-zinc-400 mt-1.5">Jumlah maksimum token yang bisa pernah di-mint.</p>
            </div>
          </div>
        </div>

        {/* Fitur compliance */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Fitur Compliance</div>
          <div className="flex flex-col gap-5">
            <Toggle checked={toggles.allowlist} onChange={v => tog('allowlist', v)}
              label="Allowlist"
              description="Hanya alamat yang disetujui yang bisa menerima token ini." />
            <Toggle checked={toggles.freeze} onChange={v => tog('freeze', v)}
              label="Freeze"
              description="Admin bisa membekukan saldo alamat tertentu agar tidak bisa transfer." />
            <Toggle checked={toggles.memos} onChange={v => tog('memos', v)}
              label="Memos"
              description="Lampirkan catatan referensi di setiap transfer — berguna untuk pembayaran B2B." />
            <Toggle checked={toggles.permit} onChange={v => tog('permit', v)}
              label="Permit (ERC-2612)"
              description="Gasless approval dengan tanda tangan off-chain. Direkomendasikan untuk DeFi." />
          </div>
        </div>

        {/* Tombol deploy */}
        {!isConnected ? (
          <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm flex flex-col items-center gap-3">
            <p className="text-sm text-zinc-400 text-center">
              Hubungkan wallet untuk deploy token di Base Mainnet
            </p>
            <ConnectButton label="Hubungkan Wallet" />
          </div>
        ) : !isBase ? (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-700 text-center">
            ⚠ Jaringan salah — klik badge di navbar untuk pindah ke Base Mainnet
          </div>
        ) : (
          <button
            onClick={handleDeploy}
            disabled={!canDeploy}
            className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all ${
              canDeploy
                ? 'bg-zinc-900 text-white hover:bg-zinc-800 cursor-pointer active:scale-[.99]'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
          >
            {isDeploying ? 'Mengirim transaksi…' : 'Deploy Token →'}
          </button>
        )}

        <DeployResult
          status={status}
          txHash={txHash}
          tokenAddress={tokenAddress}
          error={error}
          onReset={handleReset}
          tokenSymbol={form.symbol}
          decimals={form.variant === 1 ? 6 : form.decimals}
        />
      </div>

      {/* ── Kanan: Sidebar ──────────────────────────────── */}
      <div className="lg:col-span-2 flex flex-col gap-4 lg:sticky lg:top-28 self-start">

        {/* Preview */}
        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-zinc-50">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Preview Token</span>
          </div>
          <TokenPreview form={form} toggles={toggles} />
        </div>

        {/* Estimasi biaya */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Estimasi Biaya</div>
          <div className="flex flex-col gap-2">
            {[
              ['Gas (deploy)', '~0.0005 ETH'],
              ['Biaya platform', 'Gratis'],
              ['Jaringan', 'Base Mainnet'],
            ].map(([k, v], i, arr) => (
              <div key={k} className={`flex justify-between text-xs py-1.5 ${i < arr.length - 1 ? 'border-b border-zinc-50' : ''}`}>
                <span className="text-zinc-400">{k}</span>
                <span className="font-semibold text-zinc-800">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Langkah-langkah */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Cara Deploy</div>
          <div className="flex flex-col gap-3">
            {[
              'Hubungkan wallet ke Base Mainnet',
              'Isi nama, simbol, dan parameter token',
              'Aktifkan fitur compliance sesuai kebutuhan',
              'Klik Deploy dan konfirmasi di wallet',
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span className="text-xs text-zinc-500 leading-relaxed">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
