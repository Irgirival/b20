const S = { maxWidth: 760, margin: '0 auto', padding: '60px 24px 100px' }
const H2 = { fontSize: 26, fontWeight: 800, color: '#F0F0FF', letterSpacing: '-0.02em', marginBottom: 12, marginTop: 48 }
const H3 = { fontSize: 16, fontWeight: 700, color: '#F0F0FF', marginBottom: 8, marginTop: 28 }
const P  = { fontSize: 14, color: '#8888AA', lineHeight: 1.75, marginBottom: 12 }

const Code = ({ children }) => (
  <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, background: '#16161F', border: '1px solid #2A2A3D', borderRadius: 6, padding: '2px 7px', color: '#6699FF' }}>
    {children}
  </code>
)

const CodeBlock = ({ children }) => (
  <pre style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, background: '#111118', border: '1px solid #2A2A3D', borderRadius: 12, padding: '16px 20px', color: '#6699FF', overflowX: 'auto', lineHeight: 1.7, marginBottom: 16 }}>
    {children}
  </pre>
)

const InfoBox = ({ icon, title, children }) => (
  <div style={{ background: 'rgba(0,82,255,0.06)', border: '1px solid rgba(0,82,255,0.15)', borderRadius: 12, padding: '14px 18px', marginBottom: 16 }}>
    <div style={{ fontWeight: 700, fontSize: 13, color: '#6699FF', marginBottom: 6 }}>{icon} {title}</div>
    <div style={{ fontSize: 13, color: '#8888AA', lineHeight: 1.65 }}>{children}</div>
  </div>
)

export default function DocsPage({ onNavigate }) {
  return (
    <div style={S}>
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#0052FF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Documentation</div>
        <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.04em', color: '#F0F0FF', marginBottom: 16 }}>How B20 Forge Works</h1>
        <p style={{ ...P, fontSize: 16 }}>A complete guide to deploying B20 tokens on Base using B20 Forge — from understanding the standard to launching your first token.</p>
      </div>

      {/* What is B20 */}
      <h2 style={H2}>What is B20?</h2>
      <p style={P}>B20 is a next-generation token standard native to Base. Unlike traditional ERC-20 tokens that are deployed as Solidity smart contracts, B20 tokens are created via a <strong style={{ color: '#F0F0FF' }}>native precompile</strong> — a piece of code running directly inside the Base EVM at a fixed address.</p>
      <p style={P}>This means B20 tokens get cheaper transfers, higher throughput, and compliance features baked in at the protocol level — without you writing, auditing, or deploying any contract.</p>

      <InfoBox icon="⬡" title="B20 Factory Address">
        The factory lives at <Code>0xB20f000000000000000000000000000000000000</Code> on every Base network — mainnet, Sepolia, and Vibenet. Tokens created by the factory will have addresses starting with <Code>0xB200...</Code>
      </InfoBox>

      {/* Variants */}
      <h2 style={H2}>Token Variants</h2>

      <h3 style={H3}>Asset (variant 0)</h3>
      <p style={P}>The standard token type. Configurable decimals between 6 and 18. Suitable for utility tokens, governance tokens, reward tokens, and any general-purpose use case.</p>

      <h3 style={H3}>Stablecoin (variant 1)</h3>
      <p style={P}>Designed for fiat-pegged tokens. Decimals are fixed at 6 (matching USDC/USDT). Requires an ISO 4217 currency code (e.g. <Code>USD</Code>, <Code>EUR</Code>, <Code>IDR</Code>) to identify the pegged fiat currency.</p>

      {/* Compliance */}
      <h2 style={H2}>Compliance Features</h2>
      <p style={P}>Compliance features are configured at token creation via <Code>initCalls</Code> — a batch of function calls applied atomically before your token becomes usable. You do not need to call anything after deployment to activate them.</p>

      {[
        {
          name: 'Allowlist', role: 'ALLOWLIST_ROLE',
          desc: 'When enabled, only addresses that have been explicitly approved by an account holding ALLOWLIST_ROLE can receive the token. Transfers to non-approved addresses revert. Useful for securities tokens, KYC-gated distributions, and corporate tokens.',
        },
        {
          name: 'Freeze', role: 'FREEZE_ROLE',
          desc: 'An account holding FREEZE_ROLE can freeze any address, preventing that address from sending or receiving tokens. The freeze can be lifted at any time. Standard in regulated stablecoins for AML and sanctions compliance.',
        },
        {
          name: 'Memos', role: 'none',
          desc: 'Allows senders to attach a short text reference to any transfer. The memo is stored onchain and emitted in the transfer event. Useful for B2B payments, reconciliation, and referencing off-chain invoices or order IDs.',
        },
        {
          name: 'Permit (ERC-2612)', role: 'none',
          desc: 'Users can authorize a spender by signing a typed message off-chain, rather than broadcasting an on-chain approve() transaction. This eliminates the two-step approve + transferFrom flow, reducing user friction and gas costs in DeFi protocols.',
        },
      ].map(c => (
        <div key={c.name} style={{ background: '#111118', border: '1px solid #2A2A3D', borderRadius: 14, padding: '18px 20px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#F0F0FF' }}>{c.name}</span>
            {c.role !== 'none' && <Code>{c.role}</Code>}
          </div>
          <p style={{ ...P, marginBottom: 0 }}>{c.desc}</p>
        </div>
      ))}

      {/* Roles */}
      <h2 style={H2}>Role System</h2>
      <p style={P}>B20 uses OpenZeppelin-style access control. Roles are <Code>bytes32</Code> values granted via <Code>grantRole(role, address)</Code>. B20 Forge automatically grants <Code>MINT_ROLE</Code> to your deploying wallet, so you can mint immediately after deploy.</p>

      <CodeBlock>{`DEFAULT_ADMIN_ROLE  0x0000...0000  // Can grant/revoke all roles
MINT_ROLE          keccak256("MINT_ROLE")
BURN_ROLE          keccak256("BURN_ROLE")
FREEZE_ROLE        keccak256("FREEZE_ROLE")
ALLOWLIST_ROLE     keccak256("ALLOWLIST_ROLE")`}</CodeBlock>

      {/* FAQ */}
      <h2 style={H2}>FAQ</h2>
      {[
        ['Do I need to write Solidity?', 'No. B20 Forge handles all encoding and transaction building. You interact through a web form.'],
        ['Does my token work with Uniswap / Aerodrome?', 'Yes. B20 tokens are fully ERC-20 compatible — any protocol or wallet that supports ERC-20 works out of the box.'],
        ['Can I mint tokens after deploying?', 'Yes. Your deploying wallet is automatically granted MINT_ROLE. You can call mint(address, amount) on your token contract at any time.'],
        ['Is there a supply cap by default?', 'No. If you leave the supply cap field empty, the cap defaults to type(uint128).max — effectively unlimited.'],
        ['What happens if B20 is not yet activated?', 'B20 Forge checks the Activation Registry before submitting any transaction. If B20 is not yet active, you\'ll see a clear error and no gas is spent.'],
        ['Is the factory address the same on testnet?', 'Yes. 0xB20f000000000000000000000000000000000000 is the same on Base Mainnet, Base Sepolia, and Vibenet.'],
      ].map(([q, a]) => (
        <div key={q} style={{ borderBottom: '1px solid #1A1A2E', padding: '18px 0' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#F0F0FF', marginBottom: 8 }}>{q}</div>
          <div style={{ fontSize: 14, color: '#8888AA', lineHeight: 1.65 }}>{a}</div>
        </div>
      ))}

      <div style={{ marginTop: 56, textAlign: 'center' }}>
        <button className="btn-primary" onClick={() => onNavigate('launch')} style={{ fontSize: 15, padding: '13px 36px' }}>
          Launch Your Token →
        </button>
      </div>
    </div>
  )
}
