import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { base } from '../lib/wagmi'

export default function Navbar({ currentPage, onNavigate }) {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const isBase = chainId === base.id

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #1A1A2E',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Logo */}
        <button onClick={() => onNavigate('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #0052FF 0%, #003ACC 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="none" stroke="white" strokeWidth="1.5"/>
              <path d="M4 7L6 9L10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em', color: '#F0F0FF' }}>
            B20 <span style={{ color: '#0052FF' }}>Forge</span>
          </span>
        </button>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
          {[['home', 'Home'], ['launch', 'Launch Token'], ['docs', 'How it Works']].map(([page, label]) => (
            <button key={page} onClick={() => onNavigate(page)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '6px 12px', borderRadius: 8,
                fontSize: 13, fontWeight: 500,
                color: currentPage === page ? '#F0F0FF' : '#8888AA',
                fontFamily: 'inherit',
                transition: 'color 0.15s',
              }}
            >{label}</button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Network badge */}
        {isConnected && (
          <button onClick={() => !isBase && switchChain({ chainId: base.id })}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 20,
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: isBase ? 'rgba(0,82,255,0.12)' : 'rgba(255,68,68,0.12)',
              color: isBase ? '#6699FF' : '#FF6666',
              border: `1px solid ${isBase ? 'rgba(0,82,255,0.25)' : 'rgba(255,68,68,0.25)'}`,
              fontFamily: 'inherit',
            }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: isBase ? '#0052FF' : '#FF4444' }} className={isBase ? 'pulse' : ''} />
            {isBase ? 'Base Mainnet' : 'Switch to Base ↗'}
          </button>
        )}

        <ConnectButton label="Connect Wallet" showBalance={false} chainStatus="none" accountStatus="address" />
      </div>
    </nav>
  )
}
