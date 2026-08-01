import { typography, useTheme } from '@/theme/shakhes';
import { Feather } from '@expo/vector-icons';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface Props {
  label: string;
  value: string;
  icon?: keyof typeof Feather.glyphMap;
  tone?: 'neutral' | 'primary';
  style?: StyleProp<ViewStyle>;
}

export function StatTile({
  label,
  value,
  icon,
  tone = 'neutral',
  style,
}: Props) {
  const b = useTheme();
  const primary = tone === 'primary';
  return (
    <View
      style={[
        styles.tile,
        { backgroundColor: b.colors.inputBackground },
        style,
      ]}
    >
      {icon ? (
        <View
          style={[
            styles.icon,
            {
              backgroundColor: primary ? b.colors.primarySoft : b.colors.card,
            },
          ]}
        >
          <Feather
            name={icon}
            size={16}
            color={primary ? b.colors.primary : b.colors.textSecondary}
          />
        </View>
      ) : null}
      <Text
        style={{
          color: b.colors.textSecondary,
          fontFamily: typography.medium,
          fontSize: 12,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: b.colors.text,
          fontFamily: typography.bold,
          fontSize: 16,
          marginTop: 2,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
