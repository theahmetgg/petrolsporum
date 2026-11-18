import React from "react";
import Animated from "react-native-reanimated";
import { firstLoadEntering } from "./motion";

/**
 * Liste ilk yüklemesi (kullanıcı kararı, 12 Kasım 2026): iskeletten sonra ilk birkaç satır sırayla solarak gelir.
 * Yalnızca hücre ilk kez çizildiğinde çalışır; FlashList hücreyi yeniden kullanınca (kaydırma) tekrar oynamaz,
 * sınırdan sonraki satırlar animasyonsuzdur. Sarmalayıcı her satırda aynı türdür (Animated.View), yeniden kurulum olmaz.
 */
export function FirstLoadFade({ index, children }: { index: number; children: React.ReactNode }) {
  return <Animated.View entering={firstLoadEntering(index)}>{children}</Animated.View>;
}

/**
 * `renderItem` sarmalayıcısı: `renderItem={withFirstLoadFade(({ item }) => <Row item={item} />)}`.
 * Satırın kendisine dokunmadan ilk yükleme solmasını ekler.
 */
export function withFirstLoadFade<I extends { index: number }>(render: (info: I) => React.ReactNode) {
  return function FadingItem(info: I) {
    return <FirstLoadFade index={info.index}>{render(info)}</FirstLoadFade>;
  };
}
