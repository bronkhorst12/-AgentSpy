# AgentSpy

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/typescript-%230074c1.svg?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Solana](https://img.shields.io/badge/Solana-9945FF?logo=solana&logoColor=white)

**AgentSpy** adalah platform monitoring blockchain Solana yang canggih dengan kemampuan real-time untuk melacak aktivitas whale, aliran pasar, data staking, dan feed real-time. Didesain untuk memberikan insight mendalam tentang ekosistem Solana.

## Fitur Utama

### Whale Activity Tracker
- Monitoring transaksi besar dari dompet whale Solana
- Pelacakan hingga 5 alamat whale utama
- Filter berdasarkan jumlah transaksi dan waktu
- Eksport data ke CSV/JSON
- Real-time signature tracking

### Market Flow Analyzer
- Analisis DEX (Jupiter, Raydium, Orca)
- Tracking volume trading real-time
- Price action monitoring via CoinGecko API
- Flow visualization untuk token pairs
- Swap analytics dengan filter advanced

### Staking Monitor
- Monitor 849+ validator Solana
- Data APY real-time untuk semua validator
- Staking statistics dan performance metrics
- Leaderboard validator berdasarkan performa
- Export staking data untuk analysis

### Real-time Feed
- Live event streaming dari blockchain Solana
- Real-time transaction updates
- WebSocket connection untuk data terbaru
- Auto-refresh setiap 5 detik
- Event aggregation dari multiple sources

### Wallet Integration
- Multi-wallet support (Phantom, Solflare, Coinbase, Trust Wallet, Ledger)
- Seamless wallet connection
- Transaction history integration
- Balance tracking dan wallet management

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool dan development server
- **Tailwind CSS** - Utility-first CSS framework
- **Solana Wallet Adapters** - Multi-wallet integration

### Backend
- **Supabase Edge Functions** - Serverless backend (Deno runtime)
- **PostgreSQL** - Primary database
- **Real-time Subscriptions** - Live data streaming

### Blockchain Integration
- **Solana RPC** - Mainnet blockchain interaction
- **Jupiter API** - DEX aggregation dan swap data
- **CoinGecko API** - Real-time token prices

## 📁 Struktur Project

```
AgentSpy/
├── src/                          # Frontend source code
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Base UI components
│   │   │   ├── Modal.tsx        # Modal system
│   │   │   ├── SearchBar.tsx    # Search interface
│   │   │   ├── ExportButton.tsx # Data export
│   │   │   └── CopyButton.tsx   # Copy functionality
│   │   ├── WalletButton.tsx     # Multi-wallet connection
│   │   └── layout/              # Layout components
│   ├── pages/                   # Main application pages
│   │   ├── WhaleActivity.tsx    # Whale tracking
│   │   ├── MarketFlow.tsx       # DEX analysis
│   │   ├── StakingMonitor.tsx   # Validator monitoring
│   │   └── RealTimeFeed.tsx     # Live event feed
│   ├── contexts/                # React contexts
│   │   └── WalletContextProvider.tsx
│   ├── hooks/                   # Custom React hooks
│   └── lib/                     # Utility libraries
│       └── supabase.ts          # Supabase client
├── supabase/                    # Backend configuration
│   ├── functions/               # Edge Functions
│   │   ├── fetch-whale-transactions/
│   │   ├── fetch-market-flow/
│   │   ├── fetch-staking-data/
│   │   ├── aggregate-real-time-feed/
│   │   └── cron-refresh-data/
│   ├── tables/                  # Database schemas
│   ├── migrations/              # Database migrations
│   └── cron_jobs/               # Scheduled tasks
├── docs/                        # Documentation
└── .github/                     # GitHub templates
```

## Instalasi & Menjalankan

### Prerequisites
- Node.js 18+ dan npm/pnpm
- Supabase account dan project
- Git

### 1. Clone Repository
```bash
git clone https://github.com/superbixnggas/AgentSpy.git
cd AgentSpy
```

### 2. Install Dependencies
```bash
npm install
# atau
pnpm install
```

### 3. Environment Configuration
Buat file `.env.local` di root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Setup Supabase Backend
```bash
# Install Supabase CLI
npm install -g supabase

# Login ke Supabase
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Deploy Edge Functions
supabase functions deploy
```

### 5. Menjalankan Development Server
```bash
# Frontend development
npm run dev

# Backend functions (in another terminal)
supabase functions serve
```

Aplikasi akan berjalan di `http://localhost:5173`

### 6. Build untuk Production
```bash
npm run build
npm run preview
```

## Live Demo

- **Production URL**: [https://4gt721fta2x1.space.minimax.io](https://4gt721fta2x1.space.minimax.io)
- **GitHub Repository**: [https://github.com/superbixnggas/AgentSpy](https://github.com/superbixnggas/AgentSpy)

## Dokumentasi

- [Architecture Overview](docs/architecture.md)
- [API Documentation - Market Flow](docs/api-market-flow.md)
- [API Documentation - Whale Transactions](docs/api-whale-transactions.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)
- [Roadmap](ROADMAP.md)

## Kontribusi

Kami welcome kontribusi dari community! Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk guidelines.

## License

Proyek ini menggunakan [MIT License](LICENSE).

## Security

Untuk melaporkan security vulnerabilities, lihat [SECURITY.md](SECURITY.md).

---

**AgentSpy** - *Your intelligent Solana blockchain monitoring companion* 🚀