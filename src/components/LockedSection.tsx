import { motion } from "framer-motion";
import { Lock, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface LockedSectionProps {
  title: string;
  icon?: React.ReactNode;
  hintText?: string;
  socialProof?: string;
  previewText?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "compact";
  isUnlocked?: boolean;
}

const LockedSection = ({
  title,
  icon,
  hintText = "Most users unlock this",
  socialProof,
  previewText,
  children,
  className = "",
  variant = "default",
  isUnlocked = false,
}: LockedSectionProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleUnlock = () => {
    if (!user) {
      navigate('/login?redirect=/buy-plan');
    } else {
      navigate('/buy-plan');
    }
  };

  // If unlocked, show full content
  if (isUnlocked) {
    if (variant === "compact") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-xl border-2 border-green-500/30 bg-gradient-to-br from-green-950/20 via-emerald-950/10 to-background p-5 ${className}`}
        >
          {/* Unlocked indicator */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-500/20 border border-green-500/40">
            <Sparkles className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs font-bold text-green-400">Unlocked</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            {icon}
            <h4 className="font-semibold text-sm">{title}</h4>
          </div>
          
          {children || (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {previewText}
            </p>
          )}
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-xl border-2 border-green-500/30 bg-gradient-to-br from-green-950/20 via-emerald-950/10 to-background p-6 sm:p-8 ${className}`}
      >
        {/* Unlocked indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/40">
          <Sparkles className="w-4 h-4 text-green-400" />
          <span className="text-sm font-bold text-green-400">Unlocked</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h3 className="font-display text-lg sm:text-xl font-semibold">
            {title}
          </h3>
        </div>

        {children || (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {previewText}
          </p>
        )}
      </motion.div>
    );
  }

  // Locked state
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, borderColor: "rgba(249, 115, 22, 0.5)" }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden rounded-xl border-2 border-orange-500/20 bg-gradient-to-br from-orange-950/30 via-red-950/20 to-background group cursor-pointer ${className}`}
        onClick={handleUnlock}
      >
        {/* Animated glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Lock overlay with blur */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-background/40 z-10" />
        
        {/* Lock icon badge */}
        <motion.div
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-500/20 border border-orange-500/40 backdrop-blur-sm"
          animate={{
            boxShadow: [
              "0 0 10px rgba(249, 115, 22, 0.3)",
              "0 0 20px rgba(249, 115, 22, 0.5)",
              "0 0 10px rgba(249, 115, 22, 0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Lock className="w-3.5 h-3.5 text-orange-400" />
        </motion.div>

        <div className="relative z-0 p-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            {icon}
            <h4 className="font-semibold text-sm text-foreground/80">{title}</h4>
          </div>
          
          {/* Preview text with gradient fade */}
          {previewText && (
            <div className="relative mb-3">
              <p className="text-xs text-muted-foreground/60 line-clamp-2 leading-relaxed">
                {previewText}
              </p>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
            </div>
          )}
          
          {/* Hint */}
          <p className="text-xs text-orange-400/80 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {hintText}
          </p>
        </div>

        {/* Unlock button overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-background via-background/95 to-transparent">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUnlock();
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50"
          >
            <Zap className="w-3.5 h-3.5" />
            Unlock Now
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, borderColor: "rgba(249, 115, 22, 0.6)" }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-950/40 via-red-950/30 to-background group cursor-pointer ${className}`}
      onClick={handleUnlock}
    >
      {/* Animated fire glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-red-500/10 to-transparent"
        animate={{
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Lock overlay with subtle blur */}
      <div className="absolute inset-0 backdrop-blur-[3px] bg-background/50 z-10" />

      {/* Prominent lock badge */}
      <motion.div
        className="absolute top-4 right-4 z-20 p-3 rounded-xl bg-orange-500/20 border-2 border-orange-500/50 backdrop-blur-md"
        animate={{
          boxShadow: [
            "0 0 15px rgba(249, 115, 22, 0.4)",
            "0 0 30px rgba(249, 115, 22, 0.6)",
            "0 0 15px rgba(249, 115, 22, 0.4)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Lock className="w-5 h-5 text-orange-400" />
      </motion.div>

      {/* Content area */}
      <div className="relative z-0 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <div>
            <h3 className="font-display text-lg sm:text-xl font-semibold mb-1 text-foreground/80">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground/60">{hintText}</p>
          </div>
        </div>

        {/* Preview content with gradient fade */}
        {previewText && (
          <div className="relative mb-4">
            <p className="text-sm text-muted-foreground/60 leading-relaxed">
              {previewText}
            </p>
            {/* Strong gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
          </div>
        )}

        {/* Social proof */}
        {socialProof && (
          <div className="flex items-center gap-2 mb-4 text-xs text-orange-400/80">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{socialProof}</span>
          </div>
        )}
      </div>

      {/* CTA Button at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-background via-background/98 to-transparent">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            handleUnlock();
          }}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/40 group-hover:shadow-orange-500/60"
        >
          <Zap className="w-5 h-5" />
          Unlock This Insight
        </motion.button>
        
        <p className="text-xs text-center text-muted-foreground/60 mt-3">
          No subscription • Instant access
        </p>
      </div>
    </motion.div>
  );
};

export default LockedSection;
