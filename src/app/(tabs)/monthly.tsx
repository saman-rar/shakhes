import { BlubankCard } from '@/components/BlubankCard';
import { ControlledScoreInput } from '@/components/ControlledScoreInput';
import { SectionHeader } from '@/components/SectionHeader';
import { useEmployees } from '@/context/EmployeesContext';
import {
  listMonthlyEvaluations,
  upsertMonthlyEvaluation,
} from '@/db/repositories';
import { MonthlyEvaluation } from '@/db/types';
import { JALALI_MONTHS, toFa } from '@/lib/jalali';
import { MONTHLY_MAX, performancePercentage } from '@/lib/scoring';
import { MonthlyForm, monthlySchema } from '@/schemas';
import { BlubankTheme, typography, useBlubank } from '@/theme/blubank';
import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

const CURRENT_YEAR = 1405;

export default function MonthlyScreen() {
  const b = useBlubank();
  const styles = useMemo(() => makeStyles(b), [b]);

  const { employees, getEmployeeName } = useEmployees();
  const [employeeId, setEmployeeId] = useState('');
  const [monthIdx, setMonthIdx] = useState(0);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [picker, setPicker] = useState<'month' | 'employee' | null>(null);
  const [result, setResult] = useState<MonthlyForm | null>(null);
  const [isShowResult, setIsShowResult] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<MonthlyEvaluation[]>([]);

  const employee = employees.find((e) => e.id === employeeId);
  const monthLabel = JALALI_MONTHS[monthIdx];

  const load = useCallback(async () => {
    const rows = await listMonthlyEvaluations();
    setHistory(rows);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => undefined);
    }, [load]),
  );

  const { control, handleSubmit, getValues, watch, reset } =
    useForm<MonthlyForm>({
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
    if (isShowResult) {
      setIsShowResult(false);
    } else {
      const v = getValues();
      setResult({ ...v });
      setSaved(false);
      setIsShowResult(true);
    }
  };

  const onSubmit = async (data: MonthlyForm) => {
    if (!employeeId) return;
    const total = FIELDS.reduce((s, f) => s + (Number(data[f.name]) || 0), 0);
    const percent = performancePercentage([total], SCALE_SUM);
    await upsertMonthlyEvaluation({
      employeeId,
      month: monthLabel,
      year: String(year),
      accuracy: data.accuracy,
      knowledge: data.knowledge,
      knowledgeSharing: data.knowledgeSharing,
      convergence: data.convergence,
      participation: data.participation,
      extraCurricular: data.extraCurricular,
      orgSystem: data.orgSystem,
      innovation: data.innovation,
      total,
      percent,
    });
    setResult({ ...data });
    setSaved(true);
    load().catch(() => undefined);
  };

  const total = result
    ? FIELDS.reduce((s, f) => s + (Number(result[f.name]) || 0), 0)
    : 0;
  const percent = result ? performancePercentage([total], SCALE_SUM) : 0;

  const canSubmit = employeeId.length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <BlubankCard style={styles.headerCard}>
          <View style={styles.avatar}>
            <Feather name='user' size={22} color={b.colors.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>
              {employee ? employee.fullName : 'کارمند را انتخاب کنید'}
            </Text>
            <Text style={styles.sub}>ارزیابی ماهانه</Text>
          </View>
          <Pressable
            style={styles.period}
            onPress={() => setPicker('month')}
            hitSlop={8}
          >
            <Text style={styles.periodMonth}>{monthLabel}</Text>
            <Text style={styles.periodYear}>{toFa(year)}</Text>
          </Pressable>
        </BlubankCard>

        <SectionHeader title='انتخاب کارمند' />
        <BlubankCard>
          <Pressable
            style={styles.picker}
            onPress={() => setPicker('employee')}
          >
            <Feather name='users' size={16} color={b.colors.textSecondary} />
            <Text style={styles.pickerText}>
              {employee ? employee.fullName : 'انتخاب کنید…'}
            </Text>
            <Feather
              name='chevron-down'
              size={16}
              color={b.colors.textSecondary}
            />
          </Pressable>
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
              {toFa(liveTotal)} / {toFa(SCALE_SUM)}
            </Text>
          </View>

          <View style={styles.btnRow}>
            <Pressable style={styles.ghostBtn} onPress={showResult}>
              <Feather
                name={isShowResult ? 'eye-off' : 'eye'}
                size={16}
                color={b.colors.primary}
              />
              <Text style={styles.ghostText}>
                {isShowResult ? 'پنهان کردن نتایج' : 'نمایش نتیجه'}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.primaryBtn, !canSubmit && styles.disabled]}
              disabled={!canSubmit}
              onPress={handleSubmit(onSubmit)}
            >
              <Feather name='check-circle' size={16} color='#FFF' />
              <Text style={styles.primaryText}>ثبت ارزیابی ماهانه</Text>
            </Pressable>
          </View>
        </BlubankCard>

        {isShowResult && result && (
          <>
            <SectionHeader title='نتیجه محاسبه' />
            <BlubankCard>
              {FIELDS.map((f) => (
                <View key={f.name} style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{f.label}</Text>
                  <Text style={styles.resultValue}>
                    {toFa(result[f.name])}{' '}
                    <Text style={styles.resultMax}>/ {toFa(f.max)}</Text>
                  </Text>
                </View>
              ))}
              <View style={styles.divider} />
              <View style={styles.resultRow}>
                <Text style={styles.totalLabel}>مجموع امتیازات</Text>
                <Text style={styles.totalValue}>{toFa(total)}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.totalLabel}>
                  درصد عملکرد (از {toFa(SCALE_SUM)})
                </Text>
                <Text style={styles.percentValue}>
                  {toFa(percent.toFixed(1))}٪
                </Text>
              </View>
              {saved && (
                <View style={styles.savedBadge}>
                  <Feather name='check' size={13} color={b.colors.success} />
                  <Text style={styles.savedText}>ارزیابی ثبت شد</Text>
                </View>
              )}
            </BlubankCard>
          </>
        )}

        {isShowResult && (
          <>
            <SectionHeader title='سوابق ارزیابی' />
            <View style={styles.historyList}>
              {history.length === 0 && (
                <Text style={styles.empty}>هنوز ارزیابی ثبت نشده است</Text>
              )}
              {history.map((h) => (
                <BlubankCard key={h.id} style={styles.historyCard}>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyName}>
                      {getEmployeeName(h.employeeId)}
                    </Text>
                    <Text style={styles.historyMeta}>
                      {h.month} · {toFa(h.year)}
                    </Text>
                  </View>
                  <View style={styles.historyBadge}>
                    <Text style={styles.historyScore}>{toFa(h.total)}</Text>
                    <Text style={styles.historyPercent}>
                      {toFa(h.percent.toFixed(0))}٪
                    </Text>
                  </View>
                </BlubankCard>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <Modal
        transparent
        visible={picker !== null}
        animationType='slide'
        onRequestClose={() => setPicker(null)}
      >
        <Pressable style={styles.overlay} onPress={() => setPicker(null)}>
          <View style={styles.sheet}>
            <BlubankCard padded={false} style={styles.sheetCard}>
              <Text style={styles.sheetTitle}>
                {picker === 'employee' ? 'انتخاب کارمند' : 'انتخاب ماه'}
              </Text>

              {picker === 'employee' &&
                (employees.length === 0 ? (
                  <Text style={styles.sheetEmpty}>ابتدا کارمندی ثبت کنید</Text>
                ) : (
                  employees.map((e) => (
                    <TouchableOpacity
                      key={e.id}
                      style={styles.optionRow}
                      onPress={() => {
                        setEmployeeId(e.id);
                        setSaved(false);
                        setResult(null);
                        reset();
                        setPicker(null);
                      }}
                    >
                      {employeeId === e.id && (
                        <Feather
                          name='check'
                          size={18}
                          color={b.colors.primary}
                        />
                      )}
                      <Text style={styles.optionText}>{e.fullName}</Text>
                    </TouchableOpacity>
                  ))
                ))}

              {picker === 'month' &&
                JALALI_MONTHS.map((m, i) => (
                  <TouchableOpacity
                    key={m}
                    style={styles.optionRow}
                    onPress={() => {
                      setMonthIdx(i);
                      setSaved(false);
                      setPicker(null);
                    }}
                  >
                    {monthIdx === i && (
                      <Feather
                        name='check'
                        size={18}
                        color={b.colors.primary}
                      />
                    )}
                    <Text style={styles.optionText}>{m}</Text>
                  </TouchableOpacity>
                ))}

              {picker === 'month' && (
                <View style={styles.yearRow}>
                  <TouchableOpacity
                    style={styles.yearBtn}
                    onPress={() => setYear((y) => Math.max(1380, y - 1))}
                  >
                    <Text style={styles.yearBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.yearValue}>{toFa(year)}</Text>
                  <TouchableOpacity
                    style={styles.yearBtn}
                    onPress={() => setYear((y) => Math.min(1450, y + 1))}
                  >
                    <Text style={styles.yearBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </BlubankCard>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function makeStyles(b: BlubankTheme) {
  const c = b.colors;
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    scroll: { paddingHorizontal: b.spacing.lg, paddingBottom: 110 },
    headerCard: { flexDirection: 'row-reverse', alignItems: 'center' },
    avatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: c.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerInfo: { flex: 1, marginStart: b.spacing.md },
    name: { fontSize: 15, fontFamily: typography.bold, color: c.text },
    sub: {
      fontSize: 12,
      color: c.textSecondary,
      marginTop: 2,
      fontFamily: typography.regular,
    },
    period: { alignItems: 'flex-end' },
    periodMonth: {
      fontSize: 14,
      fontFamily: typography.bold,
      color: c.primary,
    },
    periodYear: {
      fontSize: 12,
      color: c.textSecondary,
      marginTop: 1,
      fontFamily: typography.regular,
    },
    picker: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.inputBackground,
      borderRadius: b.radius.input,
      paddingHorizontal: b.spacing.md,
      paddingVertical: 13,
    },
    pickerText: {
      flex: 1,
      fontSize: 15,
      color: c.text,
      textAlign: 'right',
      fontFamily: typography.regular,
    },
    grid: {
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      gap: b.spacing.sm,
    },
    liveBar: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: c.inputBackground,
      borderRadius: b.radius.input,
      paddingHorizontal: b.spacing.md,
      paddingVertical: b.spacing.sm,
      marginTop: b.spacing.sm,
    },
    liveLabel: {
      fontSize: 12,
      color: c.textSecondary,
      fontFamily: typography.regular,
    },
    liveValue: { fontSize: 14, fontFamily: typography.bold, color: c.primary },
    btnRow: {
      flexDirection: 'row-reverse',
      gap: b.spacing.md,
      marginTop: b.spacing.lg,
    },
    ghostBtn: {
      flex: 1,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderWidth: 1,
      borderColor: c.primary,
      borderRadius: b.radius.input,
      paddingVertical: 13,
    },
    ghostText: { color: c.primary, fontSize: 14, fontFamily: typography.bold },
    primaryBtn: {
      flex: 1.4,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: c.primary,
      borderRadius: b.radius.input,
      paddingVertical: 13,
    },
    disabled: { opacity: 0.5 },
    primaryText: {
      color: '#fff',
      fontSize: 14,
      fontFamily: typography.bold,
    },
    resultRow: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: b.spacing.sm,
    },
    resultLabel: {
      fontSize: 13,
      color: c.textSecondary,
      fontFamily: typography.regular,
    },
    resultValue: { fontSize: 14, fontFamily: typography.bold, color: c.text },
    resultMax: { fontSize: 11, color: c.textMuted },
    divider: {
      height: 1,
      backgroundColor: c.border,
      marginVertical: b.spacing.xs,
    },
    totalLabel: { fontSize: 14, fontFamily: typography.bold, color: c.text },
    totalValue: { fontSize: 16, fontFamily: typography.bold, color: c.primary },
    percentValue: {
      fontSize: 15,
      fontFamily: typography.bold,
      color: c.success,
    },
    savedBadge: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 5,
      alignSelf: 'flex-end',
      backgroundColor: c.successSoft,
      borderRadius: b.radius.pill,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginTop: b.spacing.sm,
    },
    savedText: {
      fontSize: 12,
      color: c.success,
      fontFamily: typography.bold,
    },
    historyList: { gap: b.spacing.sm },
    historyCard: { flexDirection: 'row-reverse', alignItems: 'center' },
    historyInfo: { flex: 1 },
    historyName: {
      fontSize: 14,
      fontFamily: typography.bold,
      color: c.text,
      textAlign: 'right',
    },
    historyMeta: {
      fontSize: 12,
      color: c.textSecondary,
      marginTop: 2,
      fontFamily: typography.regular,
      textAlign: 'right',
    },
    historyBadge: { alignItems: 'flex-end' },
    historyScore: {
      fontSize: 16,
      fontFamily: typography.bold,
      color: c.primary,
    },
    historyPercent: {
      fontSize: 12,
      fontFamily: typography.bold,
      color: c.success,
      marginTop: 2,
    },
    empty: {
      textAlign: 'center',
      color: c.textMuted,
      paddingVertical: b.spacing.xl,
      fontFamily: typography.regular,
    },
    overlay: {
      flex: 1,
      backgroundColor: c.overlay,
      justifyContent: 'flex-end',
    },
    sheet: { paddingBottom: b.spacing.xl },
    sheetCard: {
      borderTopLeftRadius: b.radius.tab,
      borderTopRightRadius: b.radius.tab,
      paddingTop: b.spacing.xl,
      paddingHorizontal: b.spacing.lg,
      paddingBottom: b.spacing.xl,
      maxHeight: '80%',
    },
    sheetTitle: {
      fontSize: 16,
      fontFamily: typography.bold,
      color: c.text,
      marginBottom: b.spacing.md,
      textAlign: 'right',
    },
    sheetEmpty: {
      textAlign: 'center',
      color: c.textMuted,
      paddingVertical: b.spacing.lg,
      fontFamily: typography.regular,
    },
    optionRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: b.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: c.inputBackground,
    },
    optionText: { fontSize: 15, color: c.text, fontFamily: typography.regular },
    yearRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: b.spacing.lg,
      marginTop: b.spacing.md,
    },
    yearBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.inputBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    yearBtnText: { fontSize: 18, fontFamily: typography.bold, color: c.text },
    yearValue: { fontSize: 16, fontFamily: typography.bold, color: c.text },
  });
}
