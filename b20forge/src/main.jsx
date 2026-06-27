import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, lightTheme, darkTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { wagmiConfig } from './lib/wagmi'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import DeployForm from './components/DeployForm'
import DocsPage from './pages/DocsPage'

import '@rainbow-me/rainbowkit/styles.css'
import './index.css'

const queryClient = new QueryClient()

function App() {
  const [page, setPage] = useState('home')

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#0052FF',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          <Navbar currentPage={page} onNavigate={setPage} />
          {page === 'home'   && <LandingPage onNavigate={setPage} />}
          {page === 'launch' && <DeployForm />}
          {page === 'docs'   && <DocsPage onNavigate={setPage} />}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)
