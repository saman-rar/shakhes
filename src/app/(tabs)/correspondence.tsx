import { Card } from '@/components/Card';
import { Select } from '@/components/Select';
import { FormDateField } from '@/components/FormDateField';
import { FormField } from '@/components/FormField';
import { SectionHeader } from '@/components/SectionHeader';
import { useEmployees } from '@/context/EmployeesContext';
import {
  createCorrespondence,
  deleteCorrespondence,
  listCorrespondence,
  listReferrals,
} from '@/db/repositories';
import { Correspondence, Referral } from '@/db/types';
import { CorrespondenceForm, correspondenceSchema } from '@/schemas';
import { ShakhesTheme, typography, useTheme } from '@/theme/shakhes';
import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TYPES = [
  { label: 'وارده', value: 'incoming' },
  { label: 'صادره', value: 'outgoing' },
];
const STATUSES = [
  { label: 'ثبت‌شده', value: 'registered' },
  { label: 'در حال بررسی', value: 'reviewing' },
];

export default function CorrespondenceScreen() {
  const b = useTheme();
  const styles = useMemo(() => makeStyles(b), [b]);

  const { employeeOptions, getEmployeeName } = useEmployees();
  const [letters, setLetters] = useState<Correspondence[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);

  const load = useCallback(async () => {
    const [lettersRows, referralRows] = await Promise.all([
      listCorrespondence(),
      listReferrals(),
    ]);
    setLetters(lettersRows);
    setReferrals(referralRows);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => undefined);
    }, [load]),
  );

  const remove = useCallback(async (id: string) => {
    await deleteCorrespondence(id);
    setLetters((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const referralOptions = referrals.map((r) => ({
    label: `${r.title} (${r.letterId})`,
    value: r.id,
  }));

  const { control, handleSubmit, reset } = useForm<CorrespondenceForm>({
    resolver: zodResolver(correspondenceSchema),
    defaultValues: {
      correspondenceType: 'incoming',
      employee: '',
      relatedReferral: '',
      letterNumber: '',
      subject: '',
      senderReceiver: '',
      date: '',
      status: 'registered',
      description: '',
    },
  });

  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ['*/*'],
      copyToCacheDirectory: true,
    });
    if (!res.canceled && res.assets[0]) {
      setAttachments((prev) => [...prev, res.assets[0].name]);
    }
  };

  const capturePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!res.canceled && res.assets[0]) {
      setAttachments((prev) => [
        ...prev,
        res.assets[0].fileName ?? 'photo.jpg',
      ]);
    }
  };

  const onSubmit = async (data: CorrespondenceForm) => {
    const created = await createCorrespondence({
      correspondenceType: data.correspondenceType,
      employeeId: data.employee,
      relatedReferralId: data.relatedReferral || null,
      letterNumber: data.letterNumber,
      subject: data.subject,
      senderReceiver: data.senderReceiver,
      date: data.date,
      status: data.status,
      description: data.description || null,
      attachments,
    });
    setLetters((prev) => [created, ...prev]);
    setAttachments([]);
    reset();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title='ثبت نامه و مستندات' />
        <Card>
          <Select
            control={control}
            name='correspondenceType'
            label='نوع مکاتبه'
            options={TYPES}
          />
          <Select
            control={control}
            name='employee'
            label='کارمند'
            options={employeeOptions}
          />
          <Select
            control={control}
            name='relatedReferral'
            label='ارجاع مرتبط (اختیاری)'
            options={referralOptions}
          />
          <FormField control={control} name='letterNumber' label='شماره نامه' />
          <FormField control={control} name='subject' label='موضوع' />
          <FormField
            control={control}
            name='senderReceiver'
            label='فرستنده / گیرنده'
          />
          <FormDateField control={control} name='date' label='تاریخ' />
          <Select
            control={control}
            name='status'
            label='وضعیت'
            options={STATUSES}
          />
          <FormField
            control={control}
            name='description'
            label='شرح و نتیجه اقدام'
            multiline
            numberOfLines={4}
            style={styles.textarea}
          />

          <View style={styles.attachRow}>
            <Pressable style={styles.attachBtn} onPress={pickFile}>
              <Feather name='paperclip' size={16} color={b.colors.primary} />
              <Text style={styles.attachText}>انتخاب فایل / ZIP / عکس</Text>
            </Pressable>
            <Pressable style={styles.attachBtn} onPress={capturePhoto}>
              <Feather name='camera' size={16} color={b.colors.primary} />
              <Text style={styles.attachText}>ثبت مستقیم عکس</Text>
            </Pressable>
          </View>

          {attachments.length > 0 && (
            <View style={styles.chipWrap}>
              {attachments.map((a, i) => (
                <View key={i} style={styles.chip}>
                  <Feather
                    name='file'
                    size={12}
                    color={b.colors.textSecondary}
                  />
                  <Text style={styles.chipText} numberOfLines={1}>
                    {a}
                  </Text>
                  <Pressable
                    onPress={() =>
                      setAttachments((p) => p.filter((_, x) => x !== i))
                    }
                  >
                    <Feather name='x' size={14} color={b.colors.danger} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <Pressable style={styles.primaryBtn} onPress={handleSubmit(onSubmit)}>
            <Feather name='mail' size={18} color='#FFF' />
            <Text style={styles.primaryBtnText}>ثبت نامه و مستندات</Text>
          </Pressable>
        </Card>

        <SectionHeader title='آخرین مکاتبات' />
        <View style={styles.list}>
          {letters.length === 0 && (
            <Text style={styles.empty}>هنوز نامه‌ای ثبت نشده است</Text>
          )}
          {letters.map((l) => (
            <Card key={l.id} style={styles.rowCard}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowTitle}>{l.subject}</Text>
                <Text style={styles.rowMeta}>
                  {getEmployeeName(l.employeeId)} · {l.letterNumber} · {l.date}
                </Text>
              </View>
              {l.attachments.length > 0 && (
                <View style={styles.badge}>
                  <Feather
                    name='paperclip'
                    size={11}
                    color={b.colors.primary}
                  />
                  <Text style={styles.badgeText}>{l.attachments.length}</Text>
                </View>
              )}
              <Pressable onPress={() => remove(l.id)} hitSlop={8}>
                <Feather name='trash-2' size={15} color={b.colors.danger} />
              </Pressable>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(b: ShakhesTheme) {
  const c = b.colors;
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    scroll: { paddingHorizontal: b.spacing.lg, paddingBottom: 110 },
    textarea: { minHeight: 90, textAlignVertical: 'top' },
    attachRow: {
      flexDirection: 'row-reverse',
      gap: b.spacing.md,
      marginTop: b.spacing.md,
    },
    attachBtn: {
      flex: 1,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 12,
      borderRadius: b.radius.input,
      borderWidth: 1,
      borderColor: c.primary,
      borderStyle: 'dashed',
      backgroundColor: c.primarySoft,
    },
    attachText: {
      fontSize: 12,
      color: c.primary,
      fontFamily: typography.bold,
    },
    chipWrap: {
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: b.spacing.md,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: c.inputBackground,
      borderRadius: b.radius.pill,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    chipText: {
      fontSize: 11,
      color: c.textSecondary,
      fontFamily: typography.regular,
    },
    primaryBtn: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: b.spacing.sm,
      backgroundColor: c.primary,
      borderRadius: b.radius.input,
      paddingVertical: 14,
      marginTop: b.spacing.lg,
    },
    primaryBtnText: {
      color: '#FFF',
      fontSize: 15,
      fontFamily: typography.bold,
    },
    list: { gap: b.spacing.sm },
    empty: {
      textAlign: 'center',
      color: c.textMuted,
      paddingVertical: b.spacing.xl,
      fontFamily: typography.regular,
    },
    rowCard: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingVertical: b.spacing.md,
    },
    rowInfo: { flex: 1 },
    rowTitle: {
      fontSize: 14,
      fontFamily: typography.bold,
      color: c.text,
      textAlign: 'right',
    },
    rowMeta: {
      fontSize: 11,
      color: c.textSecondary,
      marginTop: 2,
      fontFamily: typography.regular,
      textAlign: 'right',
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      backgroundColor: c.primarySoft,
      borderRadius: b.radius.pill,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginHorizontal: b.spacing.sm,
    },
    badgeText: {
      fontSize: 11,
      color: c.primary,
      fontFamily: typography.bold,
    },
  });
}
