import "../global.css";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { queryClient } from "../src/lib/queryClient";
import { useAppFonts } from "../src/lib/fonts";
import { useThemeStore } from "../src/stores/themeStore";
import { useSessionStore } from "../src/stores/sessionStore";
import { usePredictionStore } from "../src/stores/predictionStore";
import { useLineupStore } from "../src/stores/lineupStore";
import { useBrickStore } from "../src/stores/brickStore";
import { ThemeProvider, useTheme } from "../src/theme";
import { Toast } from "../src/components/Toast";
import { ConfirmHost } from "../src/components/common/ConfirmHost";
import { OverlayHost } from "../src/components/layout/FullScreenOverlay";
import DrawerMenu from "../src/components/DrawerMenu";
import { AnimatedSplash } from "../src/components/common/AnimatedSplash";
import { NavigationBarController } from "../src/hooks/useSystemNavigationBar";
import { ErrorBoundary } from "../src/components/common/ErrorBoundary";

cssInterop(Image, { className: "style" });

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.preventAutoHideAsync();

/** Linkle doğrudan bir ekran açılınca altına başlangıç ekranı (`index`) konur: geri tuşu uygulamayı kapatmaz. */
export const unstable_settings = { initialRouteName: "index" };

/** Açılış okumaları takılırsa telefonun açılış ekranının sonsuza kadar açık kalmaması için üst sınır. */
const SPLASH_MAX_WAIT_MS = 5000;
/** Uygulama hazırken animasyonlu açılışın ikonu çizilmezse (görsel hatası) telefonun ekranı en fazla bu kadar bekletilir. */
const SPLASH_ICON_MAX_WAIT_MS = 1000;

/**
 * Kök düzen (Batman360 iskeleti). Prototipte sunucu yok: oturum sahtedir (`sessionStore`); bildirim, çevrimdışı
 * kuyruk ve sürüm kapısı burada yer almaz, Faz 2'de eklenir.
 */
function RootLayout() {
  const themeHydrated = useThemeStore((state) => state.isHydrated);
  const sessionLoading = useSessionStore((state) => state.isLoading);
  const theme = useTheme();

  useEffect(() => {
    useThemeStore.getState().hydrate().catch(console.warn);
    useSessionStore.getState().init().catch(console.warn);
    // Telefonda saklanan demo verileri: tahminler, kurulan ilk 11, anıt duvarı tuğlaları
    usePredictionStore.getState().hydrate().catch(console.warn);
    useLineupStore.getState().hydrate().catch(console.warn);
    useBrickStore.getState().hydrate().catch(console.warn);
  }, []);

  const [fontsLoaded] = useAppFonts();
  const isAppReady = fontsLoaded && themeHydrated && !sessionLoading;

  // Animasyonlu açılış: katman telefonun açılış ekranıyla aynı ilk karede altında bekler;
  // telefonun ekranı kapanınca oynar, bitince ağaçtan kalkar
  const [splashPlay, setSplashPlay] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  // Katmanın ikonu ekrana çizildi mi: telefonun ekranı ikon çizilmeden kapanırsa bir an ikonsuz kırmızı görünür
  const [splashIconShown, setSplashIconShown] = useState(false);

  useEffect(() => {
    const release = () => {
      SplashScreen.hideAsync().catch(console.warn);
      setSplashPlay(true);
    };
    if (isAppReady && splashIconShown) {
      release();
      return;
    }
    if (!fontsLoaded) return;
    // Uygulama hazırsa ikon için kısa, değilse genel üst sınır kadar beklenir
    const timer = setTimeout(release, isAppReady ? SPLASH_ICON_MAX_WAIT_MS : SPLASH_MAX_WAIT_MS);
    return () => clearTimeout(timer);
  }, [isAppReady, fontsLoaded, splashIconShown]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ErrorBoundary screen="kök">
          {/* Uygulama edge-to-edge: KeyboardProvider bunu kendisi algılar ve çubukları saydam kabul eder. */}
          <KeyboardProvider>
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
              <BottomSheetModalProvider>
                <QueryClientProvider client={queryClient}>
                  <ErrorBoundary screen="gezinme">
                    <View style={{ flex: 1, backgroundColor: theme.colors.surface.bg }}>
                      <StatusBar style={theme.statusBarStyle} />
                      <NavigationBarController splashActive={!splashDone} />
                      <ConfirmHost />
                      <Toast />
                      <Stack
                        screenOptions={{
                          headerShown: false,
                          contentStyle: { backgroundColor: theme.colors.surface.bg },
                          animation: "fade_from_bottom",
                          animationDuration: 260,
                          gestureEnabled: true,
                          // Üstüne yeni ekran açılan (görünmeyen) ekranlar dondurulur: arka planda yeniden çizilmez
                          freezeOnBlur: true,
                        }}
                      >
                        <Stack.Screen name="index" />
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="(auth)" />
                      </Stack>
                      {/* Tam ekran katmanlar (fotoğraf önizleme vb.): RN Modal yerine ana pencerede, Stack'in üstünde */}
                      <OverlayHost />
                      {/* Yan menü: ana pencerede tek kopya, gezinme yığınının üstünde (sekmeler drawerStore ile açar) */}
                      <DrawerMenu />
                      {/* Animasyonlu açılış: her şeyin üstünde, bitince kaldırılır */}
                      {!splashDone ? (
                        <AnimatedSplash play={splashPlay} onReady={() => setSplashIconShown(true)} onFinish={() => setSplashDone(true)} />
                      ) : null}
                    </View>
                  </ErrorBoundary>
                </QueryClientProvider>
              </BottomSheetModalProvider>
            </SafeAreaProvider>
          </KeyboardProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default RootLayout;
