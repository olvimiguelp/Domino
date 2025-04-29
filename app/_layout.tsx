import { useEffect, useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { GameContextProvider } from '@/contexts/GameContext';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { ScoreProvider } from '@/contexts/ScoreContext';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

// Keep splash screen visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <LocalizationProvider>
      <ScoreProvider>
        <GameContextProvider>
          <View style={styles.container} onLayout={onLayoutRootView}>
            <Stack screenOptions={{
              headerStyle: { backgroundColor: Colors.primary.dark },
              headerTintColor: Colors.white,
              headerTitleStyle: { 
                fontFamily: 'Inter-SemiBold',
                fontSize: 18,
              },
              contentStyle: { backgroundColor: Colors.background },
            }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
              <Stack.Screen name="*" options={{ title: 'Redirecting...' }} redirectTo="/" />
            </Stack>
            <StatusBar style="light" />
          </View>
        </GameContextProvider>
      </ScoreProvider>
    </LocalizationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});