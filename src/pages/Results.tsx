import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Flame, Sparkles, TrendingUp, Zap, Target, AlertTriangle, Link as LinkIcon, Check, Heart, Users, Eye, Laugh } from "lucide-react";
import Footer from "@/components/Footer";
import { AuraResult } from "@/lib/fireworks";
import { getAuraResultById, getShareableUrl, copyShareableUrl, decodeResultData } from "@/lib/resultStorage";
import { useEffect, useState } from "react";
import LockedSection from "@/components/LockedSection";
import { getFreeTip, getPaidTip } from "@/lib/auraTips";
import { useAuth } from "@/contexts/AuthContext";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState<AuraResult | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { user, profile } = useAuth();
  
  // Check if user has premium access (has credits)
  const hasPremiumAccess = profile && profile.credits_remaining > 0;

  useEffect(() => {
    const loadResult = async () => {
      // Priority 1: Try to get result from URL data parameter (for sharing)
      const dataParam = searchParams.get('data');
      if (dataParam) {
        const decodedResult = decodeResultData(dataParam);
        if (decodedResult) {
          setResult(decodedResult);
          setResultId(id || null);
          return;
        }
      }

      // Priority 2: Try to get result from localStorage/Supabase using ID
      if (id) {
        const storedResult = await getAuraResultById(id);
        if (storedResult) {
          setResult(storedResult);
          setResultId(id);
          return;
        }
      }

      // Priority 3: Fallback to location state (for backward compatibility)
      const stateResult = location.state?.result as AuraResult | undefined;
      if (stateResult) {
        setResult(stateResult);
      } else {
        navigate("/upload");
      }
    };

    loadResult();
  }, [id, searchParams, location.state, navigate]);

  if (!result) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 40) return "text-purple-400";
    if (score >= 25) return "text-green-400";
    if (score >= 10) return "text-cyan-400";
    if (score >= 0) return "text-gray-400";
    if (score >= -14) return "text-yellow-400";
    if (score >= -29) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 40) return "from-purple-500 via-pink-500 to-purple-600";
    if (score >= 25) return "from-green-500 via-emerald-500 to-green-600";
    if (score >= 10) return "from-cyan-500 via-blue-500 to-cyan-600";
    if (score >= 0) return "from-gray-500 via-slate-500 to-gray-600";
    if (score >= -14) return "from-yellow-500 via-amber-500 to-orange-500";
    if (score >= -29) return "from-orange-500 via-red-500 to-orange-600";
    return "from-red-500 via-pink-500 to-red-600";
  };

  const getScoreBgGlow = (score: number) => {
    if (score >= 40) return "shadow-[0_0_100px_rgba(168,85,247,0.4)]";
    if (score >= 25) return "shadow-[0_0_100px_rgba(34,197,94,0.3)]";
    if (score >= 10) return "shadow-[0_0_100px_rgba(6,182,212,0.3)]";
    if (score >= 0) return "shadow-[0_0_60px_rgba(100,116,139,0.2)]";
    if (score >= -14) return "shadow-[0_0_80px_rgba(251,191,36,0.3)]";
    if (score >= -29) return "shadow-[0_0_100px_rgba(249,115,22,0.3)]";
    return "shadow-[0_0_120px_rgba(239,68,68,0.4)]";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 40) return "Elite tier. Don't let it go to your head.";
    if (score >= 25) return "Strong presence. Keep it up.";
    if (score >= 10) return "Positive vibes. Room to grow.";
    if (score >= 0) return "Neutral. Forgettable but not offensive.";
    if (score >= -14) return "Weak signal. Needs work.";
    if (score >= -29) return "Off energy. Something's not right.";
    return "Negative presence. Time for a reality check.";
  };

  const handleShare = async () => {
    const scoreDisplay = result.aura_score > 0 ? `+${result.aura_score}` : `${result.aura_score}`;
    
    if (resultId) {
      // Share the unique URL with encoded data
      const shareUrl = getShareableUrl(resultId, result);
      const shareText = `My Aura Score: ${scoreDisplay}/50 🔥\n${result.shareable_one_liner}\n\nCheck it out:`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: "My Aura Score",
            text: shareText,
            url: shareUrl,
          });
        } catch (err) {
          console.log("Share cancelled");
        }
      } else {
        // Fallback: copy URL to clipboard
        const success = await copyShareableUrl(resultId, result);
        if (success) {
          alert("Link copied to clipboard!");
        }
      }
    } else {
      // Fallback to text-only share
      const shareText = `My Aura Score: ${scoreDisplay}/50 🔥\n${result.shareable_one_liner}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: "My Aura Score",
            text: shareText,
            url: window.location.origin,
          });
        } catch (err) {
          console.log("Share cancelled");
        }
      } else {
        navigator.clipboard.writeText(shareText);
        alert("Copied to clipboard!");
      }
    }
  };

  const handleCopyLink = async () => {
    if (resultId) {
      const success = await copyShareableUrl(resultId, result);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden noise-overlay">
      <main className="relative pt-16 pb-16">
        {/* Intense background effects - roasting room vibes */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-orange-950/10 to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        
        {/* Animated fire orbs */}
        <div className="orb w-[700px] h-[700px] -top-48 -left-48 opacity-40 bg-gradient-to-br from-red-500 to-orange-500" style={{ animationDuration: '20s' }} />
        <div className="orb w-[600px] h-[600px] top-1/4 -right-64 opacity-30 bg-gradient-to-br from-orange-500 to-yellow-500" style={{ animationDelay: '-5s', animationDuration: '25s' }} />
        <div className="orb w-[500px] h-[500px] bottom-0 left-1/3 opacity-25 bg-gradient-to-br from-pink-500 to-red-500" style={{ animationDelay: '-10s', animationDuration: '30s' }} />
        
        {/* Floating fire particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-500 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
                opacity: 0 
              }}
              animate={{ 
                y: -50, 
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{ 
                duration: Math.random() * 3 + 2, 
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        <div className="container relative z-10">
          {/* Back button with fire theme */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Roast another victim</span>
          </motion.button>

          <div className="max-w-3xl mx-auto">
            {/* Header with fire emoji */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <motion.div 
                className="glass-card px-6 py-3 mb-6 flex items-center gap-3 w-fit mx-auto border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10"
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(249,115,22,0.3)",
                    "0 0 40px rgba(249,115,22,0.5)",
                    "0 0 20px rgba(249,115,22,0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-semibold text-orange-400">ROAST RESULTS</span>
                <Flame className="w-5 h-5 text-orange-500" />
              </motion.div>
              
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                You've Been <span className="gradient-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text">Roasted</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Prepare yourself. The AI held nothing back. 🔥
              </p>
            </motion.div>

            {/* Score Card - More dramatic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`glass-card p-6 sm:p-10 mb-8 relative overflow-hidden border-2 ${getScoreBgGlow(result.aura_score)}`}
              style={{
                borderImage: `linear-gradient(135deg, ${result.aura_score >= 60 ? '#10b981, #3b82f6' : '#ef4444, #f97316'}) 1`
              }}
            >
              {/* Animated background gradient */}
              <motion.div 
                className="absolute inset-0 opacity-10"
                animate={{
                  background: [
                    `radial-gradient(circle at 0% 0%, ${result.aura_score >= 60 ? '#10b981' : '#ef4444'} 0%, transparent 50%)`,
                    `radial-gradient(circle at 100% 100%, ${result.aura_score >= 60 ? '#3b82f6' : '#f97316'} 0%, transparent 50%)`,
                    `radial-gradient(circle at 0% 0%, ${result.aura_score >= 60 ? '#10b981' : '#ef4444'} 0%, transparent 50%)`
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />

              <div className="text-center mb-6 sm:mb-8 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
                  className={`text-7xl sm:text-9xl font-bold mb-4 ${getScoreColor(result.aura_score)} drop-shadow-[0_0_30px_currentColor]`}
                >
                  {result.aura_score > 0 ? '+' : ''}{result.aura_score}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className={`text-2xl sm:text-3xl font-display font-semibold bg-gradient-to-r ${getScoreGradient(result.aura_score)} bg-clip-text text-transparent mb-2`}
                >
                  {result.aura_label}
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-muted-foreground text-sm px-4"
                >
                  {getScoreMessage(result.aura_score)}
                </motion.p>
              </div>

              {/* Animated progress bar */}
              <div className="w-full h-3 sm:h-4 bg-muted/30 rounded-full overflow-hidden mb-6 sm:mb-8 relative">
                {/* Center line at 0 */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30" />
                
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.abs(result.aura_score)}%`,
                    left: result.aura_score >= 0 ? '50%' : `${50 - Math.abs(result.aura_score)}%`
                  }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${getScoreGradient(result.aura_score)}`}
                  style={{ position: 'absolute' }}
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/50 text-sm sm:text-base"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Share the Burn
                </motion.button>
                
                {resultId && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyLink}
                    className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        Copy Link
                      </>
                    )}
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/upload")}
                  className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-300 text-sm sm:text-base"
                >
                  Get Roasted Again
                </motion.button>
              </div>
            </motion.div>

            {/* Social Proof Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-card p-4 mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
            >
              <p className="text-center text-sm text-muted-foreground">
                <span className="text-primary font-semibold">12,000+ users</span> unlocked their full aura today • You've seen <span className="text-primary font-semibold">30%</span> of your results
              </p>
            </motion.div>

            {/* FREE CONTENT SECTION */}
            
            {/* The Roast Section - Fire themed (FREE) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass-card p-6 sm:p-8 mb-6 border-2 border-red-500/30 bg-gradient-to-br from-red-950/20 to-orange-950/20 relative overflow-hidden"
            >
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <h3 className="font-display text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-3">
                <motion.span 
                  className="text-3xl sm:text-4xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  🔥
                </motion.span>
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  The Roast
                </span>
              </h3>
              <p className="text-foreground text-base sm:text-lg leading-relaxed relative z-10 font-normal whitespace-pre-wrap break-words">
                {result.roast}
              </p>
            </motion.div>

            {/* Personality Insight (FREE - 1-2 traits) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="glass-card p-6 sm:p-8 mb-6"
            >
              <h3 className="font-display text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                <span>Personality Insight</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base whitespace-pre-wrap break-words">
                {result.personality_insight.split('.').slice(0, 2).join('.')}
                {result.personality_insight.split('.').length > 2 && '.'}
              </p>
            </motion.div>

            {/* Basic Strengths (FREE - show 1-2) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="glass-card p-5 sm:p-6 mb-6 border-2 border-green-500/30 bg-gradient-to-br from-green-950/20 to-emerald-950/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />
              <h3 className="font-display text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2 relative z-10">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                <span className="text-green-400">Your Strengths</span>
              </h3>
              <ul className="space-y-3 relative z-10">
                {result.strengths.slice(0, 2).map((strength, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm sm:text-base leading-relaxed break-words">{strength}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Tip to Improve Your Aura (FREE VERSION) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="glass-card p-6 sm:p-8 mb-6 border-2 border-cyan-500/30"
            >
              <h3 className="font-display text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                <span className="text-cyan-400">Tip to Improve Your Aura</span>
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4">
                {getFreeTip(result.aura_score)}
              </p>
              
              {/* Locked Premium Tip */}
              {!hasPremiumAccess && (
                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20 relative overflow-hidden">
                  <div className="absolute inset-0 backdrop-blur-sm bg-background/40" />
                  <div className="relative z-10 text-center space-y-3">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Unlock personalized improvement guidance
                    </p>
                    <p className="text-xs text-primary/80">87% of users found this insight surprisingly accurate</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(user ? '/buy-plan' : '/login?redirect=/buy-plan')}
                      className="btn-primary-glow bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                    >
                      Unlock Deeper Guidance
                    </motion.button>
                    <p className="text-xs text-muted-foreground">No subscription • Use credits anytime</p>
                  </div>
                </div>
              )}
              
              {/* Premium Tip (if unlocked) */}
              {hasPremiumAccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30"
                >
                  <p className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Personalized Insight
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {getPaidTip(result)}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* LOCKED PREMIUM SECTIONS */}
            
            {/* Premium Insights Grid - Fire Theme */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mb-8"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.0, type: "spring" }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 mb-4"
                >
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-semibold text-orange-400">Premium Insights</span>
                  <Flame className="w-4 h-4 text-orange-400" />
                </motion.div>
                
                <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
                  Unlock Deeper <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">Insights</span>
                </h2>
                <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                  Discover what 87% of users found surprisingly accurate about themselves
                </p>
              </div>

              {/* Grid of locked sections */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <LockedSection
                  title="Love Aura"
                  icon={<Heart className="w-5 h-5 text-pink-400" />}
                  hintText="How others perceive your romantic energy"
                  previewText="Your romantic energy is magnetic but guarded. People are drawn to you, but you keep them at arm's length until you feel safe. This creates an intriguing push-pull dynamic..."
                  variant="compact"
                  isUnlocked={hasPremiumAccess}
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your romantic energy is magnetic but guarded. People are drawn to you, but you keep them at arm's length until you feel safe. This creates an intriguing push-pull dynamic that makes you memorable in relationships. You're not playing games—you're protecting yourself. But this guard can sometimes prevent genuine connections from forming. When you do let someone in, they feel special because they know how rare that is.
                  </p>
                </LockedSection>

                <LockedSection
                  title="Social Presence"
                  icon={<Users className="w-5 h-5 text-blue-400" />}
                  hintText="How you show up in group settings"
                  previewText="In social settings, you're the observer. People feel comfortable around you, but you rarely take center stage. You have a quiet influence that others don't always notice..."
                  variant="compact"
                  isUnlocked={hasPremiumAccess}
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    In social settings, you're the observer. People feel comfortable around you, but you rarely take center stage. You have a quiet influence that others don't always notice. You're the person people seek out for real conversations, not small talk. Your presence is calming, which makes you easy to overlook in loud environments—but those who pay attention value you deeply.
                  </p>
                </LockedSection>

                <LockedSection
                  title="Hidden Strengths"
                  icon={<Eye className="w-5 h-5 text-green-400" />}
                  hintText="Strengths you don't realize you have"
                  previewText="Natural leadership in crisis situations • Emotional intelligence that puts others at ease • Ability to read between the lines and understand unspoken dynamics..."
                  variant="compact"
                  isUnlocked={hasPremiumAccess}
                >
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">•</span>
                      <span>Natural leadership in crisis situations—you stay calm when others panic</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">•</span>
                      <span>Emotional intelligence that puts others at ease without trying</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">•</span>
                      <span>Ability to read between the lines and understand unspoken dynamics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">•</span>
                      <span>Loyalty that makes people feel secure in your presence</span>
                    </li>
                  </ul>
                </LockedSection>

                <LockedSection
                  title="Hidden Weaknesses"
                  icon={<AlertTriangle className="w-5 h-5 text-orange-400" />}
                  hintText="Blind spots holding you back"
                  previewText="Overthinking simple decisions • Fear of vulnerability in close relationships • Tendency to self-sabotage when things are going too well • Difficulty accepting compliments..."
                  variant="compact"
                  isUnlocked={hasPremiumAccess}
                >
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">•</span>
                      <span>Overthinking simple decisions until they become complicated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">•</span>
                      <span>Fear of vulnerability in close relationships—you'd rather be alone than hurt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">•</span>
                      <span>Tendency to self-sabotage when things are going too well</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">•</span>
                      <span>Difficulty accepting compliments—you deflect instead of receiving</span>
                    </li>
                  </ul>
                </LockedSection>
              </div>

              {/* Featured locked section - Aura Roast */}
              <LockedSection
                title="Aura Roast 😈"
                icon={<Laugh className="w-5 h-5 text-red-400" />}
                hintText="The unfiltered truth about your energy"
                socialProof="Only for those who can handle brutal honesty"
                previewText="You think you're mysterious, but really you're just indecisive. Your 'vibe' is less 'enigmatic' and more 'can't commit to a personality'. People don't wonder about you—they wonder if you know who you are. Your energy screams 'I'm figuring it out' but you've been figuring it out for years..."
                isUnlocked={hasPremiumAccess}
              >
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You think you're mysterious, but really you're just indecisive. Your 'vibe' is less 'enigmatic' and more 'can't commit to a personality'. People don't wonder about you—they wonder if you know who you are. Your energy screams 'I'm figuring it out' but you've been figuring it out for years. You're not deep—you're just scared to pick a lane. And that 'I don't care what people think' act? Everyone can tell you care way too much. Your aura isn't bad, it's just... confused. And honestly? That's more exhausting than impressive.
                </p>
              </LockedSection>
            </motion.div>

            {/* Shareable One-liner - Fire themed */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="glass-card p-6 sm:p-8 bg-gradient-to-br from-orange-950/40 via-red-950/40 to-pink-950/40 border-2 border-orange-500/30 relative overflow-hidden mb-8"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              />
              
              <div className="text-center relative z-10">
                <motion.p 
                  className="text-lg sm:text-xl font-semibold text-foreground mb-6 leading-relaxed break-words px-2"
                  animate={{ 
                    textShadow: [
                      "0 0 10px rgba(249,115,22,0.5)",
                      "0 0 20px rgba(249,115,22,0.8)",
                      "0 0 10px rgba(249,115,22,0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  "{result.shareable_one_liner}"
                </motion.p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg shadow-orange-500/30"
                >
                  <Share2 className="w-4 h-4" />
                  Share This Roast
                </motion.button>
              </div>
            </motion.div>

            {/* Final Unlock CTA - Fire Theme */}
            {!hasPremiumAccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="relative overflow-hidden rounded-xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-950/40 via-red-950/30 to-background p-8 sm:p-10 text-center"
              >
                {/* Animated fire glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-red-500/10 to-transparent"
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2, type: "spring" }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/30 border-2 border-orange-500/40 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Flame className="w-10 h-10 text-orange-400" />
                    </motion.div>
                  </motion.div>
                  
                  <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3">
                    Ready for the <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">full picture?</span>
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Join 12,000+ users who unlocked their complete aura analysis
                  </p>
                  
                  <motion.button
                    onClick={() => navigate(user ? '/buy-plan' : '/login?redirect=/buy-plan')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 inline-flex items-center gap-2 shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60"
                  >
                    <Zap className="w-5 h-5" />
                    Unlock All Insights
                  </motion.button>
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    No subscription • Instant access • Credits never expire
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Results;
