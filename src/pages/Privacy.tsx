import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const Privacy = () => {
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
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Legal</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Privacy <span className="gradient-text">Policy</span>
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
                Your privacy matters to us. This Privacy Policy explains how Aura Meter handles your information.
              </p>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">1. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold mb-3 text-foreground">a) Information You Provide</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>Inputs used for aura analysis (e.g., screenshots, selections)</li>
                  <li>Payment details (handled securely by Razorpay — we do not store card data)</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 text-foreground">b) Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>Basic device information</li>
                  <li>Browser type</li>
                  <li>Anonymous usage data (for performance and improvement)</li>
                </ul>

                <p className="text-muted-foreground leading-relaxed mb-2">We do not collect:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Precise location</li>
                  <li>Personal identity details unless explicitly provided</li>
                  <li>Sensitive personal data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">2. How We Use Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">We use data to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>Generate aura insights</li>
                  <li>Improve user experience</li>
                  <li>Prevent misuse</li>
                  <li>Process payments securely</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed font-semibold">
                  We do not sell your personal data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">3. Cookies & Local Storage</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Aura Meter uses cookies or local storage to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                  <li>Remember free usage limits</li>
                  <li>Improve performance</li>
                  <li>Enhance user experience</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  You can disable cookies in your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">4. Payments & Third-Party Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Payments are handled by Razorpay, which follows industry-standard security practices. We may also use analytics tools to understand general usage trends.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">5. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We take reasonable measures to protect your data. However, no online system is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">6. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Aura Meter is not designed for children under 13. We do not knowingly collect data from children.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">7. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">You may:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Request deletion of your data (if applicable)</li>
                  <li>Contact us for privacy-related questions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">8. Changes to Privacy Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this policy occasionally. Changes will be posted on this page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">9. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For privacy concerns:<br />
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

export default Privacy;
