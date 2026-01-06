import { motion } from "framer-motion";
import { Check, Zap, Crown, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { getUserPricing, type PricingConfig } from "@/lib/geolocation";

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserPricing()
      .then(setPricing)
      .finally(() => setLoading(false));
  }, []);

  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Dip your toes in",
      features: [
        "Limited analysis",
        "Basic aura score",
        "No history saved",
      ],
      cta: "Default",
      popular: false,
      icon: Star,
    },
    {
      name: "Basic",
      price: pricing?.prices.basic.toString() || "50",
      description: "Get a real taste",
      features: [
        "5 screenshot analyses",
        "Better AI roast",
        "Faster results",
      ],
      cta: "Get Basic",
      popular: false,
      icon: Zap,
    },
    {
      name: "Best",
      price: pricing?.prices.best.toString() || "100",
      description: "Most popular choice",
      features: [
        "12 screenshot analyses",
        "History of all results",
        "Stronger roast + tips",
      ],
      cta: "Get Best",
      popular: true,
      icon: Crown,
    },
    {
      name: "VIP",
      price: pricing?.prices.vip.toString() || "150",
      description: "For the serious ones",
      features: [
        "25 screenshot analyses",
        "Detailed roast + deep tips",
        "All Best plan features",
        "Priority processing",
      ],
      cta: "Go VIP",
      popular: false,
      icon: Crown,
    },
  ];

  const currencySymbol = pricing?.symbol || "₹";

  const handlePlanClick = (planName: string) => {
    if (planName === "Free") return;

    // Check if user is logged in
    if (!user) {
      toast.info('Please login to purchase credits');
      // Redirect to login with return URL
      navigate('/login?redirect=/buy-plan');
      return;
    }

    // User is logged in, redirect to buy-plan page
    navigate('/buy-plan');
  };

  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      <div className="orb orb-purple w-[500px] h-[500px] -bottom-48 -right-48 opacity-20" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Unlock your <span className="gradient-text">full aura</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            One-time credits. No subscriptions. Unlock deeper insights anytime.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className={`h-full ${plan.popular ? 'price-card-popular' : ''}`}>
                <div className={`glass-card-hover p-6 h-full flex flex-col ${plan.popular ? 'border-primary/50' : ''}`}>
                  <div className="mb-6">
                    <div className={`p-2 w-fit rounded-lg mb-4 ${plan.popular ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <plan.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <span className="font-display text-4xl font-bold">
                      {loading ? "..." : `${currencySymbol}${plan.price}`}
                    </span>
                    {plan.price !== "0" && (
                      <span className="text-muted-foreground text-sm ml-1">one-time</span>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handlePlanClick(plan.name)}
                    disabled={plan.name === "Free"}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      plan.name === "Free"
                        ? 'bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60'
                        : plan.popular
                        ? 'btn-primary-glow bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-muted-foreground text-sm mt-8"
        >
          No subscription • Use credits anytime • Instant access
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-primary text-sm mt-2"
        >
          12,000+ users unlocked their aura today
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
