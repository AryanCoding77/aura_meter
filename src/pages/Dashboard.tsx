import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Crown, TrendingUp, History, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'vip':
        return 'from-purple-500/20 to-pink-500/20';
      case 'best':
        return 'from-blue-500/20 to-cyan-500/20';
      case 'basic':
        return 'from-green-500/20 to-emerald-500/20';
      default:
        return 'from-gray-500/20 to-slate-500/20';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header with gradient */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-white/10 p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="font-display text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
                </h1>
                <p className="text-[#9CA3AF] text-lg">
                  Ready to discover your digital aura?
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid - Enhanced */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {/* Credits Card - Enhanced */}
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-[#12121A] border border-white/10 rounded-2xl p-6 hover:border-yellow-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/30">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                {profile?.credits_remaining === 0 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    Empty
                  </span>
                )}
              </div>
              <p className="text-xs text-[#9CA3AF] uppercase tracking-wide mb-1">Available Credits</p>
              <p className="text-3xl font-bold mb-2">{profile?.credits_remaining || 0}</p>
              <p className="text-xs text-[#9CA3AF] mb-4">
                {profile?.credits_remaining === 0 
                  ? 'Purchase credits to analyze' 
                  : 'Each analysis uses 1 credit'}
              </p>
              {profile?.credits_remaining === 0 && (
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 border-0 text-white"
                  onClick={() => navigate('/buy-plan')}
                >
                  Buy Credits
                </Button>
              )}
            </div>
          </motion.div>

          {/* Plan Card - Enhanced */}
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-[#12121A] border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPlanColor(profile?.plan || 'free')} flex items-center justify-center border border-white/10`}>
                  <Crown className="w-6 h-6 text-purple-400" />
                </div>
                <Star className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-xs text-[#9CA3AF] uppercase tracking-wide mb-1">Current Plan</p>
              <p className="text-3xl font-bold capitalize mb-2">{profile?.plan || 'Free'}</p>
              <p className="text-xs text-[#9CA3AF] mb-4">
                Pay-as-you-go model
              </p>
            </div>
          </motion.div>

          {/* Quick Action Card */}
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30 mb-4">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-xs text-[#9CA3AF] uppercase tracking-wide mb-1">Ready to Start?</p>
                <p className="text-xl font-bold mb-2">Analyze Screenshot</p>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0"
                onClick={() => navigate('/analyze')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Now
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Main CTA Section - Redesigned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden bg-[#12121A] border border-white/10 rounded-2xl p-8 lg:p-12 mb-8"
        >
          {/* Animated background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-6"
            >
              <Sparkles className="w-10 h-10 text-purple-400" />
            </motion.div>
            
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
              Discover Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Aura Score</span>
            </h2>
            <p className="text-[#9CA3AF] text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Upload a screenshot and let our AI analyze your digital presence. 
              Get personalized insights and brutal honesty.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0"
                onClick={() => navigate('/analyze')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze New Screenshot
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10"
                onClick={() => navigate('/history')}
              >
                <History className="w-5 h-5 mr-2" />
                View History
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* How It Works */}
          <div className="bg-[#12121A] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-xl">How It Works</h3>
            </div>
            <ul className="space-y-4">
              {[
                'Upload a screenshot of your social media profile',
                'Our AI analyzes your digital presence',
                'Get your aura score with detailed insights',
                'Share your results or keep them private'
              ].map((step, index) => (
                <li key={index} className="flex items-start gap-3 group">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold text-sm flex items-center justify-center border border-purple-500/30 group-hover:bg-purple-500/30 transition-colors">
                    {index + 1}
                  </span>
                  <span className="text-[#9CA3AF] group-hover:text-white transition-colors">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Tips */}
          <div className="bg-[#12121A] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-xl">Quick Tips</h3>
            </div>
            <ul className="space-y-4">
              {[
                { icon: '📸', text: 'Use clear, high-quality screenshots' },
                { icon: '👤', text: 'Include your profile picture and bio' },
                { icon: '📊', text: 'Check history to track improvements' },
                { icon: '⚡', text: 'Each analysis uses just 1 credit' }
              ].map((tip, index) => (
                <li key={index} className="flex items-start gap-3 group">
                  <span className="flex-shrink-0 text-xl">{tip.icon}</span>
                  <span className="text-[#9CA3AF] group-hover:text-white transition-colors">{tip.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
