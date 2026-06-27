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
}

const DEFAULT_TOGGLES = {
  allowlist: false,
  freeze: false,
  memos: false,
  permit: true,
}

export default function DeployForm() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const isBase = chainId === base.id

  const [form, setForm] = useState(DEFAULT_FORM)
  const [toggles, setToggles] = useState(DEFAULT_TOGGLES)

  const { deploy, status, txHash, tokenAddress, error, reset } = useDeployToken()

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))
  const tog = (key, val) => setToggles((t) => ({ ...t, [key]: val }))

  const isStablecoin = form.variant === B20_VARIANT.STABLECOIN
  const isDeploying = status === 'pending' || status === 'confirming'

  const handleDeploy = () => {
    if (!form.name || !form.symbol) return
    deploy({ ...form, ...toggles })
  }

  const handleReset = () => {
    reset()
    setForm(DEFAULT_FORM)
    setToggles(DEFAULT_TOGGLES)
  }

  const inputCls =
    'w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-blue-100 transition-all bg-white'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      {/* ── Left: Form ────────────────────────────────────── */}
      <div className="lg:col-span-3 space-y-4">

        {/* Variant selector */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">Jenis Token</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Asset', sub: 'ERC-20 standar · desimal fleksibel', val: B20_VARIANT.ASSET },
              { label: 'Stablecoin', sub: 'Fixed 6 desimal · cocok untuk USDC-like', val: B20_VARIANT.STABLECOIN },
            ].map(({ label, sub, val }) => (
              <button
                key={val}
                onClick={() => set('variant', val)}
                className={`text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  form.variant === val
                    ? 'border-[#0052FF] bg-blue-50'
                    : 'border-zinc-100 bg-zinc-50 hover:border-zinc-200'
                }`}
              >
                <div className={`text-sm font-semibold ${form.variant === val ? 'text-[#0052FF]' : 'text-zinc-800'}`}>
                  {label}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Token info */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">Informasi Token</div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-zinc-600 block mb-1">Nama Token *</label>
              <input
                type="text"
                placeholder="contoh: My Token"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                maxLength={64}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-600 block mb-1">Simbol *</label>
                <input
                  type="text"
                  placeholder="MTK"
                  value={form.symbol}
                  onChange={(e) => set('symbol', e.target.value.toUpperCase())}
                  maxLength={12}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-600 block mb-1">
                  Desimal {isStablecoin && <span className="text-zinc-400">(fixed 6)</span>}
                </label>
                <input
                  type="number"
                  value={isStablecoin ? 6 : form.decimals}
                  onChange={(e) => set('decimals', e.target.value)}
                  disabled={isStablecoin}
                  min={0}
                  max={18}
                  className={inputCls + (isStablecoin ? ' opacity-50 cursor-not-allowed' : '')}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-600 block mb-1">
                Supply Cap <span className="text-zinc-400">(kosongkan = tidak terbatas)</span>
              </label>
              <input
                type="text"
                placeholder="1000000"
                value={form.supplyCap}
                onChange={(e) => set('supplyCap', e.target.value.replace(/[^0-9,]/g, ''))}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Compliance toggles */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-4">Fitur Compliance</div>
          <div className="space-y-4">
            <Toggle
              checked={toggles.allowlist}
              onChange={(v) => tog('allowlist', v)}
              label="Allowlist"
              description="Hanya address yang disetujui yang bisa menerima token."
            />
            <Toggle
              checked={toggles.freeze}
              onChange={(v) => tog('freeze', v)}
              label="Freeze"
              description="Admin bisa membekukan saldo address tertentu."
            />
            <Toggle
              checked={toggles.memos}
              onChange={(v) => tog('memos', v)}
              label="Memos"
              description="Izinkan penambahan catatan/referensi di setiap transfer."
            />
            <Toggle
              checked={toggles.permit}
              onChange={(v) => tog('permit', v)}
              label="Permit (ERC-2612)"
              description="Gasless approval dengan signature — direkomendasikan."
            />
          </div>
        </div>

        {/* Deploy button / connect */}
        {!isConnected ? (
          <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex flex-col items-center gap-3 py-6">
            <p className="text-sm text-zinc-500 text-center">Hubungkan wallet untuk deploy token di Base Mainnet</p>
            <ConnectButton label="Hubungkan Wallet" />
          </div>
        ) : !isBase ? (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-700 text-center">
            Kamu sedang di jaringan yang salah. Klik badge "Ganti ke Base" di navbar.
          </div>
        ) : (
          <button
            onClick={handleDeploy}
            disabled={!form.name || !form.symbol || isDeploying}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
              form.name && form.symbol && !isDeploying
                ? 'bg-zinc-900 text-white hover:bg-zinc-800 cursor-pointer'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
          >
            {isDeploying ? 'Deploying…' : 'Deploy Token →'}
          </button>
        )}

        {/* Result */}
        <DeployResult
          status={status}
          txHash={txHash}
          tokenAddress={tokenAddress}
          error={error}
          onReset={handleReset}
        />
      </div>

      {/* ── Right: Preview ────────────────────────────────── */}
      <div className="lg:col-span-2 space-y-4">
        {/* Token preview card */}
        <div className="bg-white border border-zinc-100 rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] sticky top-20">
          <div className="px-5 pt-4 pb-2 border-b border-zinc-50">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Preview Token</div>
          </div>
          <TokenPreview form={form} toggles={toggles} />
        </div>

        {/* Cost estimate */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">Estimasi Biaya</div>
          <div className="space-y-2 text-xs">
            {[
              ['Gas deploy', '~0.0005 ETH'],
              ['Biaya platform', 'Gratis'],
              ['Jaringan', 'Base Mainnet'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-zinc-500">
                <span>{k}</span>
                <span className="font-medium text-zinc-800">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps guide */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">Cara Deploy</div>
          <div className="space-y-2.5">
            {[
              ['1', 'Hubungkan wallet ke Base Mainnet'],
              ['2', 'Isi nama, simbol, dan parameter token'],
              ['3', 'Aktifkan fitur compliance sesuai kebutuhan'],
              ['4', 'Klik Deploy dan konfirmasi di wallet'],
            ].map(([n, text]) => (
              <div key={n} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-500 flex items-center justify-center flex-shrink-0">
                  {n}
                </div>
                <span className="text-xs text-zinc-600 leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
