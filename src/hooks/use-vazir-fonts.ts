import { useFonts } from 'expo-font';

export function useVazirFonts() {
  return useFonts({
    Vazir: require('../../assets/fonts/Vazir.ttf'),
    'Vazir-Medium': require('../../assets/fonts/Vazir-Medium.ttf'),
    'Vazir-Bold': require('../../assets/fonts/Vazir-Bold.ttf'),
  });
}
