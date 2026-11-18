import { useCallback, useRef } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

/**
 * ScrollView içinde sayfalı içerik için: kaydırma sona `threshold` ekran yüksekliği kadar yaklaşınca `onEnd` çağrılır.
 * (FlashList/FlatList'te `onEndReached` kullanılır; bu hook başlıklı ScrollView ekranları içindir.)
 */
export function useScrollEndReached(onEnd: () => void, threshold = 0.5) {
  const firedForHeight = useRef(0);
  return useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
      const distanceToEnd = contentSize.height - (contentOffset.y + layoutMeasurement.height);
      // Aynı içerik yüksekliği için bir kez tetiklenir; yeni sayfa gelince yükseklik değişir
      if (distanceToEnd < layoutMeasurement.height * threshold && firedForHeight.current !== contentSize.height) {
        firedForHeight.current = contentSize.height;
        onEnd();
      }
    },
    [onEnd, threshold]
  );
}
