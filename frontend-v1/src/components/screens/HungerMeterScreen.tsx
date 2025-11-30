import { motion } from "framer-motion";
import { useRef, useCallback } from "react";

interface HungerMeterScreenProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
}

const TRACK_HEIGHT = 320; // Height of the slider track in pixels
const HANDLE_SIZE = 80; // Size of the handle in pixels

export const HungerMeterScreen = ({ value, onChange, onNext }: HungerMeterScreenProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const getEmoji = () => {
    if (value < 33) return "🐦";
    if (value < 66) return "😋";
    return "🦖";
  };

  const getLabel = () => {
    if (value < 33) return "Just Peckish";
    if (value < 66) return "Pretty Hungry";
    return "STARVING!";
  };

  // Calculate value from Y position relative to track
  const calculateValueFromY = useCallback((clientY: number) => {
    if (!trackRef.current) return value;
    
    const rect = trackRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    // Invert because 0% is at bottom, 100% is at top
    const percentage = 100 - (relativeY / rect.height) * 100;
    return Math.max(0, Math.min(100, percentage));
  }, [value]);

  // Handle mouse/touch events on the track
  const handleTrackInteraction = useCallback((clientY: number) => {
    const newValue = calculateValueFromY(clientY);
    onChange(newValue);
  }, [calculateValueFromY, onChange]);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    handleTrackInteraction(e.clientY);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        handleTrackInteraction(e.clientY);
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
    handleTrackInteraction(e.touches[0].clientY);
  }, [handleTrackInteraction]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDraggingRef.current) {
      handleTrackInteraction(e.touches[0].clientY);
    }
  }, [handleTrackInteraction]);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Calculate handle position - clamped to stay within track
  const handlePosition = Math.max(0, Math.min(100, value));
  // Position from bottom, accounting for handle size
  const handleBottomOffset = (handlePosition / 100) * TRACK_HEIGHT - HANDLE_SIZE / 2;
  const clampedHandleBottom = Math.max(-HANDLE_SIZE / 2, Math.min(TRACK_HEIGHT - HANDLE_SIZE / 2, handleBottomOffset));

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-background"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
        How hungry are you?
      </h2>
      <p className="text-lg text-muted-foreground mb-12">Drag the slider up!</p>

      {/* Slider container with padding for handle overflow */}
      <div 
        className="relative w-24 select-none"
        style={{ height: TRACK_HEIGHT, paddingTop: HANDLE_SIZE / 2, paddingBottom: HANDLE_SIZE / 2 }}
      >
        {/* Interactive track area */}
        <div 
          ref={trackRef}
          className="relative w-full cursor-pointer"
          style={{ height: TRACK_HEIGHT }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slider track background */}
          <div className="absolute left-1/2 -translate-x-1/2 w-3 h-full bg-muted rounded-full" />
          
          {/* Slider fill */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-3 bottom-0 bg-primary rounded-full"
            style={{ height: `${value}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {/* Handle - positioned relative to track */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing pointer-events-none"
            style={{ 
              width: HANDLE_SIZE, 
              height: HANDLE_SIZE,
              bottom: clampedHandleBottom,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-full h-full bg-primary-foreground rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 border-primary"
              animate={
                value >= 95
                  ? {
                      rotate: [0, -5, 5, -5, 5, 0],
                      scale: [1, 1.1, 1],
                    }
                  : { rotate: 0, scale: 1 }
              }
              transition={{ 
                duration: 0.5, 
                repeat: value >= 95 ? Infinity : 0,
                type: "tween",
                ease: "easeInOut"
              }}
            >
              <motion.span
                key={getEmoji()}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {getEmoji()}
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.p
        className="text-2xl font-bold text-primary mt-12"
        key={getLabel()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {getLabel()}
      </motion.p>

      <motion.button
        className="mt-12 px-12 py-4 bg-primary text-primary-foreground rounded-full text-xl font-bold shadow-lg"
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
