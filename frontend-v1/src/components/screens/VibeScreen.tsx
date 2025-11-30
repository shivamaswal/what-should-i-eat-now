import { motion } from "framer-motion";

interface VibeScreenProps {
  value: 'hangover' | 'stressed' | 'lazy' | 'happy' | null;
  onChange: (value: 'hangover' | 'stressed' | 'lazy' | 'happy') => void;
  onNext: () => void;
}

const vibes = [
  { id: 'hangover' as const, emoji: '🤕', label: 'Hangover', x: 20, y: 30 },
  { id: 'stressed' as const, emoji: '😤', label: 'Stressed', x: 70, y: 20 },
  { id: 'lazy' as const, emoji: '😴', label: 'Lazy', x: 30, y: 70 },
  { id: 'happy' as const, emoji: '🤩', label: 'Happy', x: 80, y: 65 },
];

export const VibeScreen = ({ value, onChange, onNext }: VibeScreenProps) => {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-secondary/20 via-background to-primary/10"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
        What's your vibe?
      </h2>
      <p className="text-lg text-muted-foreground mb-12">Pop the bubble that fits!</p>

      <div className="relative w-full max-w-2xl h-96 mb-12">
        {vibes.map((vibe, index) => (
          <motion.button
            key={vibe.id}
            className={`absolute w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 ${
              value === vibe.id
                ? 'bg-primary text-primary-foreground shadow-2xl'
                : 'bg-card text-card-foreground shadow-xl hover:shadow-2xl'
            }`}
            style={{
              left: `${vibe.x}%`,
              top: `${vibe.y}%`,
            }}
            onClick={() => onChange(vibe.id)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: value === vibe.id ? 0 : 1,
              opacity: value === vibe.id ? 0 : 1,
            }}
            transition={{
              scale: { duration: 0.3 },
              opacity: { duration: 0.3 },
              delay: index * 0.1,
            }}
            whileHover={{ scale: 1.15, y: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-5xl">{vibe.emoji}</span>
            <span className="text-sm font-bold">{vibe.label}</span>
          </motion.button>
        ))}

        {/* Particle explosion when bubble is popped */}
        {value && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 2, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 0.6, type: "tween", ease: "easeOut" }}
          >
            <div className="text-6xl">💥</div>
          </motion.div>
        )}
      </div>

      {value && (
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <p className="text-3xl font-bold text-primary">
            {vibes.find(v => v.id === value)?.emoji} POP!
          </p>
        </motion.div>
      )}

      <motion.button
        className="px-12 py-4 bg-primary text-primary-foreground rounded-full text-xl font-bold shadow-lg disabled:opacity-50"
        onClick={onNext}
        disabled={!value}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Get My Food! →
      </motion.button>
    </motion.div>
  );
};
