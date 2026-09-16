import React, { useMemo, useRef, useState } from 'react';
import { Alert, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomSheet } from '../components/BottomSheet';
import { BowlProgress } from '../components/BowlProgress';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CatIllustration } from '../components/CatIllustration';
import { EmptyState } from '../components/EmptyState';
import { Input } from '../components/Input';
import { MizuIcon } from '../components/MizuIcon';
import { Screen } from '../components/Screen';
import { WaterQuickButton } from '../components/WaterQuickButton';
import { useHydration } from '../hooks/HydrationProvider';
import { colors, spacing, typography } from '../theme';
import { WaterEntry } from '../types';
import { dateKey, formatTime, greeting } from '../utils/date';
import { catMoodForProgress, formatVolume, progressPercent } from '../utils/hydration';

export const TodayScreen = () => {
  const { data, todayTotal, addWater, editEntry, deleteEntry } = useHydration();
  const [customOpen, setCustomOpen] = useState(false);
  const [editing, setEditing] = useState<WaterEntry | null>(null);
  const [amount, setAmount] = useState('');
  const feedback = useRef(new Animated.Value(0)).current;
  const goal = data.dailyGoals[dateKey()] ?? data.settings.dailyGoalMl;
  const percent = progressPercent(todayTotal, goal);
  const mood = catMoodForProgress(percent);
  const remaining = Math.max(0, goal - todayTotal);
  const todayEntries = useMemo(() => data.entries.filter((entry) => entry.date === dateKey()).slice(0, 8), [data.entries]);

  const register = (value: number) => {
    addWater(value);
    feedback.setValue(1);
    Animated.timing(feedback, { toValue: 0, duration: 900, delay: 450, useNativeDriver: true }).start();
  };
  const openCustom = () => { setEditing(null); setAmount(''); setCustomOpen(true); };
  const openEdit = (entry: WaterEntry) => { setEditing(entry); setAmount(String(entry.amountMl)); setCustomOpen(true); };
  const saveAmount = () => {
    const value = Number(amount.replace(',', '.'));
    if (!Number.isFinite(value) || value <= 0) return;
    if (editing) editEntry(editing.id, value); else register(value);
    setCustomOpen(false);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View style={{ flex: 1, marginRight: spacing.sm }}><Text style={styles.kicker}>{greeting()}{data.settings.displayName ? `, ${data.settings.displayName}` : ''}</Text><Text style={styles.title}>Seu dia com água</Text></View>
        <View style={styles.brandBadge}><MizuIcon name="droplet" size={21} strokeWidth={1.8} color={colors.waterDark} /></View>
      </View>

      <Card style={styles.heroCard}>
        <CatIllustration color={data.settings.cat.color} mood={mood} size={204} />
        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.total}>{formatVolume(todayTotal, data.settings.unit)}</Text>
        <Text style={styles.of}>de {formatVolume(goal, data.settings.unit)}</Text>
        <BowlProgress percent={percent} />
        <View style={styles.remainingPill}><Text style={styles.remaining}>{remaining > 0 ? `Faltam ${formatVolume(remaining, data.settings.unit)} para sua meta` : `${formatVolume(todayTotal - goal, data.settings.unit)} além da meta — tudo registrado`}</Text></View>
        <Animated.Text accessibilityLiveRegion="polite" style={[styles.feedback, { opacity: feedback }]}>Água registrada ✓</Animated.Text>
      </Card>

      <Text style={styles.sectionTitle}>Registrar água</Text>
      <View style={styles.quickGrid}>
        {data.settings.quickAmounts.map((value) => <WaterQuickButton key={value} amount={value} onPress={() => register(value)} />)}
        <WaterQuickButton label="Outra quantidade" onPress={openCustom} />
      </View>

      <View style={styles.sectionRow}><Text style={styles.sectionTitle}>Registros de hoje</Text><Text style={styles.count}>{todayEntries.length}</Text></View>
      <Card style={styles.entriesCard}>
        {todayEntries.length === 0 ? <EmptyState title="Seu primeiro copo cabe aqui" description="Use um dos botões acima. O registro aparece imediatamente." /> : todayEntries.map((entry, index) => (
          <View key={entry.id} style={[styles.entry, index < todayEntries.length - 1 && styles.entryBorder]}>
            <View><Text style={styles.entryAmount}>{formatVolume(entry.amountMl)}</Text><Text style={styles.entryTime}>{formatTime(entry.createdAt)}</Text></View>
            <View style={styles.actions}>
              <Pressable accessibilityRole="button" accessibilityLabel={`Editar registro de ${entry.amountMl} mililitros`} onPress={() => openEdit(entry)} style={styles.iconAction}><MizuIcon name="pencil" size={18} strokeWidth={1.8} color={colors.waterDark} /></Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel={`Excluir registro de ${entry.amountMl} mililitros`} onPress={() => Alert.alert('Excluir registro?', `${formatVolume(entry.amountMl)} às ${formatTime(entry.createdAt)}`, [{ text: 'Cancelar', style: 'cancel' }, { text: 'Excluir', style: 'destructive', onPress: () => deleteEntry(entry.id) }])} style={styles.iconAction}><MizuIcon name="trash" size={18} strokeWidth={1.8} color={colors.danger} /></Pressable>
            </View>
          </View>
        ))}
      </Card>

      <BottomSheet visible={customOpen} title={editing ? 'Editar quantidade' : 'Outra quantidade'} onClose={() => setCustomOpen(false)}>
        <Input label="Quantidade" value={amount} onChangeText={setAmount} keyboardType="number-pad" suffix="ml" autoFocus placeholder="250" />
        <Button label={editing ? 'Salvar alteração' : 'Registrar água'} onPress={saveAmount} disabled={!Number(amount) || Number(amount) <= 0} />
      </BottomSheet>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  kicker: { ...typography.caption, marginBottom: 2 },
  title: { ...typography.h1 },
  brandBadge: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.waterSoft, alignItems: 'center', justifyContent: 'center' },
  heroCard: { alignItems: 'center', paddingTop: spacing.lg, paddingBottom: spacing.md, overflow: 'hidden' },
  total: { ...typography.display, marginTop: -9 },
  of: { ...typography.body, color: colors.textMuted },
  remainingPill: { backgroundColor: colors.beigeSoft, borderRadius: 99, paddingHorizontal: spacing.md, paddingVertical: 8, marginTop: -3 },
  remaining: { ...typography.caption, textAlign: 'center', color: colors.text },
  feedback: { ...typography.caption, color: colors.success, height: 20, marginTop: spacing.xs },
  sectionTitle: { ...typography.h2, marginTop: spacing.lg, marginBottom: spacing.sm },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  count: { ...typography.caption, marginTop: spacing.md, backgroundColor: colors.beigeSoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9 },
  entriesCard: { paddingVertical: 0 },
  entry: { minHeight: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  entryBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  entryAmount: { ...typography.body, fontFamily: 'PlusJakartaSans_600SemiBold' },
  entryTime: { ...typography.caption },
  actions: { flexDirection: 'row', gap: 2 },
  iconAction: { minHeight: 44, minWidth: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
