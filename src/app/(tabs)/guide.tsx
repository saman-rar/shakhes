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
    persian: 'وزن کل = ضریب اهمیت × ضریب پیچیدگی',
  },
  {
    icon: 'sliders',
    title: 'امتیاز فنی',
    subtitle: 'Technical Score',
    persian:
      'امتیاز فنی = کیفیت ۳۷.۵% + دانش ۳۷.۵% + چابکی و نوآوری سهم کمتر ۱۲.۵%',
  },
  {
    icon: 'trending-up',
    title: 'امتیاز وزنی',
    subtitle: 'Weighted Score',
    persian: 'امتیاز وزنی = امتیاز فنی × وزن کل',
  },
  {
    icon: 'percent',
    title: 'درصد عملکرد',
    subtitle: 'Performance Percentage',
    persian: 'درصد عملکرد = (مجموع امتیاز ماهانه ÷ ۱۵۵) × ۱۰۰',
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
              <Text style={styles.formula}>{f.persian}</Text>
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
      textAlign: 'right',
    },
    formula: {
      fontSize: 12,
      color: c.text,
      fontFamily: 'monospace',
      textAlign: 'right',
    },
  });
}
