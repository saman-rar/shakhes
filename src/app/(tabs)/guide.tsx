import { BlubankCard } from '@/components/BlubankCard';
import { SectionHeader } from '@/components/SectionHeader';
import { Blubank } from '@/theme/blubank';
import { Feather } from '@expo/vector-icons';
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
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title='راهنمای منطق محاسبات' />
        {FORMULAS.map((f, i) => (
          <BlubankCard key={i} style={styles.card}>
            <View style={styles.head}>
              <View style={styles.iconWrap}>
                <Feather
                  name={f.icon as any}
                  size={18}
                  color={Blubank.colors.primary}
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
              <Feather name='code' size={11} color={Blubank.colors.textMuted} />
              <Text style={styles.fn}>lib/scoring.ts → {f.fn}</Text>
            </View>
          </BlubankCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Blubank.colors.background },
  scroll: { paddingHorizontal: Blubank.spacing.lg, paddingBottom: 110 },
  card: { marginBottom: Blubank.spacing.md },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Blubank.spacing.md,
    marginBottom: Blubank.spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Blubank.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 14, fontWeight: '700', color: Blubank.colors.text },
  subtitle: { fontSize: 11, color: Blubank.colors.textSecondary, marginTop: 1 },
  formulaBox: {
    backgroundColor: Blubank.colors.inputBackground,
    borderRadius: Blubank.radius.input,
    padding: Blubank.spacing.md,
    marginBottom: Blubank.spacing.sm,
  },
  formula: {
    fontSize: 12,
    color: Blubank.colors.text,
    fontFamily: 'monospace',
  },
  persian: {
    fontSize: 12,
    color: Blubank.colors.textSecondary,
    textAlign: 'right',
    marginBottom: 6,
  },
  fnRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  fn: {
    fontSize: 11,
    color: Blubank.colors.textMuted,
    fontFamily: 'monospace',
  },
});
