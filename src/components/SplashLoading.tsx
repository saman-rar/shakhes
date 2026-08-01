import { lightColors, typography } from '@/theme/shakhes';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export function SplashLoading() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2400, easing: Easing.linear }),
      -1,
      false,
    );
  }, [rotation]);

  const spin = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Animated.Image
          source={require('../../assets/images/sepah-logo.png')}
          style={[styles.logo, spin]}
          resizeMode='contain'
        />
      </View>

      <Text style={styles.title}>
        نرم افزار ارزیابی عملکرد اداره قراردادهای بانک سپه
      </Text>

      <ActivityIndicator size='large' color='#FFFFFF' style={styles.spinner} />

      <Text style={styles.subtitle}>در حال بارگذاری اطلاعات...</Text>
    </View>
  );
}

const CIRCLE = 150;
const LOGO = 108;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  logo: {
    width: LOGO,
    height: LOGO,
  },
  title: {
    marginTop: 32,
    fontSize: 16,
    lineHeight: 30,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: typography.bold,
  },
  spinner: {
    marginTop: 28,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontFamily: typography.regular,
  },
});
