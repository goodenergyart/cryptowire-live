# WebSocket Events Documentation

## Connection

### Endpoint
```
wss://api.cryptowire.live/v1/stream
```

### Authentication
Include your API key in the connection query parameters:
```
wss://api.cryptowire.live/v1/stream?api_key=YOUR_API_KEY
```

### Connection Example

```javascript
const ws = new WebSocket('wss://api.cryptowire.live/v1/stream?api_key=YOUR_API_KEY');

ws.onopen = () => {
  console.log('Connected to CryptoWire LIVE stream');

  // Subscribe to channels
  ws.send(JSON.stringify({
    action: 'subscribe',
    channels: ['transactions:ethereum', 'prices:all', 'whale:alerts']
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

## Subscription Management

### Subscribe to Channels
```json
{
  "action": "subscribe",
  "channels": [
    "transactions:ethereum",
    "transactions:bitcoin",
    "prices:all",
    "whale:alerts",
    "defi:events"
  ]
}
```

### Unsubscribe from Channels
```json
{
  "action": "unsubscribe",
  "channels": ["transactions:ethereum"]
}
```

### List Active Subscriptions
```json
{
  "action": "list_subscriptions"
}
```

## Available Channels

### Transaction Streams

#### `transactions:{chain}`
Real-time transaction feed for specific chains.

**Subscribe:**
```json
{
  "action": "subscribe",
  "channels": ["transactions:ethereum"],
  "filters": {
    "minAmount": 10000,
    "types": ["whale", "defi"]
  }
}
```

**Event Structure:**
```json
{
  "channel": "transactions:ethereum",
  "type": "transaction",
  "data": {
    "id": "tx_123456",
    "chain": "ethereum",
    "type": "whale",
    "amount": 1000.5,
    "amountUSD": 1650825.75,
    "hash": "0x1234567890abcdef...",
    "from": "0xabc123...",
    "to": "0xdef456...",
    "gasPrice": 50,
    "gasUsed": 21000,
    "timestamp": 1640995200000,
    "impact": "bullish",
    "confidence": 0.95
  }
}
```

### Price Streams

#### `prices:all`
Real-time price updates for all supported cryptocurrencies.

**Event Structure:**
```json
{
  "channel": "prices:all",
  "type": "price_update",
  "data": {
    "symbol": "ETH",
    "price": 3421.75,
    "change24h": 5.2,
    "changePercent24h": 0.152,
    "volume24h": 15234567890,
    "marketCap": 411234567890,
    "timestamp": 1640995200000
  }
}
```

#### `prices:{symbol}`
Price updates for a specific cryptocurrency.

**Subscribe:**
```json
{
  "action": "subscribe",
  "channels": ["prices:ETH", "prices:BTC"]
}
```

### Whale Activity

#### `whale:alerts`
Notifications for large transactions and whale activity.

**Event Structure:**
```json
{
  "channel": "whale:alerts",
  "type": "whale_movement",
  "data": {
    "alertId": "whale_123",
    "chain": "ethereum",
    "amount": 50000000,
    "amountUSD": 82500000,
    "walletAddress": "0x123...",
    "type": "accumulation",
    "significance": "high",
    "potentialImpact": "bullish",
    "timestamp": 1640995200000
  }
}
```

### DeFi Events

#### `defi:events`
Smart contract events from major DeFi protocols.

**Event Structure:**
```json
{
  "channel": "defi:events",
  "type": "defi_event",
  "data": {
    "protocol": "uniswap",
    "chain": "ethereum",
    "event": "large_swap",
    "tokenIn": "USDC",
    "tokenOut": "ETH",
    "amountIn": 1000000,
    "amountOut": 292.5,
    "priceImpact": 0.15,
    "txHash": "0xabc123...",
    "timestamp": 1640995200000
  }
}
```

### Market Predictions

#### `predictions:updates`
AI-generated market predictions and analysis updates.

**Event Structure:**
```json
{
  "channel": "predictions:updates",
  "type": "prediction",
  "data": {
    "id": "pred_123",
    "title": "Ethereum Bullish Momentum",
    "description": "Technical indicators suggest upward movement",
    "confidence": 87,
    "impact": "high",
    "timeframe": "24h",
    "chains": ["ethereum"],
    "reasoning": [
      "Large whale accumulation",
      "DeFi TVL increase",
      "Technical breakout pattern"
    ],
    "targetPrice": 3800,
    "timestamp": 1640995200000
  }
}
```

### Network Status

#### `network:status`
Blockchain network health and status updates.

**Event Structure:**
```json
{
  "channel": "network:status",
  "type": "network_update",
  "data": {
    "chain": "ethereum",
    "blockHeight": 16234567,
    "blockTime": 12.5,
    "gasPrice": {
      "slow": 20,
      "standard": 25,
      "fast": 35
    },
    "mempool": {
      "size": 12345,
      "feeRange": [20, 150]
    },
    "timestamp": 1640995200000
  }
}
```

## Error Handling

### Connection Errors
```json
{
  "type": "error",
  "code": "AUTH_FAILED",
  "message": "Invalid API key provided"
}
```

### Subscription Errors
```json
{
  "type": "error",
  "code": "INVALID_CHANNEL",
  "message": "Channel 'invalid:channel' does not exist",
  "availableChannels": [
    "transactions:ethereum",
    "prices:all",
    "whale:alerts"
  ]
}
```

### Rate Limiting
```json
{
  "type": "error",
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many subscription requests",
  "retryAfter": 60
}
```

## Connection Management

### Heartbeat
The server sends periodic heartbeat messages to maintain connection:

```json
{
  "type": "heartbeat",
  "timestamp": 1640995200000
}
```

Clients should respond with:
```json
{
  "type": "pong",
  "timestamp": 1640995200000
}
```

### Reconnection Strategy
Implement exponential backoff for reconnections:

```javascript
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;

function reconnect() {
  if (reconnectAttempts < maxReconnectAttempts) {
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
    setTimeout(connect, delay);
    reconnectAttempts++;
  }
}

function connect() {
  const ws = new WebSocket('wss://api.cryptowire.live/v1/stream?api_key=YOUR_API_KEY');

  ws.onopen = () => {
    reconnectAttempts = 0;
    // Resubscribe to previous channels
  };

  ws.onerror = () => {
    reconnect();
  };
}
```

## Best Practices

1. **Buffer Management**: Implement client-side buffering for high-frequency data
2. **Selective Subscriptions**: Only subscribe to channels you actively need
3. **Error Handling**: Always handle connection errors and implement reconnection logic
4. **Data Validation**: Validate incoming data before processing
5. **Rate Limiting**: Respect subscription rate limits to avoid disconnection

## SDK Examples

### React Hook
```typescript
import { useWebSocket } from '@cryptowire/react';

function TransactionFeed() {
  const { data, isConnected } = useWebSocket({
    channels: ['transactions:ethereum'],
    filters: { minAmount: 10000 }
  });

  return (
    <div>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      {data.map(tx => (
        <div key={tx.id}>{tx.hash}: ${tx.amountUSD}</div>
      ))}
    </div>
  );
}
```

### Node.js Client
```javascript
const { CryptoWireWS } = require('@cryptowire/node');

const client = new CryptoWireWS({
  apiKey: 'your-api-key'
});

client.subscribe(['whale:alerts']);

client.on('whale_movement', (data) => {
  console.log(`Whale alert: $${data.amountUSD} moved on ${data.chain}`);
});
```
