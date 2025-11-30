import { motion } from "framer-motion";

interface SpiceScreenProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
}

export const SpiceScreen = ({ value, onChange, onNext }: SpiceScreenProps) => {
  const getEmoji = () => {
    if (value === 0) return "🍼";
    if (value <= 2) return "😊";
    if (value <= 3) return "🌶️";
    if (value <= 4) return "🔥";
    return "🐉";
  };

  const getLabel = () => {
    if (value === 0) return "No Spice Please";
    if (value <= 2) return "Mild";
    if (value <= 3) return "Medium Heat";
    if (value <= 4) return "Spicy!";
    return "DRAGON FIRE!";
  };

  const rotation = (value / 5) * 270 - 135;

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background overflow-hidden"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">
        How spicy?
      </h2>
      <p className="text-base text-muted-foreground mb-6">Turn the heat dial!</p>

      <div className="relative w-56 h-56 md:w-64 md:h-64 mb-6">
        {/* Speedometer background */}
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(142, 71%, 45%)" />
              <stop offset="50%" stopColor="hsl(45, 100%, 50%)" />
              <stop offset="100%" stopColor="hsl(0, 79%, 46%)" />
            </linearGradient>
          </defs>
          
          {/* Gauge arc */}
          <path
            d="M 30 170 A 80 80 0 1 1 170 170"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          
          {/* Gauge background */}
          <path
            d="M 30 170 A 80 80 0 1 1 170 170"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="20"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>

        {/* Center emoji display */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-6xl"
          key={getEmoji()}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {getEmoji()}
        </motion.div>

        {/* Needle */}
        <motion.div
          className="absolute top-1/2 left-1/2 origin-bottom"
          style={{
            width: "3px",
            height: "55px",
            marginLeft: "-1.5px",
            marginTop: "-55px",
          }}
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <motion.div
            className="w-full h-full bg-primary rounded-full"
            animate={value === 5 ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={{ duration: 0.3, repeat: value === 5 ? Infinity : 0, type: "tween", ease: "easeInOut" }}
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background" />
        </motion.div>

        {/* Dragon fire effect at max */}
        {value === 5 && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1, repeat: Infinity, type: "tween", ease: "easeInOut" }}
          >
            🔥
          </motion.div>
        )}
      </div>

      {/* Level selector */}
      <div className="flex gap-2 mb-4">
        {[0, 1, 2, 3, 4, 5].map((level) => (
          <motion.button
            key={level}
            className={`w-10 h-10 rounded-full font-bold text-base transition-all ${
              value === level
                ? "bg-primary text-primary-foreground shadow-xl"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            onClick={() => onChange(level)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {level}
          </motion.button>
        ))}
      </div>

      <motion.p
        className="text-xl font-bold text-primary mb-6"
        key={getLabel()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {getLabel()}
      </motion.p>

      <motion.button
        className="px-10 py-3 bg-primary text-primary-foreground rounded-full text-lg font-bold shadow-lg"
        onClick={onNext}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Next →
      </motion.button>
    </motion.div>
  );
};
