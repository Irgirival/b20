// Lightweight analytics — no third-party, no cookies
// Sends anonymous events to a simple endpoint or console in dev

const IS_DEV = import.meta.env.DEV

export function track(event, props = {}) {
  const payload = {
    event,
    ...props,
    ts: Date.now(),
    url: window.location.pathname,
  }

  if (IS_DEV) {
    console.log('[analytics]', payload)
    return
  }

  // Option 1: Vercel Analytics (add @vercel/analytics to package.json)
  // import { track as vercelTrack } from '@vercel/analytics'
  // vercelTrack(event, props)

  // Option 2: Simple beacon (ganti dengan endpoint kamu sendiri)
  // navigator.sendBeacon('/api/analytics', JSON.stringify(payload))

  // Default: simpan ke localStorage sebagai fallback sederhana
  try {
    const key = 'b20forge_analytics'
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    existing.push(payload)
    localStorage.setItem(key, JSON.stringify(existing.slice(-200)))
  } catch (_) {}
}

// Events yang dipakai di seluruh app
export const EVENTS = {
  DEPLOY_STARTED:   'deploy_started',
  DEPLOY_SUCCESS:   'deploy_success',
  DEPLOY_ERROR:     'deploy_error',
  MINT_SUCCESS:     'mint_success',
  WALLET_CONNECTED: 'wallet_connected',
  PAGE_VIEW:        'page_view',
}
