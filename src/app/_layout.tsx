import { SplashLoading } from '@/components/SplashLoading';
import { DatabaseProvider } from '@/context/DatabaseContext';
import { EmployeesProvider } from '@/context/EmployeesContext';
import { useVazirFonts } from '@/hooks/use-vazir-fonts';
import { useTheme } from '@/theme/shakhes';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

function StackRoot() {
  const b = useTheme();
  const scheme = useColorScheme();
  return (
    <View style={[styles.flex, { backgroundColor: b.colors.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: b.colors.background },
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useVazirFonts();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return <SplashLoading />;

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <DatabaseProvider>
          <EmployeesProvider>
            <StackRoot />
          </EmployeesProvider>
        </DatabaseProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
