import { beforeEach, describe, expect, it, vi } from 'vitest';
const native = vi.hoisted(() => {
  const pending = new Map<string, any>();
  return {
    pending,
    setNotificationHandler: vi.fn(),
    setNotificationChannelAsync: vi.fn(async () => {}),
    getPermissionsAsync: vi.fn(async () => ({ status: 'granted', granted: true, canAskAgain: true })),
    requestPermissionsAsync: vi.fn(async () => ({ status: 'granted', granted: true, canAskAgain: true })),
    getAllScheduledNotificationsAsync: vi.fn(async () => [...pending.values()]),
    cancelScheduledNotificationAsync: vi.fn(async (id: string) => { pending.delete(id); }),
    scheduleNotificationAsync: vi.fn(async (item: any) => { pending.set(item.identifier, item); return item.identifier; }),
    AndroidImportance: { DEFAULT: 3 }, IosAuthorizationStatus: { PROVISIONAL: 3 },
    SchedulableTriggerInputTypes: { DAILY: 'daily', TIME_INTERVAL: 'timeInterval' },
  };
});
vi.mock('expo-notifications', () => native);
vi.mock('react-native', () => ({ Platform: { OS: 'android' } }));
import { configureReminders, scheduleTestReminder } from '../../notifications/reminders';

const settings = { enabled: true, startTime: '07:30', endTime: '11:00', frequencyMinutes: 60 };
beforeEach(() => { vi.clearAllMocks(); native.pending.clear(); });
describe('agendamento nativo de lembretes', () => {
  it('registra disparos diários que não dependem de timers JavaScript', async () => {
    expect(await configureReminders(settings, true)).toBe(true);
    expect([...native.pending.values()].map(item => item.trigger)).toEqual([8,9,10].map(hour =>
      ({ type: 'daily', hour, minute: 30, channelId: 'mizu-lembretes' })));
    expect(native.setNotificationChannelAsync.mock.invocationCallOrder[0]).toBeLessThan(native.getPermissionsAsync.mock.invocationCallOrder[0]!);
  });
  it('retomar o app não cancela nem duplica a agenda existente', async () => {
    await configureReminders(settings);
    await configureReminders(settings);
    expect(native.scheduleNotificationAsync).toHaveBeenCalledTimes(3);
    expect(native.cancelScheduledNotificationAsync).not.toHaveBeenCalled();
  });
  it('serializa ativação e desativação concorrentes', async () => {
    await Promise.all([configureReminders(settings), configureReminders({ ...settings, enabled: false })]);
    expect(native.pending.size).toBe(0);
  });
  it('migra lembretes antigos e preserva notificações não pertencentes ao Mizu', async () => {
    native.pending.set('legacy', { identifier: 'legacy', content: { data: { screen: 'Hoje' } } });
    native.pending.set('other', { identifier: 'other', content: { data: {} } });
    await configureReminders(settings);
    expect(native.pending.has('legacy')).toBe(false);
    expect(native.pending.has('other')).toBe(true);
    expect(native.pending.size).toBe(4);
  });
  it('não apaga a agenda se a consulta de permissão falhar', async () => {
    await configureReminders(settings);
    native.getPermissionsAsync.mockRejectedValueOnce(new Error('native error'));
    await expect(configureReminders({ ...settings, frequencyMinutes: 30 })).rejects.toThrow('native error');
    expect(native.pending.size).toBe(3);
  });
  it('agenda teste nativo único de 15 segundos', async () => {
    expect(await scheduleTestReminder()).toBe(true);
    expect(native.pending.get('mizu-test').trigger).toMatchObject({ type: 'timeInterval', seconds: 15, repeats: false });
  });
});
