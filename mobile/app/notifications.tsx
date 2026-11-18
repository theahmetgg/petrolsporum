import React from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { AppText, ColorIconBox, ScreenHeader, Surface } from "@/components/ui";
import type { ColorIconName } from "@/constants/colorIcons.generated";
import { spacing } from "@/theme";

interface DemoNotification {
  id: string;
  icon: ColorIconName;
  title: string;
  text: string;
  when: string;
  href?: string;
}

/**
 * Örnek bildirimler (demo). Gerçek bildirim altyapısı Faz 2'de bağlanır (Expo Push); burada kulübün
 * SMS yerine göndereceği bildirim türleri gösterilir: maç günü, tahmin hatırlatması, maç sonucu, mağaza.
 */
const NOTIFICATIONS: DemoNotification[] = [
  { id: "n1", icon: "football", title: "Maç günü yaklaşıyor", text: "Batman Petrolspor – Muğlaspor, 22 Kasım Pazar 13:30. Biletini aldın mı?", when: "Bugün", href: "/match/2026-27-h15" },
  { id: "n2", icon: "prediction", title: "Tahminini yap", text: "Muğlaspor maçı için skor tahmini açık. Düdük çalınca kilitlenir.", when: "Bugün", href: "/play/prediction" },
  { id: "n3", icon: "whistle", title: "Maç sonucu", text: "Mardin 1969 Spor 1 – 1 Batman Petrolspor. Gol: Biron.", when: "8 Kasım", href: "/match/2026-27-h14" },
  { id: "n4", icon: "wallpaper", title: "Yeni duvar kağıdı", text: "Maç günü afişi galeriye eklendi.", when: "7 Kasım", href: "/(tabs)/gallery" },
  { id: "n5", icon: "store", title: "Mağaza", text: "2026-2027 sezon formaları satışta.", when: "1 Kasım" },
];

export default function NotificationsScreen() {
  return (
    <Screen>
      <ScreenHeader title="Bildirimler" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingBottom: 32, gap: spacing.boxGap }}>
        {NOTIFICATIONS.map((n) => (
          <Surface key={n.id} onPress={n.href ? () => router.push(n.href as never) : undefined} chevron={!!n.href}>
            <ColorIconBox name={n.icon} size={44} />
            <View style={{ flex: 1 }}>
              <AppText variant="small" weight="medium">
                {n.title}
              </AppText>
              <AppText variant="caption" tone="secondary">
                {n.text}
              </AppText>
              <AppText variant="caption" tone="muted" style={{ marginTop: 2 }}>
                {n.when}
              </AppText>
            </View>
          </Surface>
        ))}
        <AppText variant="caption" tone="muted" align="center" style={{ marginTop: 8 }}>
          Demo sürüm: bildirimler örnektir.
        </AppText>
      </ScrollView>
    </Screen>
  );
}
