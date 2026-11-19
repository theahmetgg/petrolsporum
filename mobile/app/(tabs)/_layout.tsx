import { Redirect, Tabs } from "expo-router";
import React from "react";
import { CustomTabBar } from "@/components/common/CustomTabBar";
import { TabBarProvider } from "@/contexts/TabBarContext";
import { useSessionStore } from "@/stores/sessionStore";
import { useColors } from "@/theme";

/** Alt menü (karar, 18 Kasım 2026): Ana Sayfa · Maçlar · Oyna · Galeri · Profil */
export default function TabLayout() {
  const colors = useColors();
  const fan = useSessionStore((s) => s.fan);

  // Sekmeler oturum ister (misafir de oturumdur); oturum yoksa karşılama ekranı
  if (!fan) return <Redirect href="/(auth)/welcome" />;

  return (
    <TabBarProvider value={true}>
      <Tabs
        initialRouteName="index"
        // Android standardı: hangi sekmede olursan ol geri → Ana Sayfa → uygulama arka plana alınır
        backBehavior="initialRoute"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          // Görünmeyen sekmeler dondurulur: arka plandaki durum değişiklikleri onları yeniden çizdirmez
          freezeOnBlur: true,
          // Sekme değişince içerik kısa bir solmayla gelir (140 ms; yalnız saydamlık)
          animation: "fade",
          transitionSpec: { animation: "timing", config: { duration: 140 } },
          sceneStyle: { backgroundColor: colors.surface.bg },
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Ana Sayfa" }} />
        <Tabs.Screen name="matches" options={{ title: "Maçlar" }} />
        <Tabs.Screen name="play" options={{ title: "Oyna" }} />
        <Tabs.Screen name="gallery" options={{ title: "Galeri" }} />
        <Tabs.Screen name="profile" options={{ title: "Profil" }} />
      </Tabs>
    </TabBarProvider>
  );
}
