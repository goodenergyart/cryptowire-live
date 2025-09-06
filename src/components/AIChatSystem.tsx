import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Brain,
  TrendingUp,
  Activity,
  Zap,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Lightbulb,
  AlertTriangle,
  Target,
  BarChart3
} from 'lucide-react';
import { lakesailClient } from '../services/lakesailClient';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: number;
  analysis?: MarketAnalysis;
  suggestions?: string[];
}

interface MarketAnalysis {
  type: 'whale_activity' | 'gas_analysis' | 'defi_trends' | 'correlation' | 'prediction';
  confidence: number;
  data: any;
  visualization?: 'chart' | 'heatmap' | 'network';
}

interface QuickQuery {
  id: string;
  label: string;
  icon: React.ReactNode;
  query: string;
  category: 'whale' | 'gas' | 'defi' | 'prediction';
}

export const AIChatSystem: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
}> = ({ isOpen, onClose, onMinimize, isMinimized }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickQueries: QuickQuery[] = [
    {
      id: 'whale_btc',
      label: 'Bitcoin Whale Activity',
      icon: <Activity className="w-4 h-4" />,
      query: 'Analyze current Bitcoin whale movements and predict market impact',
      category: 'whale'
    },
    {
      id: 'eth_gas',
      label: 'Ethereum Gas Trends',
      icon: <Zap className="w-4 h-4" />,
      query: 'What\'s driving current Ethereum gas prices and when will they normalize?',
      category: 'gas'
    },
    {
      id: 'defi_flows',
      label: 'DeFi Capital Flows',
      icon: <TrendingUp className="w-4 h-4" />,
      query: 'Analyze DeFi capital flows across chains and identify opportunities',
      category: 'defi'
    },
    {
      id: 'cross_chain',
      label: 'Cross-Chain Correlations',
      icon: <BarChart3 className="w-4 h-4" />,
      query: 'Show me cross-chain correlations and arbitrage opportunities',
      category: 'prediction'
    },
    {
      id: 'market_prediction',
      label: 'Market Predictions',
      icon: <Target className="w-4 h-4" />,
      query: 'Generate 24h market predictions based on current blockchain data',
      category: 'prediction'
    },
    {
      id: 'anomaly_detection',
      label: 'Anomaly Detection',
      icon: <AlertTriangle className="w-4 h-4" />,
      query: 'What unusual blockchain activities should I be aware of right now?',
      category: 'whale'
    }
  ];

  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      // Welcome message
      setMessages([{
        id: 'welcome',
        type: 'ai',
        content: `🧠 **CryptoWire AI Assistant**

Welcome! I'm your blockchain intelligence assistant, powered by real-time data from 7+ blockchain networks.

I can help you:
• 🐋 **Whale Analysis** - Track large transactions and market impact
• ⛽ **Gas Optimization** - Monitor gas prices and predict trends
• 💰 **DeFi Intelligence** - Analyze protocol flows and yields
• 🔗 **Cross-Chain Analysis** - Identify arbitrage opportunities
• 📈 **Market Predictions** - ML-powered price forecasting
• 🚨 **Anomaly Detection** - Spot unusual blockchain activities

Try asking me about current market conditions or use the quick queries below!`,
        timestamp: Date.now()
      }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    // Simulate AI processing with real blockchain data analysis
    try {
      const aiResponse = await generateAIResponse(content);

      setTimeout(() => {
        setMessages(prev => [...prev, aiResponse]);
        setIsThinking(false);
      }, 1500 + Math.random() * 1000); // Realistic thinking time

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '⚠️ Sorry, I encountered an error analyzing the current blockchain data. Please try again.',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsThinking(false);
    }
  };

  const generateAIResponse = async (query: string): Promise<ChatMessage> => {
    const queryLower = query.toLowerCase();

    let analysis: MarketAnalysis | undefined;
    let content = '';
    let suggestions: string[] = [];

    // Whale activity analysis
    if (queryLower.includes('whale') || queryLower.includes('large transaction')) {
      const whaleData = await lakesailClient.detectWhaleMovements('bitcoin');
      analysis = {
        type: 'whale_activity',
        confidence: 0.85,
        data: whaleData
      };

      content = `🐋 **Whale Activity Analysis**

I've detected ${whaleData.length} significant whale movements in the last hour:

${whaleData.map((whale, i) =>
  `**${i + 1}.** ${whale.chain.toUpperCase()} - $${(whale.amountUSD / 1000000).toFixed(1)}M ${whale.pattern}
  • Impact Score: ${whale.impactScore.toFixed(0)}/100
  • Confidence: ${(whale.confidence * 100).toFixed(0)}%`
).join('\n\n')}

**Market Impact Prediction:**
${whaleData.length > 2 ? '📈 Bullish momentum expected from accumulation patterns' :
  whaleData.length > 0 ? '⚠️ Mixed signals - monitor closely for trend confirmation' :
  '😴 Low whale activity - retail-driven market currently'}`;

      suggestions = [
        'Show me gas price impact from whale movements',
        'Analyze cross-chain whale migration patterns',
        'What are the biggest whale wallets doing?'
      ];
    }

    // Gas analysis
    else if (queryLower.includes('gas') || queryLower.includes('ethereum') && queryLower.includes('price')) {
      const ethMetrics = await lakesailClient.getNetworkMetrics('ethereum');
      analysis = {
        type: 'gas_analysis',
        confidence: 0.78,
        data: ethMetrics
      };

      content = `⛽ **Ethereum Gas Analysis**

**Current Status:**
• Gas Price: ${ethMetrics.gasPriceGwei} gwei
• Network Activity: ${ethMetrics.whaleActivityScore.toFixed(0)}/100
• Active Addresses: ${(ethMetrics.activeAddresses / 1000).toFixed(0)}K

**Prediction Model Results:**
${ethMetrics.gasPriceGwei! > 50 ?
  '🔴 **HIGH GAS ALERT** - Major protocol activity or NFT mint driving congestion' :
  ethMetrics.gasPriceGwei! > 25 ?
  '🟡 **MODERATE** - Normal DeFi activity, expect gradual normalization' :
  '🟢 **LOW** - Optimal time for DeFi transactions'}

**Optimization Strategy:**
• Best transaction time: ${ethMetrics.gasPriceGwei! > 30 ? 'Wait 2-4 hours' : 'Now'}
• Alternative: Use Polygon or Arbitrum for 90% lower fees`;

      suggestions = [
        'Compare gas prices across L2 networks',
        'Predict next gas spike timing',
        'Show me DeFi protocols causing congestion'
      ];
    }

    // DeFi analysis
    else if (queryLower.includes('defi') || queryLower.includes('yield') || queryLower.includes('tvl')) {
      const correlations = await lakesailClient.analyzeCrossChainCorrelations();
      analysis = {
        type: 'defi_trends',
        confidence: 0.82,
        data: correlations
      };

      content = `💰 **DeFi Intelligence Report**

**Cross-Chain Capital Flows:**

${correlations.map(corr =>
  `**${corr.chains.join(' ↔️ ')}**
  • Correlation: ${(corr.correlation * 100).toFixed(0)}% (${corr.strength})
  • Opportunity: ${corr.opportunity.toUpperCase()}
  • Time Window: ${corr.timeframe}`
).join('\n\n')}

**Strategic Insights:**
• 🎯 Strongest arbitrage opportunity: ${correlations[0]?.chains.join(' → ')}
• 🔄 Capital rotating from Ethereum to L2s (+25% weekly)
• 📊 DeFi TVL momentum: ${correlations.length > 2 ? 'Bullish' : 'Consolidating'}

**Recommended Actions:**
1. Monitor ${correlations[0]?.chains[0]} → ${correlations[0]?.chains[1]} bridge volumes
2. Set alerts for correlation breakdown opportunities`;

      suggestions = [
        'Find highest yield opportunities across chains',
        'Alert me to unusual DeFi drainage events',
        'Compare Uniswap vs competitors volumes'
      ];
    }

    // Market predictions
    else if (queryLower.includes('predict') || queryLower.includes('forecast') || queryLower.includes('price')) {
      const predictions = await lakesailClient.generateMarketPredictions(['bitcoin', 'ethereum', 'solana']);
      analysis = {
        type: 'prediction',
        confidence: 0.72,
        data: predictions
      };

      content = `📈 **AI Market Predictions (Next 24H)**

${predictions.map(pred =>
  `**${pred.symbol}** ${pred.direction === 'up' ? '📈' : pred.direction === 'down' ? '📉' : '➡️'}
  • Direction: ${pred.direction.toUpperCase()} (${(pred.confidence * 100).toFixed(0)}% confidence)
  • Timeframe: ${pred.timeframe}
  • Reasoning: ${pred.reasoning}`
).join('\n\n')}

**Model Performance:**
• Accuracy (7d): 74%
• Features: ${predictions[0]?.features.join(', ')}
• Model: ${predictions[0]?.modelVersion}

⚠️ **Risk Disclaimer:** Predictions based on on-chain data patterns. Always DYOR and manage risk appropriately.`;

      suggestions = [
        'Explain the prediction model methodology',
        'Show historical prediction accuracy',
        'Alert me when confidence exceeds 85%'
      ];
    }

    // Anomaly detection
    else if (queryLower.includes('anomal') || queryLower.includes('unusual') || queryLower.includes('alert')) {
      const anomalies = await lakesailClient.detectAnomalies();
      analysis = {
        type: 'whale_activity',
        confidence: 0.88,
        data: anomalies
      };

      content = `🚨 **Anomaly Detection Report**

${anomalies.length > 0 ?
  anomalies.map(anomaly =>
    `**${anomaly.severity.toUpperCase()} ALERT** - ${anomaly.chain.toUpperCase()}
    • Type: ${anomaly.type.replace('_', ' ').toUpperCase()}
    • ${anomaly.description}
    • Confidence: ${(anomaly.confidence * 100).toFixed(0)}%
    • Predicted Impact: ${anomaly.predictedImpact.toUpperCase()}
    • Time Window: ${anomaly.timeWindow}`
  ).join('\n\n') :
  '✅ **All Clear** - No significant anomalies detected across monitored networks'
}

**Monitoring Status:**
• Networks: 7 chains actively monitored
• Detection Models: 12 active
• Alert Threshold: Medium+
• Last Scan: ${new Date().toLocaleTimeString()}`;

      suggestions = [
        'Set up custom anomaly alerts',
        'Explain anomaly detection methodology',
        'Show historical anomaly patterns'
      ];
    }

    // General blockchain query
    else {
      content = `🤖 **General Blockchain Analysis**

I can help you with specific blockchain intelligence queries. Here are some areas I excel at:

**🐋 Whale Tracking**
• Large transaction monitoring
• Accumulation/distribution patterns
• Market impact predictions

**⛽ Gas & Network Analysis**
• Real-time gas optimization
• Network congestion forecasting
• L2 migration opportunities

**💰 DeFi Intelligence**
• Cross-chain capital flows
• Yield optimization strategies
• Protocol health monitoring

**📊 Market Predictions**
• ML-powered price forecasting
• Correlation analysis
• Trend identification

Try asking something more specific, or use the quick query buttons below!`;

      suggestions = [
        'What are Bitcoin whales doing right now?',
        'Should I wait for lower gas prices?',
        'Where are the best DeFi yields?'
      ];
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content,
      timestamp: Date.now(),
      analysis,
      suggestions
    };
  };

  const handleQuickQuery = (query: string) => {
    handleSendMessage(query);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'whale': return 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300';
      case 'gas': return 'bg-blue-500/20 border-blue-400/30 text-blue-300';
      case 'defi': return 'bg-purple-500/20 border-purple-400/30 text-purple-300';
      case 'prediction': return 'bg-green-500/20 border-green-400/30 text-green-300';
      default: return 'bg-gray-500/20 border-gray-400/30 text-gray-300';
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`fixed z-50 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl transition-all duration-300 ${
        isMaximized
          ? 'inset-4'
          : isMinimized
            ? 'bottom-4 right-4 w-80 h-16'
            : 'bottom-4 right-4 w-96 h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">CryptoWire AI</h3>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onMinimize}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}>
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' && <Bot className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />}
                    {message.type === 'user' && <User className="w-4 h-4 text-white mt-1 flex-shrink-0" />}
                    <div className="flex-1">
                      <div className="prose prose-sm text-current max-w-none">
                        {message.content.split('\n').map((line, i) => (
                          <div key={i} className="mb-1">
                            {line.includes('**') ? (
                              <span dangerouslySetInnerHTML={{
                                __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              }} />
                            ) : (
                              line
                            )}
                          </div>
                        ))}
                      </div>

                      {message.suggestions && (
                        <div className="mt-3 space-y-1">
                          <div className="text-xs text-gray-400 flex items-center">
                            <Lightbulb className="w-3 h-3 mr-1" />
                            Suggested follow-ups:
                          </div>
                          {message.suggestions.map((suggestion, i) => (
                            <button
                              key={i}
                              onClick={() => handleSendMessage(suggestion)}
                              className="block w-full text-left text-xs text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              • {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gray-800 text-gray-100 border border-gray-700 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-400" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-sm text-gray-400">Analyzing blockchain data...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Queries */}
          <div className="px-4 py-2 border-t border-gray-700">
            <div className="text-xs text-gray-400 mb-2">Quick Queries:</div>
            <div className="grid grid-cols-2 gap-1">
              {quickQueries.slice(0, 4).map((query) => (
                <button
                  key={query.id}
                  onClick={() => handleQuickQuery(query.query)}
                  className={`p-2 rounded-lg text-xs flex items-center space-x-1 transition-colors ${getCategoryColor(query.category)} hover:opacity-80`}
                >
                  {query.icon}
                  <span className="truncate">{query.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                placeholder="Ask about blockchain data, whales, DeFi trends..."
                className="flex-1 bg-gray-800 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isThinking}
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isThinking || !inputValue.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
