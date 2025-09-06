# REST API Reference

## Base URL
```
https://api.cryptowire.live/v1
```

## Authentication
All API requests require authentication using an API key in the header:
```
Authorization: Bearer YOUR_API_KEY
```

## Rate Limiting
- **Free Tier**: 100 requests per minute
- **Pro Tier**: 1,000 requests per minute
- **Enterprise**: 10,000 requests per minute

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

## Endpoints

### Chain Metrics

#### GET /chains
Get metrics for all supported blockchain networks.

**Response:**
```json
{
  "data": [
    {
      "chain": "ethereum",
      "icon": "Ξ",
      "txCount24h": 1234567,
      "whaleActivity": 85,
      "gasPressure": 45,
      "bridgeVolume": 234.5,
      "defiTVL": 45.2,
      "sentiment": "bullish",
      "change24h": 12.5
    }
  ],
  "timestamp": 1640995200000
}
```

#### GET /chains/{chainId}
Get detailed metrics for a specific chain.

**Parameters:**
- `chainId` (string): Chain identifier (ethereum, bitcoin, solana, polygon, kava)

### Live Transactions

#### GET /transactions/live
Get real-time transaction feed across all chains.

**Query Parameters:**
- `chains` (array): Filter by specific chains
- `type` (string): Filter by transaction type (whale, defi, bridge, normal)
- `minAmount` (number): Minimum transaction amount in USD
- `limit` (number): Number of transactions to return (default: 50, max: 200)

**Response:**
```json
{
  "data": [
    {
      "id": "tx_123456",
      "chain": "ethereum",
      "type": "whale",
      "amount": 1000.5,
      "amountUSD": 1650825.75,
      "hash": "0x1234567890abcdef...",
      "timestamp": 1640995200000,
      "impact": "bullish"
    }
  ],
  "hasMore": true,
  "nextCursor": "cursor_abc123"
}
```

### Market Predictions

#### GET /predictions
Get AI-powered market predictions.

**Query Parameters:**
- `chains` (array): Filter by specific chains
- `timeframe` (string): Prediction timeframe (1h, 4h, 24h, 7d)
- `minConfidence` (number): Minimum confidence score (0-100)

**Response:**
```json
{
  "data": [
    {
      "id": "pred_123",
      "title": "Ethereum Price Surge Expected",
      "description": "Large whale accumulation detected...",
      "confidence": 87,
      "impact": "high",
      "timeframe": "24h",
      "chains": ["ethereum"],
      "timestamp": 1640995200000
    }
  ]
}
```

### Portfolio Analysis

#### POST /portfolio/analyze
Analyze a cryptocurrency portfolio.

**Request Body:**
```json
{
  "holdings": [
    {
      "symbol": "ETH",
      "amount": 10.5,
      "chain": "ethereum"
    },
    {
      "symbol": "BTC",
      "amount": 0.5,
      "chain": "bitcoin"
    }
  ]
}
```

**Response:**
```json
{
  "analysis": {
    "totalValue": 52450.75,
    "riskScore": 65,
    "diversificationScore": 78,
    "recommendations": [
      {
        "type": "rebalance",
        "priority": "high",
        "description": "Consider reducing ETH exposure"
      }
    ]
  }
}
```

### DeFi Protocols

#### GET /defi/protocols
Get DeFi protocol metrics and TVL data.

**Response:**
```json
{
  "data": [
    {
      "protocol": "uniswap",
      "chain": "ethereum",
      "tvl": 5234567890,
      "volume24h": 123456789,
      "fees24h": 234567,
      "change24h": 5.7
    }
  ]
}
```

## Error Handling

All errors follow the JSON API specification:

```json
{
  "error": {
    "code": "INVALID_CHAIN",
    "message": "The specified chain is not supported",
    "details": {
      "supportedChains": ["bitcoin", "ethereum", "solana", "polygon", "kava"]
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_API_KEY` | 401 | API key is missing or invalid |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit exceeded |
| `INVALID_CHAIN` | 400 | Unsupported blockchain network |
| `INVALID_PARAMS` | 400 | Invalid query parameters |
| `INTERNAL_ERROR` | 500 | Internal server error |

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @cryptowire/sdk
```

```typescript
import { CryptoWireClient } from '@cryptowire/sdk';

const client = new CryptoWireClient({
  apiKey: 'your-api-key'
});

const metrics = await client.chains.getMetrics();
```

### Python
```bash
pip install cryptowire-python
```

```python
from cryptowire import CryptoWireClient

client = CryptoWireClient(api_key='your-api-key')
metrics = client.chains.get_metrics()
```

## Webhooks

Register webhook endpoints to receive real-time notifications:

### POST /webhooks
Register a new webhook endpoint.

**Request Body:**
```json
{
  "url": "https://yourapp.com/webhooks/cryptowire",
  "events": ["whale_transaction", "price_alert", "defi_event"],
  "chains": ["ethereum", "bitcoin"]
}
```

### Webhook Events

#### whale_transaction
Triggered when a large transaction is detected.

```json
{
  "event": "whale_transaction",
  "data": {
    "chain": "ethereum",
    "amount": 1000000,
    "hash": "0x...",
    "timestamp": 1640995200000
  }
}
```

#### price_alert
Triggered when significant price movements occur.

```json
{
  "event": "price_alert",
  "data": {
    "symbol": "ETH",
    "price": 3500.75,
    "change": 15.2,
    "timeframe": "1h"
  }
}
```
