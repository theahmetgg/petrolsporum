import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { spacing, useColors } from "@/theme";
import { AppText } from "./AppText";
import { IconButton, PLAIN_BACK } from "./IconButton";

export interface AppHeaderProps {
  title?: string;
  /** Başlığın altında küçük açıklama (ör. "12 eczane nöbette") */
  subtitle?: string;
  /** Geri butonu gösterilsin mi (varsayılan: true) */
  showBack?: boolean;
  onBack?: () => void;
  /** Sağdaki aksiyonlar (IconButton'lar) */
  right?: React.ReactNode;
  /** Başlık yerine ortada özel içerik (ör. logo) */
  left?: React.ReactNode;
  /** Alt çizgi: ekran kaydırılınca `onScroll` ile true yapılır */
  divider?: boolean;
  /**
   * "large" (varsayılan; Papara düzeni, kullanıcı kararı 12 Kasım 2026): geri oku dairesiz ve kalın, başlık ortada iri
   * (`display`, 600). "compact": eski düzen — gri dairede geri, `headline` medium başlık.
   */
  size?: "large" | "compact";
  style?: StyleProp<ViewStyle>;
}

/**
 * Standart gradyansız üst bar: [geri] — ortada başlık — [aksiyonlar] (tasarım sistemi §4.1). Varsayılan görünüm Papara
 * düzeni (kullanıcı kararı, 12 Kasım 2026): dairesiz kalın geri oku, ortada iri başlık; isteğe bağlı soluk alt satır.
 * Gradyan bloktaki `SignatureTopBar` ile aynı düzen (kullanıcı kararı, 9 Kasım 2026): sol ve sağ yuva eşit esner,
 * başlık (+ isteğe bağlı soluk alt satır) her zaman ekranın tam ortasında durur; uzun başlık "…" ile kısalır.
 * Zemin saydamdır; sayfanın zemini (`Screen backgroundColor`) görünür.
 * Güvenli alan (status bar) boşluğu `Screen` bileşeni tarafından verilir.
 */
export function AppHeader({ title, subtitle, showBack = true, onBack, right, left, divider = false, size = "large", style }: AppHeaderProps) {
  const large = size === "large";
  const colors = useColors();
  const handleBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace("/(tabs)")));
  return (
    <View
      style={[
        {
          height: large ? 64 : 60,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: spacing.screen,
          gap: 8,
          backgroundColor: "transparent",
          borderBottomWidth: 1,
          borderBottomColor: divider ? colors.mono.line : "transparent",
        },
        style,
      ]}
    >
      <View style={{ flex: 1, minWidth: 40, alignItems: "flex-start" }}>
        {showBack ? (
          large ? (
            // Dairesiz kalın ok; dokunma alanı 44, ok ekran kenar boşluğuyla hizalı
            <IconButton icon={ChevronLeft} label="Geri" onPress={handleBack} {...PLAIN_BACK} />
          ) : (
            <IconButton icon={ChevronLeft} label="Geri" onPress={handleBack} size={40} />
          )
        ) : null}
      </View>
      <View style={{ alignItems: "center", flexShrink: 1 }}>
        {left ??
          (title ? (
            <>
              <AppText
                variant={large ? "display" : "headline"}
                weight={large ? "bold" : "medium"}
                align="center"
                numberOfLines={1}
                // Uzun başlık önce biraz küçülür, sığmazsa "…" ile kısalır
                adjustsFontSizeToFit={large}
                minimumFontScale={0.8}
                accessibilityRole="header"
              >
                {title}
              </AppText>
              {subtitle ? (
                <AppText variant="caption" tone="muted" align="center" numberOfLines={1}>
                  {subtitle}
                </AppText>
              ) : null}
            </>
          ) : null)}
      </View>
      <View style={{ flex: 1, minWidth: 40, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>{right}</View>
    </View>
  );
}

/** Alt ekranların standart üst barı (AppHeader v2) */
export const ScreenHeader = AppHeader;
