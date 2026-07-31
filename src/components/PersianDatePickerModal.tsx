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
import { typography, useBlubank } from '@/theme/blubank';
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
  const b = useBlubank();
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
      <Pressable
        style={[styles.overlay, { backgroundColor: b.colors.overlay }]}
        onPress={onClose}
      >
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: b.colors.card,
              borderTopLeftRadius: b.radius.tab,
              borderTopRightRadius: b.radius.tab,
              paddingBottom: b.spacing.xl,
              paddingHorizontal: b.spacing.lg,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            style={[
              styles.handle,
              {
                backgroundColor: b.colors.border,
                marginVertical: b.spacing.sm,
              },
            ]}
          />

          <View style={[styles.header, { marginBottom: b.spacing.md }]}>
            <TouchableOpacity
              onPress={() => shiftMonth(1)}
              style={{ padding: b.spacing.sm }}
            >
              <Feather
                name='chevron-left'
                size={20}
                color={b.colors.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.monthTitleWrap}
              onPress={() => setShowYearPicker((v) => !v)}
            >
              <Text
                style={[
                  styles.monthTitle,
                  { color: b.colors.text, fontFamily: typography.bold },
                ]}
              >
                {JALALI_MONTHS[viewMonth - 1]} {toFa(viewYear)}
              </Text>
              <Feather
                name={showYearPicker ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={b.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => shiftMonth(-1)}
              style={{ padding: b.spacing.sm }}
            >
              <Feather
                name='chevron-right'
                size={20}
                color={b.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {showYearPicker ? (
            <ScrollView
              style={{ maxHeight: 280 }}
              contentContainerStyle={[
                styles.yearListContent,
                { gap: b.spacing.sm, paddingVertical: b.spacing.sm },
              ]}
            >
              {years.map((y) => (
                <TouchableOpacity
                  key={y}
                  style={[
                    styles.yearItem,
                    {
                      paddingHorizontal: b.spacing.lg,
                      paddingVertical: b.spacing.sm,
                      borderRadius: b.radius.pill,
                      backgroundColor:
                        y === viewYear
                          ? b.colors.primary
                          : b.colors.inputBackground,
                    },
                  ]}
                  onPress={() => {
                    setViewYear(y);
                    setShowYearPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.yearText,
                      {
                        color: y === viewYear ? '#FFFFFF' : b.colors.text,
                        fontFamily:
                          y === viewYear ? typography.bold : typography.regular,
                      },
                    ]}
                  >
                    {toFa(y)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <>
              <View style={[styles.weekRow, { marginBottom: b.spacing.xs }]}>
                {JALALI_WEEKDAYS.map((w) => (
                  <Text
                    key={w}
                    style={[styles.weekCell, { color: b.colors.textMuted }]}
                  >
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
                        isToday(d) && !isSelected(d)
                          ? {
                              borderRadius: b.radius.pill,
                              borderWidth: 1,
                              borderColor: b.colors.primary,
                            }
                          : null,
                        isSelected(d)
                          ? {
                              backgroundColor: b.colors.primary,
                              borderRadius: b.radius.pill,
                            }
                          : null,
                      ]}
                      onPress={() =>
                        setSelected({ jy: viewYear, jm: viewMonth, jd: d })
                      }
                    >
                      <Text
                        style={[
                          styles.cellText,
                          {
                            color: isSelected(d)
                              ? '#FFFFFF'
                              : isToday(d)
                                ? b.colors.primary
                                : b.colors.text,
                            fontFamily: isSelected(d)
                              ? typography.bold
                              : typography.regular,
                          },
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

          <View
            style={[
              styles.footer,
              { gap: b.spacing.md, marginTop: b.spacing.lg },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.todayBtn,
                {
                  borderRadius: b.radius.input,
                  backgroundColor: b.colors.inputBackground,
                },
              ]}
              onPress={() => {
                setSelected(today);
                setViewYear(today.jy);
                setViewMonth(today.jm);
              }}
            >
              <Text
                style={{
                  color: b.colors.text,
                  fontSize: 15,
                  fontFamily: typography.bold,
                }}
              >
                امروز
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                {
                  borderRadius: b.radius.input,
                  backgroundColor: b.colors.primary,
                },
              ]}
              onPress={() => {
                onConfirm(formatJalali(selected));
                onClose();
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 15,
                  fontFamily: typography.bold,
                }}
              >
                تأیید
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: {},
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  monthTitle: { fontSize: 17 },
  weekRow: { flexDirection: 'row' },
  weekCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontFamily: typography.medium,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: { fontSize: 14 },
  yearListContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  yearItem: {},
  yearText: { fontSize: 15 },
  footer: { flexDirection: 'row' },
  todayBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  confirmBtn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
});
