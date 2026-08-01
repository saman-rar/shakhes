import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { ShakhesTheme, typography, useTheme } from '@/theme/shakhes';
import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FORMULAS = [
  {
    icon: 'layers',
    title: 'وزن کل',
    subtitle: 'Total Weight',
    formula: 'Total Weight = Importance Coefficient × Complexity Coefficient',
    persian: 'وزن کل = ضریب اهمیت × ضریب پیچیدگی',
    fn: 'totalWeight({ importance, complexity })',
  },
  {
    icon: 'sliders',
    title: 'امتیاز فنی',
    subtitle: 'Technical Score',
    formula:
      'Technical Score = (Quality×37.5%) + (Knowledge×37.5%) + (Agility×12.5%) + (Innovation×12.5%)',
    persian: 'امتیاز فنی = کیفیت و دانش ۴۵٪ + چابکی و نوآوری سهم کمتر',
    fn: 'technicalScore({ quality, knowledge, agility, innovation })',
  },
  {
    icon: 'trending-up',
    title: 'امتیاز وزنی',
    subtitle: 'Weighted Score',
    formula: 'Weighted Score = Technical Score × Total Weight',
    persian: 'امتیاز وزنی = امتیاز فنی × وزن کل',
    fn: 'weightedScore(technical, weight)',
  },
  {
    icon: 'percent',
    title: 'درصد عملکرد',
    subtitle: 'Performance Percentage',
    formula: 'Performance Percentage = (Σ Monthly Scores ÷ 155) × 100',
    persian: 'درصد عملکرد = (مجموع امتیاز ماهانه ÷ ۱۵۵) × ۱۰۰',
    fn: 'performancePercentage(monthlyScores, 155)',
  },
];

export default function GuideScreen() {
  const b = useTheme();
  const styles = useMemo(() => makeStyles(b), [b]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title='راهنمای منطق محاسبات' />
        {FORMULAS.map((f, i) => (
          <Card key={i} style={styles.card}>
            <View style={styles.head}>
              <View style={styles.iconWrap}>
                <Feather
                  name={f.icon as any}
                  size={18}
                  color={b.colors.primary}
                />
              </View>
              <View>
                <Text style={styles.title}>{f.title}</Text>
                <Text style={styles.subtitle}>{f.subtitle}</Text>
              </View>
            </View>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>{f.formula}</Text>
            </View>
            <Text style={styles.persian}>{f.persian}</Text>
            <View style={styles.fnRow}>
              <Feather name='code' size={11} color={b.colors.textMuted} />
              <Text style={styles.fn}>lib/scoring.ts → {f.fn}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(b: ShakhesTheme) {
  const c = b.colors;
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    scroll: { paddingHorizontal: b.spacing.lg, paddingBottom: 110 },
    card: { marginBottom: b.spacing.md },
    head: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: b.spacing.md,
      marginBottom: b.spacing.md,
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: c.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 14,
      fontFamily: typography.bold,
      color: c.text,
      textAlign: 'right',
    },
    subtitle: {
      fontSize: 11,
      color: c.textSecondary,
      marginTop: 1,
      textAlign: 'right',
    },
    formulaBox: {
      backgroundColor: c.inputBackground,
      borderRadius: b.radius.input,
      padding: b.spacing.md,
      marginBottom: b.spacing.sm,
    },
    formula: { fontSize: 12, color: c.text, fontFamily: 'monospace' },
    persian: {
      fontSize: 12,
      color: c.textSecondary,
      textAlign: 'right',
      marginBottom: 6,
      fontFamily: typography.regular,
    },
    fnRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    fn: { fontSize: 11, color: c.textMuted, fontFamily: 'monospace' },
  });
}
