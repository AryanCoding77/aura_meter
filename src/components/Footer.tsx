import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative py-12 border-t border-border/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Aura Meter Logo" 
              className="w-8 h-8 rounded-lg"
            />
            <span className="font-display font-semibold">Aura Meter</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/feedback" className="hover:text-foreground transition-colors">Feedback</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <a href="mailto:support@aurameter.com" className="hover:text-foreground transition-colors">Contact</a>
          </nav>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground">
            Built for fun. Powered by AI.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
