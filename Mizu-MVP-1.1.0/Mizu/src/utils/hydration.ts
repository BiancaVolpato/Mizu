import { CatMood, WaterEntry } from '../types';

export const calculateGoal = (weightKg: number): number => Math.round(Math.max(0, weightKg) * 35);

export const totalForDate = (entries: WaterEntry[], date: string): number =>
  entries.filter((entry) => entry.date === date).reduce((sum, entry) => sum + entry.amountMl, 0);

export const progressPercent = (total: number, goal: number): number =>
  goal > 0 ? Math.round((Math.max(0, total) / goal) * 100) : 0;

export const catMoodForProgress = (percent: number): CatMood => {
  if (percent >= 100) return 'celebrating';
  if (percent >= 75) return 'happy';
  if (percent >= 50) return 'playing';
  if (percent >= 25) return 'stretching';
  return 'sleeping';
};

export const formatVolume = (ml: number, unit: 'ml' | 'L' = 'ml'): string => {
  if (unit === 'L') return `${(ml / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} L`;
  return `${Math.round(ml).toLocaleString('pt-BR')} ml`;
};
