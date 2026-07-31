import {
  JALALI_MONTHS,
  JALALI_WEEKDAYS,
  JalaliDate,
  daysInJalaliMonth,
  firstWeekdayOfMonth,
  formatJalali,
  parseJalali,
  toFa,
  todayJalali,
} from '@/lib/jalali';
import { Blubank } from '@/theme/blubank';
import { Feather } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  visible: boolean;
  value?: string;
  onClose: () => void;
  onConfirm: (formatted: string) => void;
}

const YEAR_RANGE = 10;

export function PersianDatePickerModal({
  visible,
  value,
  onClose,
  onConfirm,
}: Props) {
  const today = useMemo(() => todayJalali(), []);
  const initial = useMemo(() => parseJalali(value) ?? today, [value, today]);

  const [viewYear, setViewYear] = useState(initial.jy);
  const [viewMonth, setViewMonth] = useState(initial.jm);
  const [selected, setSelected] = useState<JalaliDate>(initial);
  const [showYearPicker, setShowYearPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      const base = parseJalali(value) ?? today;
      setSelected(base);
      setViewYear(base.jy);
      setViewMonth(base.jm);
      setShowYearPicker(false);
    }
  }, [visible, value, today]);

  const days = daysInJalaliMonth(viewYear, viewMonth);
  const leadingBlanks = firstWeekdayOfMonth(viewYear, viewMonth);
  const cells: Array<number | null> = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];

  const years = Array.from(
    { length: YEAR_RANGE * 2 + 1 },
    (_, i) => today.jy - YEAR_RANGE + i,
  );

  const shiftMonth = (dir: 1 | -1) => {
    let m = viewMonth + dir;
    let y = viewYear;
    if (m > 12) {
      m = 1;
      y += 1;
    }
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    setViewMonth(m);
    setViewYear(y);
  };

  const isSelected = (d: number) =>
    selected.jy === viewYear && selected.jm === viewMonth && selected.jd === d;

  const isToday = (d: number) =>
    today.jy === viewYear && today.jm === viewMonth && today.jd === d;

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => shiftMonth(1)}
              style={styles.navBtn}
            >
              <Feather
                name='chevron-right'
                size={20}
                color={Blubank.colors.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.monthTitleWrap}
              onPress={() => setShowYearPicker((v) => !v)}
            >
              <Text style={styles.monthTitle}>
                {JALALI_MONTHS[viewMonth - 1]} {toFa(viewYear)}
              </Text>
              <Feather
                name={showYearPicker ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={Blubank.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => shiftMonth(-1)}
              style={styles.navBtn}
            >
              <Feather
                name='chevron-left'
                size={20}
                color={Blubank.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {showYearPicker ? (
            <ScrollView
              style={styles.yearList}
              contentContainerStyle={styles.yearListContent}
            >
              {years.map((y) => (
                <TouchableOpacity
                  key={y}
                  style={[
                    styles.yearItem,
                    y === viewYear && styles.yearItemActive,
                  ]}
                  onPress={() => {
                    setViewYear(y);
                    setShowYearPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.yearText,
                      y === viewYear && styles.yearTextActive,
                    ]}
                  >
                    {toFa(y)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <>
              <View style={styles.weekRow}>
                {JALALI_WEEKDAYS.map((w) => (
                  <Text key={w} style={styles.weekCell}>
                    {w}
                  </Text>
                ))}
              </View>
              <View style={styles.grid}>
                {cells.map((d, i) =>
                  d === null ? (
                    <View key={`b${i}`} style={styles.cell} />
                  ) : (
                    <TouchableOpacity
                      key={d}
                      style={[
                        styles.cell,
                        isToday(d) && styles.cellToday,
                        isSelected(d) && styles.cellSelected,
                      ]}
                      onPress={() =>
                        setSelected({ jy: viewYear, jm: viewMonth, jd: d })
                      }
                    >
                      <Text
                        style={[
                          styles.cellText,
                          isSelected(d) && styles.cellTextSelected,
                          isToday(d) && !isSelected(d) && styles.cellTextToday,
                        ]}
                      >
                        {toFa(d)}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            </>
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.todayBtn}
              onPress={() => {
                setSelected(today);
                setViewYear(today.jy);
                setViewMonth(today.jm);
              }}
            >
              <Text style={styles.todayText}>امروز</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => {
                onConfirm(formatJalali(selected));
                onClose();
              }}
            >
              <Text style={styles.confirmText}>تأیید</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Blubank.colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Blubank.colors.card,
    borderTopLeftRadius: Blubank.radius.tab,
    borderTopRightRadius: Blubank.radius.tab,
    paddingBottom: Blubank.spacing.xl,
    paddingHorizontal: Blubank.spacing.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Blubank.colors.border,
    marginVertical: Blubank.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Blubank.spacing.md,
  },
  navBtn: { padding: Blubank.spacing.sm },
  monthTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  monthTitle: { fontSize: 17, fontWeight: '700', color: Blubank.colors.text },
  weekRow: { flexDirection: 'row', marginBottom: Blubank.spacing.xs },
  weekCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    color: Blubank.colors.textMuted,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellToday: {
    borderRadius: Blubank.radius.pill,
    borderWidth: 1,
    borderColor: Blubank.colors.primary,
  },
  cellSelected: {
    backgroundColor: Blubank.colors.primary,
    borderRadius: Blubank.radius.pill,
  },
  cellText: { fontSize: 14, color: Blubank.colors.text },
  cellTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  cellTextToday: { color: Blubank.colors.primary },
  yearList: { maxHeight: 280 },
  yearListContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Blubank.spacing.sm,
    justifyContent: 'center',
    paddingVertical: Blubank.spacing.sm,
  },
  yearItem: {
    paddingHorizontal: Blubank.spacing.lg,
    paddingVertical: Blubank.spacing.sm,
    borderRadius: Blubank.radius.pill,
    backgroundColor: Blubank.colors.inputBackground,
  },
  yearItemActive: { backgroundColor: Blubank.colors.primary },
  yearText: { fontSize: 15, color: Blubank.colors.text },
  yearTextActive: { color: '#FFFFFF', fontWeight: '700' },
  footer: {
    flexDirection: 'row',
    gap: Blubank.spacing.md,
    marginTop: Blubank.spacing.lg,
  },
  todayBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: Blubank.radius.input,
    backgroundColor: Blubank.colors.inputBackground,
  },
  todayText: { color: Blubank.colors.text, fontSize: 15, fontWeight: '600' },
  confirmBtn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: Blubank.radius.input,
    backgroundColor: Blubank.colors.primary,
  },
  confirmText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
