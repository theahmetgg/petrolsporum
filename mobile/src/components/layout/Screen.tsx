import React from "react";
import {
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
} from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { StatusBar, type StatusBarStyle } from "expo-status-bar";
import { useNavigationMode } from "@/hooks/useNavigationMode";
import { useIsInsideTabBar } from "@/contexts/TabBarContext";
import { useNavigationBarOverride } from "@/hooks/useSystemNavigationBar";
import { useThemeScheme, systemColors } from "@/theme";

export interface ScreenProps {
  children: React.ReactNode;
  /**
   * Whether to apply safe area bottom inset padding.
   * Set to `false` for screens inside bottom tab bars or custom scroll views.
   * @default true
   */
  withBottomInset?: boolean;
  /**
   * Explicitly override whether this screen is inside a tab bar.
   * By default, automatically detected via TabBarContext.
   */
  hasTabBar?: boolean;
  /**
   * Whether to apply safe area top inset padding.
   * Set to `false` when a screen implements its own header/banner with custom top padding.
   * @default true
   */
  withTopInset?: boolean;
  /**
   * Klavye açıldığında içeriği klavyenin üstüne iter (react-native-keyboard-controller,
   * `useReanimatedKeyboardAnimation` ile UI thread'de padding). Standart KeyboardAvoidingView kullanılmaz.
   * @default false
   */
  avoidKeyboard?: boolean;
  /**
   * `avoidKeyboard` açıkken klavye payından düşülecek ek mesafe (dp).
   * @default 0
   */
  keyboardVerticalOffset?: number;
  /**
   * Background color override for the screen container.
   */
  backgroundColor?: string;
  /**
   * NativeWind class names for the outer container.
   */
  className?: string;
  /**
   * Custom style for the root View container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Custom class names for the inner content container.
   */
  contentContainerClassName?: string;
  /**
   * Custom style for the inner content container.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Status bar style ('light' | 'dark' | 'auto').
   */
  statusBarStyle?: StatusBarStyle;
  /**
   * Android status bar background color.
   */
  statusBarColor?: string;
  /**
   * Whether the status bar is translucent on Android.
   * @default true
   */
  statusBarTranslucent?: boolean;
  /**
   * System navigation bar style ('light' | 'dark').
   */
  navigationBarStyle?: "light" | "dark";
}

/**
 * `avoidKeyboard` ekranlarının klavye payı. Ayrı bileşende durur: klavye animasyonu yalnızca bu ekranlarda
 * izlenir (her `Screen`'de çalışsaydı arkada açık duran tüm ekranlar klavyenin her karesinde hesap yapardı).
 */
function KeyboardAvoidingContent({
  children,
  baseOffset,
  keyboardVerticalOffset,
}: {
  children: React.ReactNode;
  baseOffset: number;
  keyboardVerticalOffset: number;
}) {
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();
  const animatedKeyboardStyle = useAnimatedStyle(() => {
    const currentHeight = Math.abs(keyboardHeight.value);
    const displacement = Math.max(currentHeight - baseOffset, 0);
    return { paddingBottom: Math.max(displacement - keyboardVerticalOffset, 0) };
  }, [baseOffset, keyboardVerticalOffset]);

  return <Animated.View style={[{ flex: 1 }, animatedKeyboardStyle]}>{children}</Animated.View>;
}

/**
 * Universal Screen wrapper component for the entire application.
 *
 * Responsibilities:
 * - Centrally manages Safe Area Insets (Top & Bottom).
 * - Adapts to Android 3-button navigation, gesture navigation, and iOS home indicators.
 * - Handles keyboard avoidance smoothly without layout jank (120 FPS UI-thread via react-native-keyboard-controller).
 * - Eliminates repetitive boilerplate in screen components.
 */
export function Screen({
  children,
  withBottomInset = true,
  hasTabBar,
  withTopInset = true,
  avoidKeyboard = false,
  keyboardVerticalOffset = 0,
  backgroundColor,
  className = "flex-1 bg-surface-bg",
  style,
  contentContainerClassName,
  contentContainerStyle,
  statusBarStyle,
  statusBarColor,
  statusBarTranslucent = true,
  navigationBarStyle,
}: ScreenProps) {
  const { is3Button, insetTop, insetBottom } = useNavigationMode();
  const isInsideTabBar = useIsInsideTabBar();
  const isDark = useThemeScheme() === "dark";
  // "dark" = açık zemin üstünde koyu ikon; koyu temada zemin de koyulaştığı için ikonlar açılır.
  // Kapak/fotoğraf üstündeki "light" ekranlar temadan bağımsız kalır.
  const resolvedStatusBarStyle = isDark && statusBarStyle === "dark" ? "light" : statusBarStyle;
  const effectiveHasTabBar = hasTabBar ?? isInsideTabBar;

  useNavigationBarOverride(navigationBarStyle);

  // 3-Buton modunda altta sabit 48px siyah bar bulunduğu için onun payını çıkar.
  // Gesture modunda withBottomInset aktifse container zaten insetBottom sağlamaktadır, çift pay olmaması için onu çıkar.
  const keyboardBaseOffset =
    is3Button && !effectiveHasTabBar
      ? insetBottom
      : !is3Button && withBottomInset && !effectiveHasTabBar
      ? insetBottom
      : 0;

  const containerPaddingStyle: ViewStyle = {
    paddingTop: withTopInset ? insetTop : 0,
    paddingBottom:
      !is3Button && withBottomInset && !effectiveHasTabBar
        ? insetBottom
        : 0,
    ...(backgroundColor ? { backgroundColor } : {}),
  };

  const content = (
    <View
      className={contentContainerClassName ? `flex-1 ${contentContainerClassName}` : "flex-1"}
      style={contentContainerStyle}
    >
      {children}
    </View>
  );

  return (
    <View
      className={className}
      style={[{ flex: 1 }, containerPaddingStyle, style]}
    >
      {statusBarStyle && (
        <StatusBar
          style={resolvedStatusBarStyle}
          backgroundColor={statusBarColor || "transparent"}
          translucent={statusBarTranslucent}
        />
      )}
      {avoidKeyboard ? (
        <KeyboardAvoidingContent
          baseOffset={keyboardBaseOffset}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          {content}
        </KeyboardAvoidingContent>
      ) : (
        content
      )}

      {is3Button && !effectiveHasTabBar && (
        <View
          style={{
            height: insetBottom,
            backgroundColor: systemColors.bar,
            width: "100%",
          }}
        />
      )}
    </View>
  );
}

export default Screen;
