import { Blubank, softShadow } from '@/theme/blubank';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  monthly: 'ارزیابی ماهانه',
  guide: 'راهنما',
};

export function FloatingTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}
      pointerEvents='box-none'
    >
      <View style={[styles.bar, softShadow]}>
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
              <Feather
                name={icon}
                size={22}
                color={
                  focused ? Blubank.colors.primary : Blubank.colors.textMuted
                }
              />
              <Text
                style={[styles.label, focused && styles.labelFocused]}
                numberOfLines={1}
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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  bar: {
    height: 65,
    backgroundColor: Blubank.colors.card,
    borderTopLeftRadius: Blubank.radius.tab,
    borderTopRightRadius: Blubank.radius.tab,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Blubank.spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 10,
    color: Blubank.colors.textMuted,
  },
  labelFocused: {
    color: Blubank.colors.primary,
    fontWeight: '700',
  },
});
