import { useEffect, useState, useRef } from 'react'

const FEATURES = [
  {
    icon: '⬡',
    title: 'Native Precompile',
    desc: 'B20 runs as a precompile on Base — not a deployed contract. Transfers are cheaper and faster than standard ERC-20 by design.',
  },
  {
    icon: '⚡',
    title: 'Deploy in Seconds',
    desc: 'One transaction. No Solidity, no audits, no contract deployment. Fill the form, sign, done. Your token is live on Base Mainnet.',
  },
  {
    icon: '🛡',
    title: 'Compliance Built-In',
    desc: 'Allowlist, freeze, permit, and memos are native to the token — not bolted-on contracts. Configure once at creation.',
  },
  {
    icon: '🔑',
    title: 'Full Role Control',
    desc: 'MINT_ROLE, FREEZE_ROLE, ALLOWLIST_ROLE — granular access control granted to any address at deploy time.',
  },
  {
    icon: '🌐',
    title: 'Full ERC-20 Compatible',
    desc: 'Every B20 token works with any wallet, DEX, bridge, or protocol that supports ERC-20. No wrappers needed.',
  },
  {
    icon: '◎',
    title: 'Deterministic Address',
    desc: 'Token address is derived from your salt — predictable, auditable, and consistent across environments.',
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Connect your wallet', desc: 'Link MetaMask, Coinbase Wallet, or any WalletConnect-compatible wallet. Make sure you\'re on Base Mainnet.' },
  { step: '02', title: 'Configure your token', desc: 'Choose Asset or Stablecoin variant. Set name, symbol, decimals, and optional supply cap.' },
  { step: '03', title: 'Set compliance features', desc: 'Toggle Allowlist, Freeze, Memos, and Permit to match your token\'s requirements — none required.' },
  { step: '04', title: 'Deploy to Base', desc: 'Sign one transaction. B20 Factory creates your token atomically with all roles and settings applied.' },
]

const COMPLIANCE = [
  {
    name: 'Allowlist',
    tag: 'Access Control',
    color: '#7C5CFC',
    desc: 'Restrict token transfers to approved addresses only. Essential for securities, corporate tokens, and permissioned ecosystems. Admin can add or remove addresses at any time.',
  },
  {
    name: 'Freeze',
    tag: 'Asset Safety',
    color: '#0052FF',
    desc: 'Freeze the balance of any address — preventing transfers in or out. Used for regulatory compliance, sanctions screening, and incident response. Standard in enterprise stablecoins.',
  },
  {
    name: 'Memos',
    tag: 'Payment Tracking',
    color: '#00C896',
    desc: 'Attach a reference string to every transfer. Essential for B2B payments, invoicing, and reconciliation — similar to wire transfer references, but onchain.',
  },
  {
    name: 'Permit (ERC-2612)',
    tag: 'Gas Optimization',
    color: '#F5A623',
    desc: 'Users approve token spending with an off-chain signature instead of an on-chain transaction. Eliminates the "approve + transfer" two-step, reducing gas costs and friction for end users.',
  },
]

function ForgeAnimation() {
  const [displayed, setDisplayed] = useState('')
  const target = '0xB200c4f4e6a21c52DE09eD879c2a5A8b8e4D7aa1'
  const idx = useRef(0)
  const timer = useRef(null)

  useEffect(() => {
    const run = () => {
      if (idx.current <= target.length) {
        setDisplayed(target.slice(0, idx.current))
        idx.current++
        timer.current = setTimeout(run, idx.current < 6 ? 120 : 40)
      } else {
        setTimeout(() => { idx.current = 0; run() }, 3500)
      }
    }
    timer.current = setTimeout(run, 800)
    return () => clearTimeout(timer.current)
  }, [])

  return (
    <div style={{
      background: '#0D0D18',
      border: '1px solid #2A2A3D',
      borderRadius: 14,
      padding: '18px 24px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      maxWidth: '100%',
    }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0052FF', flexShrink: 0 }} className="pulse" />
      <span className="mono" style={{ fontSize: 15, color: '#6699FF', letterSpacing: '0.02em', wordBreak: 'break-all' }}>
        {displayed}
        <span className="cursor-blink" style={{ color: '#0052FF' }}>█</span>
      </span>
    </div>
  )
}

export default function LandingPage({ onNavigate }) {
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px 100px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div className="fade-in" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,82,255,0.1)', border: '1px solid rgba(0,82,255,0.25)',
          borderRadius: 20, padding: '5px 14px', marginBottom: 28,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C896' }} className="pulse" />
          <span style={{ fontSize: 12, fontWeight: 500, color: '#6699FF' }}>Live on Base Mainnet · Beryl Upgrade</span>
        </div>

        <h1 className="fade-in-1 gradient-text" style={{
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1.05,
          marginBottom: 24,
        }}>
          Launch a B20 Token<br />on Base in Seconds
        </h1>

        <p className="fade-in-2" style={{
          fontSize: 18, color: '#8888AA', maxWidth: 520, margin: '0 auto 40px',
          lineHeight: 1.65, fontWeight: 400,
        }}>
          Deploy production-grade ERC-20 tokens with native compliance features —
          no Solidity, no contract deployment, no audits needed.
        </p>

        <div className="fade-in-2" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
          <button className="btn-primary" style={{ fontSize: 15, padding: '13px 32px' }} onClick={() => onNavigate('launch')}>
            Launch Your Token →
          </button>
          <button className="btn-ghost" style={{ fontSize: 15 }} onClick={() => onNavigate('docs')}>
            How it Works
          </button>
        </div>

        <div className="fade-in-3" style={{ display: 'flex', justifyContent: 'center' }}>
          <ForgeAnimation />
        </div>

        {/* Stats */}
        <div className="fade-in-3" style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap' }}>
          {[['~$0.01', 'avg deploy cost'], ['< 30s', 'time to live'], ['ERC-20', 'compatible'], ['Base', 'native precompile']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#F0F0FF', letterSpacing: '-0.02em' }}>{val}</div>
              <div style={{ fontSize: 12, color: '#555570', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid #1A1A2E' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0052FF', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Why B20 Forge</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: '#F0F0FF' }}>Built for token builders</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="card" style={{ transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#3A3A55'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2A2A3D'}>
                <div style={{ fontSize: 24, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#F0F0FF', marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: '#8888AA', lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compliance ────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid #1A1A2E' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0052FF', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Compliance Features</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: '#F0F0FF' }}>Enterprise-grade controls</h2>
            <p style={{ fontSize: 15, color: '#8888AA', marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>
              All four features are native to the B20 token — not add-on contracts. Configure once at deploy time.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {COMPLIANCE.map((c) => (
              <div key={c.name} className="card" style={{ borderTop: `2px solid ${c.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#F0F0FF' }}>{c.name}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                    background: `${c.color}22`, color: c.color,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>{c.tag}</span>
                </div>
                <p style={{ fontSize: 13, color: '#8888AA', lineHeight: 1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ──────────────────────────────────────────── */}
      <section id="how" style={{ padding: '80px 24px', borderTop: '1px solid #1A1A2E' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0052FF', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Process</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: '#F0F0FF' }}>Four steps to launch</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {HOW_IT_WORKS.map((s, i) => (
              <div key={s.step} style={{ display: 'flex', gap: 24, position: 'relative' }}>
                {/* Line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(0,82,255,0.1)', border: '1px solid rgba(0,82,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, color: '#0052FF',
                    flexShrink: 0,
                  }}>{s.step}</div>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: '#2A2A3D', marginTop: 8, marginBottom: 8, minHeight: 32 }} />
                  )}
                </div>
                <div style={{ paddingBottom: i < HOW_IT_WORKS.length - 1 ? 32 : 0, paddingTop: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#F0F0FF', marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: '#8888AA', lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px 100px', borderTop: '1px solid #1A1A2E' }}>
        <div style={{
          maxWidth: 700, margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(0,82,255,0.08) 0%, rgba(0,82,255,0.02) 100%)',
          border: '1px solid rgba(0,82,255,0.2)', borderRadius: 24, padding: '56px 40px',
        }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: '#F0F0FF', marginBottom: 16 }}>
            Ready to forge your token?
          </h2>
          <p style={{ fontSize: 15, color: '#8888AA', marginBottom: 32, lineHeight: 1.65 }}>
            Join the builders launching on Base with B20 — the native token standard built for speed, compliance, and composability.
          </p>
          <button className="btn-primary" style={{ fontSize: 16, padding: '14px 40px' }} onClick={() => onNavigate('launch')}>
            Launch Token Now →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1A1A2E', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, background: '#0052FF', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" stroke="white" strokeWidth="1.5"/></svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#F0F0FF' }}>B20 Forge</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Built on Base', 'B20 Standard', 'Open Source'].map(l => (
              <span key={l} style={{ fontSize: 12, color: '#555570' }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
