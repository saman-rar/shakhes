import { BlubankCard } from '@/components/BlubankCard';
import { BlubankSelect } from '@/components/BlubankSelect';
import { ControlledScoreInput } from '@/components/ControlledScoreInput';
import { FormDateField } from '@/components/FormDateField';
import { FormField } from '@/components/FormField';
import { SectionHeader } from '@/components/SectionHeader';
import { useEmployees } from '@/context/EmployeesContext';
import {
  createReferral,
  deleteReferral,
  listReferrals,
} from '@/db/repositories';
import { Referral } from '@/db/types';
import { toFa } from '@/lib/jalali';
import { technicalScore, totalWeight, weightedScore } from '@/lib/scoring';
import { ReferralForm, referralSchema } from '@/schemas';
import { BlubankTheme, typography, useBlubank } from '@/theme/blubank';
import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
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

const TYPES = [
  { label: 'پیگیری و هماهنگی', value: 'follow_up_and_coordination' },
  { label: 'مکاتبات و پاسخگویی', value: 'correspondence_and_response' },
  { label: 'جلسه و کمیته', value: 'meeting_and_committee' },
  { label: 'بررسی اسناد و مستندات', value: 'document_review' },
  { label: 'گزارش و تحلیل', value: 'report_and_analysis' },
  { label: 'بررسی قرارداد', value: 'contract_review' },
  { label: 'مناقصه/مزایده', value: 'tender_and_auction' },
  { label: 'تنظیم/اصلاح قرارداد', value: 'contract_drafting_and_revision' },
  { label: 'حل اختلاف/ادعا', value: 'dispute_and_claim' },
  { label: 'سایر', value: 'other' },
];
const PRIORITIES = [
  { label: 'کم‌اهمیت', value: 'unimportant' },
  { label: 'عادی', value: 'normal' },
  { label: 'مهم', value: 'important' },
  { label: 'خیلی مهم', value: 'very_important' },
  { label: 'فوری/بحرانی', value: 'urgent' },
];
const STATUSES = [
  { label: 'ثبت‌ شده', value: 'registered' },
  { label: 'در حال انجام', value: 'in_progress' },
  { label: 'در انتظار پاسخ/مدارک', value: 'waiting' },
  { label: 'عودت برای اصلاح', value: 'returned' },
  { label: 'مختومه', value: 'closed' },
  { label: 'لغو شده', value: 'cancelled' },
];

export default function ReferralsScreen() {
  const b = useBlubank();
  const styles = useMemo(() => makeStyles(b), [b]);

  const { employeeOptions, getEmployeeName } = useEmployees();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const load = useCallback(async () => {
    const rows = await listReferrals();
    setReferrals(rows);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => undefined);
    }, [load]),
  );

  const remove = useCallback(async (id: string) => {
    await deleteReferral(id);
    setReferrals((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const { control, handleSubmit, reset } = useForm<ReferralForm>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      employee: '',
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

  const onSubmit = async (data: ReferralForm) => {
    const weight = totalWeight({ importance: 1, complexity: 1 });
    const tech = technicalScore({
      quality: data.quality,
      knowledge: data.knowledge,
      agility: 100 - data.effectiveDelay,
      innovation: data.innovation,
    });
    const score = weightedScore(tech, weight);
    setLastScore(score);
    const created = await createReferral({
      employeeId: data.employee,
      letterId: data.letterId,
      title: data.title,
      type: data.type,
      priority: data.priority,
      status: data.status,
      referralDate: data.referralDate,
      deadline: data.deadline,
      returnDate: data.returnDate || null,
      effectiveDelay: data.effectiveDelay,
      quality: data.quality,
      knowledge: data.knowledge,
      innovation: data.innovation,
      correctionCount: data.correctionCount,
      extraCurricular: data.extraCurricular,
      feedback: data.feedback || null,
      evaluationMonth: data.evaluationMonth || null,
      score,
    });
    setReferrals((prev) => [created, ...prev]);
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
            options={employeeOptions}
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
                <Text style={styles.switchLabel}>فوق برنامه</Text>
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{
                    false: b.colors.border,
                    true: b.colors.primarySoft,
                  }}
                  thumbColor={value ? b.colors.primary : b.colors.textMuted}
                />
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
            <Feather name='check-circle' size={18} color='#FFF' />
            <Text style={[styles.btnText, { color: '#FFF' }]}>
              ثبت و محاسبه امتیاز
            </Text>
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
        {referrals.map((r) => (
          <BlubankCard key={r.id} style={styles.rowCard}>
            <View style={styles.rowRight}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{r.title}</Text>
                <Text style={styles.rowMeta}>
                  {getEmployeeName(r.employeeId)} · {r.referralDate}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.rowScore}>
                  {r.score != null ? toFa(Math.round(r.score)) : '—'}
                </Text>
                <Text style={styles.rowScoreLabel}>امتیاز</Text>
              </View>
              <Pressable onPress={() => remove(r.id)} hitSlop={8}>
                <Feather name='trash-2' size={16} color={b.colors.danger} />
              </Pressable>
            </View>
          </BlubankCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(b: BlubankTheme) {
  const c = b.colors;
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    scroll: { paddingHorizontal: b.spacing.lg, paddingBottom: 110 },
    scoreRow: { flexDirection: 'row', gap: b.spacing.md },
    switchRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: b.spacing.md,
    },
    switchLabel: {
      color: c.text,
      fontSize: 15,
      fontFamily: typography.medium,
    },
    textarea: { minHeight: 90, textAlignVertical: 'top' },
    primaryBtn: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: b.spacing.sm,
      backgroundColor: c.primary,
      borderRadius: b.radius.input,
      paddingVertical: 14,
      marginTop: b.spacing.sm,
    },
    btnText: { fontSize: 15, fontFamily: typography.bold },
    resultBox: {
      marginTop: b.spacing.md,
      backgroundColor: c.primarySoft,
      borderRadius: b.radius.input,
      padding: b.spacing.md,
      alignItems: 'center',
    },
    resultLabel: {
      color: c.textSecondary,
      fontSize: 12,
      fontFamily: typography.medium,
    },
    resultValue: {
      color: c.primary,
      fontSize: 24,
      fontFamily: typography.bold,
    },
    rowCard: {
      marginBottom: b.spacing.sm,
      paddingVertical: b.spacing.md,
    },
    rowRight: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: b.spacing.md,
    },
    rowTitle: {
      color: c.text,
      fontSize: 15,
      fontFamily: typography.bold,
      textAlign: 'right',
    },
    rowMeta: {
      color: c.textSecondary,
      fontSize: 12,
      marginTop: 2,
      fontFamily: typography.regular,
      textAlign: 'right',
    },
    rowScore: {
      color: c.primary,
      fontSize: 18,
      fontFamily: typography.bold,
    },
    rowScoreLabel: {
      color: c.textMuted,
      fontSize: 11,
      fontFamily: typography.regular,
    },
  });
}
