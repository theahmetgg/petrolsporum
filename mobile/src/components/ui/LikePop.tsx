import React, { useEffect, useRef } from "react";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { pop, shrinkBack } from "./motion";

/**
 * Beğeni ikonu sarmalayıcısı (kullanıcı kararı, 12 Kasım 2026): beğenince kısa büyüme, geri alınca hafif içe çekilme.
 * Yalnızca `liked` değişince oynar; ekran ilk açıldığında oynamaz. UI thread'de çalışır.
 */
export function LikePop({ liked, children }: { liked: boolean; children: React.ReactNode }) {
  const scale = useSharedValue(1);
  const prev = useRef(liked);
  useEffect(() => {
    if (prev.current === liked) return;
    prev.current = liked;
    if (liked) pop(scale);
    else shrinkBack(scale);
  }, [liked, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <Animated.View style={style}>{children}</Animated.View>;
}
