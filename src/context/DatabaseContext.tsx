import { getDb } from '@/db/client';
import type { SQLiteDatabase } from 'expo-sqlite';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const DatabaseContext = createContext<SQLiteDatabase | null>(null);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  useEffect(() => {
    let mounted = true;
    getDb().then((instance) => {
      if (mounted) setDb(instance);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!db) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size='large' color='#F28B0C' />
      </View>
    );
  }

  return (
    <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>
  );
}

export function useDatabase(): SQLiteDatabase {
  const db = useContext(DatabaseContext);
  if (!db) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return db;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
