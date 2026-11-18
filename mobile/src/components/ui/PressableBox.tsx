import React, { useState } from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";

export interface PressableBoxProps extends Omit<PressableProps, "style" | "children"> {
  /** Basılı olup olmamasına göre stil üretir */
  style?: (pressed: boolean) => StyleProp<ViewStyle>;
  /**
   * Basınca öğenin küçüleceği oran (ör. 0.97). Verilmezse küçülme yoktur, yalnızca `style`'daki basılı stil uygulanır.
   * Animasyon UI thread'de (Reanimated) çalışır; sistemde "hareketi azalt" açıksa küçülme yapılmaz.
   */
  pressScale?: number;
  children?: React.ReactNode;
}

/** Basma efekti oranları (kullanıcı kararı, 12 Kasım 2026): kutular hafif küçülür ve soluklaşmaz, butonlar biraz daha belirgin küçülür */
export const BOX_PRESS_SCALE = 0.98;
export const BUTTON_PRESS_SCALE = 0.96;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Basış anında hızlı içe, bırakınca biraz daha yavaş geri dönüş (yay simülasyonu yok) */
const PRESS_IN = { duration: 90, easing: Easing.out(Easing.quad) };
const PRESS_OUT = { duration: 160, easing: Easing.out(Easing.quad) };

/**
 * NativeWind, Pressable'ın `style={({ pressed }) => ...}` fonksiyon biçimini uygulamıyor
 * (stil tamamen düşüyor). Bu sarmalayıcı basılı durumu kendisi tutar ve Pressable'a
 * düz stil dizisi verir. UI kit içindeki tüm basılabilir bileşenler bunu kullanır.
 */
export function PressableBox({ pressScale, ...props }: PressableBoxProps) {
  // Küçülme yalnızca isteyen öğede: diğer yüzlerce kullanımda animasyon kancası kurulmaz
  if (pressScale != null && pressScale !== 1) return <ScalingPressableBox {...props} pressScale={pressScale} />;
  return <PlainPressableBox {...props} />;
}

/**
 * Stil fonksiyonu basılı durumu okuyor mu? `style={() => ...}` (parametresiz) ise okumaz; o öğede basışta
 * React yeniden çizimi yapılmaz (liste kaydırılırken parmak değince JS thread boşuna çalışmasın).
 */
const readsPressed = (style?: (pressed: boolean) => StyleProp<ViewStyle>) => !!style && style.length > 0;

function PlainPressableBox({ style, onPressIn, onPressOut, onPress, children, ...rest }: Omit<PressableBoxProps, "pressScale">) {
  const [pressed, setPressed] = useState(false);
  const track = readsPressed(style);
  return (
    <Pressable
      {...rest}
      onPressIn={(e) => {
        if (track) setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        if (track) setPressed(false);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        // Basış tamamlanınca vurguyu hemen kaldır: açılan sheet/yeni ekran
        // onPressOut'u yutarsa satır gri kalmasın
        if (track) setPressed(false);
        onPress?.(e);
      }}
      style={style ? style(pressed) : undefined}
    >
      {children}
    </Pressable>
  );
}

function ScalingPressableBox({
  style,
  onPressIn,
  onPressOut,
  onPress,
  children,
  pressScale,
  ...rest
}: Omit<PressableBoxProps, "pressScale"> & { pressScale: number }) {
  const [pressed, setPressed] = useState(false);
  const track = readsPressed(style);
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // Küçülme yalnız UI thread'de; basılı durum yalnız stil onu okuyorsa React'e yazılır
  const release = () => {
    if (track) setPressed(false);
    scale.value = withTiming(1, PRESS_OUT);
  };

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        if (track) setPressed(true);
        if (!reduceMotion) scale.value = withTiming(pressScale, PRESS_IN);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        release();
        onPressOut?.(e);
      }}
      onPress={(e) => {
        // Açılan sheet/yeni ekran onPressOut'u yutarsa öğe küçük kalmasın
        release();
        onPress?.(e);
      }}
      style={[style ? style(pressed) : undefined, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
