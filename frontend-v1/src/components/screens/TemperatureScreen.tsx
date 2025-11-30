import { motion } from "framer-motion";
import { useRef, useCallback } from "react";

interface TemperatureScreenProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
}

// Min/max percentages - slider stops at the emoji boundaries
const MIN_VALUE = 5;  // Don't go past left emoji (❄️)
const MAX_VALUE = 95; // Don't go past right emoji (🔥)

export const TemperatureScreen = ({ value, onChange, onNext }: TemperatureScreenProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  
  const bgGradient = `linear-gradient(90deg, 
    hsl(195, 100%, 50%) 0%, 
    hsl(${195 - (value * 1.95)}, ${100 - (value * 0.5)}%, ${50 + (value * 0.2)}%) 100%
  )`;

  // Calculate value from X position relative to track
  const calculateValueFromX = useCallback((clientX: number) => {
    if (!trackRef.current) return value;
    
    const rect = trackRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentage = (relativeX / rect.width) * 100;
    // Clamp between MIN and MAX to not go past emojis
    return Math.max(MIN_VALUE, Math.min(MAX_VALUE, percentage));
  }, [value]);

  const handleTrackInteraction = useCallback((clientX: number) => {
    const newValue = calculateValueFromX(clientX);
    onChange(newValue);
  }, [calculateValueFromX, onChange]);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    handleTrackInteraction(e.clientX);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        handleTrackInteraction(e.clientX);
      }
    };
    
    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleTrackInteraction]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDraggingRef.current = true;
    handleTrackInteraction(e.touches[0].clientX);
  }, [handleTrackInteraction]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDraggingRef.current) {
      handleTrackInteraction(e.touches[0].clientX);
    }
  }, [handleTrackInteraction]);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Clamp displayed value
  const clampedValue = Math.max(MIN_VALUE, Math.min(MAX_VALUE, value));

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: bgGradient }}
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    >
      {/* Frost effect for cold */}
      {value < 30 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Heat haze effect for hot */}
      {value > 70 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            type: "tween",
          }}
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.1) 2px, rgba(255, 255, 255, 0.1) 4px)",
            backgroundSize: "100% 4px",
          }}
        />
      )}

      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center drop-shadow-lg">
        Hot or Cold?
      </h2>
      <p className="text-lg text-white/90 mb-12 drop-shadow">What temperature sounds good?</p>

      <div className="relative w-full max-w-2xl mb-8">
        {/* Gradient slider track */}
        <div
          ref={trackRef}
          className="relative h-6 rounded-full shadow-inner cursor-pointer select-none"
          style={{
            background: "linear-gradient(90deg, hsl(195, 100%, 50%) 0%, hsl(14, 100%, 57%) 100%)",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            className="absolute left-0 h-full bg-white/30 rounded-full backdrop-blur-sm pointer-events-none"
            style={{ width: `${clampedValue}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          
          {/* Draggable handle - now positioned relative to track */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-20 h-20 cursor-grab active:cursor-grabbing pointer-events-none"
            style={{ left: `calc(${clampedValue}% - 40px)` }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-full h-full bg-white rounded-full shadow-2xl flex items-center justify-center text-4xl">
              {value < 50 ? "❄️" : "🔥"}
            </div>
          </motion.div>
        </div>

        {/* Left icon */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 text-5xl pointer-events-none"
          animate={value < 30 ? { rotate: [0, -10, 10, 0] } : { rotate: 0 }}
          transition={{ duration: 2, repeat: value < 30 ? Infinity : 0, type: "tween", ease: "easeInOut" }}
        >
          ❄️
        </motion.div>

        {/* Right icon */}
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-5xl pointer-events-none"
          animate={
            value > 70
              ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }
              : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 1, repeat: value > 70 ? Infinity : 0, type: "tween", ease: "easeInOut" }}
        >
          🔥
        </motion.div>
      </div>

      <motion.p
        className="text-2xl font-bold text-white drop-shadow-lg mb-12"
        key={value < 50 ? 'cold' : 'hot'}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {value < 30 ? "Ice Cold!" : value < 50 ? "Cool & Fresh" : value < 70 ? "Warm & Cozy" : "Blazing Hot!"}
      </motion.p>

      <motion.button
        className="px-12 py-4 bg-white text-foreground rounded-full text-xl font-bold shadow-2xl"
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
