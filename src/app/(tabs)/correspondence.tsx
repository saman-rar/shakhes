import { BlubankCard } from '@/components/BlubankCard';
import { BlubankSelect } from '@/components/BlubankSelect';
import { FormDateField } from '@/components/FormDateField';
import { FormField } from '@/components/FormField';
import { SectionHeader } from '@/components/SectionHeader';
import { CorrespondenceForm, correspondenceSchema } from '@/schemas';
import { Blubank } from '@/theme/blubank';
import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TYPES = [
  { label: 'وارده', value: 'incoming' },
  { label: 'صادره', value: 'outgoing' },
];
const EMPLOYEES = [
  { label: 'مهدی اسدی', value: 'mehdi' },
  { label: 'سارا محمدی', value: 'sara' },
];
const STATUSES = [
  { label: 'ثبت‌شده', value: 'registered' },
  { label: 'در حال بررسی', value: 'reviewing' },
];

interface Letter {
  id: string;
  subject: string;
  letterNumber: string;
  date: string;
  attachments: string[];
}

export default function CorrespondenceScreen() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);

  const { control, handleSubmit, reset } = useForm<CorrespondenceForm>({
    resolver: zodResolver(correspondenceSchema),
    defaultValues: {
      correspondenceType: 'incoming',
      employee: 'mehdi',
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

  const onSubmit = (data: CorrespondenceForm) => {
    setLetters((prev) => [
      {
        id: String(Date.now()),
        subject: data.subject,
        letterNumber: data.letterNumber,
        date: data.date,
        attachments,
      },
      ...prev,
    ]);
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
        <BlubankCard>
          <BlubankSelect
            control={control}
            name='correspondenceType'
            label='نوع مکاتبه'
            options={TYPES}
          />
          <BlubankSelect
            control={control}
            name='employee'
            label='کارمند'
            options={EMPLOYEES}
          />
          <FormField
            control={control}
            name='relatedReferral'
            label='ارجاع مرتبط (اختیاری)'
          />
          <FormField control={control} name='letterNumber' label='شماره نامه' />
          <FormField control={control} name='subject' label='موضوع' />
          <FormField
            control={control}
            name='senderReceiver'
            label='فرستنده / گیرنده'
          />
          <FormDateField control={control} name='date' label='تاریخ' />
          <BlubankSelect
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
              <Feather
                name='paperclip'
                size={16}
                color={Blubank.colors.primary}
              />
              <Text style={styles.attachText}>انتخاب فایل / ZIP / عکس</Text>
            </Pressable>
            <Pressable style={styles.attachBtn} onPress={capturePhoto}>
              <Feather name='camera' size={16} color={Blubank.colors.primary} />
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
                    color={Blubank.colors.textSecondary}
                  />
                  <Text style={styles.chipText} numberOfLines={1}>
                    {a}
                  </Text>
                  <Pressable
                    onPress={() =>
                      setAttachments((p) => p.filter((_, x) => x !== i))
                    }
                  >
                    <Feather name='x' size={14} color={Blubank.colors.danger} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <Pressable style={styles.primaryBtn} onPress={handleSubmit(onSubmit)}>
            <Feather name='mail' size={18} color='#FFFFFF' />
            <Text style={styles.primaryBtnText}>ثبت نامه و مستندات</Text>
          </Pressable>
        </BlubankCard>

        <SectionHeader title='آخرین مکاتبات' />
        <View style={styles.list}>
          {letters.length === 0 && (
            <Text style={styles.empty}>هنوز نامه‌ای ثبت نشده است</Text>
          )}
          {letters.map((l) => (
            <BlubankCard key={l.id} style={styles.rowCard}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowTitle}>{l.subject}</Text>
                <Text style={styles.rowMeta}>
                  {l.letterNumber} · {l.date}
                </Text>
              </View>
              {l.attachments.length > 0 && (
                <View style={styles.badge}>
                  <Feather
                    name='paperclip'
                    size={11}
                    color={Blubank.colors.primary}
                  />
                  <Text style={styles.badgeText}>{l.attachments.length}</Text>
                </View>
              )}
            </BlubankCard>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Blubank.colors.background },
  scroll: { paddingHorizontal: Blubank.spacing.lg, paddingBottom: 110 },
  textarea: { minHeight: 90, textAlignVertical: 'top' },
  attachRow: {
    flexDirection: 'row',
    gap: Blubank.spacing.md,
    marginTop: Blubank.spacing.md,
  },
  attachBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: Blubank.radius.input,
    borderWidth: 1,
    borderColor: Blubank.colors.primary,
    borderStyle: 'dashed',
    backgroundColor: Blubank.colors.primarySoft,
  },
  attachText: {
    fontSize: 12,
    color: Blubank.colors.primary,
    fontWeight: '600',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Blubank.spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Blubank.colors.inputBackground,
    borderRadius: Blubank.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: '100%',
  },
  chipText: {
    fontSize: 11,
    color: Blubank.colors.textSecondary,
    maxWidth: 140,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Blubank.spacing.sm,
    backgroundColor: Blubank.colors.primary,
    borderRadius: Blubank.radius.input,
    paddingVertical: 14,
    marginTop: Blubank.spacing.lg,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  list: { gap: Blubank.spacing.sm },
  empty: {
    textAlign: 'center',
    color: Blubank.colors.textMuted,
    paddingVertical: Blubank.spacing.xl,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Blubank.spacing.md,
  },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: Blubank.colors.text },
  rowMeta: { fontSize: 11, color: Blubank.colors.textSecondary, marginTop: 2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Blubank.colors.primarySoft,
    borderRadius: Blubank.radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 11, color: Blubank.colors.primary, fontWeight: '700' },
});
