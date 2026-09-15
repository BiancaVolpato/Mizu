import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CatIllustration } from '../components/CatIllustration';
import { Input } from '../components/Input';
import { Screen } from '../components/Screen';
import { catOptions, futureCosmeticSlots } from '../data/catCatalog';
import { useHydration } from '../hooks/HydrationProvider';
import { colors, radius, spacing, typography } from '../theme';
import { dateKey } from '../utils/date';
import { catMoodForProgress, progressPercent } from '../utils/hydration';

export const CatScreen = () => {
  const { data, todayTotal, updateCat } = useHydration();
  const [name, setName] = useState(data.settings.cat.name);
  useEffect(() => setName(data.settings.cat.name), [data.settings.cat.name]);
  const goal = data.dailyGoals[dateKey()] ?? data.settings.dailyGoalMl;
  const percent = progressPercent(todayTotal, goal);
  const mood = catMoodForProgress(percent);

  return (
    <Screen>
      <Text style={styles.eyebrow}>SUA COMPANHIA</Text>
      <Text style={styles.title}>{data.settings.cat.name}</Text>
      <Card style={styles.hero}>
        <View style={styles.percentBadge}><Text style={styles.percent}>{percent}% hoje</Text></View>
        <CatIllustration color={data.settings.cat.color} mood={mood} size={230} />
        <Text style={styles.mood}>{mood === 'sleeping' ? 'Descansando com calma' : mood === 'stretching' ? 'Começando a despertar' : mood === 'playing' ? 'Hora de brincar' : mood === 'happy' ? 'Um dia bem leve' : 'Comemorando com você'}</Text>
      </Card>

      <Text style={styles.section}>Nome</Text>
      <Card style={styles.formCard}>
        <Input label="Nome do gatinho" value={name} onChangeText={setName} maxLength={18} />
        <Button label="Salvar nome" variant="secondary" onPress={() => updateCat({ name: name.trim() || 'Mizu' })} />
      </Card>

      <Text style={styles.section}>Aparência</Text>
      <View style={styles.colorsGrid}>{catOptions.map((option) => {
        const selected = option.id === data.settings.cat.color;
        return <Pressable key={option.id} accessibilityRole="radio" accessibilityState={{ checked: selected }} accessibilityLabel={`Pelagem ${option.label}`} onPress={() => updateCat({ color: option.id })} style={[styles.colorOption, selected && styles.colorSelected]}>
          <View style={[styles.swatch, { backgroundColor: option.swatch, borderColor: option.accent }]} />
          <Text style={styles.colorLabel}>{option.label}</Text>
          {selected ? <Text style={styles.check}>✓</Text> : null}
        </Pressable>;
      })}</View>

      <Text style={styles.section}>Em breve</Text>
      <Card>{futureCosmeticSlots.map((slot, index) => <View key={slot.id} style={[styles.futureRow, index < futureCosmeticSlots.length - 1 && styles.futureBorder]}><Text style={styles.futureText}>{slot.label}</Text><Text style={styles.lock}>○</Text></View>)}</Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  eyebrow: { ...typography.caption, fontFamily: 'PlusJakartaSans_600SemiBold', letterSpacing: 1.6 },
  title: { ...typography.h1, marginBottom: spacing.lg },
  hero: { alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.lg },
  percentBadge: { position: 'absolute', top: spacing.md, right: spacing.md, backgroundColor: colors.waterSoft, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  percent: { ...typography.caption, color: colors.waterDark, fontFamily: 'PlusJakartaSans_600SemiBold' },
  mood: { ...typography.body, fontFamily: 'PlusJakartaSans_500Medium', marginTop: -8 },
  section: { ...typography.h2, marginTop: spacing.lg, marginBottom: spacing.sm },
  formCard: { gap: spacing.md },
  colorsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  colorOption: { width: '47%', minHeight: 64, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm },
  colorSelected: { borderColor: colors.waterDark, backgroundColor: colors.waterSoft },
  swatch: { width: 34, height: 34, borderRadius: 17, borderWidth: 2 },
  colorLabel: { ...typography.caption, flex: 1, color: colors.text },
  check: { ...typography.body, color: colors.waterDark },
  futureRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  futureBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  futureText: { ...typography.body, color: colors.textMuted },
  lock: { color: colors.beige },
});
