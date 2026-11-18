import React, { forwardRef } from "react";
import { View } from "react-native";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Check, type LucideIcon } from "lucide-react-native";
import SheetModal from "./SheetModal";
import { AppText, PressableBox } from "@/components/ui";
import { palettes, useTheme } from "@/theme";

export interface ActionSheetItem {
  key: string;
  icon: LucideIcon;
  label: string;
  /** Satırın altında gri kısa açıklama */
  description?: string;
  /** Sil / engelle gibi yıkıcı eylem: kırmızı, en altta */
  danger?: boolean;
  /** Seçim satırı (ör. tema): seçili olanın sağında onay işareti durur */
  selected?: boolean;
  /** false: dokununca pencere kapanmaz (ör. iki adımlı pencerede sonraki adıma geçen satır). Varsayılan true */
  closeOnPress?: boolean;
  onPress: () => void;
}

export interface ActionSheetProps {
  items: ActionSheetItem[];
  /** Kartın üstünde ortalı kısa soru (ör. "Mesaj silinsin mi?"); çoğu pencerede yok */
  title?: string;
  /** Başlığın altında soluk açıklama (ör. silmenin sonucu) */
  message?: string;
  /** Alttaki siyah butonun yazısı. Varsayılan "Vazgeç" */
  cancelLabel?: string;
  /** Verilirse alttaki buton pencereyi kapatmak yerine bunu çalıştırır (ör. iki adımlı pencerede "Geri") */
  onCancel?: () => void;
  /**
   * Koyu medya ekranının (gönderi, hikaye) üstünde açılır: temadan bağımsız koyu temanın grileriyle çizilir
   * (kart #272727, Vazgeç #323232, yazı beyaz; kullanıcı kararı 12 Kasım 2026) — siyah Vazgeç koyu zeminde kaybolmaz.
   */
  onMedia?: boolean;
  onDismiss?: () => void;
}

// Ölçüler Papara'nın "Fotoğraf Çek / Galeriden Seç" penceresinden alındı (dp)
const RADIUS = 8; // Kart ve alttaki buton köşesi
const ROW_PAD_X = 16;
const ROW_H = 52;
const ICON_SIZE = 26;
const ICON_GAP = 16;
const GAP = 16; // Kart ile alttaki buton arası

/**
 * Ortak Aksiyon penceresi (tasarım sistemi §5.2 "Aksiyon", Papara kalıbı; kullanıcı kararı 12 Kasım 2026):
 * pencere zemini ve tutamak yok; kenarlardan 16 ayrık tek kart içinde satırlar (zeminsiz çizgi ikon (tek tip, pastel ikon yok; kullanıcı kararı 12 Kasım 2026) +
 * `headline` semibold etiket + isteğe bağlı gri açıklama, aralarında kartı baştan sona kesen ince çizgi), altında ayrı
 * siyah "Vazgeç". Yıkıcı satır kırmızı ve en altta. Satıra dokununca pencere kapanır, sonra eylem çalışır. Klavye: Tip 3.
 */
export const ActionSheet = forwardRef<BottomSheetModal, ActionSheetProps>(function ActionSheet(
  { items, title, message, cancelLabel = "Vazgeç", onCancel, onMedia = false, onDismiss },
  ref
) {
  const theme = useTheme();
  // Medya üstünde koyu temanın renkleri, değilse etkin tema
  const colors = onMedia ? palettes.dark : theme.colors;
  const isDark = onMedia || theme.isDark;
  const dismiss = () => (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
  const ordered = [...items.filter((i) => !i.danger), ...items.filter((i) => i.danger)];
  // Kart: açık temada beyaz (karartılmış ekranın üstünde), koyu temada kutu rengi
  const cardBg = isDark ? colors.mono.fill : colors.surface.DEFAULT;
  const pressedBg = isDark ? colors.mono.fillStrong : colors.mono.fill;
  const hasHeader = !!(title || message);

  return (
    <SheetModal ref={ref} scrollable={false} floating onDismiss={onDismiss}>
      <View style={{ gap: GAP }}>
        <View style={{ backgroundColor: cardBg, borderRadius: RADIUS, overflow: "hidden" }}>
          {hasHeader ? (
            <View
              style={{
                paddingHorizontal: ROW_PAD_X,
                paddingVertical: 14,
                gap: 4,
                alignItems: "center",
                borderBottomWidth: ordered.length ? 1 : 0,
                borderBottomColor: colors.mono.line,
              }}
            >
              {title ? (
                <AppText variant="body" weight="semibold" align="center" color={colors.ink.DEFAULT}>
                  {title}
                </AppText>
              ) : null}
              {message ? (
                <AppText variant="caption" align="center" color={colors.ink.muted}>
                  {message}
                </AppText>
              ) : null}
            </View>
          ) : null}
          {ordered.map((item, i) => {
            const tint = item.danger ? colors.danger.DEFAULT : colors.ink.DEFAULT;
            const last = i === ordered.length - 1;
            return (
              <PressableBox
                key={item.key}
                onPress={() => {
                  if (item.closeOnPress !== false) dismiss();
                  item.onPress();
                }}
                accessibilityRole={item.selected === undefined ? "button" : "radio"}
                accessibilityState={item.selected === undefined ? undefined : { selected: item.selected }}
                accessibilityLabel={item.description ? `${item.label}, ${item.description}` : item.label}
                style={(pressed) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: ICON_GAP,
                  paddingLeft: ROW_PAD_X,
                  backgroundColor: pressed ? pressedBg : "transparent",
                  // Ayraç kartın bir kenarından öbürüne uzanır (kullanıcı isteği)
                  borderBottomWidth: last ? 0 : 1,
                  borderBottomColor: colors.mono.line,
                })}
              >
                <item.icon size={ICON_SIZE} color={tint} strokeWidth={2} />
                <View style={{ flex: 1, minHeight: ROW_H, justifyContent: "center", paddingVertical: 10, paddingRight: ROW_PAD_X }}>
                  <AppText variant="headline" weight="semibold" color={tint}>
                    {item.label}
                  </AppText>
                  {item.description ? (
                    <AppText variant="caption" color={colors.ink.muted} numberOfLines={2}>
                      {item.description}
                    </AppText>
                  ) : null}
                </View>
                {item.selected ? (
                  <View style={{ paddingRight: ROW_PAD_X }}>
                    <Check size={22} color={tint} strokeWidth={2} />
                  </View>
                ) : null}
              </PressableBox>
            );
          })}
        </View>
        <PressableBox
          onPress={onCancel ?? dismiss}
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
          style={() => ({
            height: ROW_H,
            borderRadius: RADIUS,
            backgroundColor: onMedia ? colors.mono.fillStrong : colors.mono.solid,
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <AppText variant="headline" weight="semibold" color={onMedia ? colors.ink.DEFAULT : colors.mono.onSolid}>
            {cancelLabel}
          </AppText>
        </PressableBox>
      </View>
    </SheetModal>
  );
});
