import { useState } from 'react'
import { useAccount, useWalletClient, usePublicClient } from 'wagmi'
import { base } from '../lib/wagmi'
import { B20_TOKEN_ABI, B20_ROLES } from '../lib/b20'
import { parseError } from '../hooks/useMintToken'

function useContractWrite() {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient({ chainId: base.id })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [txHash, setTxHash] = useState(null)

  async function write({ address, functionName, args }) {
    setStatus('pending'); setError(null); setTxHash(null)
    try {
      const hash = await walletClient.writeContract({
        address, abi: B20_TOKEN_ABI, functionName, args, chain: base
      })
      setTxHash(hash); setStatus('confirming')
      await publicClient.waitForTransactionReceipt({ hash })
      setStatus('success')
    } catch (e) {
      setStatus('error'); setError(parseError(e))
    }
  }

  function reset() { setStatus('idle'); setError(null); setTxHash(null) }
  return { write, status, error, txHash, reset }
}

function ActionCard({ title, description, icon, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-sm">{icon}</div>
        <div>
          <div className="text-sm font-semibold text-zinc-900">{title}</div>
          {description && <div className="text-xs text-zinc-400">{description}</div>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function StatusRow({ status, error, txHash }) {
  if (status === 'idle') return null
  const configs = {
    pending:    { cls: 'bg-blue-50 border-blue-100 text-blue-700',  text: '⏳ Menunggu konfirmasi wallet...' },
    confirming: { cls: 'bg-blue-50 border-blue-100 text-blue-700',  text: '⏳ Memproses di blockchain...' },
    success:    { cls: 'bg-green-50 border-green-100 text-green-700', text: '✓ Berhasil!' },
    error:      { cls: 'bg-red-50 border-red-100 text-red-700',     text: `✕ ${error}` },
  }
  const c = configs[status]
  return (
    <div className={`mt-3 px-3 py-2.5 rounded-lg border text-xs ${c.cls}`}>
      {c.text}
      {status === 'success' && txHash && (
        <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
          className="ml-2 underline">Lihat ↗</a>
      )}
    </div>
  )
}

export default function ManagePage() {
  const { address } = useAccount()
  const [tokenAddr, setTokenAddr] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  // Grant Role
  const grantRole = useContractWrite()
  const [grantTarget, setGrantTarget] = useState('')
  const [grantRoleKey, setGrantRoleKey] = useState('MINT_ROLE')

  // Allowlist
  const allowlist = useContractWrite()
  const [allowAddr, setAllowAddr] = useState('')

  // Freeze
  const freeze = useContractWrite()
  const [freezeAddr, setFreezeAddr] = useState('')

  if (!confirmed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 mb-1">Kelola token</h1>
        <p className="text-sm text-zinc-400 mb-6">Grant role, manage allowlist, dan fitur compliance lainnya.</p>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">Alamat token</label>
          <input
            type="text"
            value={tokenAddr}
            onChange={e => setTokenAddr(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-zinc-900 placeholder-zinc-300 font-mono focus:border-[#0052FF] focus:outline-none"
          />
          <button
            onClick={() => tokenAddr.startsWith('0x') && tokenAddr.length === 42 && setConfirmed(true)}
            disabled={!tokenAddr.startsWith('0x') || tokenAddr.length !== 42}
            className="mt-3 w-full py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Buka token
          </button>
          <p className="text-xs text-zinc-400 mt-3 text-center">
            Kamu harus punya peran admin pada token tersebut
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => { setConfirmed(false); setTokenAddr('') }} className="text-zinc-400 hover:text-zinc-700">←</button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Kelola token</h1>
          <div className="font-mono text-xs text-zinc-400 mt-0.5">{tokenAddr}</div>
        </div>
      </div>

      <div className="flex flex-col gap-4">

        {/* Grant Role */}
        <ActionCard title="Grant role" description="Beri izin ke alamat tertentu" icon="🔑">
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Role</label>
              <select
                value={grantRoleKey}
                onChange={e => setGrantRoleKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-zinc-900 focus:border-[#0052FF] focus:outline-none"
              >
                <option value="MINT_ROLE">MINT_ROLE — izin mint supply baru</option>
                <option value="BURN_ROLE">BURN_ROLE — izin burn token</option>
                <option value="PAUSE_ROLE">PAUSE_ROLE — izin pause transaksi</option>
                <option value="ADMIN_ROLE">ADMIN_ROLE — admin penuh</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Alamat penerima</label>
              <input
                type="text"
                value={grantTarget}
                onChange={e => setGrantTarget(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-zinc-900 placeholder-zinc-300 font-mono focus:border-[#0052FF] focus:outline-none"
              />
              <button onClick={() => setGrantTarget(address || '')} className="text-[11px] text-[#0052FF] mt-1 hover:underline">
                Pakai wallet saya
              </button>
            </div>
            <button
              onClick={() => grantRole.write({ address: tokenAddr, functionName: 'grantRole', args: [B20_ROLES[grantRoleKey], grantTarget] })}
              disabled={grantRole.status === 'pending' || grantRole.status === 'confirming' || !grantTarget}
              className="py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Grant role
            </button>
            <StatusRow {...grantRole} />
          </div>
        </ActionCard>

        {/* Allowlist */}
        <ActionCard title="Allowlist" description="Tambah alamat ke whitelist transfer" icon="✅">
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50 rounded-lg">
              <span className="text-blue-400 text-sm mt-0.5">ℹ</span>
              <p className="text-xs text-blue-700">Hanya berlaku jika fitur Allowlist diaktifkan saat deploy.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Alamat yang diizinkan</label>
              <input
                type="text"
                value={allowAddr}
                onChange={e => setAllowAddr(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-zinc-900 placeholder-zinc-300 font-mono focus:border-[#0052FF] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => allowlist.write({ address: tokenAddr, functionName: 'addToAllowlist', args: [allowAddr] })}
                disabled={allowlist.status === 'pending' || !allowAddr}
                className="py-2.5 bg-zinc-900 text-white text-xs font-medium rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-40"
              >
                Tambah ke allowlist
              </button>
              <button
                onClick={() => allowlist.write({ address: tokenAddr, functionName: 'removeFromAllowlist', args: [allowAddr] })}
                disabled={allowlist.status === 'pending' || !allowAddr}
                className="py-2.5 border border-gray-200 text-zinc-600 text-xs font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                Hapus dari allowlist
              </button>
            </div>
            <StatusRow {...allowlist} />
          </div>
        </ActionCard>

        {/* Freeze */}
        <ActionCard title="Freeze alamat" description="Bekukan atau cairkan alamat tertentu" icon="🧊">
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Alamat yang ingin dibekukan</label>
              <input
                type="text"
                value={freezeAddr}
                onChange={e => setFreezeAddr(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-zinc-900 placeholder-zinc-300 font-mono focus:border-[#0052FF] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => freeze.write({ address: tokenAddr, functionName: 'freeze', args: [freezeAddr] })}
                disabled={freeze.status === 'pending' || !freezeAddr}
                className="py-2.5 bg-red-600 text-white text-xs font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-40"
              >
                Freeze
              </button>
              <button
                onClick={() => freeze.write({ address: tokenAddr, functionName: 'unfreeze', args: [freezeAddr] })}
                disabled={freeze.status === 'pending' || !freezeAddr}
                className="py-2.5 border border-gray-200 text-zinc-600 text-xs font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                Unfreeze
              </button>
            </div>
            <StatusRow {...freeze} />
          </div>
        </ActionCard>

      </div>
    </div>
  )
}
