import { useTheme, useSoftShadow } from '@/theme/shakhes';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  padded?: boolean;
}

export function Card({ children, style, padded = true, ...rest }: Props) {
  const b = useTheme();
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
