import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { base } from '../lib/wagmi'

export default function Navbar() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const isBase = chainId === base.id

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polygon points="8,1 14,4.5 14,11.5 8,15 2,11.5 2,4.5" stroke="white" strokeWidth="1.5"/>
              <text x="8" y="11" fontFamily="monospace" fontSize="5.5" fontWeight="bold" fill="white" textAnchor="middle">B2</text>
            </svg>
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-zinc-900">
            B20 <span className="text-[#0052FF]">Forge</span>
          </span>
        </a>

        <div className="flex-1" />

        {/* Network badge */}
        {isConnected && (
          <button
            onClick={() => !isBase && switchChain({ chainId: base.id })}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all border-0 cursor-pointer ${
              isBase
                ? 'bg-blue-50 text-[#0052FF]'
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                isBase ? 'bg-[#0052FF] pulse-dot' : 'bg-red-500'
              }`}
            />
            {isBase ? 'Base Mainnet' : 'Ganti ke Base ↗'}
          </button>
        )}

        {/* Wallet connect */}
        <ConnectButton
          label="Hubungkan Wallet"
          showBalance={false}
          chainStatus="none"
          accountStatus="address"
        />
      </div>
    </nav>
  )
}
