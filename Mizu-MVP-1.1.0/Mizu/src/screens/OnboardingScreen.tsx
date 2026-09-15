import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { CatIllustration } from '../components/CatIllustration';
import { Input } from '../components/Input';
import { TimeInput } from '../components/TimeInput';
import { useHydration } from '../hooks/HydrationProvider';
import { colors, spacing, typography } from '../theme';
import { isValidTime } from '../utils/date';
import { calculateGoal, formatVolume } from '../utils/hydration';

export const OnboardingScreen = () => {
  const { completeOnboarding } = useHydration();
  const [step, setStep] = useState(0);
  const [weight, setWeight] = useState('65');
  const [wake, setWake] = useState('07:30');
  const [sleep, setSleep] = useState('23:30');
  const weightNumber = Number(weight.replace(',', '.'));
  const goal = useMemo(() => calculateGoal(weightNumber), [weightNumber]);
  const validWeight = weightNumber >= 25 && weightNumber <= 350;
  const validRoutine = isValidTime(wake) && isValidTime(sleep) && wake !== sleep;

  const next = () => {
    if (step === 3) completeOnboarding(weightNumber, { wakeTime: wake, sleepTime: sleep });
    else setStep((value) => value + 1);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topRow}>
          {step > 0 ? <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={() => setStep((value) => value - 1)} hitSlop={12}><Text style={styles.back}>‹</Text></Pressable> : <View style={styles.backSpace} />}
          <Text style={styles.brand}>mizu</Text>
          <Text style={styles.counter}>{step + 1}/4</Text>
        </View>

        <View style={styles.content}>
          {step === 0 ? <>
            <View style={styles.hero}><CatIllustration color="black" mood="happy" size={220} /></View>
            <Text style={styles.display}>Vamos cuidar da sua hidratação juntos.</Text>
            <Text style={styles.support}>Uma companhia leve para lembrar da água, sem cobranças.</Text>
          </> : null}

          {step === 1 ? <>
            <Text style={styles.title}>Quanto você pesa?</Text>
            <Text style={styles.support}>Usaremos seu peso para criar uma meta inicial de hidratação.</Text>
            <Input label="Peso" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" suffix="kg" autoFocus error={weight.length > 0 && !validWeight ? 'Digite um peso entre 25 e 350 kg.' : undefined} />
          </> : null}

          {step === 2 ? <>
            <Text style={styles.title}>Qual é sua rotina?</Text>
            <Text style={styles.support}>Assim conseguimos distribuir seus lembretes durante o dia.</Text>
            <View style={styles.row}><View style={styles.flex}><TimeInput label="Acordo" value={wake} onChange={setWake} /></View><View style={styles.flex}><TimeInput label="Durmo" value={sleep} onChange={setSleep} /></View></View>
          </> : null}

          {step === 3 ? <>
            <Text style={styles.eyebrow}>SUA META DIÁRIA</Text>
            <Text style={styles.goal}>{formatVolume(goal)}</Text>
            <View style={styles.goalVisual}><CatIllustration color="black" mood="playing" size={190} /></View>
            <Text style={styles.support}>Essa é apenas uma estimativa inicial baseada em {weightNumber} kg × 35 ml. Você pode alterar sua meta quando quiser.</Text>
          </> : null}
        </View>

        <View style={styles.footer}>
          <Button label={step === 0 ? 'Começar' : step === 3 ? 'Começar meu dia' : 'Continuar'} onPress={next} disabled={(step === 1 && !validWeight) || (step === 2 && !validRoutine)} />
          <View style={styles.dots}>{[0, 1, 2, 3].map((item) => <View key={item} style={[styles.dot, item === step && styles.dotActive]} />)}</View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  fill: { flex: 1, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  topRow: { height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { ...typography.h2, letterSpacing: 2 },
  counter: { ...typography.caption, width: 34, textAlign: 'right' },
  back: { fontSize: 36, lineHeight: 38, color: colors.text },
  backSpace: { width: 34 },
  content: { flex: 1, justifyContent: 'center', gap: spacing.lg, width: '100%', maxWidth: 560, alignSelf: 'center' },
  hero: { alignItems: 'center', marginBottom: spacing.sm },
  display: { ...typography.display, textAlign: 'center' },
  title: { ...typography.h1 },
  support: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  row: { flexDirection: 'row', gap: spacing.sm },
  flex: { flex: 1 },
  eyebrow: { ...typography.caption, textAlign: 'center', fontFamily: 'PlusJakartaSans_600SemiBold', letterSpacing: 1.8 },
  goal: { ...typography.display, textAlign: 'center', fontSize: 46 },
  goalVisual: { alignItems: 'center' },
  footer: { gap: spacing.md, width: '100%', maxWidth: 560, alignSelf: 'center' },
  dots: { flexDirection: 'row', gap: spacing.xs, justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { width: 20, backgroundColor: colors.waterDark },
});
