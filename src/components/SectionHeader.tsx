import { Blubank } from '@/theme/blubank';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  title: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, action }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Blubank.spacing.md,
    marginTop: Blubank.spacing.xl,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Blubank.colors.text,
  },
});
