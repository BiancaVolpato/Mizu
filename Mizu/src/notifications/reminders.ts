import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ReminderSettings } from '../types';
import { buildReminderTimes } from '../utils/reminderSchedule';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false,
  }),
});

const CHANNEL = 'mizu-lembretes';
const PREFIX = 'mizu-daily-v2-';
const messages = [
  { title: 'Lembrete Mizu', body: '🐾 Que tal beber um pouco de água?' },
  { title: 'Uma pausa leve', body: '💧 Um copo de água pode caber bem agora.' },
  { title: 'Mizu lembra', body: 'Cuide da sua hidratação no seu ritmo.' },
];
export const reminderMessage = (index = 0) => messages[index % messages.length]!;

async function permissionGranted(prompt: boolean) {
  // Android 13 requires the channel to exist before requesting notification permission.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Lembretes de hidratação', importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default', vibrationPattern: [0, 180], lightColor: '#A8DADC',
    });
  }
  let permission = await Notifications.getPermissionsAsync();
  if (permission.status !== 'granted' && prompt && permission.canAskAgain) {
    permission = await Notifications.requestPermissionsAsync();
  }
  return permission.granted || permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

// Serialize mutations: an older refresh can never cancel a newer schedule.
let queue: Promise<unknown> = Promise.resolve();
function serialized<T>(operation: () => Promise<T>): Promise<T> {
  const result = queue.then(operation);
  queue = result.catch(() => undefined);
  return result;
}

export const configureReminders = (settings: ReminderSettings, promptPermission = false): Promise<boolean> => {
  const snapshot = { ...settings };
  return serialized(async () => {
    if (Platform.OS === 'web') return !snapshot.enabled;
    const pending = await Notifications.getAllScheduledNotificationsAsync();
    const owned = pending.filter(item => item.identifier.startsWith('mizu-') || item.content.data?.screen === 'Hoje');
    if (!snapshot.enabled) {
      for (const item of owned) await Notifications.cancelScheduledNotificationAsync(item.identifier);
      return true;
    }
    const times = buildReminderTimes(snapshot.startTime, snapshot.endTime, snapshot.frequencyMinutes);
    if (!times.length) throw new Error('Escolha uma frequência menor que o período acordado.');
    if (times.length > 60) throw new Error('Aumente o intervalo: o limite é de 60 lembretes por dia.');
    if (!(await permissionGranted(promptPermission))) return false;
    const wanted = new Set(times.map(time => PREFIX + time));
    // Cancel obsolete reminders only; leave unchanged native daily triggers intact.
    for (const item of owned) {
      if (!wanted.has(item.identifier) && item.identifier !== 'mizu-test') {
        await Notifications.cancelScheduledNotificationAsync(item.identifier);
      }
    }
    const existing = new Set(pending.map(item => item.identifier));
    for (const [index, time] of times.entries()) {
      const identifier = PREFIX + time;
      if (existing.has(identifier)) continue;
      const [hour, minute] = time.split(':').map(Number);
      await Notifications.scheduleNotificationAsync({
        identifier,
        content: { ...reminderMessage(index), sound: 'default', data: { screen: 'Hoje', kind: 'hydration' } },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: hour!, minute: minute!, ...(Platform.OS === 'android' ? { channelId: CHANNEL } : {}) },
      });
    }
    return true;
  });
};

export const scheduleTestReminder = (): Promise<boolean> => serialized(async () => {
  if (Platform.OS === 'web' || !(await permissionGranted(true))) return false;
  await Notifications.cancelScheduledNotificationAsync('mizu-test');
  await Notifications.scheduleNotificationAsync({
    identifier: 'mizu-test',
    content: { title: 'Mizu — teste de lembrete', body: 'Este é o teste de notificação local do Mizu.',
      sound: 'default', data: { screen: 'Hoje', kind: 'test' } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 15, repeats: false,
      ...(Platform.OS === 'android' ? { channelId: CHANNEL } : {}) },
  });
  return true;
});
