import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { AppState } from 'react-native';
import { configureReminders } from '../notifications/reminders';
import { defaultData } from '../storage/defaults';
import { clearAppData, loadAppData, saveAppData } from '../storage/storage';
import { AppData, CatColor, ReminderSettings, Routine, Unit, UserSettings, WaterEntry } from '../types';
import { dateKey } from '../utils/date';
import { calculateGoal, totalForDate } from '../utils/hydration';
import { createId } from '../utils/id';

type Action =
  | { type: 'hydrate'; payload: AppData }
  | { type: 'onboard'; payload: { weightKg: number; routine: Routine } }
  | { type: 'add'; payload: WaterEntry }
  | { type: 'edit'; payload: { id: string; amountMl: number } }
  | { type: 'delete'; payload: string }
  | { type: 'settings'; payload: Partial<UserSettings> }
  | { type: 'cat'; payload: { name?: string; color?: CatColor } }
  | { type: 'reminders'; payload: ReminderSettings }
  | { type: 'goal'; payload: number }
  | { type: 'reset-onboarding' }
  | { type: 'clear' }
  | { type: 'ensure-day'; payload: string };

const ensureGoal = (data: AppData, key: string): AppData => data.dailyGoals[key]
  ? data
  : { ...data, dailyGoals: { ...data.dailyGoals, [key]: data.settings.dailyGoalMl } };

const reducer = (state: AppData, action: Action): AppData => {
  switch (action.type) {
    case 'hydrate': return ensureGoal(action.payload, dateKey());
    case 'onboard': {
      const goal = calculateGoal(action.payload.weightKg);
      return ensureGoal({
        ...state,
        onboardingComplete: true,
        settings: {
          ...state.settings,
          weightKg: action.payload.weightKg,
          dailyGoalMl: goal,
          routine: action.payload.routine,
          reminders: { ...state.settings.reminders, startTime: action.payload.routine.wakeTime, endTime: action.payload.routine.sleepTime },
        },
      }, dateKey());
    }
    case 'add': return { ...state, entries: [action.payload, ...state.entries] };
    case 'edit': return { ...state, entries: state.entries.map((entry) => entry.id === action.payload.id ? { ...entry, amountMl: action.payload.amountMl } : entry) };
    case 'delete': return { ...state, entries: state.entries.filter((entry) => entry.id !== action.payload) };
    case 'settings': return { ...state, settings: { ...state.settings, ...action.payload,
      reminders: action.payload.routine ? { ...state.settings.reminders,
        startTime: action.payload.routine.wakeTime, endTime: action.payload.routine.sleepTime } : state.settings.reminders } };
    case 'cat': return { ...state, settings: { ...state.settings, cat: { ...state.settings.cat, ...action.payload } } };
    case 'reminders': return { ...state, settings: { ...state.settings, reminders: action.payload } };
    case 'goal': {
      const goal = Math.max(250, Math.round(action.payload));
      return { ...state, settings: { ...state.settings, dailyGoalMl: goal }, dailyGoals: { ...state.dailyGoals, [dateKey()]: goal } };
    }
    case 'reset-onboarding': return { ...state, onboardingComplete: false };
    case 'clear': return ensureGoal(defaultData, dateKey());
    case 'ensure-day': return ensureGoal(state, action.payload);
  }
};

interface HydrationContextValue {
  data: AppData;
  ready: boolean;
  reminderError: string | null;
  todayTotal: number;
  addWater: (amountMl: number) => void;
  editEntry: (id: string, amountMl: number) => void;
  deleteEntry: (id: string) => void;
  completeOnboarding: (weightKg: number, routine: Routine) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  updateGoal: (goalMl: number) => void;
  updateCat: (value: { name?: string; color?: CatColor }) => void;
  updateReminders: (settings: ReminderSettings) => Promise<boolean>;
  resetOnboarding: () => void;
  clearEverything: () => Promise<void>;
}

const HydrationContext = createContext<HydrationContextValue | null>(null);

export const HydrationProvider = ({ children }: React.PropsWithChildren) => {
  const [data, dispatch] = useReducer(reducer, defaultData);
  const [ready, setReady] = useState(false);
  const [reminderError, setReminderError] = useState<string | null>(null);

  const reconcileReminders = useCallback(() => {
    if (!ready) return;
    void configureReminders(data.settings.reminders).then(allowed => {
      setReminderError(allowed ? null : 'Permita as notificações do Mizu nos ajustes do aparelho.');
    }).catch(error => setReminderError(error instanceof Error ? error.message : 'Não foi possível agendar os lembretes. Tente novamente.'));
  }, [ready, data.settings.reminders]);

  useEffect(() => {
    loadAppData().then((stored) => { dispatch({ type: 'hydrate', payload: stored }); setReady(true); });
  }, []);

  useEffect(() => {
    if (ready) void saveAppData(data);
  }, [data, ready]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        dispatch({ type: 'ensure-day', payload: dateKey() });
        reconcileReminders();
      }
    });
    return () => subscription.remove();
  }, [reconcileReminders]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const scheduleMidnight = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 0, 100);
      timer = setTimeout(() => { dispatch({ type: 'ensure-day', payload: dateKey() }); scheduleMidnight(); }, next.getTime() - now.getTime());
    };
    scheduleMidnight();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    reconcileReminders();
  }, [reconcileReminders]);

  const todayTotal = useMemo(() => totalForDate(data.entries, dateKey()), [data.entries]);
  const addWater = useCallback((amountMl: number) => {
    if (!Number.isFinite(amountMl) || amountMl <= 0) return;
    const now = new Date();
    dispatch({ type: 'add', payload: { id: createId(), amountMl: Math.round(amountMl), createdAt: now.toISOString(), date: dateKey(now) } });
  }, []);

  const value = useMemo<HydrationContextValue>(() => ({
    data,
    ready,
    reminderError,
    todayTotal,
    addWater,
    editEntry: (id, amountMl) => dispatch({ type: 'edit', payload: { id, amountMl: Math.max(1, Math.round(amountMl)) } }),
    deleteEntry: (id) => dispatch({ type: 'delete', payload: id }),
    completeOnboarding: (weightKg, routine) => dispatch({ type: 'onboard', payload: { weightKg, routine } }),
    updateSettings: (settings) => dispatch({ type: 'settings', payload: settings }),
    updateGoal: (goalMl) => dispatch({ type: 'goal', payload: goalMl }),
    updateCat: (cat) => dispatch({ type: 'cat', payload: cat }),
    updateReminders: async (settings) => {
      try {
        const allowed = await configureReminders(settings, true);
        setReminderError(allowed ? null : 'Permita as notificações do Mizu nos ajustes do aparelho.');
        dispatch({ type: 'reminders', payload: { ...settings, enabled: allowed && settings.enabled } });
        return allowed;
      } catch (error) {
        setReminderError(error instanceof Error ? error.message : 'Não foi possível agendar os lembretes. Tente novamente.');
        return false;
      }
    },
    resetOnboarding: () => dispatch({ type: 'reset-onboarding' }),
    clearEverything: async () => { await clearAppData(); dispatch({ type: 'clear' }); await configureReminders({ ...defaultData.settings.reminders, enabled: false }); },
  }), [addWater, data, ready, todayTotal, reminderError]);

  return <HydrationContext.Provider value={value}>{children}</HydrationContext.Provider>;
};

export const useHydration = (): HydrationContextValue => {
  const value = useContext(HydrationContext);
  if (!value) throw new Error('useHydration precisa estar dentro de HydrationProvider');
  return value;
};
