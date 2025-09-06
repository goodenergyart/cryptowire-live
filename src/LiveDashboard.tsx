import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
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
  Radio
} from 'lucide-react';
import type { Portfolio, PriceData } from './types';

interface LiveTransaction {
  id: string;
  type: 'in' | 'out';
  amount: number;
  timestamp: number;
  hash: string;
  isWhale: boolean;
}

interface MarketCorrelation {
  timestamp: number;
  walletChange: number;
  marketChange: number;
}

interface LiveDashboardProps {
  portfolio: Portfolio;
  prices: PriceData;
  address: string;
}

const LiveDashboard: React.FC<LiveDashboardProps> = ({ portfolio, prices, address }) => {
  const [liveTransactions, setLiveTransactions] = useState<LiveTransaction[]>([]);
  const [portfolioValue, setPortfolioValue] = useState(portfolio.valueUSD);
  const [riskScore, setRiskScore] = useState(42);
  const [isLive, setIsLive] = useState(false);
  const [marketData, setMarketData] = useState<MarketCorrelation[]>([]);
  const [whaleCount, setWhaleCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Simulate live data updates
  useEffect(() => {
    setIsLive(true);

    // Generate initial market data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      timestamp: Date.now() - (20 - i) * 30000,
      walletChange: (Math.random() - 0.5) * 10,
      marketChange: (Math.random() - 0.5) * 8
    }));
    setMarketData(initialData);

    // Start live updates
    intervalRef.current = setInterval(() => {
      // Simulate new transaction
      if (Math.random() > 0.7) {
        const isWhale = Math.random() > 0.9;
        const newTransaction: LiveTransaction = {
          id: Math.random().toString(36).substr(2, 9),
          type: Math.random() > 0.5 ? 'in' : 'out',
          amount: isWhale ? Math.random() * 100 + 50 : Math.random() * 10 + 0.1,
          timestamp: Date.now(),
          hash: Math.random().toString(36).substr(2, 16),
          isWhale
        };

        setLiveTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);

        if (isWhale) {
          setWhaleCount(prev => prev + 1);
        }
      }

      // Update portfolio value with animation
      setPortfolioValue(prev => {
        const change = (Math.random() - 0.5) * 0.02 * prev;
        return Math.max(0, prev + change);
      });

      // Update risk score
      setRiskScore(prev => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(0, Math.min(100, prev + change));
      });

      // Add new market correlation data
      setMarketData(prev => {
        const newPoint = {
          timestamp: Date.now(),
          walletChange: (Math.random() - 0.5) * 10,
          marketChange: (Math.random() - 0.5) * 8
        };
        return [...prev.slice(1), newPoint];
      });
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setIsLive(false);
    };
  }, []);

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-400';
    if (score < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskBg = (score: number) => {
    if (score < 30) return 'bg-green-500/20';
    if (score < 70) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  const formatTransactionValue = (amount: number, symbol = 'BTC') => {
    if (amount >= 1) return `${amount.toFixed(3)} ${symbol}`;
    return `${amount.toFixed(6)} ${symbol}`;
  };

  return (
    <div className="space-y-6">
      {/* Live Status Header */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Radio className="w-6 h-6 text-green-400" />
              {isLive && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">🔥 Live Blockchain Intelligence</h2>
              <p className="text-gray-300 text-sm">Real-time analysis of {address.slice(0, 8)}...{address.slice(-8)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{whaleCount}</div>
              <div className="text-xs text-gray-400">Whale Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{liveTransactions.length}</div>
              <div className="text-xs text-gray-400">Live TXs</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Portfolio Pulse */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">Live Portfolio Pulse</h3>
          </div>

          <div className="space-y-4">
            <motion.div
              key={portfolioValue}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-white mb-2">
                ${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-sm text-gray-400">Live Portfolio Value</div>
            </motion.div>

            {/* Risk Thermometer */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Risk Level</span>
                <span className={`text-sm font-bold ${getRiskColor(riskScore)}`}>
                  {riskScore.toFixed(0)}/100
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  className={`h-3 rounded-full ${getRiskBg(riskScore)} border border-white/30`}
                  style={{ width: `${riskScore}%` }}
                  animate={{ width: `${riskScore}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Market Correlation */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Market Correlation</h3>
          </div>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData}>
                <XAxis hide />
                <YAxis hide />
                <Line
                  type="monotone"
                  dataKey="walletChange"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="marketChange"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between text-xs mt-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-400">Wallet</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="text-gray-400">Market</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Transaction Stream */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-2 mb-4">
          <Waves className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">🌊 Live Transaction Stream</h3>
          <div className="ml-auto flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">LIVE</span>
          </div>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          <AnimatePresence>
            {liveTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  tx.isWhale
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {tx.isWhale && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-yellow-400"
                    >
                      🐋
                    </motion.div>
                  )}
                  <div className={`w-2 h-2 rounded-full ${
                    tx.type === 'in' ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <div>
                    <div className="text-white text-sm font-medium">
                      {tx.type === 'in' ? '↓ Incoming' : '↑ Outgoing'}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {tx.hash.slice(0, 8)}...{tx.hash.slice(-8)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-bold ${
                    tx.type === 'in' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {tx.type === 'in' ? '+' : '-'}{formatTransactionValue(tx.amount)}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                {tx.isWhale && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                    className="ml-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {liveTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Monitoring for live transactions...</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-2 mb-4">
          <Eye className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-bold text-white">🧠 Real-Time AI Insights</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            className="bg-blue-500/20 rounded-lg p-4 border border-blue-400/30"
            animate={{ borderColor: ['rgba(96, 165, 250, 0.3)', 'rgba(96, 165, 250, 0.6)', 'rgba(96, 165, 250, 0.3)'] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
          >
            <Target className="w-6 h-6 text-blue-400 mb-2" />
            <div className="text-white font-medium">Activity Pattern</div>
            <div className="text-blue-300 text-sm">
              {riskScore > 60 ? 'High frequency trading detected' : 'Steady accumulation pattern'}
            </div>
          </motion.div>

          <motion.div
            className="bg-green-500/20 rounded-lg p-4 border border-green-400/30"
            animate={{ borderColor: ['rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.6)', 'rgba(34, 197, 94, 0.3)'] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4, delay: 1 }}
          >
            <TrendingUp className="w-6 h-6 text-green-400 mb-2" />
            <div className="text-white font-medium">Market Position</div>
            <div className="text-green-300 text-sm">
              {portfolioValue > portfolio.valueUSD * 1.01 ? 'Above entry value' : 'Near entry levels'}
            </div>
          </motion.div>

          <motion.div
            className="bg-purple-500/20 rounded-lg p-4 border border-purple-400/30"
            animate={{ borderColor: ['rgba(168, 85, 247, 0.3)', 'rgba(168, 85, 247, 0.6)', 'rgba(168, 85, 247, 0.3)'] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, delay: 2 }}
          >
            <Flame className="w-6 h-6 text-purple-400 mb-2" />
            <div className="text-white font-medium">Whale Activity</div>
            <div className="text-purple-300 text-sm">
              {whaleCount > 0 ? `${whaleCount} whale movements detected` : 'No significant whale activity'}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LiveDashboard;
