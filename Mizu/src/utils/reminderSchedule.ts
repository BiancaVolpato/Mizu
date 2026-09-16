import { isValidTime, minutesToTime, timeToMinutes } from './date';

export const buildReminderTimes = (start: string, end: string, frequencyMinutes: number): string[] => {
  if (!Number.isFinite(frequencyMinutes) || !Number.isInteger(frequencyMinutes) || frequencyMinutes <= 0
    || !isValidTime(start) || !isValidTime(end) || start === end) return [];
  const first = timeToMinutes(start);
  let last = timeToMinutes(end);
  if (last <= first) last += 24 * 60;
  const values: string[] = [];
  for (let cursor = first + frequencyMinutes; cursor < last; cursor += frequencyMinutes) values.push(minutesToTime(cursor));
  return values;
};
