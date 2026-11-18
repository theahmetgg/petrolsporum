import { useMemo } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets, type EdgeInsets } from "react-native-safe-area-context";

export type NavigationMode = "3-button" | "gesture" | "tablet-taskbar" | "ios-indicator" | "none";

export interface NavigationModeInfo {
  mode: NavigationMode;
  is3Button: boolean;
  isGesture: boolean;
  isTabletTaskbar: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  insetBottom: number;
  insetTop: number;
  insets: EdgeInsets;
  /**
   * Recommended bottom padding for fixed bottom action bars / CTA buttons.
   */
  safeBottomPadding: number;
  /**
   * Recommended bottom padding for custom bottom tab bar.
   */
  safeTabPadding: number;
}

/**
 * Pure consumer hook to access safe area insets and navigation mode info
 * for modern Edge-to-Edge Expo/React Native.
 * Highly memoized against primitive inset values to prevent unnecessary re-renders.
 */
export function useNavigationMode(): NavigationModeInfo {
  const insets = useSafeAreaInsets();
  const isAndroid = Platform.OS === "android";
  const isIOS = Platform.OS === "ios";

  const top = insets.top;
  const bottom = insets.bottom;
  const left = insets.left;
  const right = insets.right;

  return useMemo(() => {
    // Android navigation bar metrics:
    // - Gesture navigation bar height is 15-24dp (never >= 30dp).
    // - 3-Button navigation bar height is 40-56dp (standard 48dp).
    const is3Button = isAndroid && bottom >= 32;
    const isGesture = isAndroid && bottom > 0 && bottom < 32;
    const isTabletTaskbar = isAndroid && bottom >= 56;

    let mode: NavigationMode = "none";
    if (isAndroid) {
      if (is3Button) mode = "3-button";
      else if (isGesture) mode = "gesture";
    } else if (isIOS) {
      if (bottom > 0) mode = "ios-indicator";
    }

    const safeBottomPadding = is3Button
      ? Math.max(bottom + 8, 20)
      : Math.max(bottom + 12, 20);

    const safeTabPadding = is3Button
      ? 0
      : (bottom > 0 ? bottom : 10);

    return {
      mode,
      is3Button,
      isGesture,
      isTabletTaskbar,
      isAndroid,
      isIOS,
      insetBottom: bottom,
      insetTop: top,
      insets,
      safeBottomPadding,
      safeTabPadding,
    };
  }, [top, bottom, left, right, isAndroid, isIOS]);
}

export default useNavigationMode;


