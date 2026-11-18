import React from "react";
import { RefreshControl, Platform, type RefreshControlProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/theme";

export interface AppRefreshControlProps extends RefreshControlProps {
  tintColor?: string;
  colors?: string[];
  progressBackgroundColor?: string;
  progressViewOffset?: number;
}

/**
 * Universal Pull-to-Refresh Control.
 *
 * Enforces brand theme (marka kırmızısı), tema zeminiyle uyumlu arka plan,
 * and unified spinner experience across iOS and Android.
 *
 * Automatically offsets the indicator on Android (progressViewOffset)
 * so it clears the status bar notch/punch-hole camera without being too far down.
 */
export function AppRefreshControl({
  tintColor,
  colors,
  progressBackgroundColor,
  progressViewOffset,
  ...rest
}: AppRefreshControlProps) {
  const palette = useColors();
  const insets = useSafeAreaInsets();

  // Android SwipeRefreshLayout simge çapı 40dp'dir.
  // Çekip bırakıldığında simgenin çentiğin altında net görünmesi için
  // bekleme pozisyonunu (offset) status bar / çentik seviyesinin altına indiriyoruz.
  const defaultOffset =
    Platform.OS === "android"
      ? Math.max((insets.top || 32) + 52, 82)
      : undefined;

  return (
    <RefreshControl
      tintColor={tintColor ?? palette.brand.DEFAULT}
      colors={colors ?? [palette.brand.DEFAULT]}
      progressBackgroundColor={progressBackgroundColor ?? palette.surface.DEFAULT}
      progressViewOffset={progressViewOffset ?? defaultOffset}
      {...rest}
    />
  );
}

export default AppRefreshControl;
