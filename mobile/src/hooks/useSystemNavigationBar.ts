import { useEffect } from "react";
import { Platform, AppState, type AppStateStatus, processColor } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { requireNativeModule } from "expo-modules-core";
import { useNavigationMode, type NavigationModeInfo } from "./useNavigationMode";
import { useThemeScheme } from "../theme/useTheme";
import { getResolvedThemeScheme, type ThemeScheme } from "../stores/themeStore";
import { systemColors } from "@/theme";

let NativeExpoNavBar: any = null;
try {
  NativeExpoNavBar = requireNativeModule("ExpoNavigationBar");
} catch {
  // Not on Android or native module not loaded
}

let lastAppliedStyle: string | null = null;

type NavigationButtonStyle = "light" | "dark";

/**
 * Ekranların istediği geçici jest çizgisi stilleri (iç içe açılabilirler: ör. hikaye oluşturma + önizleme).
 * En son eklenen geçerlidir; boşsa tema stili kullanılır.
 */
const overrideStack: { id: number; style: NavigationButtonStyle }[] = [];
let nextOverrideId = 0;

function getActiveOverride(): NavigationButtonStyle | null {
  return overrideStack.length ? overrideStack[overrideStack.length - 1].style : null;
}

/** Jest modunda çizgi rengi: açık temada koyu, koyu temada açık. */
export function getGestureNavigationStyle(scheme: ThemeScheme = getResolvedThemeScheme()): "light" | "dark" {
  return scheme === "dark" ? "light" : "dark";
}

/**
 * Configure Android navigation bar icon style and background color.
 * - 3-Button Mode: WHITE icons ("light"), BLACK background ("#000000") — temadan bağımsız.
 * - Gesture Mode: DARK line ("dark") on light theme, LIGHT line ("light") on dark theme, TRANSPARENT background ("#00000000").
 */
export async function configureSystemNavigationBar(
  is3Button: boolean,
  scheme: ThemeScheme = getResolvedThemeScheme(),
  splashActive = false
): Promise<void> {
  if (Platform.OS !== "android") return;
  try {
    // Jest modunda açık bir override (koyu medya ekranı vb.) varsa tema yerine o uygulanır
    const btnStyle = is3Button ? "light" : getActiveOverride() ?? getGestureNavigationStyle(scheme);
    // Açılış animasyonu tam ekran: 3 tuş modunda siyah zemin açılış bitince boyanır (tuşlar kırmızı üstünde beyaz)
    const paintBlack = is3Button && !splashActive;
    const cacheKey = `${btnStyle}|${paintBlack ? "bar" : "clear"}`;
    if (lastAppliedStyle === cacheKey) return;

    // 1. Set button/pill foreground icon color
    // "light" = white icons (isAppearanceLightNavigationBars = false)
    // "dark"  = dark icons (isAppearanceLightNavigationBars = true)
    await NavigationBar.setButtonStyleAsync(btnStyle);

    // 2. Set native window navigation bar background for Android <= 14 compatibility
    if (NativeExpoNavBar?.setBackgroundColorAsync) {
      const targetColor = paintBlack ? processColor(systemColors.bar) : processColor("#00000000");
      if (targetColor !== null && targetColor !== undefined) {
        await NativeExpoNavBar.setBackgroundColorAsync(targetColor);
      }
    }

    lastAppliedStyle = cacheKey;
  } catch {
    // Silently ignore platform unsupported errors
  }
}

/**
 * Force re-apply navigation bar style (used on app resume).
 */
export async function forceApplyNavigationBar(
  is3Button: boolean,
  scheme: ThemeScheme = getResolvedThemeScheme(),
  splashActive = false
): Promise<void> {
  lastAppliedStyle = null;
  await configureSystemNavigationBar(is3Button, scheme, splashActive);
}

/**
 * Set Android navigation bar button style dynamically.
 * Önbelleği de günceller; böylece sonraki `configureSystemNavigationBar` çağrısı gerçek durumu bilir.
 */
export async function setSystemNavigationStyle(
  style: NavigationButtonStyle = "light"
): Promise<void> {
  if (Platform.OS !== "android") return;
  try {
    await NavigationBar.setButtonStyleAsync(style);
    // Zemin bilgisi yok: sonraki `configureSystemNavigationBar` çağrısı durumu yeniden uygular
    lastAppliedStyle = null;
  } catch {
    // Silently ignore
  }
}

/**
 * Jest modunda, `enabled` olduğu sürece çizgiyi `style` rengine sabitler (koyu medya zeminleri için "light").
 * Kapanınca bir önceki override'a ya da tema stiline döner. Uygulamaya geri dönüşte ve tema değişiminde de korunur.
 * 3 tuş modunda hiçbir şey yapmaz (tuşlar her zaman beyaz).
 */
export function useNavigationBarOverride(style: NavigationButtonStyle | undefined, enabled = true): void {
  const { is3Button } = useNavigationMode();

  useEffect(() => {
    if (Platform.OS !== "android" || is3Button || !enabled || !style) return;

    const id = nextOverrideId++;
    overrideStack.push({ id, style });
    setSystemNavigationStyle(style);

    return () => {
      const index = overrideStack.findIndex((entry) => entry.id === id);
      if (index >= 0) overrideStack.splice(index, 1);
      setSystemNavigationStyle(getActiveOverride() ?? getGestureNavigationStyle());
    };
  }, [is3Button, enabled, style]);
}

/**
 * Hook to manage system navigation bar lifecycle on Android.
 */
export function useSystemNavigationBar(splashActive = false): NavigationModeInfo {
  const modeInfo = useNavigationMode();
  const scheme = useThemeScheme();

  useEffect(() => {
    if (modeInfo.isAndroid && modeInfo.insetBottom <= 0) return;

    configureSystemNavigationBar(modeInfo.is3Button, scheme, splashActive);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        forceApplyNavigationBar(modeInfo.is3Button, scheme, splashActive);
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove();
  }, [modeInfo.is3Button, modeInfo.insetBottom, scheme, splashActive]);

  return modeInfo;
}

/**
 * Functional component controller to mount inside root layout.
 */
export function NavigationBarController({ splashActive = false }: { splashActive?: boolean } = {}): null {
  // Açılış animasyonu sürerken 3 tuş modunda çubuk saydam kalır (açılış tam ekran), bitince siyah boyanır
  useSystemNavigationBar(splashActive);
  return null;
}

export default useSystemNavigationBar;
