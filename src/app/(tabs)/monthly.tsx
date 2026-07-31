import { BlubankCard } from '@/components/BlubankCard';
import { ControlledScoreInput } from '@/components/ControlledScoreInput';
import { SectionHeader } from '@/components/SectionHeader';
import { MONTHLY_MAX, performancePercentage } from '@/lib/scoring';
import { MonthlyForm, monthlySchema } from '@/schemas';
import { Blubank } from '@/theme/blubank';
import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FIELDS: { name: keyof MonthlyForm; label: string; max: number }[] = [
  { name: 'accuracy', label: 'دقت', max: MONTHLY_MAX.accuracy },
  { name: 'knowledge', label: 'دانش', max: MONTHLY_MAX.knowledge },
  {
    name: 'knowledgeSharing',
    label: 'نشر دانش',
    max: MONTHLY_MAX.knowledgeSharing,
  },
  { name: 'convergence', label: 'همگرایی', max: MONTHLY_MAX.convergence },
  {
    name: 'participation',
    label: 'مشارکت‌پذیری',
    max: MONTHLY_MAX.participation,
  },
  {
    name: 'extraCurricular',
    label: 'فوق‌برنامه',
    max: MONTHLY_MAX.extraCurricular,
  },
  { name: 'orgSystem', label: 'نظام سازمانی', max: MONTHLY_MAX.orgSystem },
  { name: 'innovation', label: 'نوآوری', max: MONTHLY_MAX.innovation },
];
const SCALE_SUM = 155;

export default function MonthlyScreen() {
  const [result, setResult] = useState<MonthlyForm | null>(null);
  const [saved, setSaved] = useState(false);

  const { control, handleSubmit, getValues, watch } = useForm<MonthlyForm>({
    resolver: zodResolver(monthlySchema),
    defaultValues: {
      accuracy: 0,
      knowledge: 0,
      knowledgeSharing: 0,
      convergence: 0,
      participation: 0,
      extraCurricular: 0,
      orgSystem: 0,
      innovation: 0,
    },
  });

  const values = watch();
  const liveTotal = FIELDS.reduce(
    (s, f) => s + (Number(values[f.name]) || 0),
    0,
  );

  const showResult = () => {
    const v = getValues();
    setResult({ ...v });
    setSaved(false);
  };

  const onSubmit = (data: MonthlyForm) => {
    setResult(data);
    setSaved(true);
  };

  const total = result
    ? FIELDS.reduce((s, f) => s + (Number(result[f.name]) || 0), 0)
    : 0;
  const percent = result ? performancePercentage([total], SCALE_SUM) : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <BlubankCard style={styles.headerCard}>
          <View style={styles.avatar}>
            <Feather name='user' size={22} color={Blubank.colors.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>مهدی اسدی</Text>
            <Text style={styles.sub}>ارزیابی ماهانه</Text>
          </View>
          <View style={styles.period}>
            <Text style={styles.periodMonth}>فروردین</Text>
            <Text style={styles.periodYear}>۱۴۰۵</Text>
          </View>
        </BlubankCard>

        <SectionHeader title='امتیازهای ماهانه' />
        <BlubankCard>
          <View style={styles.grid}>
            {FIELDS.map((f) => (
              <ControlledScoreInput
                key={f.name}
                control={control}
                name={f.name}
                label={f.label}
                maxLimit={f.max}
              />
            ))}
          </View>

          <View style={styles.liveBar}>
            <Text style={styles.liveLabel}>مجموع فعلی</Text>
            <Text style={styles.liveValue}>
              {liveTotal} / {SCALE_SUM}
            </Text>
          </View>

          <View style={styles.btnRow}>
            <Pressable style={styles.ghostBtn} onPress={showResult}>
              <Feather name='eye' size={16} color={Blubank.colors.primary} />
              <Text style={styles.ghostText}>نمایش نتیجه</Text>
            </Pressable>
            <Pressable
              style={styles.primaryBtn}
              onPress={handleSubmit(onSubmit)}
            >
              <Feather name='check-circle' size={16} color='#FFFFFF' />
              <Text style={styles.primaryText}>ثبت ارزیابی ماهانه</Text>
            </Pressable>
          </View>
        </BlubankCard>

        {result && (
          <>
            <SectionHeader title='نتیجه محاسبه' />
            <BlubankCard>
              {FIELDS.map((f) => (
                <View key={f.name} style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{f.label}</Text>
                  <Text style={styles.resultValue}>
                    {result[f.name]}{' '}
                    <Text style={styles.resultMax}>/ {f.max}</Text>
                  </Text>
                </View>
              ))}
              <View style={styles.divider} />
              <View style={styles.resultRow}>
                <Text style={styles.totalLabel}>مجموع امتیازات</Text>
                <Text style={styles.totalValue}>{total}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.totalLabel}>
                  درصد عملکرد (از {SCALE_SUM})
                </Text>
                <Text style={styles.percentValue}>{percent.toFixed(1)}٪</Text>
              </View>
              {saved && (
                <View style={styles.savedBadge}>
                  <Feather
                    name='check'
                    size={13}
                    color={Blubank.colors.success}
                  />
                  <Text style={styles.savedText}>ارزیابی ثبت شد</Text>
                </View>
              )}
            </BlubankCard>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Blubank.colors.background },
  scroll: { paddingHorizontal: Blubank.spacing.lg, paddingBottom: 110 },
  headerCard: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Blubank.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: { flex: 1, marginStart: Blubank.spacing.md },
  name: { fontSize: 15, fontWeight: '700', color: Blubank.colors.text },
  sub: { fontSize: 12, color: Blubank.colors.textSecondary, marginTop: 2 },
  period: { alignItems: 'flex-end' },
  periodMonth: {
    fontSize: 14,
    fontWeight: '700',
    color: Blubank.colors.primary,
  },
  periodYear: {
    fontSize: 12,
    color: Blubank.colors.textSecondary,
    marginTop: 1,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Blubank.spacing.sm },
  liveBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Blubank.colors.inputBackground,
    borderRadius: Blubank.radius.input,
    paddingHorizontal: Blubank.spacing.md,
    paddingVertical: Blubank.spacing.sm,
    marginTop: Blubank.spacing.sm,
  },
  liveLabel: { fontSize: 12, color: Blubank.colors.textSecondary },
  liveValue: { fontSize: 14, fontWeight: '700', color: Blubank.colors.primary },
  btnRow: {
    flexDirection: 'row',
    gap: Blubank.spacing.md,
    marginTop: Blubank.spacing.lg,
  },
  ghostBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Blubank.colors.primary,
    borderRadius: Blubank.radius.input,
    paddingVertical: 13,
  },
  ghostText: { color: Blubank.colors.primary, fontSize: 14, fontWeight: '700' },
  primaryBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Blubank.colors.primary,
    borderRadius: Blubank.radius.input,
    paddingVertical: 13,
  },
  primaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Blubank.spacing.sm,
  },
  resultLabel: { fontSize: 13, color: Blubank.colors.textSecondary },
  resultValue: { fontSize: 14, fontWeight: '700', color: Blubank.colors.text },
  resultMax: {
    fontSize: 11,
    fontWeight: '400',
    color: Blubank.colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Blubank.colors.border,
    marginVertical: Blubank.spacing.xs,
  },
  totalLabel: { fontSize: 14, fontWeight: '700', color: Blubank.colors.text },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Blubank.colors.primary,
  },
  percentValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Blubank.colors.success,
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#E7F6EC',
    borderRadius: Blubank.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: Blubank.spacing.sm,
  },
  savedText: { fontSize: 12, color: Blubank.colors.success, fontWeight: '700' },
});
