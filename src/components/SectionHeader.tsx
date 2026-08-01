import { typography, useTheme } from '@/theme/shakhes';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

export function SectionHeader({
  title,
  style,
  variant = 'primary',
}: {
  title: string;
  style?: StyleProp<TextStyle>;
  variant?: string;
}) {
  const b = useTheme();
  return (
    <Text
      style={[
        styles.title,
        {
          color:
            variant === 'primary' ? b.colors.textSecondary : b.colors.primary,
          marginTop: b.spacing.lg,
          marginBottom: b.spacing.sm,
          marginHorizontal: b.spacing.lg,
        },
        style,
      ]}
    >
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 13,
    fontFamily: typography.bold,
    textAlign: 'right',
  },
});
