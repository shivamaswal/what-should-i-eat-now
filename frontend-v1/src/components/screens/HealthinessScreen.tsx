import { motion } from "framer-motion";
import { useRef, useCallback } from "react";

interface HealthinessScreenProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
}

// Min/max percentages - slider stops at the emoji boundaries
const MIN_VALUE = 5;  // Don't go past left emoji
const MAX_VALUE = 95; // Don't go past right emoji

export const HealthinessScreen = ({ value, onChange, onNext }: HealthinessScreenProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  
  const bgColor = value < 50 
    ? `linear-gradient(135deg, hsl(142, 71%, ${45 + (50 - value) * 0.3}%), hsl(142, 71%, ${60 + (50 - value) * 0.2}%))`
    : `linear-gradient(135deg, hsl(0, 79%, ${70 + (value - 50) * 0.3}%), hsl(14, 100%, ${57 + (value - 50) * 0.2}%))`;

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
      className="min-h-screen flex flex-col items-center justify-center px-4 transition-all duration-700"
      style={{ background: bgColor }}
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center drop-shadow-lg">
        Healthy or Naughty?
      </h2>
      <p className="text-lg text-white/90 mb-12 drop-shadow">Drag the rope!</p>

      <div className="relative w-full max-w-2xl mb-8">
        {/* Slider track with rope texture */}
        <div 
          ref={trackRef}
          className="relative h-4 bg-foreground/20 rounded-full backdrop-blur-sm cursor-pointer select-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            className="absolute left-0 h-full bg-white/50 rounded-full pointer-events-none"
            style={{ width: `${clampedValue}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          
          {/* Draggable knot - now positioned relative to track */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-16 h-16 cursor-grab active:cursor-grabbing pointer-events-none"
            style={{ left: `calc(${clampedValue}% - 32px)` }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-full h-full bg-foreground rounded-full shadow-2xl border-4 border-white" />
          </motion.div>
        </div>

        {/* Left anchor - Avocado with halo */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 text-6xl pointer-events-none"
          animate={
            value < 30
              ? { y: [-5, -15, -5], rotate: [0, -10, 10, 0] }
              : { y: 0, rotate: 0 }
          }
          transition={{ duration: 1, repeat: value < 30 ? Infinity : 0, type: "tween", ease: "easeInOut" }}
        >
          🥑😇
        </motion.div>

        {/* Right anchor - Pizza with devil horns */}
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 text-6xl pointer-events-none"
          animate={
            value > 70
              ? {
                  y: [-5, -15, -5],
                  rotate: [0, 10, -10, 0],
                }
              : { y: 0, rotate: 0 }
          }
          transition={{ duration: 1, repeat: value > 70 ? Infinity : 0, type: "tween", ease: "easeInOut" }}
        >
          🍕😈
        </motion.div>
      </div>

      <motion.p
        className="text-2xl font-bold text-white drop-shadow-lg mb-12"
        key={value < 50 ? 'healthy' : 'naughty'}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {value < 30 ? "Super Healthy!" : value < 50 ? "Pretty Healthy" : value < 70 ? "A Little Naughty" : "Full Naughty Mode!"}
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
