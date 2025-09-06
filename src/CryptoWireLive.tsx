import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  Zap,
  Target,
  Waves,
  Flame,
  BarChart3,
  Radio,
  Globe,
  DollarSign,
  Clock,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface LiveTransaction {
  id: string;
  chain: string;
  type: 'whale' | 'defi' | 'bridge' | 'normal';
  amount: number;
  amountUSD: number;
  hash: string;
  timestamp: number;
  impact: 'bullish' | 'bearish' | 'neutral';
}

interface MarketPrediction {
  id: string;
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  chains: string[];
  timestamp: number;
}

interface ChainMetrics {
  chain: string;
  icon: string;
  txCount24h: number;
  whaleActivity: number;
  gasPressure?: number;
  bridgeVolume?: number;
  defiTVL?: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  change24h: number;
}

const CryptoWireLive: React.FC = () => {
  const [liveTransactions, setLiveTransactions] = useState<LiveTransaction[]>([]);
  const [marketPredictions, setMarketPredictions] = useState<MarketPrediction[]>([]);
  const [chainMetrics, setChainMetrics] = useState<ChainMetrics[]>([]);
  const [totalVolume24h, setTotalVolume24h] = useState(0);
  const [marketSentiment, setMarketSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');
  const [liveNewsItems, setLiveNewsItems] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();
  const newsRef = useRef<NodeJS.Timeout>();

  const chains = [
    { name: 'bitcoin', icon: '₿', color: '#F7931A' },
    { name: 'ethereum', icon: 'Ξ', color: '#627EEA' },
    { name: 'solana', icon: '◎', color: '#9945FF' },
    { name: 'polygon', icon: '⬢', color: '#8247E5' },
    { name: 'kava', icon: '🌊', color: '#FF564F' }
  ];

  // Initialize chain metrics
  useEffect(() => {
    const initialMetrics: ChainMetrics[] = chains.map(chain => ({
      chain: chain.name,
      icon: chain.icon,
      txCount24h: Math.floor(Math.random() * 2000000) + 500000,
      whaleActivity: Math.floor(Math.random() * 100),
      gasPressure: chain.name === 'ethereum' ? Math.floor(Math.random() * 200) + 20 : undefined,
      bridgeVolume: ['ethereum', 'polygon', 'solana'].includes(chain.name) ? Math.random() * 500 + 100 : undefined,
      defiTVL: ['ethereum', 'solana', 'polygon'].includes(chain.name) ? Math.random() * 50 + 10 : undefined,
      sentiment: ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)] as any,
      change24h: (Math.random() - 0.5) * 20
    }));
    setChainMetrics(initialMetrics);
    setTotalVolume24h(Math.random() * 10000000000 + 5000000000);
  }, []);

  // Generate live blockchain activity
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // Generate new transaction
      if (Math.random() > 0.3) {
        const chain = chains[Math.floor(Math.random() * chains.length)];
        const isWhale = Math.random() > 0.85;
        const isDefi = Math.random() > 0.7;
        const isBridge = Math.random() > 0.8;

        let type: 'whale' | 'defi' | 'bridge' | 'normal' = 'normal';
        let baseAmount = Math.random() * 10 + 0.1;

        if (isWhale) {
          type = 'whale';
          baseAmount = Math.random() * 1000 + 100;
        } else if (isDefi) {
          type = 'defi';
          baseAmount = Math.random() * 50 + 10;
        } else if (isBridge) {
          type = 'bridge';
          baseAmount = Math.random() * 200 + 50;
        }

        const priceMultiplier = {
          bitcoin: 65000,
          ethereum: 2500,
          solana: 140,
          polygon: 0.75,
          kava: 0.85
        }[chain.name] || 1;

        const newTransaction: LiveTransaction = {
          id: Math.random().toString(36).substr(2, 9),
          chain: chain.name,
          type,
          amount: baseAmount,
          amountUSD: baseAmount * priceMultiplier,
          hash: Math.random().toString(36).substr(2, 16),
          timestamp: Date.now(),
          impact: type === 'whale'
            ? (Math.random() > 0.5 ? 'bearish' : 'bullish')
            : (Math.random() > 0.6 ? 'bullish' : 'neutral')
        };

        setLiveTransactions(prev => [newTransaction, ...prev.slice(0, 19)]);
      }

      // Generate market prediction
      if (Math.random() > 0.9) {
        const predictionTemplates = [
          {
            title: "Massive Whale Movement Detected",
            description: "Large BTC holders moving funds - potential market shift incoming",
            confidence: 75 + Math.random() * 20,
            impact: 'high' as const,
            timeframe: "2-4 hours",
            chains: ['bitcoin']
          },
          {
            title: "Cross-Chain Bridge Surge",
            description: "Unusual bridging activity between ETH and Polygon - DeFi rotation signal",
            confidence: 60 + Math.random() * 25,
            impact: 'medium' as const,
            timeframe: "1-2 hours",
            chains: ['ethereum', 'polygon']
          },
          {
            title: "Gas Price Spike Alert",
            description: "Ethereum gas prices surging - major protocol activity expected",
            confidence: 80 + Math.random() * 15,
            impact: 'high' as const,
            timeframe: "30-60 minutes",
            chains: ['ethereum']
          },
          {
            title: "Solana Volume Anomaly",
            description: "Unusual SOL transaction patterns - potential news catalyst brewing",
            confidence: 55 + Math.random() * 30,
            impact: 'medium' as const,
            timeframe: "1-3 hours",
            chains: ['solana']
          }
        ];

        const template = predictionTemplates[Math.floor(Math.random() * predictionTemplates.length)];
        const newPrediction: MarketPrediction = {
          id: Math.random().toString(36).substr(2, 9),
          ...template,
          timestamp: Date.now()
        };

        setMarketPredictions(prev => [newPrediction, ...prev.slice(0, 4)]);
      }

      // Update chain metrics
      setChainMetrics(prev => prev.map(metric => ({
        ...metric,
        txCount24h: metric.txCount24h + Math.floor(Math.random() * 1000),
        whaleActivity: Math.max(0, Math.min(100, metric.whaleActivity + (Math.random() - 0.5) * 10)),
        gasPressure: metric.gasPressure ? Math.max(10, metric.gasPressure + (Math.random() - 0.5) * 20) : undefined,
        change24h: metric.change24h + (Math.random() - 0.5) * 2
      })));

      // Update overall sentiment
      setMarketSentiment(prev => {
        const sentiments = ['bullish', 'bearish', 'neutral'] as const;
        return Math.random() > 0.85 ? sentiments[Math.floor(Math.random() * 3)] : prev;
      });

    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Generate live news feed
  useEffect(() => {
    const newsTemplates = [
      "🔴 BREAKING: Bitcoin whale moves 1,200 BTC to unknown wallet",
      "⚡ ETHEREUM: Gas prices spike to 150 gwei - major protocol activity detected",
      "🌊 CROSS-CHAIN: $50M in USDC bridged from Ethereum to Polygon in last hour",
      "📈 PREDICTION: Based on whale patterns, expect 3-5% BTC movement in next 2 hours",
      "🔥 SOLANA: Unusual validator activity - network upgrade rumors circulating",
      "💰 DEFI: $100M+ in liquidity moved across protocols - yield farming rotation",
      "🐋 WHALE ALERT: Top 10 Bitcoin holder activates dormant wallet after 2 years",
      "⚡ FLASH: Ethereum L2 bridge volumes surge 400% - scaling adoption accelerating",
      "🌍 MULTI-CHAIN: Cross-chain DEX volumes reach ATH - interoperability trending"
    ];

    newsRef.current = setInterval(() => {
      if (Math.random() > 0.4) {
        const newsItem = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
        setLiveNewsItems(prev => [newsItem, ...prev.slice(0, 9)]);
      }
    }, 3000);

    return () => {
      if (newsRef.current) {
        clearInterval(newsRef.current);
      }
    };
  }, []);

  const getChainIcon = (chainName: string) => {
    return chains.find(c => c.name === chainName)?.icon || '🔗';
  };

  const getChainColor = (chainName: string) => {
    return chains.find(c => c.name === chainName)?.color || '#666';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) return `$${(volume / 1000000000).toFixed(1)}B`;
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`;
    return `$${volume.toFixed(0)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-5xl font-bold text-white mb-2"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4 }}
          >
            Crypto<span className="text-green-400">Wire</span> <span className="text-red-500">LIVE</span>
          </motion.h1>
          <p className="text-gray-300">Real-time multi-chain market intelligence powered by live blockchain data</p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 font-medium">LIVE STREAMING</span>
          </div>
        </div>

        {/* Live Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Global Volume 24h</span>
            </div>
            <motion.div
              key={totalVolume24h}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-white"
            >
              {formatVolume(totalVolume24h)}
            </motion.div>
          </motion.div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 text-sm">Live Transactions</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{liveTransactions.length}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300 text-sm">Active Predictions</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">{marketPredictions.length}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <div className="flex items-center space-x-2 mb-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-gray-300 text-sm">Market Sentiment</span>
            </div>
            <div className={`text-2xl font-bold capitalize ${getImpactColor(marketSentiment)}`}>
              {marketSentiment}
            </div>
          </div>
        </div>

        {/* Live News Stream */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-2 mb-4">
            <Radio className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-white">🔴 LIVE News Stream</h2>
            <div className="ml-auto flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-sm">STREAMING</span>
            </div>
          </div>

          <div className="h-40 overflow-y-auto space-y-2">
            <AnimatePresence>
              {liveNewsItems.map((news, index) => (
                <motion.div
                  key={`${news}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-white text-sm">{news}</span>
                  <span className="text-gray-400 text-xs ml-auto">
                    {new Date().toLocaleTimeString()}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Live Transactions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-2 mb-4">
              <Waves className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">🌊 Live Cross-Chain Activity</h3>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              <AnimatePresence>
                {liveTransactions.map((tx) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      tx.type === 'whale'
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30'
                        : tx.type === 'defi'
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30'
                        : tx.type === 'bridge'
                        ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">{getChainIcon(tx.chain)}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium capitalize">{tx.type}</span>
                          {tx.type === 'whale' && <span className="text-yellow-400">🐋</span>}
                          {tx.type === 'defi' && <span className="text-purple-400">⚡</span>}
                          {tx.type === 'bridge' && <span className="text-green-400">🌉</span>}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {tx.hash.slice(0, 8)}...{tx.hash.slice(-8)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-white font-bold">
                        {formatVolume(tx.amountUSD)}
                      </div>
                      <div className={`text-xs flex items-center ${getImpactColor(tx.impact)}`}>
                        {tx.impact === 'bullish' && <ChevronUp className="w-3 h-3" />}
                        {tx.impact === 'bearish' && <ChevronDown className="w-3 h-3" />}
                        {tx.impact}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Market Predictions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-bold text-white">🧠 AI Market Predictions</h3>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {marketPredictions.map((prediction) => (
                  <motion.div
                    key={prediction.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-4 rounded-lg border ${
                      prediction.impact === 'high'
                        ? 'bg-red-500/20 border-red-400/30'
                        : prediction.impact === 'medium'
                        ? 'bg-yellow-500/20 border-yellow-400/30'
                        : 'bg-blue-500/20 border-blue-400/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium">{prediction.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        prediction.impact === 'high' ? 'bg-red-600 text-white' :
                        prediction.impact === 'medium' ? 'bg-yellow-600 text-white' :
                        'bg-blue-600 text-white'
                      }`}>
                        {prediction.impact.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">{prediction.description}</p>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">Chains:</span>
                        {prediction.chains.map(chain => (
                          <span key={chain} className="text-white">
                            {getChainIcon(chain)}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-green-400">{prediction.confidence.toFixed(0)}% confidence</span>
                        <span className="text-gray-400">{prediction.timeframe}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Chain Metrics Dashboard */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">⛓️ Live Chain Metrics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {chainMetrics.map((metric) => (
              <motion.div
                key={metric.chain}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{metric.icon}</span>
                    <span className="text-white font-medium capitalize">{metric.chain}</span>
                  </div>
                  <div className={`text-sm ${getImpactColor(metric.sentiment)}`}>
                    {metric.sentiment}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h TXs</span>
                    <span className="text-white">{(metric.txCount24h / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Whale Activity</span>
                    <span className="text-white">{metric.whaleActivity.toFixed(0)}%</span>
                  </div>
                  {metric.gasPressure && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gas</span>
                      <span className="text-white">{metric.gasPressure.toFixed(0)} gwei</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Change</span>
                    <span className={getImpactColor(metric.change24h >= 0 ? 'bullish' : 'bearish')}>
                      {metric.change24h >= 0 ? '+' : ''}{metric.change24h.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm">
            🚀 Powered by live blockchain data streams • Built with Lakesail real-time engineering
          </p>
        </div>
      </div>
    </div>
  );
};

export default CryptoWireLive;
