import { describe, expect, it } from 'vitest';
import { calculateGoal, catMoodForProgress, formatVolume, progressPercent, totalForDate } from '../hydration';
import { WaterEntry } from '../../types';

describe('hidratação', () => {
  it('calcula meta inicial com 35 ml por kg', () => {
    expect(calculateGoal(65)).toBe(2275);
    expect(calculateGoal(-1)).toBe(0);
  });

  it('soma apenas os registros do dia solicitado', () => {
    const entries: WaterEntry[] = [
      { id: '1', amountMl: 350, createdAt: '2026-09-15T09:00:00.000Z', date: '2026-09-15' },
      { id: '2', amountMl: 200, createdAt: '2026-09-15T11:00:00.000Z', date: '2026-09-15' },
      { id: '3', amountMl: 500, createdAt: '2026-09-14T11:00:00.000Z', date: '2026-09-14' },
    ];
    expect(totalForDate(entries, '2026-09-15')).toBe(550);
  });

  it('permite ultrapassar 100 por cento', () => {
    expect(progressPercent(2550, 2300)).toBe(111);
  });

  it('mapeia os cinco estados do gato nos limites corretos', () => {
    expect([0, 24, 25, 49, 50, 74, 75, 99, 100].map(catMoodForProgress)).toEqual([
      'sleeping', 'sleeping', 'stretching', 'stretching', 'playing', 'playing', 'happy', 'happy', 'celebrating',
    ]);
  });

  it('formata ml e litros em pt-BR', () => {
    expect(formatVolume(2275, 'ml')).toContain('2.275');
    expect(formatVolume(2100, 'L')).toContain('2,1');
  });
});
