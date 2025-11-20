# 📊 Market Flow API Documentation

API ini menyediakan data analisis pasar decentralized exchange (DEX) real-time dari ekosistem Solana, terintegrasi dengan Jupiter aggregator dan CoinGecko untuk data harga token.

## 📋 Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoint](#endpoint)
- [Request Parameters](#request-parameters)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)
- [Data Sources](#data-sources)
- [Performance](#performance)

## 🎯 Overview

Market Flow API mengumpulkan dan menganalisis data dari multiple DEXs di Solana ecosystem:

- **Jupiter**: Primary DEX aggregator
- **Raydium**: Automated market maker
- **Orca**: Concentrated liquidity DEX
- **Serum**: Order book-based DEX

API ini memberikan insight tentang volume trading, price movements, dan liquidity untuk token pairs di ecosystem Solana.

## 🌐 Base URL

```
https://bpbtgkunrdzcoyfdhskh.supabase.co/functions/v1/fetch-market-flow
```

## 🔐 Authentication

API ini tidak memerlukan authentication untuk public access. Semua requests menggunakan Supabase anonymous key.

```bash
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
Content-Type: application/json
```

## 🔗 Endpoint

### GET /fetch-market-flow

Mengambil data analisis market flow real-time dari DEXs.

#### Request Method
```
GET
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Number of records to return (default: 100, max: 1000) |
| `sort_by` | string | No | Sort field (`volume`, `price`, `timestamp`, `liquidity`) |
| `sort_order` | string | No | Sort direction (`asc`, `desc`) |
| `dex_filter` | string | No | Filter by DEX (`jupiter`, `raydium`, `orca`, `serum`) |
| `token_pair` | string | No | Filter by specific token pair (e.g., `SOL/USDC`) |
| `min_volume` | number | No | Minimum volume threshold |
| `date_range` | string | No | Time range (`1h`, `24h`, `7d`, `30d`) |

#### Full URL Example
```bash
GET https://bpbtgkunrdzcoyfdhskh.supabase.co/functions/v1/fetch-market-flow?limit=50&sort_by=volume&sort_order=desc&dex_filter=jupiter
```

## 📝 Request Parameters

### limit
- **Type**: `integer`
- **Default**: `100`
- **Range**: `1` - `1000`
- **Description**: Jumlah maximum records yang dikembalikan

### sort_by
- **Type**: `string`
- **Options**: `volume`, `price`, `timestamp`, `liquidity`
- **Default**: `timestamp`
- **Description**: Field untuk sorting results

### sort_order
- **Type**: `string`
- **Options**: `asc`, `desc`
- **Default**: `desc`
- **Description**: Direction untuk sorting

### dex_filter
- **Type**: `string`
- **Options**: `jupiter`, `raydium`, `orca`, `serum`
- **Description**: Filter berdasarkan DEX platform

### token_pair
- **Type**: `string`
- **Format**: `TOKEN_A/TOKEN_B`
- **Examples**: `SOL/USDC`, `USDC/USDT`, `RAY/SOL`
- **Description**: Filter berdasarkan specific token pair

### min_volume
- **Type**: `number`
- **Unit**: USD
- **Description**: Minimum trading volume dalam USD

### date_range
- **Type**: `string`
- **Options**: `1h`, `24h`, `7d`, `30d`
- **Description**: Time range untuk data yang diinginkan

## 📊 Response Format

### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "uuid-string",
      "dex_name": "jupiter",
      "token_pair": "SOL/USDC",
      "volume": 1250000.50,
      "price": 98.75,
      "price_change_24h": 2.34,
      "liquidity": 5678900.25,
      "timestamp": 1703123456789,
      "created_at": "2025-11-19T23:15:42Z",
      "additional_data": {
        "swap_count": 156,
        "avg_swap_size": 8014.25,
        "fee_generated": 125.50,
        "impermanent_loss": -0.05,
        "price_impact": 0.02
      }
    }
  ],
  "summary": {
    "total_volume_24h": 25678900.75,
    "total_swaps_24h": 1247,
    "avg_price": 99.12,
    "top_dex": "jupiter",
    "total_liquidity": 45678901.25,
    "record_count": 100
  },
  "metadata": {
    "execution_time": 245,
    "cache_hit": true,
    "data_freshness": "45s",
    "api_version": "v1",
    "timestamp": "2025-11-19T23:15:42Z"
  }
}
```

### Response Field Definitions

#### Data Array

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique identifier untuk record |
| `dex_name` | string | Nama DEX (`jupiter`, `raydium`, `orca`, `serum`) |
| `token_pair` | string | Trading pair (e.g., `SOL/USDC`) |
| `volume` | number | Trading volume dalam USD |
| `price` | number | Current price dalam USD |
| `price_change_24h` | number | Price change percentage dalam 24 jam |
| `liquidity` | number | Total liquidity dalam pool (USD) |
| `timestamp` | number | Unix timestamp (milliseconds) |
| `created_at` | string | ISO timestamp |
| `additional_data` | object | Extended metrics untuk advanced analytics |

#### Additional Data Fields

| Field | Type | Description |
|-------|------|-------------|
| `swap_count` | integer | Number of swaps dalam time period |
| `avg_swap_size` | number | Average swap size (USD) |
| `fee_generated` | number | Total fees generated (USD) |
| `impermanent_loss` | number | Impermanent loss percentage |
| `price_impact` | number | Price impact dari largest trade |

#### Summary Object

| Field | Type | Description |
|-------|------|-------------|
| `total_volume_24h` | number | Total trading volume dalam 24 jam |
| `total_swaps_24h` | integer | Total number of swaps dalam 24 jam |
| `avg_price` | number | Average price across all pairs |
| `top_dex` | string | DEX dengan highest volume |
| `total_liquidity` | number | Total liquidity dalam system |
| `record_count` | integer | Number of records returned |

#### Metadata Object

| Field | Type | Description |
|-------|------|-------------|
| `execution_time` | number | API execution time (milliseconds) |
| `cache_hit` | boolean | Indicates if response served from cache |
| `data_freshness` | string | Age of data (e.g., "45s", "2m") |
| `api_version` | string | API version |
| `timestamp` | string | Response timestamp |

## ❌ Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "The parameter 'limit' must be between 1 and 1000",
    "details": {
      "parameter": "limit",
      "value": 1500,
      "expected_range": "1-1000"
    },
    "timestamp": "2025-11-19T23:15:42Z"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_PARAMETER` | 400 | Invalid request parameter |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `EXTERNAL_API_ERROR` | 502 | External API (CoinGecko/Jupiter) error |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `TIMEOUT` | 504 | Request timeout |
| `INTERNAL_ERROR` | 500 | Internal server error |

## 🚦 Rate Limiting

- **Limit**: 100 requests per minute per IP
- **Burst**: 10 requests per second
- **Headers**:
  ```bash
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1639876543
  ```

## 💻 Examples

### Basic Request

```javascript
const response = await fetch(
  'https://bpbtgkunrdzcoyfdhskh.supabase.co/functions/v1/fetch-market-flow',
  {
    headers: {
      'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
```

### Filter by DEX and Sort by Volume

```javascript
const response = await fetch(
  'https://bpbtgkunrdzcoyfdhskh.supabase.co/functions/v1/fetch-market-flow?dex_filter=jupiter&sort_by=volume&sort_order=desc&limit=20',
  {
    headers: {
      'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY',
      'Content-Type': 'application/json'
    }
  }
);
```

### Filter by Token Pair

```javascript
const response = await fetch(
  'https://bpbtgkunrdzcoyfdhskh.supabase.co/functions/v1/fetch-market-flow?token_pair=SOL/USDC&min_volume=100000',
  {
    headers: {
      'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY',
      'Content-Type': 'application/json'
    }
  }
);
```

### React Hook Integration

```typescript
import { useEffect, useState } from 'react';

interface MarketFlowData {
  dex_name: string;
  token_pair: string;
  volume: number;
  price: number;
  price_change_24h: number;
  liquidity: number;
  timestamp: number;
}

export const useMarketFlow = (params: {
  dex_filter?: string;
  limit?: number;
  sort_by?: string;
}) => {
  const [data, setData] = useState<MarketFlowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryString = new URLSearchParams(params as any).toString();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://bpbtgkunrdzcoyfdhskh.supabase.co/functions/v1/fetch-market-flow?${queryString}`,
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
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [queryString]);

  return { data, loading, error };
};
```

## 📡 Data Sources

### External APIs

1. **Jupiter API**
   - Endpoint: `https://quote-api.jup.ag/v4/`
   - Purpose: DEX aggregator data
   - Rate Limit: 100 requests/minute
   - Update Frequency: Real-time

2. **CoinGecko API**
   - Endpoint: `https://api.coingecko.com/api/v3/`
   - Purpose: Token pricing data
   - Rate Limit: 10 requests/minute (free tier)
   - Update Frequency: Every 30 seconds

3. **Raydium API**
   - Purpose: Raydium-specific pool data
   - Rate Limit: Adaptive based on load
   - Update Frequency: Every 5 seconds

4. **Orca API**
   - Purpose: Orca whirlpool data
   - Rate Limit: Adaptive based on load
   - Update Frequency: Every 5 seconds

### Data Processing

```typescript
const processMarketData = (rawData: any[]) => {
  return rawData.map(item => ({
    dex_name: item.source,
    token_pair: `${item.inputMint}/${item.outputMint}`,
    volume: parseFloat(item.volumeUSD),
    price: parseFloat(item.priceUSD),
    price_change_24h: parseFloat(item.priceChange24h),
    liquidity: parseFloat(item.liquidityUSD),
    timestamp: Date.now(),
    additional_data: {
      swap_count: item.swapCount,
      avg_swap_size: item.averageSwapSize,
      fee_generated: item.feesUSD,
      price_impact: parseFloat(item.priceImpact)
    }
  }));
};
```

## ⚡ Performance

### Caching Strategy

- **Redis Cache**: 60 seconds for price data
- **Database Cache**: 5 minutes for volume data
- **CDN Cache**: Static metadata untuk 1 hour

### Optimization

1. **Database Indexes**:
   ```sql
   CREATE INDEX idx_market_flow_dex_timestamp ON market_flow(dex_name, timestamp DESC);
   CREATE INDEX idx_market_flow_token_pair ON market_flow(token_pair);
   CREATE INDEX idx_market_flow_volume ON market_flow(volume DESC);
   ```

2. **Query Optimization**:
   - Use covering indexes untuk faster queries
   - Limit result sets dengan pagination
   - Implement materialized views untuk aggregations

### Monitoring

- **Response Time**: Target < 500ms untuk cached data
- **Cache Hit Rate**: Target > 90%
- **Error Rate**: Target < 1%
- **Data Freshness**: Target < 60 seconds

---

**API Version**: v1  
**Last Updated**: November 19, 2025  
**Support**: untuk questions atau issues, please contact development team