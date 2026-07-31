import { BlubankCard } from '@/components/BlubankCard';
import { BlubankSelect } from '@/components/BlubankSelect';
import { ControlledScoreInput } from '@/components/ControlledScoreInput';
import { FormDateField } from '@/components/FormDateField';
import { FormField } from '@/components/FormField';
import { SectionHeader } from '@/components/SectionHeader';
import { toFa } from '@/lib/jalali';
import { technicalScore, totalWeight, weightedScore } from '@/lib/scoring';
import { ReferralForm, referralSchema } from '@/schemas';
import { Blubank } from '@/theme/blubank';
import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EMPLOYEES = [
  { label: 'مهدی اسدی', value: 'mehdi' },
  { label: 'سارا محمدی', value: 'sara' },
];
const TYPES = [
  { label: 'سایر', value: 'other' },
  { label: 'اداری', value: 'admin' },
  { label: 'فنی', value: 'tech' },
];
const PRIORITIES = [
  { label: 'عادی', value: 'normal' },
  { label: 'فوری', value: 'urgent' },
];
const STATUSES = [
  { label: 'ثبت‌شده', value: 'registered' },
  { label: 'در حال انجام', value: 'in_progress' },
  { label: 'مختومه', value: 'closed' },
];

interface Referral {
  id: string;
  employee: string;
  title: string;
  referralDate: string;
  status: string;
  score?: number;
}

export default function ReferralsScreen() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const { control, handleSubmit, reset, watch } = useForm<ReferralForm>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      employee: 'mehdi',
      letterId: '',
      title: '',
      type: 'other',
      priority: 'normal',
      status: 'registered',
      referralDate: '',
      deadline: '',
      returnDate: '',
      effectiveDelay: 0,
      quality: 0,
      knowledge: 0,
      innovation: 0,
      correctionCount: 0,
      extraCurricular: false,
      feedback: '',
      evaluationMonth: '',
    },
  });

  const onSubmit = (data: ReferralForm) => {
    const weight = totalWeight({ importance: 1, complexity: 1 });
    const tech = technicalScore({
      quality: data.quality,
      knowledge: data.knowledge,
      agility: 100 - data.effectiveDelay,
      innovation: data.innovation,
    });
    const score = weightedScore(tech, weight);
    setLastScore(score);
    setReferrals((prev) => [
      {
        id: String(Date.now()),
        employee: data.employee,
        title: data.title,
        referralDate: data.referralDate,
        status: data.status,
        score,
      },
      ...prev,
    ]);
    reset();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title='ایجاد ارجاع' />
        <BlubankCard>
          <BlubankSelect
            control={control}
            name='employee'
            label='کارمند'
            options={EMPLOYEES}
          />
          <FormField
            control={control}
            name='letterId'
            label='شناسه نامه / ارجاع'
          />
          <FormField control={control} name='title' label='عنوان ارجاع' />
          <BlubankSelect
            control={control}
            name='type'
            label='نوع'
            options={TYPES}
          />
          <BlubankSelect
            control={control}
            name='priority'
            label='اولویت'
            options={PRIORITIES}
          />
          <BlubankSelect
            control={control}
            name='status'
            label='وضعیت'
            options={STATUSES}
          />
          <FormDateField
            control={control}
            name='referralDate'
            label='تاریخ ارجاع'
          />
          <FormDateField control={control} name='deadline' label='مهلت انجام' />
          <FormDateField
            control={control}
            name='returnDate'
            label='تاریخ بازگشت'
          />
        </BlubankCard>

        <SectionHeader title='ارزیابی ارجاع' />
        <BlubankCard>
          <ControlledScoreInput
            control={control}
            name='effectiveDelay'
            label='تأخیر مؤثر (روز)'
            maxLimit={100}
          />
          <View style={styles.scoreRow}>
            <ControlledScoreInput
              control={control}
              name='quality'
              label='کیفیت (۰–۱۰۰)'
              maxLimit={100}
            />
            <ControlledScoreInput
              control={control}
              name='knowledge'
              label='دانش (۰–۱۰۰)'
              maxLimit={100}
            />
          </View>
          <View style={styles.scoreRow}>
            <ControlledScoreInput
              control={control}
              name='innovation'
              label='نوآوری (۰–۱۰۰)'
              maxLimit={100}
            />
            <ControlledScoreInput
              control={control}
              name='correctionCount'
              label='تعداد اصلاح'
              maxLimit={100}
            />
          </View>
          <Controller
            control={control}
            name='extraCurricular'
            render={({ field: { onChange, value } }) => (
              <View style={styles.switchRow}>
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{
                    false: Blubank.colors.border,
                    true: Blubank.colors.primarySoft,
                  }}
                  thumbColor={
                    value ? Blubank.colors.primary : Blubank.colors.textMuted
                  }
                />
                <Text style={styles.switchLabel}>فوق برنامه</Text>
              </View>
            )}
          />
          <FormField
            control={control}
            name='feedback'
            label='بازخورد نهایی'
            multiline
            numberOfLines={4}
            textAlignVertical='top'
            style={styles.textarea}
          />
          <FormDateField
            control={control}
            name='evaluationMonth'
            label='ماه ارزیابی'
          />
          <Pressable style={styles.primaryBtn} onPress={handleSubmit(onSubmit)}>
            <Feather name='check-circle' size={18} color='#FFFFFF' />
            <Text style={styles.primaryBtnText}>ثبت و محاسبه امتیاز</Text>
          </Pressable>
          {lastScore !== null && (
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>امتیاز محاسبه‌شده</Text>
              <Text style={styles.resultValue}>
                {toFa(lastScore.toFixed(1))}
              </Text>
            </View>
          )}
        </BlubankCard>

        <SectionHeader title='آخرین ارجاع‌ها' />
        <View style={styles.list}>
          {referrals.length === 0 && (
            <Text style={styles.empty}>هنوز ارجاعی ثبت نشده است</Text>
          )}
          {referrals.map((r) => (
            <BlubankCard key={r.id} style={styles.rowCard}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowTitle}>{r.title}</Text>
                <Text style={styles.rowMeta}>{r.referralDate}</Text>
              </View>
              <Text style={styles.rowScore}>
                {r.score ? toFa(r.score.toFixed(0)) : '—'}
              </Text>
            </BlubankCard>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Blubank.colors.background },
  scroll: { paddingHorizontal: Blubank.spacing.lg, paddingBottom: 110 },
  scoreRow: { flexDirection: 'row', gap: Blubank.spacing.md },
  switchRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Blubank.spacing.md,
  },
  switchLabel: { fontSize: 14, color: Blubank.colors.text },
  textarea: { minHeight: 90, textAlignVertical: 'top' },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Blubank.spacing.sm,
    backgroundColor: Blubank.colors.primary,
    borderRadius: Blubank.radius.input,
    paddingVertical: 14,
    marginTop: Blubank.spacing.sm,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  resultBox: {
    marginTop: Blubank.spacing.md,
    backgroundColor: Blubank.colors.primarySoft,
    borderRadius: Blubank.radius.input,
    padding: Blubank.spacing.md,
    alignItems: 'center',
  },
  resultLabel: { fontSize: 12, color: Blubank.colors.textSecondary },
  resultValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Blubank.colors.primary,
    marginTop: 2,
  },
  list: { gap: Blubank.spacing.sm },
  empty: {
    textAlign: 'center',
    color: Blubank.colors.textMuted,
    paddingVertical: Blubank.spacing.xl,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Blubank.spacing.md,
  },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: Blubank.colors.text },
  rowMeta: { fontSize: 11, color: Blubank.colors.textSecondary, marginTop: 2 },
  rowScore: { fontSize: 18, fontWeight: '800', color: Blubank.colors.primary },
});
