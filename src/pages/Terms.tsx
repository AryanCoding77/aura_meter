import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden noise-overlay">
      {/* Simplified Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass-card !rounded-none border-x-0 border-t-0"
      >
        <div className="container py-4">
          <nav className="flex items-center justify-between">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 group"
            >
              <img 
                src="/logo.png" 
                alt="Aura Meter Logo" 
                className="w-10 h-10 rounded-xl transition-transform group-hover:scale-105"
              />
              <span className="font-display font-semibold text-lg">
                Aura Meter
              </span>
            </button>
          </nav>
        </div>
      </motion.header>

      <main className="relative pt-24 pb-16">
        {/* Background effects */}
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="orb orb-purple w-[500px] h-[500px] -top-32 -left-32 opacity-20" />
        <div className="orb orb-cyan w-[400px] h-[400px] top-1/2 -right-48 opacity-10" />

        <div className="container relative z-10">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="glass-card px-4 py-2 mb-6 flex items-center gap-2 w-fit mx-auto">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Legal</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Terms & <span className="gradient-text">Conditions</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Last updated: January 3, 2025
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-card p-8 md:p-12 space-y-8">
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Aura Meter. By accessing or using our website, you agree to the following Terms & Conditions. Please read them carefully.
              </p>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">1. Nature of the Service</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Aura Meter is an entertainment-based application that provides fun, personality-style insights based on user inputs.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>Aura results are not scientific, medical, or psychological advice</li>
                  <li>Results are generated for entertainment and self-reflection purposes only</li>
                  <li>By using this website, you acknowledge that all outputs are informational and playful in nature</li>
                </ul>
                
                <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-orange-400 flex items-center gap-2">
                    ⚠️ Content Warning
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    <strong>Use Aura Meter at your own risk.</strong> Our AI generates brutally honest, sarcastic, and sometimes personal roasts as part of the entertainment experience. The roasts are designed to be humorous but may be perceived as harsh or offensive.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    By using this service, you acknowledge and accept that:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                    <li>Roasts may contain sharp humor and direct commentary</li>
                    <li>Content is generated for entertainment, not to cause genuine harm</li>
                    <li>If you are easily offended or sensitive to criticism, this service may not be suitable for you</li>
                    <li>We are not responsible for any emotional reactions, offense, or anger resulting from the roast content</li>
                    <li>You use this service voluntarily and at your own discretion</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">2. Eligibility</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You must be at least 13 years old to use Aura Meter. If you are under 18, you should use this service with parental consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">3. Free & Paid Features</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Aura Meter offers:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>Limited free aura analyses</li>
                  <li>Optional paid credits to unlock deeper insights and premium features</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-2">Credits:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Are non-transferable</li>
                  <li>Have no cash value</li>
                  <li>Are used only within Aura Meter</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">4. Payments & Refunds</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>All payments are processed securely via Razorpay</li>
                  <li>Due to the digital and instant nature of the service, refunds are not guaranteed</li>
                  <li>If you face a genuine technical issue, you may contact support for review</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">5. User Responsibility</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">You agree:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Not to misuse the service</li>
                  <li>Not to attempt to exploit, reverse-engineer, or manipulate the system</li>
                  <li>Not to use Aura Meter for illegal or harmful purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">6. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content, design, visuals, logic, and branding related to Aura Meter are the property of Aura Meter. You may not copy, reproduce, or redistribute any part of the service without permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">7. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Aura Meter is provided "as-is". We are not liable for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Decisions made based on aura results</li>
                  <li>Emotional reactions to entertainment-based insights or roast content</li>
                  <li>Any offense, anger, or hurt feelings caused by the AI-generated roasts</li>
                  <li>Temporary service interruptions or inaccuracies</li>
                  <li>Any psychological or emotional impact from using the service</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  <strong>You acknowledge that you are using this service voluntarily and accept full responsibility for your decision to view the roast content.</strong>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">8. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update these Terms from time to time. Continued use of the website means you accept the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">9. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions or concerns:<br />
                  📧 Contact: support@aurameter.com
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
