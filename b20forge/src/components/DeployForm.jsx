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
  currencyCode: 'USD',
}

const DEFAULT_TOGGLES = {
  allowlist: false,
  freeze: false,
  memos: false,
  permit: true,
}

const LABEL = { fontSize: 12, fontWeight: 600, color: '#8888AA', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }
const SECTION = { background: '#111118', border: '1px solid #2A2A3D', borderRadius: 16, padding: 20, marginBottom: 16 }
const SECTION_TITLE = { fontSize: 11, fontWeight: 700, color: '#555570', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }

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
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', color: '#F0F0FF', marginBottom: 8 }}>
          Launch a B20 Token
        </h1>
        <p style={{ fontSize: 14, color: '#8888AA' }}>
          Deploy a native ERC-20 on Base Mainnet in one transaction. No contract needed.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
        {/* ── Left: Form ──────────────────────────────────────────── */}
        <div>

          {/* Variant */}
          <div style={SECTION}>
            <div style={SECTION_TITLE}>Token Type</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Asset', sub: 'Flexible decimals (6–18) · General purpose', val: B20_VARIANT.ASSET },
                { label: 'Stablecoin', sub: 'Fixed 6 decimals · ISO currency code required', val: B20_VARIANT.STABLECOIN },
              ].map(({ label, sub, val }) => (
                <button key={val} onClick={() => set('variant', val)} style={{
                  textAlign: 'left', padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                  background: form.variant === val ? 'rgba(0,82,255,0.1)' : '#16161F',
                  border: `2px solid ${form.variant === val ? '#0052FF' : '#2A2A3D'}`,
                  transition: 'all 0.15s', fontFamily: 'inherit',
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: form.variant === val ? '#6699FF' : '#F0F0FF', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 11, color: '#8888AA', lineHeight: 1.5 }}>{sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Token Info */}
          <div style={SECTION}>
            <div style={SECTION_TITLE}>Token Details</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={LABEL}>Token Name *</label>
                <input className="input-dark" placeholder="e.g. My Token" value={form.name}
                  onChange={e => set('name', e.target.value)} maxLength={64} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={LABEL}>Symbol *</label>
                  <input className="input-dark mono" placeholder="MTK" value={form.symbol}
                    onChange={e => set('symbol', e.target.value.toUpperCase())} maxLength={12} />
                </div>
                <div>
                  <label style={LABEL}>
                    {isStablecoin ? 'Decimals (fixed)' : 'Decimals'}
                  </label>
                  <input className="input-dark mono"
                    type="number" value={isStablecoin ? 6 : form.decimals}
                    onChange={e => set('decimals', Math.min(18, Math.max(6, Number(e.target.value))))}
                    disabled={isStablecoin} min={6} max={18} />
                </div>
              </div>

              {isStablecoin && (
                <div>
                  <label style={LABEL}>Currency Code *</label>
                  <input className="input-dark mono" placeholder="USD" value={form.currencyCode}
                    onChange={e => set('currencyCode', e.target.value.toUpperCase().slice(0, 3))}
                    maxLength={3} style={{ letterSpacing: '0.1em' }} />
                  <div style={{ fontSize: 11, color: '#555570', marginTop: 5 }}>ISO 3-letter code, e.g. USD, EUR, IDR</div>
                </div>
              )}

              <div>
                <label style={LABEL}>Supply Cap</label>
                <input className="input-dark mono" placeholder="Leave empty for unlimited"
                  value={form.supplyCap}
                  onChange={e => set('supplyCap', e.target.value.replace(/[^0-9,]/g, ''))} />
                <div style={{ fontSize: 11, color: '#555570', marginTop: 5 }}>Max tokens that can ever be minted. Leave blank for no cap.</div>
              </div>
            </div>
          </div>

          {/* Compliance */}
          <div style={SECTION}>
            <div style={SECTION_TITLE}>Compliance Features</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Toggle checked={toggles.allowlist} onChange={v => tog('allowlist', v)}
                label="Allowlist"
                description="Only approved addresses can receive this token. Admin manages the allowlist." />
              <Toggle checked={toggles.freeze} onChange={v => tog('freeze', v)}
                label="Freeze"
                description="Admin can freeze individual wallet balances to prevent transfers." />
              <Toggle checked={toggles.memos} onChange={v => tog('memos', v)}
                label="Memos"
                description="Attach a reference string to each transfer — useful for payment tracking." />
              <Toggle checked={toggles.permit} onChange={v => tog('permit', v)}
                label="Permit (ERC-2612)"
                description="Enable gasless approvals via off-chain signatures. Recommended for DeFi." />
            </div>
          </div>

          {/* Action */}
          {!isConnected ? (
            <div style={{ ...SECTION, textAlign: 'center', padding: '32px 20px' }}>
              <p style={{ fontSize: 14, color: '#8888AA', marginBottom: 16 }}>
                Connect your wallet to deploy on Base Mainnet
              </p>
              <ConnectButton label="Connect Wallet" />
            </div>
          ) : !isBase ? (
            <div style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 14, padding: 16, fontSize: 14, color: '#F5A623', textAlign: 'center' }}>
              ⚠ Wrong network — click the badge in the navbar to switch to Base Mainnet
            </div>
          ) : (
            <button className="btn-primary" onClick={handleDeploy} disabled={!canDeploy}
              style={{ width: '100%', fontSize: 15, padding: '14px 0' }}>
              {isDeploying ? 'Deploying…' : 'Deploy Token →'}
            </button>
          )}

          <DeployResult status={status} txHash={txHash} tokenAddress={tokenAddress} error={error} onReset={handleReset} tokenSymbol={form.symbol} decimals={form.variant === 1 ? 6 : form.decimals} />
        </div>

        {/* ── Right: Preview ───────────────────────────────────────── */}
        <div style={{ position: 'sticky', top: 76, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Preview card */}
          <div style={{ background: '#111118', border: '1px solid #2A2A3D', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1A1A2E' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#555570', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Token Preview</span>
            </div>
            <TokenPreview form={form} toggles={toggles} />
          </div>

          {/* Cost */}
          <div style={{ background: '#111118', border: '1px solid #2A2A3D', borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#555570', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Estimated Cost</div>
            {[['Gas (deploy)', '~0.0005 ETH'], ['Platform fee', 'Free'], ['Network', 'Base Mainnet']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid #1A1A2E' }}>
                <span style={{ color: '#8888AA' }}>{k}</span>
                <span style={{ color: '#F0F0FF', fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div style={{ background: '#111118', border: '1px solid #2A2A3D', borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#555570', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Steps</div>
            {['Connect wallet to Base Mainnet', 'Fill token name, symbol, and settings', 'Enable compliance features as needed', 'Click Deploy and confirm in wallet'].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < 3 ? 12 : 0 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,82,255,0.1)', border: '1px solid rgba(0,82,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#0052FF', flexShrink: 0, fontFamily: 'monospace' }}>{i+1}</div>
                <span style={{ fontSize: 12, color: '#8888AA', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
