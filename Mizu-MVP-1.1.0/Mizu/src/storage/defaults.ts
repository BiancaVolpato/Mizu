import { AppData } from '../types';

export const defaultData: AppData = {
  version: 1,
  onboardingComplete: false,
  settings: {
    displayName: '',
    weightKg: 65,
    dailyGoalMl: 2275,
    unit: 'ml',
    quickAmounts: [200, 350, 500],
    routine: { wakeTime: '07:30', sleepTime: '23:30' },
    reminders: { enabled: false, frequencyMinutes: 60, startTime: '07:30', endTime: '23:30' },
    cat: { name: 'Mizu', color: 'black' },
  },
  entries: [],
  dailyGoals: {},
};
