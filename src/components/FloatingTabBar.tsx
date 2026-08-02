import { getSoftShadow, typography, useTheme } from '@/theme/shakhes';
import { Feather } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  index: 'home',
  employees: 'users',
  referrals: 'send',
  correspondence: 'mail',
  monthly: 'bar-chart-2',
  guide: 'help-circle',
};

const LABELS: Record<string, string> = {
  index: 'داشبورد',
  employees: 'کارکنان',
  referrals: 'ارجاع‌ها',
  correspondence: 'مکاتبات',
  monthly: 'ارزیابی',
  guide: 'راهنما',
};

export function FloatingTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const b = useTheme();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const shadow = getSoftShadow(scheme);
  const inactive = b.colors.textMuted;

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}
      pointerEvents='box-none'
    >
      <View
        style={[
          styles.bar,
          shadow,
          {
            backgroundColor: b.colors.card,
            borderTopLeftRadius: b.radius.tab,
            borderTopRightRadius: b.radius.tab,
            paddingHorizontal: b.spacing.sm,
          },
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const focused = state.index === index;
          const icon = ICONS[route.name] ?? 'circle';
          const label = LABELS[route.name] ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          const activeColor = focused ? b.colors.primary : inactive;
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole='button'
              accessibilityState={focused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.item}
              activeOpacity={0.75}
            >
              <Feather name={icon} size={20} color={activeColor} />
              <Text
                style={[
                  styles.label,
                  {
                    color: activeColor,
                    fontFamily: focused ? typography.bold : typography.medium,
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    height: 65,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 10,
  },
});
