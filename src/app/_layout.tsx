import { Coiny_400Regular } from "@expo-google-fonts/coiny";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/inter";

import { Kavoon_400Regular } from "@expo-google-fonts/kavoon";
import { Lobster_400Regular } from "@expo-google-fonts/lobster";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Coiny_400Regular,
    Inter_800ExtraBold,
    Lobster_400Regular,
    Kavoon_400Regular,
  });

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay ready={fontsLoaded} />
        {fontsLoaded && (
          <Stack
            initialRouteName="(auth)"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="recomendaciones" />
            <Stack.Screen name="receta/[id]" />
          </Stack>
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
