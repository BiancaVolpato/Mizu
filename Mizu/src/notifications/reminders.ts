import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ReminderSettings } from '../types';
import { formatVolume } from '../utils/hydration';
import { buildReminderTimes } from '../utils/reminderSchedule';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const CHANNEL = 'mizu-lembretes';

export const reminderMessage = (remainingMl?: number): { title: string; body: string } => {
  if (remainingMl && remainingMl > 0) {
    return { title: 'Uma pausa para água', body: `Seu gatinho acompanha você. Faltam ${formatVolume(remainingMl)} para a meta de hoje.` };
  }
  const messages = [
    { title: 'Lembrete Mizu', body: '🐾 Que tal beber um pouco de água?' },
    { title: 'Uma pausa leve', body: '💧 Um copo de água pode caber bem agora.' },
    { title: 'Mizu lembra', body: 'Cuide da sua hidratação no seu ritmo.' },
  ];
  return messages[Math.floor(Math.random() * messages.length)] ?? messages[0]!;
};

export const configureReminders = async (settings: ReminderSettings, remainingMl?: number): Promise<boolean> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!settings.enabled) return true;

  const permission = await Notifications.requestPermissionsAsync();
  if (permission.status !== 'granted') return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Lembretes de hidratação',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 180],
      lightColor: '#A8DADC',
    });
  }

  const times = buildReminderTimes(settings.startTime, settings.endTime, settings.frequencyMinutes);
  for (const time of times.slice(0, 60)) {
    const [hour, minute] = time.split(':').map(Number);
    await Notifications.scheduleNotificationAsync({
      content: { ...reminderMessage(remainingMl), data: { screen: 'Hoje' } },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hour ?? 8,
        minute: minute ?? 0,
        channelId: Platform.OS === 'android' ? CHANNEL : undefined,
      },
    });
  }
  return true;
};
