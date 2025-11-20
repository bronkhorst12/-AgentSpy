# 🏗️ AgentSpy Architecture Overview

Dokumentasi ini menjelaskan arsitektur lengkap sistem AgentSpy, termasuk frontend, backend, dan integrasi dengan blockchain Solana.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Design](#database-design)
- [API Integration](#api-integration)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)

## 🎯 System Overview

AgentSpy adalah platform monitoring blockchain Solana real-time yang terdiri dari:

- **Frontend**: React-based web application dengan TypeScript
- **Backend**: Supabase Edge Functions (serverless)
- **Database**: PostgreSQL dengan Row Level Security (RLS)
- **Blockchain Integration**: Direct RPC calls ke Solana mainnet
- **External APIs**: CoinGecko dan Jupiter untuk market data

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │───▶│  Supabase Edge   │───▶│  Solana RPC     │
│   (Frontend)    │    │   Functions      │    │   Mainnet       │
│                 │    │   (Backend)      │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌──────────────────┐              │
         │              │   PostgreSQL     │◀─────────────┘
         │              │   Database       │
         │              └──────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│  External APIs  │    │   Cron Jobs      │
│ (CoinGecko,     │    │   (Auto Refresh) │
│  Jupiter)       │    └──────────────────┘
└─────────────────┘
```

## 🖥️ Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Modal.tsx          # Modal system
│   │   ├── SearchBar.tsx      # Search interface
│   │   ├── ExportButton.tsx   # Data export
│   │   └── CopyButton.tsx     # Copy functionality
│   ├── WalletButton.tsx       # Multi-wallet connection
│   └── layout/                # Layout components
│       └── Layout.tsx
├── pages/                     # Main application pages
│   ├── WhaleActivity.tsx      # Whale tracking
│   ├── MarketFlow.tsx         # DEX analysis
│   ├── StakingMonitor.tsx     # Validator monitoring
│   └── RealTimeFeed.tsx       # Live event feed
├── contexts/                  # React contexts
│   └── WalletContextProvider.tsx
├── hooks/                     # Custom React hooks
│   └── use-mobile.tsx
└── lib/                       # Utility libraries
    ├── supabase.ts            # Supabase client
    └── utils.ts               # Utility functions
```

### State Management

AgentSpy menggunakan Context API untuk state management:

1. **WalletContext**: Manages wallet connection state
2. **Local State**: React useState untuk component-specific state
3. **Supabase Real-time**: Real-time subscriptions untuk live data

### Key Design Patterns

#### Error Boundary Pattern
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}
```

#### Custom Hooks Pattern
```typescript
export const useMarketData = () => {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-market-flow');
      if (error) throw error;
      setData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch: fetchData };
};
```

## ⚡ Backend Architecture

### Supabase Edge Functions

Backend menggunakan Supabase Edge Functions (Deno runtime) untuk serverless computing:

#### Function Structure
```
supabase/functions/
├── fetch-whale-transactions/
│   └── index.ts
├── fetch-market-flow/
│   └── index.ts
├── fetch-staking-data/
│   └── index.ts
├── aggregate-real-time-feed/
│   └── index.ts
└── cron-refresh-data/
    └── index.ts
```

#### Function Lifecycle

1. **Request Processing**: Validate inputs dan authentication
2. **External API Calls**: Fetch data dari Solana RPC dan external APIs
3. **Data Processing**: Transform dan clean data
4. **Database Operations**: Store results dalam PostgreSQL
5. **Response**: Return formatted data

#### Error Handling Pattern
```typescript
export const handler = async (req: Request) => {
  try {
    // Validate request
    if (!req.url) {
      throw new Error('Invalid request');
    }

    // Process data
    const data = await processExternalData();

    // Store in database
    await storeData(data);

    // Return response
    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

### Cron Jobs

Automated data refresh menggunakan Supabase cron jobs:

```json
{
  "name": "refresh-all-data",
  "schedule": "*/5 * * * *",
  "endpoint": "/functions/v1/cron-refresh-data"
}
```

**Job Details**:
- Runs every 5 minutes
- Refreshes all data sources
- Updates database dengan fresh data
- Handles rate limiting gracefully

## 🗄️ Database Design

### Schema Overview

AgentSpy menggunakan 4 main tables untuk data storage:

#### 1. whale_events
```sql
CREATE TABLE whale_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  signature varchar NOT NULL,
  wallet_address varchar NOT NULL,
  amount numeric NOT NULL,
  timestamp bigint NOT NULL,
  block_number bigint,
  transaction_type varchar,
  created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

#### 2. market_flow
```sql
CREATE TABLE market_flow (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  dex_name varchar NOT NULL,
  token_pair varchar NOT NULL,
  volume numeric NOT NULL,
  price numeric NOT NULL,
  price_change_24h numeric,
  liquidity numeric,
  timestamp bigint NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

#### 3. staking_data
```sql
CREATE TABLE staking_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  validator_pubkey varchar NOT NULL,
  validator_name varchar,
  apy numeric NOT NULL,
  total_staked numeric NOT NULL,
  active_stake numeric NOT NULL,
  commission decimal(5,2),
  performance_score numeric,
  epoch bigint NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

#### 4. real_time_feed
```sql
CREATE TABLE real_time_feed (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type varchar NOT NULL,
  data jsonb NOT NULL,
  source varchar NOT NULL,
  timestamp bigint NOT NULL,
  processed boolean DEFAULT false,
  created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Row Level Security (RLS)

Semua tables dilindungi dengan RLS policies:

```sql
-- Enable RLS
ALTER TABLE whale_events ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access
CREATE POLICY "Public read access"
ON whale_events
FOR SELECT
USING (true);

-- Policy: Service role full access
CREATE POLICY "Service role full access"
ON whale_events
FOR ALL
USING (auth.role() = 'service_role');
```

## 🔗 API Integration

### Solana RPC Integration

Direct integration dengan Solana mainnet RPC:

```typescript
const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';

export const fetchWhaleTransactions = async (walletAddress: string) => {
  const response = await fetch(RPC_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getSignaturesForAddress',
      params: [
        walletAddress,
        {
          limit: 10,
          before: undefined,
          until: undefined,
          commitment: 'confirmed'
        }
      ]
    })
  });

  return response.json();
};
```

### External API Integration

#### CoinGecko API
```typescript
const fetchTokenPrices = async (tokenIds: string[]) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds.join(',')}&vs_currencies=usd`
  );
  return response.json();
};
```

#### Jupiter API
```typescript
const fetchSwapData = async (tokenPair: string) => {
  const response = await fetch(
    `https://quote-api.jup.ag/v4/quote?inputMint=${tokenPair}&outputMint=SOL&amount=1000000&slippageBps=50`
  );
  return response.json();
};
```

## 🔐 Security Architecture

### Authentication & Authorization

1. **Anonymous Access**: Public read access untuk basic features
2. **Wallet Authentication**: Signature-based authentication
3. **Service Role**: Backend operations menggunakan service role

### Data Security

1. **Input Validation**: All inputs validated before processing
2. **SQL Injection Prevention**: Parameterized queries
3. **Rate Limiting**: API rate limiting untuk external services
4. **Error Handling**: Secure error messages tanpa sensitive data

### Client-Side Security

```typescript
// Environment variables validation
const validateEnv = () => {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  for (const key of required) {
    if (!import.meta.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }
};
```

## 🚀 Deployment Architecture

### Production Environment

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  CDN/Static     │    │  Supabase Edge   │    │  Solana RPC     │
│  Hosting        │    │  Functions       │    │  Mainnet        │
│                 │    │  (Global Edge)   │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  Supabase        │
                       │  Database        │
                       │  (PostgreSQL)    │
                       └──────────────────┘
```

### Build Process

1. **Frontend Build**:
   ```bash
   npm run build    # Vite build with optimization
   ```

2. **Backend Deployment**:
   ```bash
   supabase functions deploy    # Deploy Edge Functions
   supabase db push            # Deploy migrations
   ```

## 📊 Data Flow

### Real-time Data Pipeline

1. **Data Collection**: Cron jobs trigger data collection
2. **External API Calls**: Fetch dari Solana RPC dan external APIs
3. **Data Processing**: Transform dan validate data
4. **Storage**: Store dalam PostgreSQL dengan timestamps
5. **Real-time Updates**: Supabase real-time subscriptions
6. **Frontend Updates**: React state updates melalui subscriptions

### Data Refresh Strategy

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Cron Job   │───▶│ Edge Function│───▶│ External API │
│   (Every 5m) │    │   (Backend)  │    │   (RPC/API)  │
└──────────────┘    └──────────────┘    └──────────────┘
                              │
                              ▼
                     ┌──────────────┐
                     │   Database   │
                     │   (Postgres) │
                     └──────────────┘
                              │
                              ▼
                     ┌──────────────┐
                     │ Real-time    │
                     │ Subscriptions│
                     └──────────────┘
                              │
                              ▼
                     ┌──────────────┐
                     │    React     │
                     │   Frontend   │
                     └──────────────┘
```

## 🛠️ Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.x | Styling |
| @solana/wallet-adapter | Latest | Wallet integration |
| @supabase/supabase-js | Latest | Backend client |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Deno | 1.x | Runtime untuk Edge Functions |
| Supabase | Latest | Backend-as-a-Service |
| PostgreSQL | 14+ | Primary database |
| Row Level Security | Built-in | Data security |

### Blockchain Integration

| Technology | Purpose |
|------------|---------|
| Solana RPC | Blockchain data access |
| Jupiter API | DEX aggregation |
| CoinGecko API | Token pricing |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| TypeScript Compiler | Type checking |
| Vite | Build optimization |

## 🔍 Performance Considerations

### Frontend Performance

1. **Code Splitting**: Dynamic imports untuk route-based splitting
2. **Lazy Loading**: Components loaded on demand
3. **Memoization**: React.memo dan useMemo untuk expensive operations
4. **Virtual Scrolling**: For large data lists

### Backend Performance

1. **Efficient Queries**: Optimized database queries
2. **Caching**: Redis cache untuk frequently accessed data
3. **Connection Pooling**: Database connection optimization
4. **Rate Limiting**: Prevent API abuse

### Database Performance

1. **Indexes**: Proper indexing untuk query optimization
2. **Query Optimization**: Efficient JOINs dan WHERE clauses
3. **Pagination**: Limit results untuk large datasets
4. **Data Partitioning**: Partitioning untuk time-series data

## 📈 Monitoring & Observability

### Application Monitoring

1. **Error Tracking**: Comprehensive error logging
2. **Performance Monitoring**: API response times
3. **User Analytics**: User behavior tracking
4. **System Health**: Database performance metrics

### Alerting

1. **Data Freshness**: Alert jika data tidak updated
2. **API Failures**: Alert untuk external API failures
3. **Database Issues**: Alert untuk database problems
4. **Performance Degradation**: Alert untuk slow queries

---

**Last Updated**: November 19, 2025  
**Version**: 1.0  
**Authors**: AgentSpy Development Team