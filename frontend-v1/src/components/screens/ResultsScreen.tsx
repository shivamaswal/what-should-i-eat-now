import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { QuizAnswers } from "@/types/quiz";

interface ResultsScreenProps {
  answers: QuizAnswers;
  onRestart: () => void;
}

interface FoodResult {
  id: number;
  name: string;
  emoji: string;
  cuisine: string;
  description: string;
  avg_price: number;
  is_vegetarian: boolean;
}

interface RecommendationResponse {
  best_match: FoodResult;
  score: number;
  matched_tags: string[];
  alternatives: Array<{
    food: FoodResult;
    score: number;
    matched_tags: string[];
  }>;
  total_matches: number;
}

// Fallback suggestions in case API fails
const fallbackSuggestions = [
  { id: 0, name: "Loaded Nachos", emoji: "🧀", cuisine: "fastfood", description: "Crispy nachos with cheese", avg_price: 200, is_vegetarian: true },
  { id: 1, name: "Chicken Biryani", emoji: "🍛", cuisine: "indian", description: "Aromatic spiced rice", avg_price: 250, is_vegetarian: false },
  { id: 2, name: "Pizza", emoji: "🍕", cuisine: "fastfood", description: "Classic comfort food", avg_price: 350, is_vegetarian: true },
];

// Use VITE_API_URL env var, fallback to relative URL for local docker-compose
const API_URL = import.meta.env.VITE_API_URL || "";

export const ResultsScreen = ({ answers, onRestart }: ResultsScreenProps) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<FoodResult | null>(null);
  const [score, setScore] = useState<number>(0);
  const [matchedTags, setMatchedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await fetch(`${API_URL}/api/recommend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(answers),
        });

        if (!response.ok) {
          throw new Error("Failed to get recommendation");
        }

        const data: RecommendationResponse = await response.json();
        
        // Add a small delay for the loading animation
        setTimeout(() => {
          setResult(data.best_match);
          setScore(data.score);
          setMatchedTags(data.matched_tags);
          setLoading(false);
        }, 2000);
        
      } catch (err) {
        console.error("Error fetching recommendation:", err);
        setError("Couldn't reach the kitchen! Using backup recipe...");
        
        // Fallback to random suggestion
        setTimeout(() => {
          const randomFallback = fallbackSuggestions[Math.floor(Math.random() * fallbackSuggestions.length)];
          setResult(randomFallback);
          setScore(0);
          setMatchedTags([]);
          setLoading(false);
        }, 2000);
      }
    };

    fetchRecommendation();
  }, [answers]);

  if (loading) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-primary/20 via-background to-secondary/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="text-8xl mb-8"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            type: "tween",
          }}
        >
          🍳
        </motion.div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
          Finding Your Perfect Meal...
        </h2>
        
        <p className="text-muted-foreground mb-8">Analyzing your cravings</p>
        
        <motion.div
          className="flex gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-4 h-4 bg-primary rounded-full"
              animate={{
                y: [0, -20, 0],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                type: "tween",
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    );
  }

  // Safety check - if result is still null after loading, show fallback
  if (!result && !loading) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-primary/20 via-background to-secondary/20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="text-center">
          <motion.div className="text-6xl mb-4">⚠️</motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Oops! Something went wrong</h2>
          <motion.button
            className="px-8 py-4 bg-primary text-primary-foreground rounded-full text-xl font-bold shadow-lg"
            onClick={onRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-6 bg-gradient-to-br from-primary/20 via-background to-secondary/20 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, type: "tween" }}
    >
      {error && (
        <motion.div 
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-500/20 text-yellow-700 px-4 py-2 rounded-full text-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      <div className="text-xl font-bold text-muted-foreground mb-2">
        You should eat...
      </div>

      <motion.div
        className="text-7xl md:text-8xl mb-2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.2,
        }}
      >
        {result?.emoji || '🍽️'}
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl font-black text-foreground mb-2 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {result?.name || 'Something Delicious'}!
      </motion.h1>

      {result?.description && (
        <motion.p
          className="text-base text-muted-foreground mb-1 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {result.description}
        </motion.p>
      )}

      {score > 0 && (
        <motion.div
          className="flex flex-col items-center gap-1 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2 text-primary">
            <span className="text-xl font-bold">{score.toFixed(0)}%</span>
            <span className="text-xs text-muted-foreground">match</span>
          </div>
          
          {matchedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center max-w-sm">
              {matchedTags.slice(0, 4).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {result?.avg_price && (
        <motion.p
          className="text-sm text-muted-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Average price: ₹{result.avg_price}
          {result.is_vegetarian && " • 🌱 Vegetarian"}
        </motion.p>
      )}

      {/* Order From Section */}
      <motion.div
        className="flex flex-col items-center gap-2 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
      >
        <h3 className="text-base font-semibold text-muted-foreground">
          Order from...
        </h3>
        
        <div className="flex gap-3">
          {/* Zomato Button */}
          <motion.a
            href={`https://www.zomato.com/bangalore/delivery/dish-${(result?.name || '').toLowerCase().replace(/\s+/g, '-')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-5 py-2.5 bg-white border-2 border-[#E23744] rounded-xl shadow-md hover:shadow-lg transition-shadow min-w-[120px]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Zomato Logo SVG */}
            <svg height="20" viewBox="0 0 2500 535" xmlns="http://www.w3.org/2000/svg">
              <path d="m381.02 135.1-2.25 72.32-188.62 205.03c78.79 0 128.75-.77 157.56-2.37-8.35 38.91-15.14 70.72-21.98 118.41-37.89-3.2-96.96-4-156.06-4-65.88 0-123.46.79-169.67 4l1.54-73.14 188.61-204.21c-82.57 0-112.88.78-146.95 1.58 7.55-36.56 12.86-77.07 18.16-117.62 59.84 2.38 83.32 3.16 161.35 3.16 71.97.01 112.85-.78 158.31-3.16zm214.39-21.48c-122.75 0-216.64 109.67-216.64 240.84 0 98.53 56.8 174.03 167.39 174.03 123.48 0 216.65-109.69 216.65-241.63.01-97.7-55.31-173.24-167.4-173.24zm-37.13 309.46c-27.28 0-43.17-24.67-43.17-73.14 0-72.32 29.54-130.32 65.92-130.32 26.49 0 42.4 23.86 42.4 73.1-.01 71.52-28.77 130.36-65.15 130.36zm1772.1-314.9c-124.32 0-219.47 111.12-219.47 243.94 0 99.87 57.55 176.37 169.59 176.37 125.09 0 219.49-111.13 219.49-244.78.01-99.02-55.99-175.53-169.61-175.53zm-39.95 314.48c-27.29 0-43.17-24.67-43.17-73.14 0-72.32 29.55-130.31 65.92-130.31 26.48 0 42.42 23.84 42.42 73.09-.02 71.55-28.81 130.36-65.17 130.36zm-890.58-165.97c9.86-67.53 4.56-128.74-70.42-128.74-54.55 0-113.63 46.1-155.29 123.19 9.1-63.6 3.78-123.19-70.45-123.19-56.05 0-116.65 48.47-158.33 128.74 10.61-52.45 8.35-112.07 5.31-124.78-43.17 7.16-81.03 11.12-134.07 12.71 1.52 36.57-.76 84.22-7.58 129.56l-17.42 119.19c-6.82 46.91-14.4 100.95-21.98 135.13h140.9c.77-20.69 6.08-53.26 9.86-81.87l12.12-81.84c9.84-53.28 52.25-116.03 84.82-116.03 18.94 0 18.2 18.27 12.89 52.44l-13.64 92.16c-6.84 46.91-14.39 100.95-21.98 135.13h142.41c.77-20.69 5.31-53.26 9.09-81.87l12.11-81.84c9.86-53.28 52.3-116.03 84.85-116.03 18.96 0 18.21 17.46 15.15 41.32l-34.02 238.41h129.97zm680.51 147.03-15.15 93.79c-23.49 12.71-67.43 31-118.18 31-86.36 0-103.76-46.1-90.15-143.85l21.98-157.36h-42.5l12-101.86 46.4-2.24 17.43-73.91 131.03-49.29-16.65 123.19h90.15c-3.02 12.71-13.66 82.67-16.64 104.1h-87.92l-19.7 145.44c-5.3 37.35-2.25 50.87 23.47 50.87 18.98-.02 46.98-11.15 64.43-19.88zm-497.04 50.66c47.69-5.91 80.51-51.88 88.4-97.75l1.33-12.29c-20.49-4.58-50.11-8.07-78.83-4.56-27.35 3.33-50.11 14.7-62.35 31.16-9.23 11.82-13.87 25.96-11.81 42.82 3.11 25.25 31.04 44.55 63.26 40.62zm-40.59 72.64c-67.31 8.27-111.64-18.45-124.95-79.22-8.35-38.24 3.24-81.8 23.51-107.79 27.15-33.99 71.39-55.81 125.38-62.4 43.45-5.39 80.06-2.73 114.3 3.75l1.42-5.87c.98-9.39 1.97-18.76.6-29.98-3.55-28.81-26.27-45.97-82.37-39.07-37.85 4.65-73.86 18.32-101.82 33.88l-27.2-82.19c37.9-21.76 85.67-38.32 140.34-45.03 104.43-12.81 177.81 20.49 187.21 97.05 2.49 20.36 2.79 41.94.22 61.52-13.41 94.66-22 165.89-25.77 213.63-.61 7.39-.56 20.09.1 38.09l-129.59-.12c2.76-7.46 5.23-17.58 7.43-30.27 1.46-8.35 2.5-18.88 3.15-31.64-27.39 37.58-65.04 59.9-111.96 65.66z" fill="#E23744"/>
            </svg>
          </motion.a>

          {/* Swiggy Button */}
          <motion.a
            href={`https://www.swiggy.com/search?query=${encodeURIComponent(result?.name || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-5 py-2.5 bg-white border-2 border-[#FC8019] rounded-xl shadow-md hover:shadow-lg transition-shadow min-w-[120px]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Swiggy Logo 2024 */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Swiggy_Logo_2024.webp" 
              alt="Swiggy" 
              className="h-6"
            />
          </motion.a>
        </div>
      </motion.div>

      <motion.div
        className="flex gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.85 }}
      >
        <motion.button
          className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-lg font-bold shadow-lg"
          onClick={onRestart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 Try Again
        </motion.button>
      </motion.div>

      {/* Confetti effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            initial={{
              top: "-10%",
              left: `${Math.random() * 100}%`,
              opacity: 1,
            }}
            animate={{
              top: "110%",
              rotate: Math.random() * 360,
              opacity: 0,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 0.5,
              ease: "linear",
            }}
          >
            {['🎉', '🎊', '✨', '⭐', '🌟'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
