import type { Portfolio } from './types';

export const DEMO_PORTFOLIOS: Record<string, Portfolio> = {
  "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh": {
    chain: "bitcoin",
    balance: { btc: 45.67 },
    hodlRatio: 0.8,
    valueUSD: 0, // Will be calculated with real prices
    wealthChange: { "1M": -5, "3M": 10, "1Y": 30 },
    assets: [
      {
        symbol: "BTC",
        amount: 45.67,
        valueUSD: 0,
        type: "token"
      }
    ]
  },
  "0x742C3cF9Af45f91B109a81EfEaf11535ECDe9571": {
    chain: "ethereum",
    balance: { eth: 10, usdc: 5000, uni: 200, link: 50, aave: 100 },
    hodlRatio: 0.4,
    valueUSD: 0,
    wealthChange: { "1M": -8, "3M": 15, "1Y": 25 },
    assets: [
      { symbol: "ETH", amount: 10, valueUSD: 0, type: "token" },
      { symbol: "USDC", amount: 5000, valueUSD: 5000, type: "token" },
      { symbol: "UNI", amount: 200, valueUSD: 0, type: "token" },
      { symbol: "LINK", amount: 50, valueUSD: 0, type: "token" },
      { symbol: "AAVE", amount: 100, valueUSD: 0, type: "token" }
    ],
    defi: [
      {
        protocol: "Uniswap V3",
        type: "liquidity",
        assets: ["ETH", "USDC"],
        valueUSD: 8500,
        apy: 12.5
      },
      {
        protocol: "Aave",
        type: "lending",
        assets: ["AAVE"],
        valueUSD: 2000,
        apy: 5.8
      }
    ]
  },
  "kava1abc123def456ghi789jkl012mno345pqr678stu": {
    chain: "kava",
    balance: { kava: 10000 },
    hodlRatio: 0.9,
    valueUSD: 0,
    wealthChange: { "1M": 2, "3M": 5, "1Y": 12 },
    assets: [
      { symbol: "KAVA", amount: 10000, valueUSD: 0, type: "staked" }
    ],
    staking: {
      validators: 3,
      totalStaked: 10000,
      rewards: 450
    }
  },
  "7xLCB2kGGTp8xVqzkqkzVGP9D3NFkzPN4H6YxUQzVyBJ": {
    chain: "solana",
    balance: { sol: 2, usdc: 1000 },
    hodlRatio: 0.3,
    valueUSD: 0,
    wealthChange: { "1M": -10, "3M": 20, "1Y": 40 },
    assets: [
      { symbol: "SOL", amount: 2, valueUSD: 0, type: "token" },
      { symbol: "USDC", amount: 1000, valueUSD: 1000, type: "staked" },
      { symbol: "NFT", amount: 3, valueUSD: 2500, type: "nft" }
    ]
  },
  "0x1234567890abcdef1234567890abcdef12345678": {
    chain: "polygon",
    balance: { matic: 5000, usdc: 2000 },
    hodlRatio: 0.6,
    valueUSD: 0,
    wealthChange: { "1M": 3, "3M": 8, "1Y": 15 },
    assets: [
      { symbol: "MATIC", amount: 5000, valueUSD: 0, type: "token" },
      { symbol: "USDC", amount: 2000, valueUSD: 2000, type: "token" }
    ],
    defi: [
      {
        protocol: "QuickSwap",
        type: "liquidity",
        assets: ["MATIC", "USDC"],
        valueUSD: 3500,
        apy: 18.2
      }
    ]
  }
};

export const CHAIN_TOKENS = {
  bitcoin: ["bitcoin"],
  ethereum: ["ethereum", "usd-coin", "uniswap", "chainlink", "aave"],
  kava: ["kava"],
  solana: ["solana", "usd-coin"],
  polygon: ["matic-network", "usd-coin"]
};
