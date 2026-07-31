import { useBlubank, useSoftShadow } from '@/theme/blubank';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  padded?: boolean;
}

export function BlubankCard({
  children,
  style,
  padded = true,
  ...rest
}: Props) {
  const b = useBlubank();
  const shadow = useSoftShadow();
  return (
    <View
      style={[
        {
          backgroundColor: b.colors.card,
          borderRadius: b.radius.card,
        },
        shadow,
        padded && { padding: b.spacing.lg },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
