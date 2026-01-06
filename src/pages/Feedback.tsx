import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, Sparkles, CheckCircle, MessageCircle, Heart, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

export default function Feedback() {
  const { user, profile } = useAuth();
  const location = useLocation();
  
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setCharCount(message.length);
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('Please share your thoughts with us');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current page name from location
      const pageName = location.pathname.replace('/', '') || 'home';

      const { error } = await supabase
        .from('feedback')
        .insert({
          message: message.trim(),
          rating: rating,
          page: pageName,
          user_id: user?.id || null,
          is_paid_user: profile ? (profile.credits_remaining > 0 || profile.plan !== 'free') : false,
        });

      if (error) throw error;

      // Success!
      setShowSuccess(true);
      setMessage('');
      setRating(null);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

    } catch (error: any) {
      console.error('Feedback submission error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = ['Poor', 'Fair', 'Good', 'Great', 'Amazing'];
  const ratingEmojis = ['😞', '😕', '😊', '😄', '🤩'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#12121A] to-[#1A1A2E] relative overflow-hidden">
      {/* Enhanced Background orbs with more movement */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-2xl mx-auto">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6 backdrop-blur-sm"
            >
              <MessageCircle className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">We're Listening</span>
              <Sparkles className="w-4 h-4 text-pink-400" />
            </motion.div>

            <motion.h1 
              className="font-display text-4xl lg:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              💬 Help Us Improve{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Aura Meter
              </span>
            </motion.h1>
            <motion.p 
              className="text-[#9CA3AF] text-lg lg:text-xl max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your thoughts help us make this experience better for everyone.
            </motion.p>
          </motion.div>

          {/* Enhanced Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 relative overflow-hidden"
              >
                {/* Success glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-emerald-400/5 animate-pulse" />
                
                <div className="relative flex items-start gap-4">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center flex-shrink-0"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <CheckCircle className="w-7 h-7 text-green-400" />
                  </motion.div>
                  <div className="flex-1">
                    <motion.p 
                      className="text-green-400 font-bold text-lg mb-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Thanks for sharing! 🎉
                    </motion.p>
                    <motion.p 
                      className="text-[#9CA3AF]"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Your feedback really helps us improve ✨
                    </motion.p>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Feedback Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="bg-[#12121A]/80 backdrop-blur-xl border-2 border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden"
          >
            {/* Form glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />
            
            <div className="relative">
              {/* Enhanced Rating Section */}
              <div className="mb-10">
                <label className="block text-base font-semibold text-white mb-5 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  How was your experience?
                </label>
                <div className="flex flex-col items-center gap-6">
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(null)}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="focus:outline-none relative group"
                      >
                        {/* Star glow effect */}
                        {(hoveredRating !== null ? star <= hoveredRating : star <= (rating || 0)) && (
                          <motion.div
                            layoutId="star-glow"
                            className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.5 }}
                          />
                        )}
                        <Star
                          className={`w-12 h-12 transition-all relative z-10 ${
                            (hoveredRating !== null ? star <= hoveredRating : star <= (rating || 0))
                              ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                              : 'text-[#9CA3AF] group-hover:text-yellow-400/50'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Rating label with emoji */}
                  <AnimatePresence mode="wait">
                    {(rating || hoveredRating) && (
                      <motion.div
                        key={rating || hoveredRating}
                        initial={{ opacity: 0, y: -10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/30"
                      >
                        <span className="text-2xl">{ratingEmojis[(rating || hoveredRating)! - 1]}</span>
                        <span className="text-yellow-400 font-semibold">
                          {ratingLabels[(rating || hoveredRating)! - 1]}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Enhanced Message Input */}
              <div className="mb-10">
                <label className="block text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-purple-400" />
                  Your thoughts <span className="text-red-400 ml-1">*</span>
                </label>
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Tell us what you liked, what felt confusing, or what we can improve…"
                    rows={7}
                    required
                    className={`w-full px-5 py-4 bg-[#0A0A0F]/70 border-2 rounded-2xl text-white placeholder:text-[#9CA3AF]/50 focus:outline-none transition-all resize-none ${
                      isFocused
                        ? 'border-purple-500/50 ring-4 ring-purple-500/10 shadow-lg shadow-purple-500/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  />
                  
                  {/* Character counter with progress */}
                  <div className="flex items-center justify-between mt-3 px-1">
                    <motion.p 
                      className="text-sm text-[#9CA3AF] flex items-center gap-2"
                      animate={{ opacity: charCount > 0 ? 1 : 0.5 }}
                    >
                      {charCount > 0 ? (
                        <>
                          <span className="text-purple-400 font-semibold">{charCount}</span> characters
                        </>
                      ) : (
                        <>Be honest, we can take it 😊</>
                      )}
                    </motion.p>
                    
                    {/* Progress indicator */}
                    {charCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex gap-1"
                      >
                        {[50, 100, 200].map((threshold) => (
                          <div
                            key={threshold}
                            className={`w-2 h-2 rounded-full transition-all ${
                              charCount >= threshold
                                ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                                : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              whileHover={!isSubmitting && message.trim() ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isSubmitting && message.trim() ? { scale: 0.98 } : {}}
              className={`
                w-full py-5 rounded-2xl font-bold text-lg transition-all relative overflow-hidden group
                ${isSubmitting || !message.trim()
                  ? 'bg-white/5 text-[#9CA3AF] cursor-not-allowed border-2 border-white/10'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white shadow-2xl shadow-purple-500/30 border-2 border-purple-400/50'
                }
              `}
            >
              {/* Animated gradient overlay */}
              {!isSubmitting && message.trim() && (
                <>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 opacity-0 group-hover:opacity-30 transition-opacity"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>
                </>
              )}
              
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <>
                    <motion.div 
                      className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Sending your thoughts...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span>Share My Thoughts</span>
                    <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </span>
            </motion.button>
          </motion.form>

          {/* Enhanced Footer Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[#9CA3AF]">No account needed</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-[#9CA3AF]">Anonymous welcome</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-[#9CA3AF]">We read everything</span>
              </div>
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-[#9CA3AF]/70 text-xs"
            >
              Your feedback shapes the future of Aura Meter ✨
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
