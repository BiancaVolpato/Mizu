import { describe, expect, it } from 'vitest';
import { dateKey, isValidTime, minutesToTime, timeToMinutes } from '../date';

describe('datas locais', () => {
  it('cria chave sem conversão para UTC', () => {
    expect(dateKey(new Date(2026, 8, 5, 23, 59))).toBe('2026-09-05');
  });

  it('valida horários e converte minutos', () => {
    expect(isValidTime('23:30')).toBe(true);
    expect(isValidTime('24:00')).toBe(false);
    expect(timeToMinutes('07:30')).toBe(450);
    expect(minutesToTime(1470)).toBe('00:30');
  });
});
