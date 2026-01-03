import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      {/* Animated gradient orbs with parallax */}
      <motion.div 
        style={{ x: y1, y: y1 }}
        className="orb w-[700px] h-[700px] -top-48 -left-48 opacity-40 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        style={{ x: y2, y: y2 }}
        className="orb w-[600px] h-[600px] top-1/4 -right-64 opacity-30 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="orb w-[500px] h-[500px] bottom-0 left-1/3 opacity-25 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              x: [null, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 pt-32 pb-20">
        <div className="flex flex-col items-center text-center max-w-6xl mx-auto">
          {/* Enhanced badge with animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="glass-card px-5 py-2.5 mb-10 flex items-center gap-2 border border-primary/30 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-primary relative z-10" />
            </motion.div>
            <span className="text-sm font-medium text-foreground relative z-10">AI-Powered Aura Analysis</span>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-primary relative z-10" />
            </motion.div>
          </motion.div>

          {/* Main headline with better typography */}
          <motion.div
            style={{ opacity }}
            className="mb-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display font-bold tracking-tight leading-none"
            >
              <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 text-white">
                Check Your Aura.
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl relative inline-block">
                <span className="gradient-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text">
                  Handle the Truth.
                </span>
                {/* Animated underline - reduced size */}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full max-w-[90%] mx-auto"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </span>
            </motion.h1>
          </motion.div>

          {/* Enhanced subtext with better sizing */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mb-12 leading-relaxed font-normal"
          >
            Upload a screenshot. Get your{" "}
            <span className="text-purple-400 font-semibold">Aura Score</span>.{" "}
            Get <span className="text-orange-400 font-semibold">roasted</span> by AI. 🔥
          </motion.p>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            <motion.button 
              onClick={() => navigate("/upload")}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(168, 85, 247, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary-glow bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden shadow-lg shadow-purple-500/50"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <Zap className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Check My Aura</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </motion.button>
            
            <motion.button 
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.05, borderColor: "rgba(168, 85, 247, 0.8)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-primary/30 hover:border-primary/60 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-300 hover:bg-primary/10 backdrop-blur-sm"
            >
              Login
            </motion.button>
          </motion.div>

          {/* Enhanced note with icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-3 text-sm text-gray-500"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Free
            </span>
            <span className="text-gray-600">•</span>
            <span>No sign-up required</span>
            <span className="text-gray-600">•</span>
            <span>Instant results</span>
          </motion.div>
        </div>
      </div>

      {/* Gradient blend transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-primary/10 to-background pointer-events-none" />
    </section>
  );
};

export default HeroSection;
