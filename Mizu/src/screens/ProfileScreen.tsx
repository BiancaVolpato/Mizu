import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Screen } from '../components/Screen';
import { TimeInput } from '../components/TimeInput';
import { useHydration } from '../hooks/HydrationProvider';
import { colors, radius, spacing, typography } from '../theme';
import { Unit } from '../types';
import { isValidTime } from '../utils/date';

const frequencyOptions = [30, 60, 90, 120];

export const ProfileScreen = () => {
  const { data, updateSettings, updateGoal, updateReminders, resetOnboarding, clearEverything } = useHydration();
  const [displayName, setDisplayName] = useState(data.settings.displayName);
  const [weight, setWeight] = useState(String(data.settings.weightKg));
  const [goal, setGoal] = useState(String(data.settings.dailyGoalMl));
  const [quick, setQuick] = useState(data.settings.quickAmounts.map(String));
  const [wake, setWake] = useState(data.settings.routine.wakeTime);
  const [sleep, setSleep] = useState(data.settings.routine.sleepTime);
  const [frequency, setFrequency] = useState(data.settings.reminders.frequencyMinutes);
  const [customFrequency, setCustomFrequency] = useState(String(data.settings.reminders.frequencyMinutes));
  const [savingReminder, setSavingReminder] = useState(false);

  useEffect(() => {
    setDisplayName(data.settings.displayName); setWeight(String(data.settings.weightKg)); setGoal(String(data.settings.dailyGoalMl)); setQuick(data.settings.quickAmounts.map(String));
    setWake(data.settings.routine.wakeTime); setSleep(data.settings.routine.sleepTime); setFrequency(data.settings.reminders.frequencyMinutes);
  }, [data.settings]);

  const validRoutine = isValidTime(wake) && isValidTime(sleep) && wake !== sleep;
  const saveHydration = () => {
    const amounts = quick.map(Number);
    if (amounts.some((value) => !Number.isFinite(value) || value <= 0)) return Alert.alert('Revise os atalhos', 'Use quantidades maiores que zero.');
    updateSettings({ displayName: displayName.trim(), weightKg: Math.max(25, Number(weight) || data.settings.weightKg), quickAmounts: amounts as [number, number, number] });
    updateGoal(Number(goal));
  };
  const saveRoutine = () => {
    if (!validRoutine) return;
    const routine = { wakeTime: wake, sleepTime: sleep };
    updateSettings({ routine });
    void updateReminders({ ...data.settings.reminders, startTime: wake, endTime: sleep, frequencyMinutes: frequency });
  };
  const toggleReminder = async (enabled: boolean) => {
    setSavingReminder(true);
    const allowed = await updateReminders({ ...data.settings.reminders, enabled, startTime: wake, endTime: sleep, frequencyMinutes: frequency });
    setSavingReminder(false);
    if (enabled && !allowed) Alert.alert('Notificações desativadas', 'Permita notificações nos ajustes do aparelho para receber os lembretes do Mizu.');
  };
  const chooseFrequency = (value: number) => {
    setFrequency(value); setCustomFrequency(String(value));
    if (data.settings.reminders.enabled) void updateReminders({ ...data.settings.reminders, frequencyMinutes: value, startTime: wake, endTime: sleep });
  };

  return (
    <Screen>
      <Text style={styles.eyebrow}>AJUSTES</Text><Text style={styles.title}>Perfil</Text>

      <Text style={styles.section}>Hidratação</Text>
      <Card style={styles.cardGap}>
        <Input label="Seu nome (opcional)" value={displayName} onChangeText={setDisplayName} maxLength={24} placeholder="Como prefere ser chamado?" />
        <View style={styles.row}><View style={styles.flex}><Input label="Peso" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" suffix="kg" /></View><View style={styles.flex}><Input label="Meta diária" value={goal} onChangeText={setGoal} keyboardType="number-pad" suffix="ml" /></View></View>
        <Text style={styles.miniLabel}>Unidade de exibição</Text>
        <View style={styles.segment}>{(['ml', 'L'] as Unit[]).map((unit) => <Pressable key={unit} accessibilityRole="radio" accessibilityState={{ checked: data.settings.unit === unit }} onPress={() => updateSettings({ unit })} style={[styles.segmentItem, data.settings.unit === unit && styles.segmentActive]}><Text style={styles.segmentText}>{unit}</Text></Pressable>)}</View>
        <Text style={styles.miniLabel}>Botões rápidos</Text>
        <View style={styles.row}>{quick.map((value, index) => <View style={styles.flex} key={index}><Input label={`Atalho ${index + 1}`} value={value} onChangeText={(text) => setQuick((items) => items.map((item, itemIndex) => itemIndex === index ? text : item))} keyboardType="number-pad" suffix="ml" /></View>)}</View>
        <Button label="Salvar hidratação" variant="secondary" onPress={saveHydration} />
        <Text style={styles.disclaimer}>A meta calculada por peso é apenas uma estimativa inicial e não substitui orientação profissional.</Text>
      </Card>

      <Text style={styles.section}>Rotina</Text>
      <Card style={styles.cardGap}>
        <View style={styles.row}><View style={styles.flex}><TimeInput label="Acordo" value={wake} onChange={setWake} /></View><View style={styles.flex}><TimeInput label="Durmo" value={sleep} onChange={setSleep} /></View></View>
        <Button label="Salvar rotina" variant="secondary" onPress={saveRoutine} disabled={!validRoutine} />
      </Card>

      <Text style={styles.section}>Lembretes</Text>
      <Card style={styles.cardGap}>
        <View style={styles.switchRow}><View style={styles.flex}><Text style={styles.settingTitle}>Lembrar de beber água</Text><Text style={styles.description}>Somente entre {wake} e {sleep}</Text></View><Switch accessibilityLabel="Ativar lembretes" value={data.settings.reminders.enabled} disabled={savingReminder} onValueChange={toggleReminder} trackColor={{ false: colors.border, true: colors.water }} thumbColor={colors.surface} /></View>
        <Text style={styles.miniLabel}>Frequência</Text>
        <View style={styles.chips}>{frequencyOptions.map((value) => <Pressable key={value} onPress={() => chooseFrequency(value)} accessibilityRole="radio" accessibilityState={{ checked: frequency === value }} style={[styles.chip, frequency === value && styles.chipActive]}><Text style={styles.chipText}>{value === 30 ? '30 min' : value === 60 ? '1 hora' : value === 90 ? '1h30' : '2 horas'}</Text></Pressable>)}</View>
        <View style={styles.customRow}><View style={styles.flex}><Input label="Personalizado" value={customFrequency} onChangeText={setCustomFrequency} keyboardType="number-pad" suffix="min" /></View><Button label="Aplicar" variant="ghost" onPress={() => chooseFrequency(Math.max(15, Math.min(720, Number(customFrequency) || 60)))} /></View>
        <Text style={styles.disclaimer}>Os lembretes são reagendados quando o app está ativo para considerar quanto falta. Consulte as limitações no README.</Text>
      </Card>

      <Text style={styles.section}>Aplicativo</Text>
      <Card style={styles.appCard}>
        <Pressable accessibilityRole="button" onPress={resetOnboarding} style={styles.appRow}><Text style={styles.settingTitle}>Refazer onboarding</Text><Text style={styles.chevron}>›</Text></Pressable>
        <View style={styles.divider}/>
        <Pressable accessibilityRole="button" onPress={() => Alert.alert('Limpar todos os dados?', 'Histórico, configurações e personalização serão apagados. Essa ação não pode ser desfeita.', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Limpar', style: 'destructive', onPress: () => void clearEverything() }])} style={styles.appRow}><Text style={styles.danger}>Limpar dados</Text><Text style={styles.chevron}>›</Text></Pressable>
        <View style={styles.divider}/>
        <View style={styles.appRow}><View><Text style={styles.settingTitle}>Sobre o Mizu</Text><Text style={styles.description}>Versão 1.2.0 · dados apenas no aparelho</Text></View></View>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  eyebrow: { ...typography.caption, fontFamily: 'PlusJakartaSans_600SemiBold', letterSpacing: 1.6 },
  title: { ...typography.h1, marginBottom: spacing.sm },
  section: { ...typography.h2, marginTop: spacing.lg, marginBottom: spacing.sm },
  cardGap: { gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm },
  flex: { flex: 1 },
  miniLabel: { ...typography.caption, color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' },
  segment: { flexDirection: 'row', backgroundColor: colors.beigeSoft, padding: 3, borderRadius: radius.pill },
  segmentItem: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
  segmentActive: { backgroundColor: colors.surface },
  segmentText: { ...typography.button, color: colors.text },
  disclaimer: { ...typography.caption },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  settingTitle: { ...typography.body, fontFamily: 'PlusJakartaSans_600SemiBold' },
  description: { ...typography.caption, marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: { minHeight: 42, justifyContent: 'center', paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { borderColor: colors.waterDark, backgroundColor: colors.waterSoft },
  chipText: { ...typography.caption, color: colors.text },
  customRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs },
  appCard: { paddingVertical: 0 },
  appRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  divider: { height: 1, backgroundColor: colors.border },
  chevron: { fontSize: 28, color: colors.textMuted },
  danger: { ...typography.body, color: colors.danger, fontFamily: 'PlusJakartaSans_600SemiBold' },
});
