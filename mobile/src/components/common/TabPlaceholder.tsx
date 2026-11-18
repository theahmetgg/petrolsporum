import React from "react";
import { ScrollView, View } from "react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, ColorIconBox, Heading, Surface } from "@/components/ui";
import type { ColorIconName } from "@/constants/colorIcons.generated";
import { useTabBarHeight } from "@/components/common/CustomTabBar";
import { spacing } from "@/theme";

export interface PlaceholderItem {
  icon: ColorIconName;
  title: string;
  /** Hangi prototip ekranında yapılacağı (Ar-Ge belgesi 13.1) */
  note: string;
}

export interface TabPlaceholderProps {
  title: string;
  items: PlaceholderItem[];
  /** Listenin altına eklenecek içerik (ör. geliştirici bağlantıları) */
  footer?: React.ReactNode;
}

/**
 * İskelet aşamasındaki boş sekme (prototip ekran 0): sekmenin adı ve bu sekmeye gelecek bölümlerin listesi.
 * Sekmenin gerçek ekranı yazılınca bu bileşenin o sekmedeki kullanımı kalkar; son sekme de bitince dosya silinir.
 */
export function TabPlaceholder({ title, items, footer }: TabPlaceholderProps) {
  const tabBarHeight = useTabBarHeight();
  return (
    <Screen withBottomInset={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingTop: 12, paddingBottom: tabBarHeight + spacing.section }}
      >
        <Heading size="display" accessibilityRole="header">
          {title}
        </Heading>
        <AppText variant="small" tone="muted" style={{ marginTop: 4 }}>
          Bu sekme sıradaki adımlarda yapılacak.
        </AppText>

        <View style={{ marginTop: spacing.section, gap: spacing.boxGap }}>
          {items.map((item) => (
            <Surface key={item.title}>
              <ColorIconBox name={item.icon} size={44} />
              <View style={{ flex: 1 }}>
                <AppText variant="small">{item.title}</AppText>
                <AppText variant="caption" tone="muted">
                  {item.note}
                </AppText>
              </View>
            </Surface>
          ))}
        </View>

        {footer}
      </ScrollView>
    </Screen>
  );
}
