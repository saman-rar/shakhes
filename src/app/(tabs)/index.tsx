import { Card } from '@/components/Card';
import { Select } from '@/components/Select';
import { FormDateField } from '@/components/FormDateField';
import { SectionHeader } from '@/components/SectionHeader';
import { StatTile } from '@/components/StatTile';
import { useEmployees } from '@/context/EmployeesContext';
import { toFa } from '@/lib/jalali';
import { dashboardSchema, DashboardForm } from '@/schemas';
import { typography, useTheme } from '@/theme/shakhes';
import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const { employeeOptions, getEmployeeName } = useEmployees();
  const b = useTheme();
  const c = b.colors;

  const { control, handleSubmit, reset } = useForm<DashboardForm>({
    resolver: zodResolver(dashboardSchema),
    defaultValues: {
      employee: '',
      date: '',
    },
  });

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: c.background }]}
      edges={['top']}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingHorizontal: b.spacing.lg,
            paddingBottom: 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.header,
            { marginBottom: b.spacing.md, paddingTop: 20 },
          ]}
        >
          <Select
            control={control}
            name='employee'
            label='کارمند'
            options={employeeOptions}
          />
          <FormDateField control={control} name='date' label='تاریخ' />
        </View>

        <Pressable
          style={[styles.updateBtn, { backgroundColor: c.primary }]}
          onPress={() => {}}
        >
          <Feather name='refresh-cw' size={18} color='#FFF' />
          <Text
            style={{
              color: '#FFF',
              fontFamily: typography.bold,
              fontSize: 16,
            }}
          >
            به‌روزرسانی داشبورد
          </Text>
        </Pressable>

        <SectionHeader title='شاخص‌های کلی' />
        <Card style={styles.container}>
          <StatTile
            style={styles.item}
            icon='send'
            label='ارجاع شده'
            value={toFa(14)}
            tone='primary'
          />
          <StatTile
            style={styles.item}
            icon='check-circle'
            label='مختومه'
            value={toFa(9)}
            tone='primary'
          />
          <StatTile
            style={styles.item}
            icon='clipboard'
            label='ارزیابی شده'
            value={toFa(11)}
            tone='primary'
          />
          <StatTile
            style={styles.item}
            icon='percent'
            label='پوشش ارزیابی'
            value='۷۹٪'
            tone='primary'
          />
        </Card>

        <View style={styles.halfRow}>
          <View style={styles.halfCard}>
            <Card style={styles.tilePadding}>
              <View style={styles.centerCol}>
                <Text
                  style={{
                    color: c.textSecondary,
                    fontFamily: typography.medium,
                    fontSize: 13,
                  }}
                >
                  میانگین کیفیت
                </Text>
                <Text
                  style={[
                    styles.big,
                    { color: c.text, fontFamily: typography.bold },
                  ]}
                >
                  {toFa(88)}
                </Text>
              </View>
            </Card>
          </View>
          <View style={styles.halfCard}>
            <Card style={styles.tilePadding}>
              <View style={styles.centerCol}>
                <Text
                  style={{
                    color: c.textSecondary,
                    fontFamily: typography.medium,
                    fontSize: 13,
                  }}
                >
                  میانگین دانش
                </Text>
                <Text
                  style={[
                    styles.big,
                    { color: c.text, fontFamily: typography.bold },
                  ]}
                >
                  {toFa(91)}
                </Text>
              </View>
            </Card>
          </View>
        </View>

        <View style={styles.rowTwo}>
          <Card style={styles.rowTwoCard}>
            <View style={styles.centerCol}>
              <Text
                style={{
                  color: c.textSecondary,
                  fontFamily: typography.medium,
                  fontSize: 13,
                }}
              >
                میانگین چابکی
              </Text>
              <Text
                style={[
                  styles.big,
                  { color: c.text, fontFamily: typography.bold },
                ]}
              >
                {toFa(84)}
              </Text>
            </View>
          </Card>
          <Card style={styles.rowTwoCard}>
            <View style={styles.centerCol}>
              <Text
                style={{
                  color: c.textSecondary,
                  fontFamily: typography.medium,
                  fontSize: 13,
                }}
              >
                میانگین نوآوری
              </Text>
              <Text
                style={[
                  styles.big,
                  { color: c.text, fontFamily: typography.bold },
                ]}
              >
                {toFa(87)}
              </Text>
            </View>
          </Card>
        </View>

        <View style={styles.thirdRow}>
          <Card style={styles.thirdCard}>
            <View style={styles.centerCol}>
              <View style={[styles.badge, { backgroundColor: c.primarySoft }]}>
                <Feather name='award' size={18} color={c.primary} />
              </View>
              <Text
                style={{
                  color: c.textSecondary,
                  fontFamily: typography.medium,
                  fontSize: 13,
                  marginTop: 6,
                }}
              >
                رتبه
              </Text>
              <Text
                style={[
                  styles.big,
                  { color: c.primary, fontFamily: typography.bold },
                ]}
              >
                نیازمند بهبود
              </Text>
            </View>
          </Card>

          <Card style={styles.thirdCard}>
            <View style={styles.centerCol}>
              <Text
                style={{
                  color: c.textSecondary,
                  fontFamily: typography.medium,
                  fontSize: 13,
                }}
              >
                امتیاز ماهانه
              </Text>
              <Text
                style={[
                  styles.big,
                  { color: c.text, fontFamily: typography.bold },
                ]}
              >
                {toFa(132)} / {toFa(155)}
              </Text>
              <Text
                style={{
                  color: c.primary,
                  fontFamily: typography.bold,
                  fontSize: 22,
                  marginTop: 4,
                }}
              >
                {toFa(85)}٪
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {},
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  greeting: { fontSize: 22 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 12,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  item: {
    width: '48%',
    padding: 8,
  },
  halfRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  halfCard: { flex: 1 },
  tilePadding: { paddingTop: 20 },
  rowTwo: { flexDirection: 'row', gap: 12, marginTop: 12 },
  rowTwoCard: { flex: 1, alignItems: 'center' },
  thirdRow: { flexDirection: 'row', gap: 12, marginTop: 12, marginBottom: 40 },
  thirdCard: { flex: 1, alignItems: 'center' },
  centerCol: { alignItems: 'center', justifyContent: 'center' },
  big: { fontSize: 18, marginTop: 4 },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
