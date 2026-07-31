export interface Coefficients {
  importance: number;
  complexity: number;
}

export interface TechnicalInputs {
  quality: number;
  knowledge: number;
  agility: number;
  innovation: number;
}

export const MONTHLY_SCORE_BASE = 155;

export const MONTHLY_MAX = {
  accuracy: 300,
  knowledge: 400,
  knowledgeSharing: 250,
  convergence: 200,
  participation: 150,
  extraCurricular: 150,
  orgSystem: 100,
  innovation: 100,
} as const;

export function totalWeight({ importance, complexity }: Coefficients): number {
  return importance * complexity;
}

export function technicalScore({
  quality,
  knowledge,
  agility,
  innovation,
}: TechnicalInputs): number {
  return (
    quality * 0.375 + knowledge * 0.375 + agility * 0.125 + innovation * 0.125
  );
}

export function weightedScore(technical: number, weight: number): number {
  return technical * weight;
}

export function performancePercentage(
  monthlyScores: number[],
  base: number = MONTHLY_SCORE_BASE,
): number {
  if (base === 0 || monthlyScores.length === 0) return 0;
  const sum = monthlyScores.reduce((acc, s) => acc + s, 0);
  return (sum / base) * 100;
}
