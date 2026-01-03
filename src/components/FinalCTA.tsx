import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="orb orb-purple w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
      <div className="orb orb-cyan w-[400px] h-[400px] top-0 right-0 opacity-20" style={{ animationDelay: '-7s' }} />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-12 md:p-16 text-center max-w-4xl mx-auto relative overflow-hidden"
        >
          {/* Animated border */}
          <div className="absolute inset-0 gradient-border opacity-50" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Ready to discover
                <span className="block mt-2 glow-text text-primary">what your aura is hiding?</span>
              </h2>
              
              <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
                Most people can't handle the truth. But you're different... right?
              </p>
              
              <motion.button
                onClick={() => navigate("/upload")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 py-5 rounded-xl text-lg transition-all duration-300 flex items-center gap-3 mx-auto group"
              >
                <Zap className="w-5 h-5" />
                Check My Aura Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <p className="text-muted-foreground text-sm mt-4">
                Free scan • No signup required • Instant results
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
