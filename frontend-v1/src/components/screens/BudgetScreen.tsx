import { motion } from "framer-motion";

interface BudgetScreenProps {
  value: 'broke' | 'moderate' | 'balling';
  onChange: (value: 'broke' | 'moderate' | 'balling') => void;
  onNext: () => void;
}

export const BudgetScreen = ({ value, onChange, onNext }: BudgetScreenProps) => {
  const options = [
    { id: 'broke' as const, emoji: '💸', label: 'Broke', description: 'Budget eats' },
    { id: 'moderate' as const, emoji: '💳', label: 'Moderate', description: 'Fair price' },
    { id: 'balling' as const, emoji: '👑', label: 'Balling', description: 'Sky\'s the limit' },
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-background"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
        What's the budget?
      </h2>
      <p className="text-lg text-muted-foreground mb-12">Pick your price range</p>

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        {options.map((option) => (
          <motion.button
            key={option.id}
            className={`relative w-48 h-64 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all ${
              value === option.id
                ? 'bg-primary text-primary-foreground shadow-2xl'
                : 'bg-card text-card-foreground shadow-lg hover:shadow-xl'
            }`}
            onClick={() => onChange(option.id)}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            animate={
              value === option.id
                ? { y: -5, scale: 1.02 }
                : { y: 0, scale: 1 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="text-7xl"
              animate={
                value === option.id
                  ? { scale: 1.2, rotate: 5 }
                  : { scale: 1, rotate: 0 }
              }
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {option.emoji}
            </motion.div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{option.label}</div>
              <div className="text-sm opacity-80">{option.description}</div>
            </div>
            
            {value === option.id && (
              <motion.div
                className="absolute inset-0 rounded-3xl border-4 border-secondary"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            )}
          </motion.button>
        ))}
      </div>

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
        Next →
      </motion.button>
    </motion.div>
  );
};
