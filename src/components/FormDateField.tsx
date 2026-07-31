import { Blubank } from '@/theme/blubank';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PersianDatePickerModal } from './PersianDatePickerModal';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

export function FormDateField<T extends FieldValues>({
  control,
  name,
  label,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.wrap}>
          {label ? <Text style={styles.label}>{label}</Text> : null}
          <Pressable
            style={[styles.box, error && styles.boxError]}
            onPress={() => setOpen(true)}
          >
            <Feather name='calendar' size={16} color={Blubank.colors.primary} />
            <Text style={[styles.value, !value && styles.placeholder]}>
              {value || 'انتخاب تاریخ'}
            </Text>
          </Pressable>
          {error ? <Text style={styles.error}>{error.message}</Text> : null}
          <PersianDatePickerModal
            visible={open}
            value={value}
            onClose={() => setOpen(false)}
            onConfirm={onChange}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: Blubank.spacing.md },
  label: {
    fontSize: 13,
    color: Blubank.colors.textSecondary,
    marginBottom: Blubank.spacing.xs,
    textAlign: 'right',
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Blubank.spacing.sm,
    backgroundColor: Blubank.colors.inputBackground,
    borderRadius: Blubank.radius.input,
    paddingHorizontal: Blubank.spacing.md,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  boxError: { borderColor: Blubank.colors.danger },
  value: { fontSize: 15, color: Blubank.colors.text },
  placeholder: { color: Blubank.colors.textMuted },
  error: {
    color: Blubank.colors.danger,
    fontSize: 11,
    marginTop: Blubank.spacing.xs,
    textAlign: 'right',
  },
});
