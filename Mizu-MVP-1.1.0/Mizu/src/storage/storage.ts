import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from '../types';
import { defaultData } from './defaults';

const STORAGE_KEY = '@mizu/app-data/v1';

export const loadAppData = async (): Promise<AppData> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultData;
  try {
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      ...defaultData,
      ...parsed,
      settings: {
        ...defaultData.settings,
        ...parsed.settings,
        routine: { ...defaultData.settings.routine, ...parsed.settings?.routine },
        reminders: { ...defaultData.settings.reminders, ...parsed.settings?.reminders },
        cat: { ...defaultData.settings.cat, ...parsed.settings?.cat },
      },
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      dailyGoals: parsed.dailyGoals ?? {},
    };
  } catch {
    return defaultData;
  }
};

export const saveAppData = (data: AppData): Promise<void> => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
export const clearAppData = (): Promise<void> => AsyncStorage.removeItem(STORAGE_KEY);
