import { toFa } from '@/lib/jalali';
import { Blubank } from '@/theme/blubank';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  icon?: keyof typeof Feather.glyphMap;
  fullWidth?: boolean;
}

export function StatTile({ label, value, unit, icon, fullWidth }: Props) {
  const display = typeof value === 'number' ? toFa(value) : value;
  return (
    <View style={[styles.tile, fullWidth && styles.full]}>
      {icon ? (
        <View style={styles.iconWrap}>
          <Feather name={icon} size={18} color={Blubank.colors.primary} />
        </View>
      ) : null}
      <Text style={styles.value}>
        {display}
        {unit ? <Text style={styles.unit}> {unit}</Text> : null}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: Blubank.colors.inputBackground,
    borderRadius: Blubank.radius.card,
    padding: Blubank.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flex: 1,
    minWidth: '30%',
    minHeight: 92,
  },
  full: { minWidth: '100%' },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: Blubank.radius.pill,
    backgroundColor: Blubank.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  value: { fontSize: 18, fontWeight: '700', color: Blubank.colors.text },
  unit: { fontSize: 11, fontWeight: '400', color: Blubank.colors.textMuted },
  label: {
    fontSize: 11,
    color: Blubank.colors.textSecondary,
    textAlign: 'center',
  },
});
