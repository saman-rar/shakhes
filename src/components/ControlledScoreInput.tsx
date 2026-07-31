import { Blubank } from '@/theme/blubank';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { BlubankBoxInput } from './BlubankBoxInput';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  maxLimit: number;
}

export function ControlledScoreInput<T extends FieldValues>({
  control,
  name,
  label,
  maxLimit,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleChange = (text: string) => {
          const cleaned = text.replace(/[^0-9]/g, '');
          if (cleaned === '') {
            onChange(0);
            return;
          }
          const num = Math.min(Number(cleaned), maxLimit);
          onChange(num);
        };
        return (
          <View style={styles.wrap}>
            <BlubankBoxInput
              label={label}
              value={value === undefined || value === '' ? '' : String(value)}
              onChangeText={handleChange}
              keyboardType='number-pad'
              error={error?.message}
              style={styles.input}
            />
            <Text style={styles.hint}>حداکثر {maxLimit}</Text>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minWidth: '46%',
  },
  input: {
    textAlign: 'center',
  },
  hint: {
    fontSize: 10,
    color: Blubank.colors.textMuted,
    textAlign: 'center',
    marginTop: -Blubank.spacing.xs,
    marginBottom: Blubank.spacing.sm,
  },
});
