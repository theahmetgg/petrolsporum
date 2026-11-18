import React, { useEffect, useId, useRef } from "react";
import { BackHandler, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useOverlayStore } from "@/stores/overlayStore";

interface FullScreenOverlayProps {
  visible: boolean;
  /** Android geri tuşu. Verilmezse geri tuşu katmanı kapatmaz ama alttaki ekrana da geçmez. */
  onRequestClose?: () => void;
  /** Katman zemini (örn. `mediaColors.bg`). Verilmezse saydam. */
  backgroundColor?: string;
  children: React.ReactNode;
}

const FILL = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 } as const;

/**
 * React Native `<Modal>` yerine kullanılan tam ekran katman.
 *
 * `<Modal>` Android'de ayrı bir pencere açar; gezinme çubuğu ayarlarımız (`setButtonStyleAsync`) o pencereye
 * ulaşmaz ve 3 tuş modunda tuşlar beyaz zemin + koyu ikon olur (navigation-bar.md). Bu bileşen içeriği
 * kök düzendeki `OverlayHost`'a taşır; içerik ana pencerede, sekme çubuğu dahil her şeyin üstünde çizilir.
 * Ana pencerenin `KeyboardProvider`, `BottomSheetModalProvider`, `Toast` ve `ConfirmHost`'u burada da geçerlidir.
 */
export function FullScreenOverlay({ visible, onRequestClose, backgroundColor, children }: FullScreenOverlayProps) {
  const key = useId();
  const onRequestCloseRef = useRef(onRequestClose);
  onRequestCloseRef.current = onRequestClose;

  const node = visible ? (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(160)}
      accessibilityViewIsModal
      style={[FILL, backgroundColor ? { backgroundColor } : null]}
    >
      {children}
    </Animated.View>
  ) : null;

  // Her çizimde içerik host'a aktarılır; host yalnızca kendini yeniden çizer, bu bileşeni tetiklemez
  useEffect(() => {
    const { upsert, remove } = useOverlayStore.getState();
    if (node) upsert(key, node);
    else remove(key);
  });

  useEffect(() => {
    return () => useOverlayStore.getState().remove(key);
  }, [key]);

  // Geri tuşu: son açılan katman önce yakalar (BackHandler son ekleneni önce çağırır)
  useEffect(() => {
    if (!visible) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      onRequestCloseRef.current?.();
      return true;
    });
    return () => subscription.remove();
  }, [visible]);

  return null;
}

/** Kök düzende (`app/_layout.tsx`) Stack'in üstünde bir kez çizilir. */
export function OverlayHost() {
  const entries = useOverlayStore((state) => state.entries);

  // Liste boşken de host yerinde kalır; son katmanın kapanış (FadeOut) animasyonu kesilmesin
  return (
    <View pointerEvents="box-none" style={FILL}>
      {entries.map((entry) => (
        <React.Fragment key={entry.key}>{entry.node}</React.Fragment>
      ))}
    </View>
  );
}

export default FullScreenOverlay;
