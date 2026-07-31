import { Blubank } from '@/theme/blubank';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export function BlubankBoxInput({ label, error, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={Blubank.colors.textMuted}
        style={[styles.input, style]}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: Blubank.spacing.md,
  },
  label: {
    fontSize: 13,
    color: Blubank.colors.textSecondary,
    marginBottom: Blubank.spacing.xs,
    textAlign: 'right',
  },
  input: {
    backgroundColor: Blubank.colors.inputBackground,
    borderRadius: Blubank.radius.input,
    paddingHorizontal: Blubank.spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: Blubank.colors.text,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  error: {
    color: Blubank.colors.danger,
    fontSize: 11,
    marginTop: Blubank.spacing.xs,
    textAlign: 'right',
  },
});
