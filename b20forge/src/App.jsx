import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import Navbar from './components/Navbar'
import DeployForm from './components/DeployForm'
import HistoryPage from './pages/HistoryPage'
import ManagePage from './pages/ManagePage'
import { track, EVENTS } from './lib/analytics'

// Simple hash-based router
function useRoute() {
  const [route, setRoute] = useState(window.location.hash || '#/')
  useEffect(() => {
    const handler = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])
  return route
}

function navigate(hash) {
  window.location.hash = hash
}

// SEO meta updater
function useMeta(title, description) {
  useEffect(() => {
    document.title = title
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta) }
    meta.content = description

    // OG tags
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:image': 'https://b20forge.vercel.app/og.png',
      'og:url': window.location.href,
      'og:type': 'website',
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': 'https://b20forge.vercel.app/og.png',
    }
    Object.entries(ogTags).forEach(([name, content]) => {
      const attr = name.startsWith('og:') ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el) }
      el.content = content
    })
  }, [title, description])
}

export default function App() {
  const route = useRoute()
  const { isConnected } = useAccount()

  // Track page views
  useEffect(() => {
    track(EVENTS.PAGE_VIEW, { route })
  }, [route])

  const tabs = [
    { hash: '#/', label: 'Deploy' },
    { hash: '#/history', label: 'Token saya' },
    { hash: '#/manage', label: 'Kelola' },
  ]

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <Navbar />

      {/* TAB NAV */}
      <div className="sticky top-14 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-0">
            {tabs.map(tab => {
              const active = route === tab.hash || (tab.hash === '#/' && route === '')
              return (
                <a
                  key={tab.hash}
                  href={tab.hash}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    active
                      ? 'border-[#0052FF] text-[#0052FF]'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  {tab.label}
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* PAGES */}
      <main>
        {(route === '#/' || route === '' || route === '#') && <DeployFormWithMeta />}
        {route === '#/history' && <HistoryPageWithMeta />}
        {route === '#/manage' && <ManagePageWithMeta />}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-white mt-8">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-400">
            B20 Forge · Dibangun di atas{' '}
            <a href="https://base.org" target="_blank" rel="noopener noreferrer" className="text-[#0052FF] hover:underline">Base</a>
            {' · '}
            <a href="https://docs.base.org/get-started/launch-b20-token" target="_blank" rel="noopener noreferrer" className="text-[#0052FF] hover:underline">Docs B20</a>
          </div>
          <div className="text-xs text-zinc-300">Token yang kamu deploy sepenuhnya milikmu. DYOR.</div>
        </div>
      </footer>
    </div>
  )
}

function DeployFormWithMeta() {
  useMeta(
    'B20 Forge — Launch token B20 di Base Mainnet',
    'Deploy token B20 ERC-20 di Base dalam satu klik. Tanpa coding, biaya ~$0.01, langsung live.'
  )
  return <DeployForm />
}

function HistoryPageWithMeta() {
  useMeta(
    'Token saya — B20 Forge',
    'Lihat semua token B20 yang sudah kamu deploy di Base Mainnet.'
  )
  return <HistoryPage />
}

function ManagePageWithMeta() {
  useMeta(
    'Kelola token — B20 Forge',
    'Grant role, manage allowlist, freeze alamat, dan fitur compliance token B20 kamu.'
  )
  return <ManagePage />
}
