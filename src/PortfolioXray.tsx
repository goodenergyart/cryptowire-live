import type React from 'react';
import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Share, Wallet, DollarSign, BarChart3, Target, Zap, ExternalLink, Radar } from 'lucide-react';
import type { Portfolio, PriceData, AnalysisResult } from './types';
import { DEMO_PORTFOLIOS, CHAIN_TOKENS } from './demoData';
import {
  detectWalletChain,
  fetchCurrentPrices,
  calculatePortfolioValue,
  analyzePerformance,
  formatCurrency,
  formatPercentage,
  getShareText,
  fetchRealWalletData
} from './utils';
import LiveDashboard from './LiveDashboard';

const PortfolioXray: React.FC = () => {
  const [address, setAddress] = useState('');
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [prices, setPrices] = useState<PriceData>({});
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDemo, setSelectedDemo] = useState('');
  const [showLiveDashboard, setShowLiveDashboard] = useState(false);

  const demoAddresses = Object.keys(DEMO_PORTFOLIOS);

  useEffect(() => {
    // Load demo address on mount - run only once
    const firstDemo = Object.keys(DEMO_PORTFOLIOS)[0];
    if (firstDemo) {
      setSelectedDemo(firstDemo);
      setAddress(firstDemo);
      analyzeAddress(firstDemo);
    }
  }, []);

  const analyzeAddress = async (walletAddress: string) => {
    setLoading(true);
    setError('');
    setShowLiveDashboard(false);

    try {
      const chain = detectWalletChain(walletAddress);
      if (!chain) {
        setError('Unsupported wallet address format. Please enter a valid Bitcoin (bc1..., 1..., 3...), Ethereum (0x...), Kava (kava1...), Solana, or Polygon address.');
        setLoading(false);
        return;
      }

      let portfolioData: Portfolio;

      // Check if it's a demo address
      if (DEMO_PORTFOLIOS[walletAddress]) {
        portfolioData = { ...DEMO_PORTFOLIOS[walletAddress] };
      } else {
        // For real addresses, fetch actual blockchain data
        console.log(`Analyzing real ${chain} address: ${walletAddress}`);
        const realData = await fetchRealWalletData(walletAddress, chain);

        if (realData) {
          portfolioData = realData;
        } else {
          setError(`Unable to fetch data for ${chain} address. This could be due to API limitations or an invalid address.`);
          setLoading(false);
          return;
        }
      }

      // Fetch current prices
      const tokens = CHAIN_TOKENS[chain as keyof typeof CHAIN_TOKENS] || [];
      const currentPrices = await fetchCurrentPrices(tokens);
      setPrices(currentPrices);

      // Calculate portfolio value
      const totalValue = calculatePortfolioValue(portfolioData, currentPrices);
      portfolioData.valueUSD = totalValue;

      // Update asset values
      if (portfolioData.assets) {
        for (const asset of portfolioData.assets) {
          const tokenId = getTokenIdFromSymbol(asset.symbol);
          asset.valueUSD = asset.amount * (currentPrices[tokenId]?.usd || 0);
        }
      }

      setPortfolio(portfolioData);

      // Analyze performance
      const performanceAnalysis = analyzePerformance(portfolioData);
      setAnalysis(performanceAnalysis);

      // Show live dashboard after successful analysis
      setTimeout(() => setShowLiveDashboard(true), 1000);

    } catch (err) {
      setError('Failed to analyze portfolio. Please try again.');
      console.error(err);
    }

    setLoading(false);
  };

  const getTokenIdFromSymbol = (symbol: string): string => {
    const mapping: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'KAVA': 'kava',
      'SOL': 'solana',
      'MATIC': 'matic-network',
      'USDC': 'usd-coin',
      'UNI': 'uniswap',
      'LINK': 'chainlink',
      'AAVE': 'aave'
    };
    return mapping[symbol] || symbol.toLowerCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      analyzeAddress(address.trim());
    }
  };

  const selectDemoAddress = (demoAddress: string) => {
    // Clear previous state first
    setPortfolio(null);
    setAnalysis(null);
    setError('');

    // Set new address
    setSelectedDemo(demoAddress);
    setAddress(demoAddress);

    // Analyze the new address
    analyzeAddress(demoAddress);
  };

  const shareOnX = () => {
    if (portfolio && analysis) {
      const text = getShareText(portfolio, analysis, portfolio.valueUSD);
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  const getChainIcon = (chain: string) => {
    const icons: Record<string, string> = {
      bitcoin: '₿',
      ethereum: 'Ξ',
      kava: '🌊',
      solana: '◎',
      polygon: '⬢'
    };
    return icons[chain] || '🔗';
  };

  const getPerformanceColor = (value: number) => {
    if (value > 0) return 'text-green-400';
    if (value < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getPerformanceIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Portfolio<span className="text-blue-400">Xray</span>
          </h1>
          <p className="text-gray-300">AI-powered crypto wallet performance analysis</p>
        </div>

        {/* Search Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter BTC, ETH, Kava, Solana, or Polygon address..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
            >
              {loading ? (
                DEMO_PORTFOLIOS[address] ? 'Loading Demo...' : 'Fetching Blockchain Data...'
              ) : 'Analyze Portfolio'}
            </button>
          </form>

          {/* Demo Addresses */}
          <div className="mt-4">
            <p className="text-gray-300 text-sm mb-2">Try demo addresses:</p>
            <div className="flex flex-wrap gap-2">
              {demoAddresses.map((demo) => (
                <button
                  key={demo}
                  onClick={() => selectDemoAddress(demo)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedDemo === demo
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {DEMO_PORTFOLIOS[demo].chain} {getChainIcon(DEMO_PORTFOLIOS[demo].chain)}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Live Dashboard - NEW! */}
        {portfolio && analysis && showLiveDashboard && (
          <div className="mb-6">
            <LiveDashboard
              portfolio={portfolio}
              prices={prices}
              address={address}
            />
          </div>
        )}

        {/* Original Portfolio Analysis */}
        {portfolio && analysis && (
          <div className="space-y-6">
            {/* Toggle Live Dashboard Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowLiveDashboard(!showLiveDashboard)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  showLiveDashboard
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-gray-300'
                }`}
              >
                <Radar className="w-5 h-5" />
                <span>{showLiveDashboard ? '🔥 Live Dashboard Active' : '⚡ Launch Live Dashboard'}</span>
              </button>
            </div>

            {/* Portfolio Overview */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getChainIcon(portfolio.chain)}</div>
                  <div>
                    <h2 className="text-xl font-bold text-white capitalize">{portfolio.chain} Portfolio</h2>
                    <p className="text-gray-400">
                      {address.slice(0, 8)}...{address.slice(-8)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={shareOnX}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Share className="w-4 h-4" />
                  <span>Share on X</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Total Value</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(portfolio.valueUSD)}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Performance</span>
                  </div>
                  <p className={`text-2xl font-bold ${analysis.performance === 'Overperforming' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {analysis.performance}
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-300">Score</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{analysis.score.toFixed(0)}/100</p>
                </div>
              </div>
            </div>

            {/* Wealth Changes */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Wealth Changes</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(portfolio.wealthChange).map(([period, change]) => (
                  <div key={period} className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      {getPerformanceIcon(change)}
                      <span className="text-gray-300">{period}</span>
                    </div>
                    <p className={`text-xl font-bold ${getPerformanceColor(change)}`}>
                      {formatPercentage(change)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Assets Breakdown */}
            {portfolio.assets && portfolio.assets.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-2 mb-4">
                  <Wallet className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold text-white">Assets</h3>
                </div>
                <div className="space-y-3">
                  {portfolio.assets.map((asset) => (
                    <div key={`${asset.symbol}-${asset.type}`} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {asset.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{asset.symbol}</p>
                          <p className="text-gray-400 text-sm capitalize">{asset.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{asset.amount.toLocaleString()}</p>
                        <p className="text-gray-400 text-sm">{formatCurrency(asset.valueUSD)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DeFi Positions */}
            {portfolio.defi && portfolio.defi.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">DeFi Positions</h3>
                </div>
                <div className="space-y-3">
                  {portfolio.defi.map((position) => (
                    <div key={`${position.protocol}-${position.type}`} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-white font-medium">{position.protocol}</h4>
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full capitalize">
                            {position.type}
                          </span>
                        </div>
                        {position.apy && (
                          <span className="text-green-400 font-medium">{position.apy}% APY</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-300">Assets: {position.assets.join(', ')}</p>
                        <p className="text-white font-medium">{formatCurrency(position.valueUSD)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Analysis */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">🤖 AI Analysis</h3>

              {analysis.insights.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Key Insights</h4>
                  <ul className="space-y-2">
                    {analysis.insights.map((insight) => (
                      <li key={insight} className="text-gray-300 flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.suggestions.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-2">Optimization Suggestions</h4>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((suggestion) => (
                      <li key={suggestion} className="text-gray-300 flex items-start space-x-2">
                        <span className="text-green-400 mt-1">→</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm">
                Built with ❤️ for the crypto community • Open source on{' '}
                <a href="https://github.com" className="text-blue-400 hover:text-blue-300">GitHub</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioXray;
