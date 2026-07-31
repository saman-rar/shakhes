import { typography, useBlubank } from '@/theme/blubank';
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
  control?: Control<T>;
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
  const b = useBlubank();
  const [open, setOpen] = useState(false);

  const theme = {
    inputBg: b.colors.inputBackground,
    border: b.colors.border,
    text: b.colors.text,
    textSecondary: b.colors.textSecondary,
    textMuted: b.colors.textMuted,
    primary: b.colors.primary,
    danger: b.colors.danger,
    overlay: b.colors.overlay,
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selected = options.find((o) => o.value === value);
        return (
          <View style={{ marginBottom: b.spacing.md, flex: 1 }}>
            {label ? (
              <Text
                style={[
                  styles.label,
                  {
                    color: theme.textSecondary,
                    marginBottom: b.spacing.xs,
                  },
                ]}
              >
                {label}
              </Text>
            ) : null}
            <Pressable
              style={[
                styles.box,
                {
                  backgroundColor: theme.inputBg,
                  borderRadius: b.radius.input,
                  paddingHorizontal: b.spacing.md,
                  borderColor: error ? theme.danger : 'transparent',
                },
              ]}
              onPress={() => setOpen(true)}
            >
              <Feather
                name='chevron-down'
                size={16}
                color={theme.textSecondary}
              />
              <Text
                style={[
                  styles.value,
                  { color: selected ? theme.text : theme.textMuted },
                ]}
              >
                {selected?.label ?? 'انتخاب کنید'}
              </Text>
            </Pressable>
            {error ? (
              <Text
                style={[
                  styles.error,
                  { color: theme.danger, marginTop: b.spacing.xs },
                ]}
              >
                {error.message}
              </Text>
            ) : null}

            <Modal
              visible={open}
              transparent
              animationType='slide'
              onRequestClose={() => setOpen(false)}
            >
              <Pressable
                style={[styles.overlay, { backgroundColor: theme.overlay }]}
                onPress={() => setOpen(false)}
              >
                <View style={{ paddingBottom: b.spacing.xl }}>
                  <BlubankCard padded={false} style={styles.sheetCard}>
                    <Text
                      style={[
                        styles.sheetTitle,
                        {
                          color: theme.text,
                          marginBottom: b.spacing.md,
                        },
                      ]}
                    >
                      {label}
                    </Text>
                    {options.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        style={[
                          styles.optionRow,
                          {
                            flexDirection: 'row-reverse',
                            paddingVertical: b.spacing.md,
                            borderBottomColor: theme.inputBg,
                          },
                        ]}
                        onPress={() => {
                          onChange(opt.value);
                          setOpen(false);
                        }}
                      >
                        {value === opt.value && (
                          <Feather
                            name='check'
                            size={18}
                            color={theme.primary}
                          />
                        )}
                        <Text
                          style={[
                            styles.optionText,
                            {
                              color:
                                value === opt.value
                                  ? theme.primary
                                  : theme.text,
                              fontFamily:
                                value === opt.value
                                  ? typography.bold
                                  : typography.regular,
                            },
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
  label: { fontSize: 13, textAlign: 'right', fontFamily: typography.medium },
  box: {
    flexDirection: 'row-reverse',
    gap: 5,
    alignItems: 'center',
    paddingVertical: 13,
    borderWidth: 1,
  },
  value: { fontSize: 15, fontFamily: typography.regular },
  error: { fontSize: 11, textAlign: 'right', fontFamily: typography.regular },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: typography.bold,
    textAlign: 'right',
  },
  optionRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  optionText: { fontSize: 15 },
});
