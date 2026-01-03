import { motion } from "framer-motion";
import { Info } from "lucide-react";

const Disclaimer = () => {
  return (
    <section className="relative py-12">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 max-w-3xl mx-auto flex items-start gap-4"
        >
          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-muted-foreground text-sm">
            <span className="text-foreground font-medium">Disclaimer:</span> This is an AI-generated entertainment tool. 
            Results are for fun and self-improvement only. Not intended for medical, psychological, or spiritual diagnosis.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Disclaimer;
