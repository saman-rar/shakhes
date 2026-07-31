import { BlubankCard } from '@/components/BlubankCard';
import { FormField } from '@/components/FormField';
import { SectionHeader } from '@/components/SectionHeader';
import { toFa } from '@/lib/jalali';
import { EmployeeForm, employeeSchema } from '@/schemas';
import { Blubank } from '@/theme/blubank';
import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Employee {
  id: string;
  fullName: string;
  personnelCode: string;
  department: string;
}

export default function EmployeesScreen() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      fullName: 'مهدی اسدی',
      personnelCode: toFa(102345),
      department: 'معاونت امور مشتریان',
    },
    {
      id: '2',
      fullName: 'سارا محمدی',
      personnelCode: toFa(103782),
      department: 'واحد توسعه نرم‌افزار',
    },
  ]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EmployeeForm>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { fullName: '', personnelCode: '', department: '' },
  });

  const onSubmit = (data: EmployeeForm) => {
    setEmployees((prev) => [{ id: String(Date.now()), ...data }, ...prev]);
    reset();
  };

  const remove = (id: string) =>
    setEmployees((prev) => prev.filter((e) => e.id !== id));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title='ثبت کارمند' />
        <BlubankCard>
          <FormField
            control={control}
            name='fullName'
            label='نام و نام خانوادگی'
          />
          <FormField
            control={control}
            name='personnelCode'
            label='کد پرسنلی'
            keyboardType='number-pad'
          />
          <FormField
            control={control}
            name='department'
            label='واحد / معاونت'
          />
          <Pressable
            style={[styles.primaryBtn, isSubmitting && styles.disabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Feather name='user-plus' size={18} color='#FFFFFF' />
            <Text style={styles.primaryBtnText}>ثبت کارمند</Text>
          </Pressable>
        </BlubankCard>

        <SectionHeader title={`کارمندان ثبت‌شده (${toFa(employees.length)})`} />
        <View style={styles.list}>
          {employees.map((emp) => (
            <BlubankCard key={emp.id} style={styles.empCard}>
              <View style={styles.empAvatar}>
                <Feather name='user' size={18} color={Blubank.colors.primary} />
              </View>
              <View style={styles.empInfo}>
                <Text style={styles.empName}>{emp.fullName}</Text>
                <Text style={styles.empMeta}>
                  {emp.personnelCode} · {emp.department}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => remove(emp.id)}
                hitSlop={8}
              >
                <Feather
                  name='trash-2'
                  size={16}
                  color={Blubank.colors.danger}
                />
                <Text style={styles.deleteText}>حذف</Text>
              </TouchableOpacity>
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
  disabled: { opacity: 0.6 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  list: { gap: Blubank.spacing.sm },
  empCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Blubank.spacing.md,
  },
  empAvatar: {
    width: 40,
    height: 40,
    borderRadius: Blubank.radius.pill,
    backgroundColor: Blubank.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Blubank.spacing.md,
  },
  empInfo: { flex: 1 },
  empName: { fontSize: 15, fontWeight: '700', color: Blubank.colors.text },
  empMeta: { fontSize: 12, color: Blubank.colors.textSecondary, marginTop: 2 },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Blubank.spacing.sm,
    paddingVertical: 6,
  },
  deleteText: { fontSize: 12, color: Blubank.colors.danger, fontWeight: '600' },
});
