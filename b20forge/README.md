# B20 Forge

Token launcher untuk Base Mainnet — deploy ERC-20 token dengan fitur compliance dalam detik.

## Stack

- **React 18 + Vite** — frontend
- **wagmi v2 + viem** — Web3 hooks & ABI encoding
- **RainbowKit v2** — wallet connect UI
- **TailwindCSS v3** — styling

## Setup

### 1. Clone & Install

```bash
git clone <repo>
cd b20forge
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_WALLETCONNECT_PROJECT_ID=xxx   # dari https://cloud.walletconnect.com
VITE_BASE_RPC=https://...           # opsional, Alchemy/QuickNode untuk production
```

### 3. Factory Address

Edit `src/lib/b20.js` → ganti `B20_FACTORY_ADDRESS` dengan alamat factory yang kamu deploy.

### 4. Jalankan

```bash
npm run dev
```

### 5. Deploy ke Vercel

```bash
npm run build
# Upload dist/ ke Vercel, atau connect repo langsung
```

Tambahkan env vars di dashboard Vercel: `VITE_WALLETCONNECT_PROJECT_ID`

## Struktur File

```
src/
├── components/
│   ├── Navbar.jsx        # sticky navbar + wallet connect
│   ├── DeployForm.jsx    # form utama
│   ├── TokenPreview.jsx  # live preview token
│   ├── Toggle.jsx        # reusable toggle switch
│   └── DeployResult.jsx  # status & hasil deploy
├── hooks/
│   └── useDeployToken.js # hook deploy + localStorage history
├── lib/
│   ├── wagmi.js          # wagmi config + chains
│   └── b20.js            # factory ABI + calldata builder
└── pages/
    └── HomePage.jsx      # halaman utama
```
