// Analytics — Vercel Analytics + localStorage fallback
const IS_DEV = import.meta.env.DEV

export function track(event, props = {}) {
  const payload = { event, ...props, ts: Date.now(), url: window.location.pathname }

  if (IS_DEV) {
    console.log('[analytics]', payload)
    return
  }

  // Vercel Analytics (aktif setelah npm install @vercel/analytics)
  try {
    if (typeof window.va === 'function') {
      window.va('event', { name: event, data: props })
    }
  } catch (_) {}

  // localStorage fallback — bisa diread dari console
  try {
    const key = 'b20forge_analytics'
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    existing.push(payload)
    localStorage.setItem(key, JSON.stringify(existing.slice(-200)))
  } catch (_) {}
}

export const EVENTS = {
  DEPLOY_STARTED:   'deploy_started',
  DEPLOY_SUCCESS:   'deploy_success',
  DEPLOY_ERROR:     'deploy_error',
  MINT_SUCCESS:     'mint_success',
  WALLET_CONNECTED: 'wallet_connected',
  PAGE_VIEW:        'page_view',
}
