import { describe, expect, it } from 'vitest';
import { buildReminderTimes } from '../reminderSchedule';

describe('agenda de lembretes', () => {
  it('não envia no horário de sono', () => {
    expect(buildReminderTimes('07:30', '11:00', 60)).toEqual(['08:30', '09:30', '10:30']);
  });

  it('suporta rotina que atravessa meia-noite', () => {
    expect(buildReminderTimes('22:00', '02:00', 120)).toEqual(['00:00']);
  });

  it('recusa frequência inválida', () => {
    expect(buildReminderTimes('07:00', '23:00', 0)).toEqual([]);
  });
});
