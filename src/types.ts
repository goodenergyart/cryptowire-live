export interface Portfolio {
  chain: string;
  balance: Record<string, number>;
  hodlRatio?: number;
  valueUSD: number;
  wealthChange: {
    "1M": number;
    "3M": number;
    "1Y": number;
  };
  assets?: Asset[];
  staking?: StakingInfo;
  defi?: DefiPosition[];
}

export interface Asset {
  symbol: string;
  amount: number;
  valueUSD: number;
  type: 'token' | 'nft' | 'staked' | 'lp';
}

export interface StakingInfo {
  validators: number;
  totalStaked: number;
  rewards: number;
}

export interface DefiPosition {
  protocol: string;
  type: 'liquidity' | 'lending' | 'staking';
  assets: string[];
  valueUSD: number;
  apy?: number;
}

export interface PriceData {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

export interface HistoricalPrice {
  timestamp: number;
  price: number;
}

export interface AnalysisResult {
  performance: 'Overperforming' | 'Underperforming';
  score: number;
  insights: string[];
  suggestions: string[];
}
