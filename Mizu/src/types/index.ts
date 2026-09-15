export type CatColor = 'white' | 'black' | 'gray' | 'orange' | 'siamese';
export type CatMood = 'sleeping' | 'stretching' | 'playing' | 'happy' | 'celebrating';
export type Unit = 'ml' | 'L';

export interface WaterEntry {
  id: string;
  amountMl: number;
  createdAt: string;
  date: string;
}

export interface Routine {
  wakeTime: string;
  sleepTime: string;
}

export interface ReminderSettings {
  enabled: boolean;
  frequencyMinutes: number;
  startTime: string;
  endTime: string;
}

export interface CatProfile {
  name: string;
  color: CatColor;
}

export interface UserSettings {
  displayName: string;
  weightKg: number;
  dailyGoalMl: number;
  unit: Unit;
  quickAmounts: [number, number, number];
  routine: Routine;
  reminders: ReminderSettings;
  cat: CatProfile;
}

export interface AppData {
  version: 1;
  onboardingComplete: boolean;
  settings: UserSettings;
  entries: WaterEntry[];
  dailyGoals: Record<string, number>;
}
