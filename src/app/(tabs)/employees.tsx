import { BoxInput } from '@/components/BoxInput';
import { Card } from '@/components/Card';
import { Select } from '@/components/Select';
import { SectionHeader } from '@/components/SectionHeader';
import { useEmployees } from '@/context/EmployeesContext';
import { typography, useTheme } from '@/theme/shakhes';
import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

const schema = z.object({
  fullName: z.string().min(3, 'نام کامل الزامی است'),
  personnelCode: z.string().min(2, 'کد پرسنلی الزامی است'),
  department: z.string().min(1, 'واحد الزامی است'),
});

type FormValues = z.infer<typeof schema>;

export default function EmployeesScreen() {
  const b = useTheme();
  const c = b.colors;
  const { employees, addEmployee, removeEmployee } = useEmployees();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { fullName: '', personnelCode: '', department: '' },
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const onSubmit = (values: FormValues) => {
    addEmployee(values);
    reset();
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: c.background }]}
      edges={['top']}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingHorizontal: b.spacing.lg, paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title='ثبت کارمند' />
        <Card>
          <Controller
            control={control}
            name='fullName'
            render={({ field, fieldState }) => (
              <BoxInput
                label='نام و نام خانوادگی'
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='personnelCode'
            render={({ field, fieldState }) => (
              <BoxInput
                label='کد پرسنلی'
                value={field.value}
                onChangeText={field.onChange}
                keyboardType='number-pad'
                error={fieldState.error?.message}
              />
            )}
          />
          <Select
            control={control}
            name='department'
            label='واحد'
            options={[
              { label: 'معاونت قراردادها', value: 'contracts_management' },
            ]}
          />
          <Pressable
            style={[
              styles.primaryBtn,
              {
                backgroundColor: c.primary,
                borderRadius: b.radius.input,
              },
            ]}
            onPress={handleSubmit(onSubmit)}
          >
            <Feather name='user-plus' size={18} color='#FFF' />
            <Text style={styles.primaryText}>ثبت کارمند</Text>
          </Pressable>
        </Card>

        <SectionHeader title='کارکنان ثبت‌شده' />
        <View style={{ gap: b.spacing.sm, marginBottom: 24 }}>
          {employees && employees.length > 0 ? (
            employees.map((emp) => (
              <Card key={emp.id} padded={false}>
                <View
                  style={[
                    styles.row,
                    {
                      paddingHorizontal: b.spacing.md,
                      paddingVertical: b.spacing.md,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: c.inputBackground },
                    ]}
                  >
                    <Feather name='user' size={18} color={c.textSecondary} />
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text
                      style={[
                        styles.name,
                        { color: c.text, fontFamily: typography.bold },
                      ]}
                    >
                      {emp.fullName}
                    </Text>
                    <Text
                      style={[
                        styles.meta,
                        {
                          color: c.textSecondary,
                          fontFamily: typography.regular,
                        },
                      ]}
                    >
                      {emp.personnelCode} · {emp.department}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeEmployee(emp.id)}
                    hitSlop={8}
                  >
                    <Feather name='trash-2' size={18} color={c.danger} />
                  </TouchableOpacity>
                </View>
              </Card>
            ))
          ) : (
            <View style={styles.noEmployee}>
              <SectionHeader
                variant='secondary'
                style={styles.noEmployeeTitle}
                title='ابتدا یک کارمند ثبت کنید.'
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {},
  primaryBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
  },
  primaryText: { color: '#FFF', fontSize: 16, fontFamily: typography.bold },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 15, textAlign: 'right' },
  meta: { fontSize: 12, marginTop: 2, textAlign: 'right' },
  noEmployee: {
    alignItems: 'center',
  },
  noEmployeeTitle: {
    fontSize: 18,
  },
});
