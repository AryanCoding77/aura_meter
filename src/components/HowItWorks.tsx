import { motion } from "framer-motion";
import { Upload, Cpu, Trophy } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload your screenshot",
    description: "Drop any screenshot or image. Your chat, your feed, anything goes.",
  },
  {
    icon: Cpu,
    number: "02",
    title: "AI analyzes your aura",
    description: "Our AI scans the vibes and calculates your aura energy levels.",
  },
  {
    icon: Trophy,
    number: "03",
    title: "Get score, roast & tips",
    description: "Receive your score, a savage roast, and actual improvement tips.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Three simple steps to discover your true aura score
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative group"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="glass-card-hover p-8 h-full">
                <div className="step-number mb-6 text-primary-foreground">
                  {step.number}
                </div>
                
                <div className="mb-4 p-3 w-fit rounded-xl bg-primary/10 text-primary">
                  <step.icon className="w-6 h-6" />
                </div>
                
                <h3 className="font-display text-xl font-semibold mb-3">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
