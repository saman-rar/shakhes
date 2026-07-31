import { BlubankCard } from '@/components/BlubankCard';
import { SectionHeader } from '@/components/SectionHeader';
import { StatTile } from '@/components/StatTile';
import { currentJalaliMonthName, toFa } from '@/lib/jalali';
import { Blubank } from '@/theme/blubank';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const stats = {
    referrals: 24,
    closed: 18,
    evaluated: 20,
    coverage: 83,
    qualityAvg: 88,
    knowledgeAvg: 91,
    agilityAvg: 84,
    innovationAvg: 76,
    monthlyScore: 132,
    performance: 85,
    rank: 'رتبه دوم',
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>مهدی اسدی عزیز، خوش آمدید</Text>
            <Text style={styles.date}>
              {currentJalaliMonthName()} {toFa(1405)}
            </Text>
          </View>
          <View style={styles.avatar}>
            <Feather name='user' size={22} color={Blubank.colors.primary} />
          </View>
        </View>

        <Pressable style={styles.updateBtn} onPress={() => {}}>
          <Feather name='refresh-cw' size={18} color='#FFFFFF' />
          <Text style={styles.updateText}>به‌روزرسانی داشبورد</Text>
        </Pressable>

        <SectionHeader title='وضعیت کلی' />
        <BlubankCard style={styles.grid}>
          <StatTile label='ارجاع شده' value={stats.referrals} icon='send' />
          <StatTile label='مختومه' value={stats.closed} icon='check-circle' />
          <StatTile label='ارزیابی شده' value={stats.evaluated} icon='award' />
        </BlubankCard>

        <View style={styles.halfRow}>
          <BlubankCard style={[styles.halfCard, styles.coverage]}>
            <Text style={styles.coverageValue}>{toFa(stats.coverage)}٪</Text>
            <Text style={styles.coverageLabel}>پوشش ارزیابی</Text>
          </BlubankCard>
          <BlubankCard style={styles.halfCard}>
            <Text style={styles.rankValue}>{stats.rank}</Text>
            <Text style={styles.coverageLabel}>رتبه</Text>
          </BlubankCard>
        </View>

        <SectionHeader title='میانگین شاخص‌ها' />
        <BlubankCard style={styles.grid}>
          <StatTile
            label='میانگین کیفیت'
            value={stats.qualityAvg}
            icon='star'
          />
          <StatTile
            label='میانگین دانش'
            value={stats.knowledgeAvg}
            icon='book-open'
          />
          <StatTile label='میانگین چابکی' value={stats.agilityAvg} icon='zap' />
          <StatTile
            label='میانگین نوآوری'
            value={stats.innovationAvg}
            icon='sliders'
          />
        </BlubankCard>

        <SectionHeader title='نتیجه' />
        <View style={styles.halfRow}>
          <StatTile
            label={`امتیاز ماهانه (از ${toFa(155)})`}
            value={stats.monthlyScore}
            icon='bar-chart'
          />
          <StatTile
            label='درصد عملکرد'
            value={`${toFa(stats.performance)}٪`}
            icon='trending-up'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Blubank.colors.background },
  scroll: {
    paddingHorizontal: Blubank.spacing.lg,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Blubank.spacing.sm,
    marginBottom: Blubank.spacing.xl,
  },
  greeting: { fontSize: 18, fontWeight: '700', color: Blubank.colors.text },
  date: { fontSize: 13, color: Blubank.colors.textSecondary, marginTop: 4 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Blubank.radius.pill,
    backgroundColor: Blubank.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Blubank.spacing.sm,
    backgroundColor: Blubank.colors.primary,
    borderRadius: Blubank.radius.card,
    paddingVertical: 15,
  },
  updateText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Blubank.spacing.md,
    padding: Blubank.spacing.md,
  },
  halfRow: {
    flexDirection: 'row',
    gap: Blubank.spacing.md,
  },
  halfCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Blubank.spacing.xl,
  },
  coverage: { borderLeftWidth: 4, borderLeftColor: Blubank.colors.primary },
  coverageValue: {
    fontSize: 26,
    fontWeight: '800',
    color: Blubank.colors.primary,
  },
  coverageLabel: {
    fontSize: 12,
    color: Blubank.colors.textSecondary,
    marginTop: 4,
  },
  rankValue: { fontSize: 20, fontWeight: '800', color: Blubank.colors.text },
});
