import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Lobster_400Regular } from '@expo-google-fonts/lobster';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_800ExtraBold,
    Lobster_400Regular,
  });

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay ready={fontsLoaded} />
      {fontsLoaded && (
        <Stack initialRouteName="welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="welcome" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      )}
    </ThemeProvider>
  );
}
