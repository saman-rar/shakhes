import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { TextInputProps } from 'react-native';
import { BoxInput } from './BoxInput';

interface Props<T extends FieldValues> extends Omit<
  TextInputProps,
  'value' | 'onChangeText'
> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  ...rest
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <BoxInput
          label={label}
          value={value}
          onChangeText={onChange}
          error={error?.message}
          {...rest}
        />
      )}
    />
  );
}
