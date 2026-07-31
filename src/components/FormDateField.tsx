import { typography, useBlubank } from '@/theme/blubank';
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
  const b = useBlubank();
  const [open, setOpen] = useState(false);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={{ marginBottom: b.spacing.md, flex: 1 }}>
          {label ? (
            <Text
              style={[
                styles.label,
                { color: b.colors.textSecondary, marginBottom: b.spacing.xs },
              ]}
            >
              {label}
            </Text>
          ) : null}
          <Pressable
            style={[
              styles.box,
              {
                flexDirection: 'row-reverse',
                backgroundColor: b.colors.inputBackground,
                borderRadius: b.radius.input,
                paddingHorizontal: b.spacing.md,
                borderColor: error ? b.colors.danger : 'transparent',
              },
            ]}
            onPress={() => setOpen(true)}
          >
            <Feather name='calendar' size={16} color={b.colors.primary} />
            <Text
              style={[
                styles.value,
                { color: value ? b.colors.text : b.colors.textMuted },
              ]}
            >
              {value || 'انتخاب تاریخ'}
            </Text>
          </Pressable>
          {error ? (
            <Text
              style={[
                styles.error,
                { color: b.colors.danger, marginTop: b.spacing.xs },
              ]}
            >
              {error.message}
            </Text>
          ) : null}
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
  label: {
    fontSize: 13,
    textAlign: 'right',
    fontFamily: typography.medium,
  },
  box: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
  },
  value: { fontSize: 15, fontFamily: typography.regular },
  error: {
    fontSize: 11,
    textAlign: 'right',
    fontFamily: typography.regular,
  },
});
