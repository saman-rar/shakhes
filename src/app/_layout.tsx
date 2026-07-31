import 'react-native-reanimated';
import { Blubank } from '@/theme/blubank';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { I18nManager, Platform, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== 'web' && !I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, []);

  return (
    // <GestureHandlerRootView style={styles.flex}>
    //   <SafeAreaProvider>
    <View style={styles.flex}>
      {/* <StatusBar style='dark' />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Blubank.colors.background },
            }}
          /> */}
      <Text>;aksjdkjaskdl</Text>
    </View>
    // </SafeAreaProvider>
    // </GestureHandlerRootView>
  );
}

// export default function RootLayout() {
//   useEffect(() => {
//     if (Platform.OS !== 'web' && !I18nManager.isRTL) {
//       I18nManager.allowRTL(true);
//       I18nManager.forceRTL(true);
//     }
//   }, []);

//   return (
//     <GestureHandlerRootView style={styles.flex}>
//       <SafeAreaProvider>
//         <View style={styles.flex}>
//           <StatusBar style='dark' />
//           <Stack
//             screenOptions={{
//               headerShown: false,
//               contentStyle: { backgroundColor: Blubank.colors.background },
//             }}
//           />
//         </View>
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// }

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Blubank.colors.background },
});
