import { motion } from "framer-motion";

interface LandingScreenProps {
  onStart: () => void;
}

export const LandingScreen = ({ onStart }: LandingScreenProps) => {
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center px-4">
        <motion.h1
          className="text-5xl md:text-7xl font-black text-foreground mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          What Should I
          <br />
          <span className="text-primary">Eat Now?</span>
        </motion.h1>
        
        <motion.p
          className="text-lg md:text-xl text-muted-foreground mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Let's end your decision fatigue 🎮
        </motion.p>

        <motion.button
          className="group relative px-12 py-5 text-2xl md:text-3xl font-bold text-primary-foreground bg-primary rounded-full shadow-2xl overflow-hidden"
          onClick={onStart}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="relative z-10 block"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              type: "tween",
            }}
          >
            FEED ME
          </motion.span>
        </motion.button>

        <motion.div
          className="mt-8 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          No typing. Just taps, swipes, and slides.
        </motion.div>
      </div>
    </motion.div>
  );
};
