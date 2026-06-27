import { useState } from 'react'
import MintPanel from './MintPanel'

export default function DeployResult({ status, txHash, tokenAddress, error, onReset, tokenSymbol, decimals }) {
  const [mintDone, setMintDone] = useState(false)

  if (status === 'idle') return null

  const basescanTx    = txHash       ? `https://basescan.org/tx/${txHash}`         : null
  const basescanToken = tokenAddress ? `https://basescan.org/token/${tokenAddress}` : null

  const wrap = (children) => (
    <div style={{ marginTop: 16, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
      {children}
    </div>
  )

  if (status === 'checking') return wrap(
    <div style={{ padding: '16px 20px', background: '#111118', display: 'flex', alignItems: 'center', gap: 12 }}>
      <Spinner color="#6699FF" />
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#F0F0FF' }}>Checking B20 activation…</div>
        <div style={{ fontSize: 12, color: '#8888AA', marginTop: 2 }}>Verifying with Base Activation Registry</div>
      </div>
    </div>
  )

  if (status === 'pending') return wrap(
    <div style={{ padding: '16px 20px', background: '#111118', display: 'flex', alignItems: 'center', gap: 12 }}>
      <Spinner color="#6699FF" />
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#F0F0FF' }}>Waiting for wallet confirmation…</div>
        <div style={{ fontSize: 12, color: '#8888AA', marginTop: 2 }}>Check your wallet to approve the transaction</div>
      </div>
    </div>
  )

  if (status === 'confirming') return wrap(
    <div style={{ padding: '16px 20px', background: 'rgba(0,82,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
      <Spinner color="#0052FF" />
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#6699FF' }}>Transaction submitted — awaiting confirmation</div>
        {basescanTx && (
          <a href={basescanTx} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, color: '#0052FF', textDecoration: 'none', marginTop: 3, display: 'block', opacity: 0.8 }}>
            View on Basescan ↗
          </a>
        )}
      </div>
    </div>
  )

  if (status === 'success') return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Success banner */}
      <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(0,200,150,0.2)', background: 'rgba(0,200,150,0.06)', padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,200,150,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00C896', fontWeight: 800, fontSize: 15 }}>✓</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#00C896' }}>Token deployed successfully</div>
        </div>

        {tokenAddress && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#00C896', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Token Address</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#111118', borderRadius: 10, padding: '10px 14px', border: '1px solid #2A2A3D' }}>
              <code className="mono" style={{ fontSize: 12, color: '#F0F0FF', flex: 1, wordBreak: 'break-all' }}>{tokenAddress}</code>
              <button onClick={() => navigator.clipboard.writeText(tokenAddress)}
                style={{ fontSize: 11, color: '#0052FF', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', flexShrink: 0 }}>
                Copy
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {basescanTx && (
            <a href={basescanTx} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, padding: '7px 14px', background: 'rgba(0,200,150,0.1)', color: '#00C896', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              View Transaction ↗
            </a>
          )}
          {basescanToken && (
            <a href={basescanToken} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, padding: '7px 14px', background: 'rgba(0,200,150,0.1)', color: '#00C896', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              View Token ↗
            </a>
          )}
          <button onClick={onReset}
            style={{ fontSize: 12, padding: '7px 14px', background: '#111118', color: '#8888AA', borderRadius: 8, border: '1px solid #2A2A3D', cursor: 'pointer', fontFamily: 'inherit', marginLeft: 'auto' }}>
            Deploy Another
          </button>
        </div>
      </div>

      {/* ── MINT PANEL — supply masih 0 setelah deploy ── */}
      {!mintDone && tokenAddress && (
        <MintPanel
          tokenAddress={tokenAddress}
          tokenSymbol={tokenSymbol || 'TOKEN'}
          decimals={decimals || 18}
          onNext={() => setMintDone(true)}
        />
      )}

      {mintDone && (
        <div style={{ borderRadius: 14, border: '1px solid #2A2A3D', background: '#111118', padding: 16 }}>
          <div style={{ fontSize: 12, color: '#8888AA', marginBottom: 12, fontWeight: 600 }}>Next steps</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href={`https://aerodrome.finance/liquidity?token=${tokenAddress}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 10, border: '1px solid #2A2A3D', textDecoration: 'none' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F0FF' }}>Add Liquidity</div>
                <div style={{ fontSize: 11, color: '#8888AA', marginTop: 2 }}>Aerodrome Finance — largest DEX on Base</div>
              </div>
              <span style={{ color: '#555570' }}>↗</span>
            </a>
            <a href="#/history"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 10, border: '1px solid #2A2A3D', textDecoration: 'none' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F0FF' }}>My Tokens</div>
                <div style={{ fontSize: 11, color: '#8888AA', marginTop: 2 }}>View all tokens you've deployed</div>
              </div>
              <span style={{ color: '#555570' }}>→</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )

  if (status === 'error') return wrap(
    <div style={{ background: 'rgba(255,68,68,0.06)', padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF4444', fontWeight: 800, fontSize: 13, flexShrink: 0, marginTop: 1 }}>✕</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#FF6666', marginBottom: 6 }}>Deploy failed</div>
          <div className="mono" style={{ fontSize: 12, color: '#FF4444', lineHeight: 1.6, opacity: 0.8 }}>{error}</div>
          <button onClick={onReset}
            style={{ marginTop: 12, fontSize: 12, padding: '7px 14px', background: '#111118', color: '#8888AA', borderRadius: 8, border: '1px solid #2A2A3D', cursor: 'pointer', fontFamily: 'inherit' }}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  )

  return null
}

function Spinner({ color = '#0052FF' }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%',
      border: `2px solid ${color}33`,
      borderTopColor: color,
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  )
}
