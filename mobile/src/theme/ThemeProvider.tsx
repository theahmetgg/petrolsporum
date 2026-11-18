import React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { vars } from "nativewind";
import { cssVariables } from "./palette";
import { ForcedSchemeContext, useThemeScheme } from "./useTheme";
import type { ThemeScheme } from "../stores/themeStore";

const themeVars = {
  light: vars(cssVariables.light),
  dark: vars(cssVariables.dark),
};

/**
 * Kök tema sarmalayıcısı: token renklerini CSS değişkeni olarak alt ağaca verir.
 * Böylece `className` ile verilen token renkleri (bg-surface, text-ink …) temaya göre kendiliğinden değişir.
 * BottomSheet portalları ve RN <Modal> içerikleri de bu ağacın altında kaldığından değişkenleri alır.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useThemeScheme();
  return <View style={[{ flex: 1 }, themeVars[scheme]]}>{children}</View>;
}

/**
 * Tema kapsamı: içindeki her şey (className token'ları ve `useTheme` / `useColors`) verilen şemayla çizilir.
 * Koyu medya ekranlarında açılan pencereler için (ör. `scheme="dark"`). Gorhom pencerelerinde içeriği bununla sarın;
 * pencerenin kendi zemini/tutamağı kapsamın dışında olduğundan `palettes[scheme]` ile verilir.
 */
export function ThemeScope({
  scheme,
  children,
  fill = true,
  style,
}: {
  scheme: ThemeScheme;
  children: React.ReactNode;
  /** Alanı doldursun mu (flex 1). İçeriğe göre boy alan pencerelerde false */
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <ForcedSchemeContext.Provider value={scheme}>
      <View style={[fill ? { flex: 1 } : null, themeVars[scheme], style]}>{children}</View>
    </ForcedSchemeContext.Provider>
  );
}
