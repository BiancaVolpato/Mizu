import React from 'react';
import { Input } from './Input';
import { isValidTime } from '../utils/date';

interface Props { label: string; value: string; onChange: (value: string) => void; }

export const TimeInput = ({ label, value, onChange }: Props) => (
  <Input
    label={label}
    value={value}
    onChangeText={(text) => {
      const digits = text.replace(/\D/g, '').slice(0, 4);
      onChange(digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits);
    }}
    keyboardType="number-pad"
    maxLength={5}
    placeholder="07:30"
    error={value.length === 5 && !isValidTime(value) ? 'Use um horário entre 00:00 e 23:59.' : undefined}
    accessibilityHint="Digite quatro números para hora e minutos"
  />
);
