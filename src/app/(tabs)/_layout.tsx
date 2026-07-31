import { FloatingTabBar } from '@/components/FloatingTabBar';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name='index' options={{ title: 'داشبورد' }} />
      <Tabs.Screen name='employees' options={{ title: 'مدیریت کارکنان' }} />
      <Tabs.Screen
        name='referrals'
        options={{ title: 'ثبت و ارزیابی ارجاع' }}
      />
      <Tabs.Screen
        name='correspondence'
        options={{ title: 'ثبت و سنجش مکاتبات' }}
      />
      <Tabs.Screen name='monthly' options={{ title: 'ارزیابی ماهانه' }} />
      <Tabs.Screen name='guide' options={{ title: 'راهنما' }} />
    </Tabs>
  );
}
