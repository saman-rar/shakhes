import { typography, useBlubank } from '@/theme/blubank';
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
  const b = useBlubank();
  return (
    <View style={{ marginBottom: b.spacing.md }}>
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
      <TextInput
        placeholderTextColor={b.colors.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: b.colors.inputBackground,
            borderRadius: b.radius.input,
            paddingHorizontal: b.spacing.md,
            color: b.colors.text,
            fontFamily: typography.regular,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text
          style={[
            styles.error,
            { color: b.colors.danger, marginTop: b.spacing.xs },
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    textAlign: 'right',
    fontFamily: typography.medium,
  },
  input: {
    paddingVertical: 12,
    fontSize: 15,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  error: {
    fontSize: 11,
    textAlign: 'right',
    fontFamily: typography.regular,
  },
});
