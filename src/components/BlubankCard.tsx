import { Blubank, softShadow } from '@/theme/blubank';
import { StyleSheet, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  padded?: boolean;
}

export function BlubankCard({
  children,
  style,
  padded = true,
  ...rest
}: Props) {
  return (
    <View
      style={[styles.card, softShadow, padded && styles.padded, style]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Blubank.colors.card,
    borderRadius: Blubank.radius.card,
  },
  padded: {
    padding: Blubank.spacing.lg,
  },
});
