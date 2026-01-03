import { motion } from "framer-motion";
import { Gauge, Flame, Brain, Target, History, Share2, Zap, AlertTriangle } from "lucide-react";

const features = [
  {
    icon: Gauge,
    title: "Aura Score (-50 to +50)",
    description: "Centered scoring system. Negative = bad aura, Zero = forgettable, Positive = rare and earned.",
    color: "text-purple-400",
  },
  {
    icon: Flame,
    title: "Savage AI Roast",
    description: "No holding back. Get absolutely violated by AI. The roast adapts to your score intensity.",
    color: "text-orange-400",
  },
  {
    icon: Brain,
    title: "Personality Insights",
    description: "Deep analysis of your traits, energy patterns, and behavioral vibes from your image.",
    color: "text-cyan-400",
  },
  {
    icon: Target,
    title: "Strengths & Weaknesses",
    description: "Honest breakdown of what works and what doesn't. Reality check included.",
    color: "text-green-400",
  },
  {
    icon: Zap,
    title: "Improvement Tips",
    description: "Actual useful advice to level up your aura game. Free generic tips + paid personalized insights.",
    color: "text-yellow-400",
  },
  {
    icon: Share2,
    title: "Shareable Results",
    description: "Unique shareable links with your score and one-liner. Flex on Instagram, let friends judge you.",
    color: "text-pink-400",
  },
  {
    icon: History,
    title: "Result History",
    description: "Track your aura evolution over time. See how you've grown (or fallen). Premium feature.",
    color: "text-blue-400",
  },
  {
    icon: AlertTriangle,
    title: "Premium Locked Insights",
    description: "Love Aura, Social Presence, Hidden Strengths/Weaknesses, Aura Roast 😈. Unlock with credits.",
    color: "text-red-400",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent" />
      <div className="orb orb-cyan w-[500px] h-[500px] top-0 left-0 opacity-20" />
      <div className="orb orb-purple w-[400px] h-[400px] bottom-0 right-0 opacity-20" style={{ animationDelay: '-5s' }} />
      
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-6"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">Features</span>
          </motion.div>
          
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            What you <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">get</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to understand (and roast) your aura. AI-powered analysis that actually makes sense.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card p-6 group relative overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300"
            >
              {/* Gradient glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`mb-4 p-3 w-fit rounded-xl bg-card/50 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                
                {/* Title */}
                <h3 className="font-display text-base font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground text-sm">
            Free analysis includes: Score, Roast, Basic Insights, 2 Strengths, Generic Tip
          </p>
          <p className="text-primary text-sm mt-1">
            Premium unlocks: Full Insights, Personalized Tips, History, Love/Social Aura, Hidden Strengths/Weaknesses
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
