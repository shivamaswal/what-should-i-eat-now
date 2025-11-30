import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { QuizAnswers, QuizStep } from "@/types/quiz";
import { ProgressBar } from "@/components/ProgressBar";
import { LandingScreen } from "@/components/screens/LandingScreen";
import { HungerMeterScreen } from "@/components/screens/HungerMeterScreen";
import { BudgetScreen } from "@/components/screens/BudgetScreen";
import { HealthinessScreen } from "@/components/screens/HealthinessScreen";
import { TemperatureScreen } from "@/components/screens/TemperatureScreen";
import { SpiceScreen } from "@/components/screens/SpiceScreen";
import { SocialScreen } from "@/components/screens/SocialScreen";
import { VibeScreen } from "@/components/screens/VibeScreen";
import { ResultsScreen } from "@/components/screens/ResultsScreen";

const Index = () => {
  const [step, setStep] = useState<QuizStep>(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({
    hunger: 50,
    healthiness: 50,
    temperature: 50,
    spice: 2,
  });

  const handleStart = () => setStep(1);
  
  const handleNext = () => setStep((prev) => (prev + 1) as QuizStep);
  
  const handleRestart = () => {
    setStep(0);
    setAnswers({
      hunger: 50,
      healthiness: 50,
      temperature: 50,
      spice: 2,
    });
  };

  const updateAnswer = <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {step > 0 && step <= 7 && <ProgressBar current={step} total={7} />}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <LandingScreen key="landing" onStart={handleStart} />
        )}
        
        {step === 1 && (
          <HungerMeterScreen
            key="hunger"
            value={answers.hunger ?? 50}
            onChange={(v) => updateAnswer('hunger', v)}
            onNext={handleNext}
          />
        )}
        
        {step === 2 && (
          <BudgetScreen
            key="budget"
            value={answers.budget || 'moderate'}
            onChange={(v) => updateAnswer('budget', v)}
            onNext={handleNext}
          />
        )}
        
        {step === 3 && (
          <HealthinessScreen
            key="healthiness"
            value={answers.healthiness ?? 50}
            onChange={(v) => updateAnswer('healthiness', v)}
            onNext={handleNext}
          />
        )}
        
        {step === 4 && (
          <TemperatureScreen
            key="temperature"
            value={answers.temperature ?? 50}
            onChange={(v) => updateAnswer('temperature', v)}
            onNext={handleNext}
          />
        )}
        
        {step === 5 && (
          <SpiceScreen
            key="spice"
            value={answers.spice ?? 2}
            onChange={(v) => updateAnswer('spice', v)}
            onNext={handleNext}
          />
        )}
        
        {step === 6 && (
          <SocialScreen
            key="social"
            value={answers.social || null}
            onChange={(v) => updateAnswer('social', v)}
            onNext={handleNext}
          />
        )}
        
        {step === 7 && (
          <VibeScreen
            key="vibe"
            value={answers.vibe || null}
            onChange={(v) => updateAnswer('vibe', v)}
            onNext={handleNext}
          />
        )}
        
        {step === 8 && (
          <ResultsScreen
            key="results"
            answers={answers as QuizAnswers}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
