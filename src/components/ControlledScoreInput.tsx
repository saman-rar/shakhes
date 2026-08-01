import { typography, useTheme } from '@/theme/shakhes';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Text, View } from 'react-native';
import { BoxInput } from './BoxInput';

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
  const b = useTheme();
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
          <View style={{ flex: 1, minWidth: '46%' }}>
            <BoxInput
              label={label}
              value={value === undefined || value === '' ? '' : String(value)}
              onChangeText={handleChange}
              keyboardType='number-pad'
              error={error?.message}
              style={{ textAlign: 'center' }}
            />
            <Text
              style={{
                fontSize: 10,
                color: b.colors.textMuted,
                textAlign: 'center',
                marginTop: -b.spacing.xs,
                marginBottom: b.spacing.sm,
                fontFamily: typography.regular,
              }}
            >
              حداکثر {maxLimit}
            </Text>
          </View>
        );
      }}
    />
  );
}
