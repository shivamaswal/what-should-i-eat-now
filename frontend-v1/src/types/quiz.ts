export interface QuizAnswers {
  hunger: number;
  budget: 'broke' | 'moderate' | 'balling';
  healthiness: number;
  temperature: number;
  spice: number;
  social: 'solo' | 'date' | 'group';
  vibe: 'hangover' | 'stressed' | 'lazy' | 'happy';
}

export type QuizStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
