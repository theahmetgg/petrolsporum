import React, { useCallback, useEffect, useRef } from "react";
import { BackHandler, View } from "react-native";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import type { LucideIcon } from "lucide-react-native";
import { AppText, Button } from "@/components/ui";
import type { ConfirmTone } from "@/stores/confirmStore";
import SheetModal from "./SheetModal";

export interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  tone?: ConfirmTone;
  /** Kullanılmıyor: onay penceresinde ikon gösterilmez (tasarım sistemi §5.2 Onay). Mevcut çağrılar bozulmasın diye kabul edilir. */
  icon?: LucideIcon;
  /** Koyu medya ekranından açıldı: pencere koyu şemayla çizilir */
  onMedia?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Onay penceresi (tasarım sistemi §5.2 "Onay"; klavye Tip 3): ortalı başlık + mesaj, altta yan yana
 * "Vazgeç" (gri) ve eylem (siyah; yıkıcıysa kırmızı). Kabuk ortak `SheetModal`'dır (animasyon, sürükleme,
 * karartma, 3-buton siyah barı diğer sheet'lerle aynı). Doğrudan kullanılmaz: ekranlar
 * `confirm()` / `useConfirm()` (`@/stores/confirmStore`) çağırır, `ConfirmHost` bu bileşeni gösterir.
 * Her açılışta `onConfirm` ya da `onCancel`'dan yalnızca biri, bir kez çağrılır.
 */
export function ConfirmModal({
  visible,
  title,
  message,
  confirmText,
  cancelText = "Vazgeç",
  tone = "primary",
  onMedia = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const isPresentedRef = useRef(false);
  const isSettledRef = useRef(true);

  // Hiç açılmamış sheet'e dismiss() çağrılmaz: Gorhom v5'te sonraki present() çağrısını etkisiz bırakıyor.
  useEffect(() => {
    if (visible) {
      isSettledRef.current = false;
      isPresentedRef.current = true;
      sheetRef.current?.present();
    } else if (isPresentedRef.current) {
      isPresentedRef.current = false;
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const settle = useCallback(
    (confirmed: boolean) => {
      if (isSettledRef.current) return;
      isSettledRef.current = true;
      if (confirmed) onConfirm();
      else onCancel();
    },
    [onConfirm, onCancel]
  );

  const handleConfirm = useCallback(() => {
    settle(true);
    sheetRef.current?.dismiss();
  }, [settle]);

  const handleCancel = useCallback(() => {
    settle(false);
    sheetRef.current?.dismiss();
  }, [settle]);

  // Kaydırarak / dışarı dokunarak kapanış: sheet zaten kapalı, effect ikinci kez dismiss() çağırmasın
  const handleDismiss = useCallback(() => {
    isPresentedRef.current = false;
    settle(false);
  }, [settle]);

  // BottomSheetModal Android geri tuşunu kendiliğinden dinlemez
  useEffect(() => {
    if (!visible) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      handleCancel();
      return true;
    });
    return () => subscription.remove();
  }, [visible, handleCancel]);

  const isDanger = tone === "danger";

  return (
    // "push": altta açık bir sheet varsa (örn. yorumlar) küçültülmeden yerinde kalsın
    <SheetModal ref={sheetRef} scrollable={false} stackBehavior="push" onDismiss={handleDismiss} scheme={onMedia ? "dark" : undefined}>
      <View className="items-center w-full" style={{ paddingTop: 8 }}>
        <AppText variant="headline" weight="medium" align="center" style={{ marginBottom: 6 }}>
          {title}
        </AppText>
        <AppText variant="body" tone="secondary" align="center" style={{ paddingHorizontal: 8 }}>
          {message}
        </AppText>
      </View>

      <View style={{ flexDirection: "row", gap: 12, width: "100%", marginTop: 24 }}>
        <Button title={cancelText} variant="secondary" size="lg" onPress={handleCancel} style={{ flex: 1 }} />
        <Button
          title={confirmText}
          variant={isDanger ? "destructive" : "primary"}
          size="lg"
          onPress={handleConfirm}
          style={{ flex: 1 }}
        />
      </View>
    </SheetModal>
  );
}
