# 🐋 Whale Transactions API Documentation

API ini menyediakan monitoring real-time untuk transaksi besar (whale transactions) dari dompet-dompet whale di blockchain Solana.

## 📋 Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoint](#endpoint)
- [Request Parameters](#request-parameters)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Whale Addresses](#whale-addresses)
- [Examples](#examples)
- [Data Sources](#data-sources)
- [Performance](#performance)

## 🎯 Overview

Whale Transactions API melacak aktivitas transaksi besar dari dompet-dompet whale Solana. API ini memberikan insight tentang:

- Large transactions (>10,000 SOL atau equivalent)
- Whale movement patterns
- Transaction timing analysis
- Impact assessment pada market
- Signature-based tracking untuk real-time updates

### Tracked Metrics

- **Transaction Volume**: Amount SOL/tokens transferred
- **Transaction Frequency**: How often whales transact
- **Market Impact**: Price movement correlation
- **Gas Fees**: Transaction costs analysis
- **Success Rate**: Failed vs successful transactions

## 🌐 Base URL

```
https://bpbtgkunrdzcoyfdhskh.supabase.co/functions/v1/fetch-whale-transactions
```

## 🔐 Authentication

API ini tidak memerlukan authentication untuk public access. Semua requests menggunakan Supabase anonymous key.

```bash
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
Content-Type: application/json
```

## 🔗 Endpoint

### GET /fetch-whale-transactions

Mengambil data transaksi whale real-time dari blockchain Solana.

#### Request Method
```
GET
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Number of records to return (default: 50, max: 200) |
| `sort_by` | string | No | Sort field (`timestamp`, `amount`, `fee`, `success_rate`) |
| `sort_order` | string | No | Sort direction (`asc`, `desc`) |
| `whale_address` | string | No | Filter by specific whale address |
| `min_amount` | number | No | Minimum transaction amount (SOL) |
| `transaction_type` | string | No | Filter by type (`transfer`, `swap`, `stake`, `unstake`) |
| `status` | string | No | Filter by status (`success`, `failed`, `pending`) |
| `date_range` | string | No | Time range (`1h`, `6h`, `24h`, `7d`) |

#### Full URL Example
```bash
GET https://bpbtgkunrdzcoyfdhskh.supabase.co/functions/v1/fetch-whale-transactions?limit=30&sort_by=amount&sort_order=desc&min_amount=50000
```

## 📝 Request Parameters

### limit
- **Type**: `integer`
- **Default**: `50`
- **Range**: `1` - `200`
- **Description**: Jumlah maximum records yang dikembalikan

### sort_by
- **Type**: `string`
- **Options**: `timestamp`, `amount`, `fee`, `success_rate`
- **Default**: `timestamp`
- **Description**: Field untuk sorting results

### sort_order
- **Type**: `string`
- **Options**: `asc`, `desc`
- **Default**: `desc`
- **Description**: Direction untuk sorting

### whale_address
- **Type**: `string`
- **Format**: Base58 Solana address
- **Examples**: `11111111111111111111111111111111`
- **Description**: Filter berdasarkan specific whale address

### min_amount
- **Type**: `number`
- **Unit**: SOL
- **Default**: `10000`
- **Description**: Minimum transaction amount dalam SOL

### transaction_type
- **Type**: `string`
- **Options**: `transfer`, `swap`, `stake`, `unstake`, `all`
- **Description**: Filter berdasarkan jenis transaksi

### status
- **Type**: `string`
- **Options**: `success`, `failed`, `pending`, `all`
- **Default**: `success`
- **Description**: Filter berdasarkan status transaksi

### date_range
- **Type**: `string`
- **Options**: `1h`, `6h`, `24h`, `7d`
- **Default**: `24h`
- **Description**: Time range untuk data yang diinginkan

## 📊 Response Format

### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "uuid-string",
      "signature": "5xyz123...",
      "wallet_address": "11111111111111111111111111111111",
      "amount": 150000.75,
      "transaction_type": "transfer",
      "timestamp": 1703123456789,
      "block_number": 285947856,
      "status": "success",
      "fee": 0.005,
      "success_rate": 100,
      "market_impact": {
        "price_change_5m": 0.12,
        "volume_spike": 2.3,
        "volatility_increase": 0.08
      },
      "transaction_details": {
        "instruction_count": 3,
        "account_count": 7,
        "compute_units_used": 800000,
        "transaction_blockhash": "abc123...",
        "recent_blockhash": "def456..."
      },
      "program_logs": [
        "Program log: Instruction: Transfer",
        "Program log: Success"
      ],
      "created_at": "2025-11-19T23:15:42Z"
    }
  ],
  "summary": {
    "total_transactions_24h": 156,
    "total_volume_24h": 15678900.50,
    "avg_transaction_size": 100506.41,
    "largest_transaction": 150000.75,
    "success_rate": 98.7,
    "most_active_whale": "11111111111111111111111111111111",
    "avg_fee": 0.008,
    "unique_whales": 5
  },
  "whale_profiles": [
    {
      "address": "11111111111111111111111111111111",
      "nickname": "Whale Alpha",
      "total_volume": 50000000.25,
      "transaction_count": 45,
      "avg_transaction_size": 1111111.12,
      "last_activity": 1703123400000,
      "risk_score": 85
    }
  ],
  "metadata": {
    "execution_time": 189,
    "cache_hit": false,
    "data_freshness": "12s",
    "api_version": "v1",
    "timestamp": "2025-11-19T23:15:42Z",
    "solana_slot": 285947856,
    "current_epoch": 882
  }
}
```

### Response Field Definitions

#### Data Array

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique identifier untuk record |
| `signature` | string | Transaction signature (transaction hash) |
| `wallet_address` | string | Source wallet address |
| `amount` | number | Transaction amount dalam SOL |
| `transaction_type` | string | Type of transaction |
| `timestamp` | number | Unix timestamp (milliseconds) |
| `block_number` | number | Solana block number |
| `status` | string | Transaction status |
| `fee` | number | Transaction fee dalam SOL |
| `success_rate` | number | Success rate percentage |

#### Market Impact Object

| Field | Type | Description |
|-------|------|-------------|
| `price_change_5m` | number | Price change dalam 5 minutes (%) |
| `volume_spike` | number | Volume spike multiplier |
| `volatility_increase` | number | Volatility increase (%) |

#### Transaction Details Object

| Field | Type | Description |
|-------|------|-------------|
| `instruction_count` | integer | Number of instructions in transaction |
| `account_count` | integer | Number of accounts involved |
| `compute_units_used` | number | Compute units consumed |
| `transaction_blockhash` | string | Transaction blockhash |
| `recent_blockhash` | string | Recent blockhash |

#### Summary Object

| Field | Type | Description |
|-------|------|-------------|
| `total_transactions_24h` | integer | Total transactions dalam 24 jam |
| `total_volume_24h` | number | Total volume dalam 24 jam (SOL) |
| `avg_transaction_size` | number | Average transaction size (SOL) |
| `largest_transaction` | number | Largest transaction amount (SOL) |
| `success_rate` | number | Overall success rate (%) |
| `most_active_whale` | string | Most active whale address |
| `avg_fee` | number | Average transaction fee (SOL) |
| `unique_whales` | number | Number of unique whale addresses |

#### Whale Profiles Array

| Field | Type | Description |
|-------|------|-------------|
| `address` | string | Whale wallet address |
| `nickname` | string | Assigned nickname |
| `total_volume` | number | Total volume handled (SOL) |
| `transaction_count` | integer | Number of transactions |
| `avg_transaction_size` | number | Average transaction size (SOL) |
| `last_activity` | number | Last activity timestamp |
| `risk_score` | number | Risk assessment score (0-100) |

## ❌ Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_WHALE_ADDRESS",
    "message": "Invalid Solana address format: invalid_address",
    "details": {
      "parameter": "whale_address",
      "value": "invalid_address",
      "expected_format": "base58-encoded string",
      "valid_examples": ["11111111111111111111111111111111"]
    },
    "timestamp": "2025-11-19T23:15:42Z"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_WHALE_ADDRESS` | 400 | Invalid Solana address format |
| `INVALID_PARAMETER` | 400 | Invalid request parameter |
| `WHALE_NOT_FOUND` | 404 | Whale address not in tracking list |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SOLANA_RPC_ERROR` | 502 | Solana RPC endpoint error |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `TIMEOUT` | 504 | Request timeout |
| `INTERNAL_ERROR` | 500 | Internal server error |

## 🚦 Rate Limiting

- **Limit**: 60 requests per minute per IP
- **Burst**: 5 requests per second
- **Headers**:
  ```bash
  X-RateLimit-Limit: 60
  X-RateLimit-Remaining: 55
  X-RateLimit-Reset: 1639876543
  ```

## 🐋 Whale Addresses

### Currently Tracked Whales

AgentSpy secara aktif memonitor 5 alamat whale utama:

| Address | Nickname | Status | Last Activity |
|---------|----------|--------|---------------|
| `11111111111111111111111111111111` | System Account | Active | Real-time |
| `Gh9ZwEmdLJ8DscKNTkTqSnNwP1uKZJmL1j8` | Large Holder #1 | Active | Real-time |
| `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` | Stable Coin Whale | Active | Real-time |
| `So11111111111111111111111111111111111111112` | Wrapped SOL | Active | Real-time |
| `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` | Serum Token | Active | Real-time |

### Adding New Whales

Whale addresses ditambahkan berdasarkan kriteria:

1. **Transaction Volume**: >100,000 SOL dalam 30 hari terakhir
2. **Frequency**: Minimal 10 large transactions per month
3. **Impact**: Significant market impact dari aktivitas
4. **Public Interest**: Addresses yang sering diminta user

## 💻 Examples

### Basic Request

```javascript
const response = await fetch(
  'https://bpbtgkunrdzcoyfdhskh.supabase.co/functions/v1/fetch-whale-transactions',
  {
    headers: {
      'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
```

### Filter by Amount and Sort

```javascript
const response = await fetch(
  'https://bpbtgkunrdzcoyfdhskh.supabase.co/functions/v1/fetch-whale-transactions?min_amount=100000&sort_by=amount&sort_order=desc',
  {
    headers: {
      'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY',
      'Content-Type': 'application/json'
    }
  }
);
```

### Specific Whale Address

```javascript
const whaleAddress = '11111111111111111111111111111111';
const response = await fetch(
  `https://bpbtgkunrdzcoyfdhskh.supabase.co/functions/v1/fetch-whale-transactions?whale_address=${whaleAddress}&limit=20`,
  {
    headers: {
      'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY',
      'Content-Type': 'application/json'
    }
  }
);
```

### Real-time Monitoring Hook

```typescript
import { useEffect, useState, useRef } from 'react';

interface WhaleTransaction {
  signature: string;
  wallet_address: string;
  amount: number;
  timestamp: number;
  status: string;
}

export const useWhaleMonitoring = (whaleAddress?: string) => {
  const [transactions, setTransactions] = useState<WhaleTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchWhaleTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (whaleAddress) params.append('whale_address', whaleAddress);
      params.append('limit', '10');
      params.append('sort_by', 'timestamp');
      params.append('sort_order', 'desc');

      const response = await fetch(
        `https://bpbtgkunrdzcoyfdhskh.supabase.co/functions/v1/fetch-whale-transactions?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setTransactions(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchWhaleTransactions();

    // Set up polling every 30 seconds
    intervalRef.current = setInterval(fetchWhaleTransactions, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [whaleAddress]);

  return { transactions, loading, error, refetch: fetchWhaleTransactions };
};
```

## 📡 Data Sources

### Solana RPC

Primary data source untuk transaction information:

```javascript
const fetchWhaleTransactions = async (walletAddress) => {
  const response = await fetch(SOLANA_RPC_ENDPOINT, {
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

### Transaction Details

```javascript
const fetchTransactionDetails = async (signature) => {
  const response = await fetch(SOLANA_RPC_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getTransaction',
      params: [
        signature,
        {
          encoding: 'jsonParsed',
          commitment: 'confirmed',
          maxSupportedTransactionVersion: 0
        }
      ]
    })
  });

  return response.json();
};
```

### Data Processing Pipeline

```typescript
const processWhaleTransaction = (rawData: any) => {
  const transaction = rawData.transaction;
  const meta = transaction.meta;
  
  return {
    signature: transaction.signatures[0],
    wallet_address: transaction.message.accountKeys[0].pubkey,
    amount: calculateTransactionAmount(meta),
    transaction_type: determineTransactionType(transaction),
    timestamp: rawData.blockTime * 1000, // Convert to milliseconds
    block_number: rawData.slot,
    status: meta.err ? 'failed' : 'success',
    fee: meta.fee / 1e9, // Convert lamports to SOL
    transaction_details: {
      instruction_count: transaction.message.instructions.length,
      account_count: transaction.message.accountKeys.length,
      compute_units_used: meta.computeUnitsConsumed
    }
  };
};
```

## ⚡ Performance

### Caching Strategy

- **Redis Cache**: 30 seconds untuk transaction signatures
- **Database Cache**: 2 minutes untuk whale profiles
- **CDN Cache**: Static data untuk 10 minutes

### Database Optimization

```sql
-- Primary indexes for whale transactions
CREATE INDEX idx_whale_events_wallet_timestamp ON whale_events(wallet_address, timestamp DESC);
CREATE INDEX idx_whale_events_signature ON whale_events(signature);
CREATE INDEX idx_whale_events_amount ON whale_events(amount DESC);

-- Composite indexes for complex queries
CREATE INDEX idx_whale_events_wallet_amount ON whale_events(wallet_address, amount DESC);
CREATE INDEX idx_whale_events_type_status ON whale_events(transaction_type, status);
```

### Performance Targets

- **Response Time**: Target < 300ms untuk cached data
- **Cache Hit Rate**: Target > 85%
- **Error Rate**: Target < 0.5%
- **Data Freshness**: Target < 15 seconds
- **Throughput**: Target 1000 requests/minute

### Monitoring Metrics

1. **Transaction Processing Speed**: Time from blockchain event ke database storage
2. **API Response Times**: P95 < 500ms, P99 < 1000ms
3. **Error Rates**: Target < 1% untuk semua endpoints
4. **Cache Effectiveness**: Hit rate monitoring
5. **Data Accuracy**: Cross-validation dengan multiple sources

---

**API Version**: v1  
**Last Updated**: November 19, 2025  
**Support**: untuk questions atau issues, please contact development team