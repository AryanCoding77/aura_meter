import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, Loader2, Sparkles, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface CreditPack {
  id: 'starter' | 'popular' | 'pro';
  name: string;
  price: number;
  credits: number;
  pricePerCredit: number;
  features: string[];
  popular?: boolean;
  savings?: string;
}

const creditPacks: CreditPack[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    price: 50,
    credits: 5,
    pricePerCredit: 10,
    features: [
      '5 screenshot analyses',
      'AI-powered insights',
      'Instant results',
      'Share your results',
    ],
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    price: 100,
    credits: 12,
    pricePerCredit: 8.33,
    features: [
      '12 screenshot analyses',
      'Better value per credit',
      'Full analysis history',
      'Priority support',
    ],
    popular: true,
    savings: 'Save 17%',
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    price: 150,
    credits: 25,
    pricePerCredit: 6,
    features: [
      '25 screenshot analyses',
      'Best value per credit',
      'Detailed insights',
      'Priority processing',
    ],
    savings: 'Save 40%',
  },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BuyPlan() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [purchasedCredits, setPurchasedCredits] = useState(0);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePurchase = async (pack: CreditPack) => {
    if (!profile) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (!scriptLoaded) {
      toast.error('Payment system loading. Please try again.');
      return;
    }

    setLoading(pack.id);

    try {
      // Get current session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      // Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: {
            user_id: profile.id,
            plan_type: pack.id,
            amount: pack.price * 100, // Convert to paise
          },
        }
      );

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw orderError;
      }

      if (!orderData) {
        throw new Error('No order data received');
      }

      const { order_id, key_id } = orderData;

      // Initialize Razorpay
      const options = {
        key: key_id,
        amount: pack.price * 100,
        currency: 'INR',
        name: 'Aura Meter',
        description: `${pack.credits} Credits - ${pack.name}`,
        order_id: order_id,
        prefill: {
          email: profile.email,
          name: profile.full_name || '',
        },
        theme: {
          color: '#9333ea',
        },
        handler: async function (response: any) {
          try {
            // Get session again for verification
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
              toast.error('Session expired. Please login again.');
              return;
            }

            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              'verify-razorpay-payment',
              {
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                },
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  user_id: profile.id,
                  plan_type: pack.id,
                },
              }
            );

            if (verifyError) {
              console.error('Verification error:', verifyError);
              throw verifyError;
            }

            toast.success(`${pack.credits} credits added to your account!`);
            await refreshProfile();
            
            // Show success screen
            setPurchasedCredits(pack.credits);
            setShowSuccess(true);
          } catch (error: any) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Contact support.');
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(null);
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Try again.');
      setLoading(null);
    }
  };



  return (
    <DashboardLayout>
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowSuccess(false);
              navigate('/dashboard');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#12121A] border-2 border-green-500/50 rounded-2xl p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => {
                  setShowSuccess(false);
                  navigate('/dashboard');
                }}
                className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </motion.div>
              </div>

              {/* Success Message */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-6"
              >
                <h2 className="text-2xl font-bold mb-2 text-green-400">
                  Payment Successful!
                </h2>
                <p className="text-[#9CA3AF] mb-4">
                  Your credits have been added to your account
                </p>
                
                {/* Credits Added */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-400" />
                    <span className="text-3xl font-bold text-green-400">
                      +{purchasedCredits}
                    </span>
                    <span className="text-lg text-[#9CA3AF]">credits</span>
                  </div>
                </div>

                {/* New Balance */}
                <p className="text-sm text-[#9CA3AF]">
                  New balance: <span className="text-white font-semibold">{profile?.credits_remaining || 0} credits</span>
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <button
                  onClick={() => navigate('/analyze')}
                  className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all"
                >
                  Start Analyzing
                </button>
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    navigate('/dashboard');
                  }}
                  className="w-full py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  Go to Dashboard
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-white/10 p-8 lg:p-12">
            {/* Animated background orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-400">Buy Credits</span>
              </motion.div>

              <h1 className="font-display text-4xl lg:text-6xl font-bold mb-4">
                Unlock Your <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">Full Aura</span>
              </h1>
              <p className="text-[#9CA3AF] text-lg lg:text-xl max-w-2xl mx-auto mb-6">
                See what your aura is hiding. No subscription • Use credits anytime.
              </p>
              
              {/* Current Balance */}
              {profile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-[#9CA3AF]">Current Balance:</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-400">{profile.credits_remaining}</span>
                  <span className="text-sm text-[#9CA3AF]">credits</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Credit Packs Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {creditPacks.map((pack, index) => {
            const isLoading = loading === pack.id;

            return (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-2xl blur-xl transition-all ${
                  pack.popular 
                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 group-hover:from-purple-500/40 group-hover:to-pink-500/40' 
                    : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20'
                }`} />
                
                {/* Card */}
                <div
                  className={`
                    relative bg-[#12121A] rounded-2xl p-8 border-2 transition-all
                    ${pack.popular 
                      ? 'border-purple-500/50 shadow-lg shadow-purple-500/20 scale-105' 
                      : 'border-white/10 hover:border-white/20'
                    }
                  `}
                >
                  {/* Popular Badge */}
                  {pack.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold shadow-lg">
                        <Sparkles className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Savings Badge */}
                  {pack.savings && (
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold">
                        {pack.savings}
                      </div>
                    </div>
                  )}

                  {/* Pack Header */}
                  <div className="mb-6 text-center">
                    <h3 className="text-2xl font-bold mb-4">{pack.name}</h3>
                    
                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          ₹{pack.price}
                        </span>
                      </div>
                      <p className="text-sm text-[#9CA3AF]">one-time payment</p>
                    </div>

                    {/* Credits Badge */}
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      <span className="text-3xl font-bold text-yellow-400">{pack.credits}</span>
                      <span className="text-sm text-[#9CA3AF]">credits</span>
                    </div>
                    
                    <p className="text-xs text-[#9CA3AF] mt-2">₹{pack.pricePerCredit.toFixed(2)} per credit</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {pack.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-purple-400" />
                        </div>
                        <span className="text-sm text-[#9CA3AF]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePurchase(pack)}
                    disabled={isLoading}
                    className={`
                      w-full py-4 rounded-xl font-semibold transition-all relative overflow-hidden group/btn
                      ${pack.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                      }
                      ${isLoading ? 'opacity-50 cursor-wait' : ''}
                    `}
                  >
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                    
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : pack.popular ? (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Unlock My Full Aura
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Get {pack.credits} Credits
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-[#9CA3AF] text-sm">
            No subscriptions. Credits never expire.
          </p>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid md:grid-cols-2 gap-6"
        >
          <div className="bg-[#12121A] border border-white/10 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Instant Activation</h3>
                <p className="text-sm text-[#9CA3AF]">
                  Credits are added to your account immediately after payment. Start analyzing right away.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#12121A] border border-white/10 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Crown className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Lifetime Access</h3>
                <p className="text-sm text-[#9CA3AF]">
                  Your credits never expire. Use them whenever you want, no time pressure.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
