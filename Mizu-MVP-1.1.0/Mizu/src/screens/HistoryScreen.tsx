import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { Screen } from '../components/Screen';
import { useHydration } from '../hooks/HydrationProvider';
import { colors, radius, spacing, typography } from '../theme';
import { dateKey, daysBack, formatDay, formatTime } from '../utils/date';
import { formatVolume, progressPercent, totalForDate } from '../utils/hydration';

type Period = 'Hoje' | 'Semana' | 'Mês';

export const HistoryScreen = () => {
  const { data } = useHydration();
  const [period, setPeriod] = useState<Period>('Semana');
  const [selected, setSelected] = useState(dateKey());
  const days = useMemo(() => daysBack(period === 'Hoje' ? 1 : period === 'Semana' ? 7 : 30), [period]);
  const summaries = useMemo(() => days.map((date) => {
    const total = totalForDate(data.entries, date);
    const goal = data.dailyGoals[date] ?? data.settings.dailyGoalMl;
    return { date, total, goal, percent: progressPercent(total, goal) };
  }), [data.dailyGoals, data.entries, data.settings.dailyGoalMl, days]);
  const average = Math.round(summaries.reduce((sum, day) => sum + day.total, 0) / summaries.length);
  const selectedSummary = summaries.find((item) => item.date === selected) ?? summaries[summaries.length - 1]!;
  const selectedEntries = data.entries.filter((entry) => entry.date === selectedSummary.date);

  return (
    <Screen>
      <Text style={styles.eyebrow}>VISÃO GERAL</Text>
      <Text style={styles.title}>Histórico</Text>
      <View style={styles.segment}>{(['Hoje', 'Semana', 'Mês'] as Period[]).map((item) => (
        <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: period === item }} onPress={() => { setPeriod(item); setSelected(dateKey()); }} style={[styles.segmentItem, period === item && styles.segmentActive]}><Text style={[styles.segmentText, period === item && styles.segmentTextActive]}>{item}</Text></Pressable>
      ))}</View>

      <Card style={styles.chartCard}>
        <View style={styles.averageRow}><View><Text style={styles.label}>Média diária</Text><Text style={styles.average}>{formatVolume(average, 'L')}</Text></View><Text style={styles.periodLabel}>últimos {summaries.length} {summaries.length === 1 ? 'dia' : 'dias'}</Text></View>
        {summaries.some((day) => day.total > 0) ? (
          <View style={styles.chart} accessibilityRole="image" accessibilityLabel={`Gráfico de consumo dos últimos ${summaries.length} dias`}>
            {summaries.map((day) => {
              const fill = Math.max(day.total > 0 ? 5 : 0, Math.min(100, day.percent));
              return <Pressable key={day.date} accessibilityRole="button" accessibilityLabel={`${formatDay(day.date)}, ${day.percent} por cento da meta`} onPress={() => setSelected(day.date)} style={styles.barColumn}>
                <View style={[styles.barTrack, selected === day.date && styles.barTrackSelected]}><View style={[styles.barFill, { height: `${fill}%` }]} /></View>
                <Text numberOfLines={1} style={styles.dayLabel}>{summaries.length > 7 ? String(Number(day.date.slice(-2))) : formatDay(day.date).slice(0, 3)}</Text>
              </Pressable>;
            })}
          </View>
        ) : <EmptyState title="Um histórico tranquilo" description="Quando você registrar água, sua evolução aparecerá aqui." />}
      </Card>

      <Text style={styles.sectionTitle}>Detalhes · {formatDay(selectedSummary.date)}</Text>
      <Card>
        <View style={styles.stats}>
          <View><Text style={styles.label}>Consumido</Text><Text style={styles.statValue}>{formatVolume(selectedSummary.total)}</Text></View>
          <View><Text style={styles.label}>Meta do dia</Text><Text style={styles.statValue}>{formatVolume(selectedSummary.goal)}</Text></View>
          <View><Text style={styles.label}>Progresso</Text><Text style={styles.statValue}>{selectedSummary.percent}%</Text></View>
        </View>
        <View style={styles.divider} />
        {selectedEntries.length === 0 ? <Text style={styles.emptyLine}>Nenhum registro neste dia.</Text> : selectedEntries.map((entry) => (
          <View key={entry.id} style={styles.detailRow}><Text style={styles.detailTime}>{formatTime(entry.createdAt)}</Text><Text style={styles.detailAmount}>{formatVolume(entry.amountMl)}</Text></View>
        ))}
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  eyebrow: { ...typography.caption, fontFamily: 'PlusJakartaSans_600SemiBold', letterSpacing: 1.6 },
  title: { ...typography.h1, marginBottom: spacing.lg },
  segment: { flexDirection: 'row', backgroundColor: colors.beigeSoft, padding: 4, borderRadius: radius.pill, marginBottom: spacing.md },
  segmentItem: { flex: 1, minHeight: 42, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  segmentActive: { backgroundColor: colors.surface },
  segmentText: { ...typography.button, color: colors.textMuted },
  segmentTextActive: { color: colors.text },
  chartCard: { minHeight: 258 },
  averageRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  label: { ...typography.caption },
  average: { ...typography.h1, marginTop: 2 },
  periodLabel: { ...typography.caption },
  chart: { height: 150, flexDirection: 'row', alignItems: 'flex-end', gap: 5, marginTop: spacing.lg },
  barColumn: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  barTrack: { width: '70%', maxWidth: 24, flex: 1, borderRadius: 8, backgroundColor: colors.waterSoft, overflow: 'hidden', justifyContent: 'flex-end' },
  barTrackSelected: { borderWidth: 1, borderColor: colors.waterDark },
  barFill: { width: '100%', borderRadius: 8, backgroundColor: colors.waterDark },
  dayLabel: { ...typography.caption, fontSize: 10 },
  sectionTitle: { ...typography.h2, marginTop: spacing.lg, marginBottom: spacing.sm, textTransform: 'capitalize' },
  stats: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  statValue: { ...typography.body, fontFamily: 'PlusJakartaSans_600SemiBold', marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  detailRow: { minHeight: 42, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailTime: { ...typography.caption },
  detailAmount: { ...typography.body },
  emptyLine: { ...typography.caption, textAlign: 'center', paddingVertical: spacing.sm },
});
