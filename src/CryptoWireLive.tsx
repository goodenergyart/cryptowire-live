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
  ChevronDown,
  MessageCircle,
  Bot,
  Network,
  Layers,
  Shield
} from 'lucide-react';

// Import new services and components
import { lakesailClient, type WhaleTransaction, type NetworkMetrics, type AnomalyAlert, type MarketCorrelation } from './services/lakesailClient';
import { AIChatSystem } from './components/AIChatSystem';

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

// Enhanced animation variants with longer durations and blur effects
const fadeInVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(10px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(5px)',
    transition: {
      duration: 0.8
    }
  }
};

const slideInVariants = {
  hidden: {
    x: -100,
    opacity: 0,
    filter: 'blur(8px)'
  },
  visible: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  },
  exit: {
    x: 100,
    opacity: 0,
    filter: 'blur(5px)',
    transition: {
      duration: 0.6
    }
  }
};

const CryptoWireLive: React.FC = () => {
  const [liveTransactions, setLiveTransactions] = useState<LiveTransaction[]>([]);
  const [marketPredictions, setMarketPredictions] = useState<MarketPrediction[]>([]);
  const [chainMetrics, setChainMetrics] = useState<ChainMetrics[]>([]);
  const [whaleTransactions, setWhaleTransactions] = useState<WhaleTransaction[]>([]);
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics[]>([]);
  const [anomalyAlerts, setAnomalyAlerts] = useState<AnomalyAlert[]>([]);
  const [crossChainCorrelations, setCrossChainCorrelations] = useState<MarketCorrelation[]>([]);
  const [totalVolume24h, setTotalVolume24h] = useState(0);
  const [marketSentiment, setMarketSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');
  const [liveNewsItems, setLiveNewsItems] = useState<string[]>([]);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiChatMinimized, setAiChatMinimized] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout>();
  const newsRef = useRef<NodeJS.Timeout>();
  const lakesailRef = useRef<NodeJS.Timeout>();

  // Enhanced chains with additional networks
  const chains = [
    { name: 'bitcoin', icon: '₿', color: '#F7931A' },
    { name: 'ethereum', icon: 'Ξ', color: '#627EEA' },
    { name: 'solana', icon: '◎', color: '#9945FF' },
    { name: 'polygon', icon: '⬢', color: '#8247E5' },
    { name: 'kava', icon: '🌊', color: '#FF564F' },
    { name: 'arbitrum', icon: '🔵', color: '#28A0F0' },
    { name: 'optimism', icon: '🔴', color: '#FF0420' },
    { name: 'avalanche', icon: '🔺', color: '#E84142' }
  ];

  // Initialize Lakesail integration
  useEffect(() => {
    const initializeLakesail = async () => {
      try {
        // Subscribe to whale transactions
        lakesailClient.subscribe('whale_transactions', (data: WhaleTransaction[]) => {
          setWhaleTransactions(prev => [...data, ...prev.slice(0, 9)]);
        });

        // Subscribe to anomaly alerts
        lakesailClient.subscribe('anomaly_alerts', (data: AnomalyAlert[]) => {
          setAnomalyAlerts(prev => [...data, ...prev.slice(0, 4)]);
        });

        // Subscribe to market correlations
        lakesailClient.subscribe('cross_chain_correlations', (data: MarketCorrelation[]) => {
          setCrossChainCorrelations(data);
        });

        // Periodic data updates
        lakesailRef.current = setInterval(async () => {
          try {
            // Get whale movements
            const whales = await lakesailClient.detectWhaleMovements('bitcoin');
            if (whales.length > 0) {
              setWhaleTransactions(prev => [...whales, ...prev.slice(0, 9)]);
            }

            // Get network metrics for all chains
            const metrics = await Promise.all(
              chains.slice(0, 5).map(chain => lakesailClient.getNetworkMetrics(chain.name))
            );
            setNetworkMetrics(metrics);

            // Get anomalies
            const anomalies = await lakesailClient.detectAnomalies();
            if (anomalies.length > 0) {
              setAnomalyAlerts(prev => [...anomalies, ...prev.slice(0, 4)]);
            }

            // Get correlations
            const correlations = await lakesailClient.analyzeCrossChainCorrelations();
            setCrossChainCorrelations(correlations);

          } catch (error) {
            console.error('Lakesail data update error:', error);
          }
        }, 12000); // Update every 12 seconds

      } catch (error) {
        console.error('Failed to initialize Lakesail:', error);
      }
    };

    initializeLakesail();

    return () => {
      if (lakesailRef.current) {
        clearInterval(lakesailRef.current);
      }
    };
  }, []);

  // Initialize chain metrics
  useEffect(() => {
    const initialMetrics: ChainMetrics[] = chains.map(chain => ({
      chain: chain.name,
      icon: chain.icon,
      txCount24h: Math.floor(Math.random() * 2000000) + 500000,
      whaleActivity: Math.floor(Math.random() * 100),
      gasPressure: chain.name === 'ethereum' ? Math.floor(Math.random() * 200) + 20 : undefined,
      bridgeVolume: ['ethereum', 'polygon', 'solana', 'arbitrum', 'optimism'].includes(chain.name) ? Math.random() * 500 + 100 : undefined,
      defiTVL: ['ethereum', 'solana', 'polygon', 'arbitrum', 'avalanche'].includes(chain.name) ? Math.random() * 50 + 10 : undefined,
      sentiment: ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)] as any,
      change24h: (Math.random() - 0.5) * 20
    }));
    setChainMetrics(initialMetrics);
    setTotalVolume24h(Math.random() * 10000000000 + 5000000000);
  }, []);

  // Enhanced live blockchain activity with longer durations
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // Generate new transaction with enhanced timing (8-15 seconds)
      if (Math.random() > 0.2) { // Increased frequency
        const chain = chains[Math.floor(Math.random() * chains.length)];
        const isWhale = Math.random() > 0.88;
        const isDefi = Math.random() > 0.75;
        const isBridge = Math.random() > 0.82;

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

        const priceMultipliers = {
          bitcoin: 65000,
          ethereum: 2500,
          solana: 140,
          polygon: 0.75,
          kava: 0.85,
          arbitrum: 2500,
          optimism: 2500,
          avalanche: 25
        };

        const priceMultiplier = priceMultipliers[chain.name as keyof typeof priceMultipliers] || 1;

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

        setLiveTransactions(prev => [newTransaction, ...prev.slice(0, 24)]); // Increased history
      }

      // Generate enhanced market predictions
      if (Math.random() > 0.92) {
        const predictionTemplates = [
          {
            title: "🐋 Massive Whale Movement Detected",
            description: "Large BTC holders moving funds - potential market shift incoming",
            confidence: 75 + Math.random() * 20,
            impact: 'high' as const,
            timeframe: "2-4 hours",
            chains: ['bitcoin']
          },
          {
            title: "🌉 Cross-Chain Bridge Surge",
            description: "Unusual bridging activity between ETH and L2s - capital rotation signal",
            confidence: 60 + Math.random() * 25,
            impact: 'medium' as const,
            timeframe: "1-2 hours",
            chains: ['ethereum', 'arbitrum', 'optimism']
          },
          {
            title: "⛽ Multi-Chain Gas Spike Alert",
            description: "Gas prices surging across networks - major protocol activity expected",
            confidence: 80 + Math.random() * 15,
            impact: 'high' as const,
            timeframe: "30-60 minutes",
            chains: ['ethereum', 'polygon']
          },
          {
            title: "🌊 Solana Volume Anomaly",
            description: "Unusual SOL transaction patterns - potential news catalyst brewing",
            confidence: 55 + Math.random() * 30,
            impact: 'medium' as const,
            timeframe: "1-3 hours",
            chains: ['solana']
          },
          {
            title: "🔄 DeFi Capital Migration",
            description: "Massive liquidity shifts between protocols - yield farming rotation",
            confidence: 70 + Math.random() * 25,
            impact: 'medium' as const,
            timeframe: "2-6 hours",
            chains: ['ethereum', 'arbitrum', 'polygon']
          },
          {
            title: "⚡ L2 Adoption Surge",
            description: "Layer 2 networks seeing unprecedented adoption - scaling narrative strengthening",
            confidence: 65 + Math.random() * 30,
            impact: 'high' as const,
            timeframe: "1-2 days",
            chains: ['arbitrum', 'optimism', 'polygon']
          }
        ];

        const template = predictionTemplates[Math.floor(Math.random() * predictionTemplates.length)];
        const newPrediction: MarketPrediction = {
          id: Math.random().toString(36).substr(2, 9),
          ...template,
          timestamp: Date.now()
        };

        setMarketPredictions(prev => [newPrediction, ...prev.slice(0, 5)]);
      }

      // Update chain metrics with Lakesail data
      setChainMetrics(prev => prev.map(metric => {
        const networkMetric = networkMetrics.find(nm => nm.chain === metric.chain);
        return {
          ...metric,
          txCount24h: networkMetric?.txCount24h || metric.txCount24h + Math.floor(Math.random() * 1000),
          whaleActivity: networkMetric?.whaleActivityScore || Math.max(0, Math.min(100, metric.whaleActivity + (Math.random() - 0.5) * 10)),
          gasPressure: networkMetric?.gasPriceGwei || (metric.gasPressure ? Math.max(10, metric.gasPressure + (Math.random() - 0.5) * 20) : undefined),
          change24h: metric.change24h + (Math.random() - 0.5) * 2
        };
      }));

      // Update overall sentiment
      setMarketSentiment(prev => {
        const sentiments = ['bullish', 'bearish', 'neutral'] as const;
        return Math.random() > 0.85 ? sentiments[Math.floor(Math.random() * 3)] : prev;
      });
    }, 8000); // Increased to 8 seconds base interval

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [networkMetrics]);

  // Enhanced live news feed with longer display times
  useEffect(() => {
    const newsTemplates = [
      "🔴 BREAKING: Bitcoin whale moves 1,200 BTC to unknown wallet",
      "⚡ ETHEREUM: Gas prices spike to 150 gwei - major protocol activity detected",
      "🌊 CROSS-CHAIN: $50M in USDC bridged from Ethereum to Arbitrum in last hour",
      "📈 PREDICTION: Based on whale patterns, expect 3-5% BTC movement in next 2 hours",
      "🔥 SOLANA: Unusual validator activity - network upgrade rumors circulating",
      "💰 DEFI: $100M+ in liquidity moved across protocols - yield farming rotation",
      "🐋 WHALE ALERT: Top 10 Bitcoin holder activates dormant wallet after 2 years",
      "⚡ FLASH: Ethereum L2 bridge volumes surge 400% - scaling adoption accelerating",
      "🌍 MULTI-CHAIN: Cross-chain DEX volumes reach ATH - interoperability trending",
      "🚨 ANOMALY: Unusual transaction pattern detected on Polygon - investigating",
      "🎯 AI PREDICTION: High confidence bullish signal detected for next 4 hours",
      "🔄 ARBITRAGE: Major price discrepancy between centralized and DEX markets",
      "⛽ GAS OPTIMIZATION: Best transaction window opening in 15 minutes",
      "🌉 BRIDGE UPDATE: New cross-chain route discovered with 40% lower fees"
    ];

    newsRef.current = setInterval(() => {
      if (Math.random() > 0.3) { // Increased frequency
        const newsItem = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
        setLiveNewsItems(prev => [newsItem, ...prev.slice(0, 11)]); // Show more history
      }
    }, 10000); // Increased to 10 seconds for longer display

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-400/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 relative">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header with AI Integration */}
        <motion.div
          className="text-center mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          <motion.h1
            className="text-6xl font-bold text-white mb-2"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 6 }}
          >
            Crypto<span className="text-green-400">Wire</span> <span className="text-red-500">LIVE</span>
          </motion.h1>
          <p className="text-gray-300 text-lg">Real-time multi-chain blockchain intelligence powered by Lakesail data streams and AI analysis</p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-medium">LIVE STREAMING</span>
            </div>
            <div className="flex items-center space-x-2">
              <Network className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">{chains.length} NETWORKS</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-medium">AI POWERED</span>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Live Market Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6"
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:border-white/30 transition-all duration-500">
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Global Volume 24h</span>
            </div>
            <motion.div
              key={totalVolume24h}
              initial={{ scale: 1.1, filter: 'blur(5px)' }}
              animate={{ scale: 1, filter: 'blur(0px)' }}
              className="text-2xl font-bold text-white"
            >
              {formatVolume(totalVolume24h)}
            </motion.div>
          </motion.div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:border-white/30 transition-all duration-500">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 text-sm">Live Transactions</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{liveTransactions.length}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:border-white/30 transition-all duration-500">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-orange-400" />
              <span className="text-gray-300 text-sm">Anomaly Alerts</span>
            </div>
            <div className="text-2xl font-bold text-orange-400">{anomalyAlerts.length}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:border-white/30 transition-all duration-500">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300 text-sm">AI Predictions</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">{marketPredictions.length}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:border-white/30 transition-all duration-500">
            <div className="flex items-center space-x-2 mb-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-gray-300 text-sm">Market Sentiment</span>
            </div>
            <div className={`text-2xl font-bold capitalize ${getImpactColor(marketSentiment)}`}>
              {marketSentiment}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Live News Stream with longer animations */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold text-white">🔴 LIVE Intelligence Stream</h2>
              <div className="ml-2 flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 text-sm">STREAMING</span>
              </div>
            </div>

            <button
              onClick={() => setAiChatOpen(true)}
              className="flex items-center space-x-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30 rounded-lg px-4 py-2 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-medium">Ask AI</span>
            </button>
          </div>

          <div className="h-48 overflow-y-auto space-y-2">
            <AnimatePresence mode="popLayout">
              {liveNewsItems.map((news, index) => (
                <motion.div
                  key={`${news}-${index}`}
                  variants={slideInVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-500"
                >
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-white text-sm flex-1">{news}</span>
                  <span className="text-gray-400 text-xs">
                    {new Date().toLocaleTimeString()}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Enhanced Multi-Network Metrics */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6"
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">🌐 Multi-Chain Network Status</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {chainMetrics.slice(0, 8).map((metric) => (
              <motion.div
                key={metric.chain}
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all duration-500"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{metric.icon}</span>
                    <span className="text-white font-medium capitalize">{metric.chain}</span>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    metric.sentiment === 'bullish' ? 'bg-green-500/20 text-green-400' :
                    metric.sentiment === 'bearish' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {metric.sentiment}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Txs:</span>
                    <span className="text-white font-mono">{(metric.txCount24h / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Whale Activity:</span>
                    <span className="text-white font-mono">{metric.whaleActivity.toFixed(0)}%</span>
                  </div>
                  {metric.gasPressure && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gas:</span>
                      <span className="text-white font-mono">{metric.gasPressure.toFixed(0)} gwei</span>
                    </div>
                  )}
                  {metric.defiTVL && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">DeFi TVL:</span>
                      <span className="text-white font-mono">${metric.defiTVL.toFixed(1)}B</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Live Transactions with Lakesail Data */}
          <motion.div
            className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Waves className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">🌊 Live Cross-Chain Activity</h3>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Lakesail Powered</span>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {liveTransactions.map((tx) => (
                  <motion.div
                    key={tx.id}
                    variants={slideInVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-700 hover:scale-[1.02] ${
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
          </motion.div>

          {/* Enhanced AI Market Predictions */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-bold text-white">🧠 AI Predictions</h3>
            </div>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {marketPredictions.map((prediction) => (
                  <motion.div
                    key={prediction.id}
                    variants={fadeInVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className={`p-4 rounded-lg border transition-all duration-700 hover:scale-[1.02] ${
                      prediction.impact === 'high'
                        ? 'bg-red-500/20 border-red-400/30'
                        : prediction.impact === 'medium'
                        ? 'bg-yellow-500/20 border-yellow-400/30'
                        : 'bg-blue-500/20 border-blue-400/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">{prediction.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        prediction.impact === 'high' ? 'bg-red-600 text-white' :
                        prediction.impact === 'medium' ? 'bg-yellow-600 text-white' :
                        'bg-blue-600 text-white'
                      }`}>
                        {prediction.impact}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs mb-3">{prediction.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{prediction.timeframe}</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-12 bg-gray-700 rounded-full h-1">
                          <div
                            className="h-1 bg-green-400 rounded-full transition-all duration-1000"
                            style={{ width: `${prediction.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-green-400">{prediction.confidence.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {prediction.chains.map(chain => (
                        <span key={chain} className="text-xs bg-white/10 px-1 py-0.5 rounded">
                          {getChainIcon(chain)}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* New Anomaly Alerts Section */}
        {anomalyAlerts.length > 0 && (
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-bold text-white">🚨 Real-Time Anomaly Detection</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {anomalyAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    variants={slideInVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getChainIcon(alert.chain)}</span>
                        <span className="font-medium uppercase text-xs">{alert.severity}</span>
                      </div>
                      <span className="text-xs opacity-70">{alert.timeWindow}</span>
                    </div>
                    <p className="text-sm mb-2">{alert.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span>Confidence: {(alert.confidence * 100).toFixed(0)}%</span>
                      <span className={getImpactColor(alert.predictedImpact)}>
                        {alert.predictedImpact.toUpperCase()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      {/* AI Chat System */}
      <AIChatSystem
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        onMinimize={() => setAiChatMinimized(true)}
        isMinimized={aiChatMinimized}
      />
    </div>
  );
};

export default CryptoWireLive;
