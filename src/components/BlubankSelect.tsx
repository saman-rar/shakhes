import { Blubank } from '@/theme/blubank';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlubankCard } from './BlubankCard';

interface Option {
  label: string;
  value: string;
}

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: Option[];
}

export function BlubankSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selected = options.find((o) => o.value === value);
        return (
          <View style={styles.wrap}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <Pressable
              style={[styles.box, error && styles.boxError]}
              onPress={() => setOpen(true)}
            >
              <Feather
                name='chevron-down'
                size={16}
                color={Blubank.colors.textSecondary}
              />
              <Text style={[styles.value, !selected && styles.placeholder]}>
                {selected?.label ?? 'انتخاب کنید'}
              </Text>
            </Pressable>
            {error ? <Text style={styles.error}>{error.message}</Text> : null}

            <Modal
              visible={open}
              transparent
              animationType='slide'
              onRequestClose={() => setOpen(false)}
            >
              <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
                <View style={styles.sheet}>
                  <BlubankCard padded={false} style={styles.sheetCard}>
                    <Text style={styles.sheetTitle}>{label}</Text>
                    {options.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        style={styles.optionRow}
                        onPress={() => {
                          onChange(opt.value);
                          setOpen(false);
                        }}
                      >
                        {value === opt.value && (
                          <Feather
                            name='check'
                            size={18}
                            color={Blubank.colors.primary}
                          />
                        )}
                        <Text
                          style={[
                            styles.optionText,
                            value === opt.value && styles.optionTextActive,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </BlubankCard>
                </View>
              </Pressable>
            </Modal>
          </View>
        );
      }}
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
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  overlay: {
    flex: 1,
    backgroundColor: Blubank.colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: { paddingBottom: Blubank.spacing.xl },
  sheetCard: {
    borderTopLeftRadius: Blubank.radius.tab,
    borderTopRightRadius: Blubank.radius.tab,
    paddingTop: Blubank.spacing.xl,
    paddingHorizontal: Blubank.spacing.lg,
    paddingBottom: Blubank.spacing.xl,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Blubank.colors.text,
    marginBottom: Blubank.spacing.md,
    textAlign: 'right',
  },
  optionRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Blubank.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Blubank.colors.inputBackground,
  },
  optionText: { fontSize: 15, color: Blubank.colors.text },
  optionTextActive: { color: Blubank.colors.primary, fontWeight: '700' },
});
