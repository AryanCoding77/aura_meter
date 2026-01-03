import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  percentage: number;
  label?: string;
}

const ProgressIndicator = ({ percentage, label = "Progress" }: ProgressIndicatorProps) => {
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-secondary"
        />
      </div>
      
      {/* Label */}
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="text-primary font-semibold">{percentage}%</span>
      </div>
    </div>
  );
};

export default ProgressIndicator;
