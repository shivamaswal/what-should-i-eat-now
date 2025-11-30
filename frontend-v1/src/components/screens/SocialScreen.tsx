import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState } from "react";

interface SocialScreenProps {
  value: 'solo' | 'date' | 'group' | null;
  onChange: (value: 'solo' | 'date' | 'group') => void;
  onNext: () => void;
}

const cards = [
  { id: 'solo' as const, emoji: '🧑‍🚀', label: 'Flying Solo', description: 'Just me, myself & I' },
  { id: 'date' as const, emoji: '🦩', label: 'Date Night', description: 'Party of two' },
  { id: 'group' as const, emoji: '🎉', label: 'Squad Up', description: 'The more the merrier' },
];

const SWIPE_THRESHOLD = 100;

export const SocialScreen = ({ value, onChange, onNext }: SocialScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  
  // Show visual indicator based on swipe direction
  const rightIndicatorOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const leftIndicatorOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const goToNextCard = () => {
    // Loop back to first card after the last one (endless deck)
    setCurrentIndex((prev) => (prev + 1) % cards.length);
    setExitDirection(null);
    x.set(0);
    setIsAnimating(false);
  };

  const handleDragEnd = (_: any, info: any) => {
    if (isAnimating) return;
    
    const swipeDistance = info.offset.x;
    const swipeVelocity = info.velocity.x;
    
    // Check if swipe was strong enough
    if (Math.abs(swipeDistance) > SWIPE_THRESHOLD || Math.abs(swipeVelocity) > 500) {
      setIsAnimating(true);
      
      if (swipeDistance > 0 || swipeVelocity > 500) {
        // SWIPED RIGHT = SELECT this card
        setExitDirection('right');
        onChange(cards[currentIndex].id);
        
        // Animate card flying off to the right
        animate(x, 500, { 
          type: "tween", 
          duration: 0.3,
          onComplete: goToNextCard 
        });
      } else {
        // SWIPED LEFT = SKIP (no selection, just move to next)
        setExitDirection('left');
        
        // Animate card flying off to the left
        animate(x, -500, { 
          type: "tween", 
          duration: 0.3,
          onComplete: goToNextCard 
        });
      }
    } else {
      // Snap back to center if swipe wasn't strong enough
      animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
    }
  };

  // Get the visible cards for the deck effect (show 3 cards stacked)
  const getVisibleCards = () => {
    const visibleCards = [];
    for (let i = 0; i < 3; i++) {
      const cardIndex = (currentIndex + i) % cards.length;
      visibleCards.push({ ...cards[cardIndex], stackIndex: i });
    }
    return visibleCards.reverse(); // Reverse so top card renders last (on top)
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background overflow-hidden"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">
        Who's eating?
      </h2>
      <p className="text-base text-muted-foreground mb-2">Swipe right to select, left to skip</p>
      
      {/* Swipe direction indicators */}
      <div className="flex justify-center gap-8 mb-4 text-sm">
        <motion.span 
          className="text-red-400 font-medium"
          style={{ opacity: leftIndicatorOpacity }}
        >
          ← Skip
        </motion.span>
        <motion.span 
          className="text-green-400 font-medium"
          style={{ opacity: rightIndicatorOpacity }}
        >
          Select →
        </motion.span>
      </div>

      <div className="relative w-full max-w-xs h-72 md:h-80 mb-4">
        {getVisibleCards().map(({ id, emoji, label, description, stackIndex }) => {
          const isTopCard = stackIndex === 0;
          
          return (
            <motion.div
              key={`${id}-${currentIndex}-${stackIndex}`}
              className={`absolute inset-0 ${isTopCard ? 'cursor-grab active:cursor-grabbing' : ''}`}
              style={{
                x: isTopCard ? x : 0,
                rotate: isTopCard ? rotate : 0,
                zIndex: 3 - stackIndex,
              }}
              drag={isTopCard && !isAnimating ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={isTopCard ? handleDragEnd : undefined}
              initial={false}
              animate={{
                scale: 1 - stackIndex * 0.05,
                y: stackIndex * 15,
                opacity: stackIndex === 2 ? 0.5 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.div
                className={`w-full h-full bg-card rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-4 border-4 ${
                  isTopCard ? 'border-primary' : 'border-muted'
                }`}
                whileHover={isTopCard ? { scale: 1.02 } : {}}
                whileTap={isTopCard ? { scale: 0.98 } : {}}
              >
                <motion.div
                  className="text-7xl md:text-8xl"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    type: "tween",
                  }}
                >
                  {emoji}
                </motion.div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-card-foreground mb-1">
                    {label}
                  </h3>
                  <p className="text-base text-muted-foreground">
                    {description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {value ? (
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={value}
        >
          <p className="text-base text-muted-foreground mb-1">✓ Selected:</p>
          <p className="text-xl font-bold text-primary">
            {cards.find(c => c.id === value)?.emoji} {cards.find(c => c.id === value)?.label}
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="text-center mb-4 h-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-base text-muted-foreground">Swipe right on a card to select</p>
        </motion.div>
      )}

      <motion.button
        className="px-10 py-3 bg-primary text-primary-foreground rounded-full text-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onNext}
        disabled={!value}
        whileHover={value ? { scale: 1.05 } : {}}
        whileTap={value ? { scale: 0.95 } : {}}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {value ? 'Next →' : 'Select an option first'}
      </motion.button>
    </motion.div>
  );
};
