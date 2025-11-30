import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const progress = (current / total) * 100;
  
  return (
    <div className="fixed top-0 left-0 right-0 h-2 bg-muted z-50">
      <motion.div
        className="h-full bg-primary relative overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Pac-man eating effect */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4">
          <motion.div
            className="w-4 h-4 bg-secondary rounded-full relative"
            animate={{
              clipPath: [
                "polygon(100% 50%, 50% 0, 0 0, 0 100%, 50% 100%)",
                "polygon(100% 50%, 50% 30%, 0 0, 0 100%, 50% 70%)",
                "polygon(100% 50%, 50% 0, 0 0, 0 100%, 50% 100%)",
              ],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};
