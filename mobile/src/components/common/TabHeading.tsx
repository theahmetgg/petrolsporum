import React from "react";
import { View } from "react-native";
import { Menu } from "lucide-react-native";
import { Heading, IconButton } from "@/components/ui";
import { useDrawerStore } from "@/stores/drawerStore";

/** Yan menüyü açan düğme: sekmelerin sol üstünde durur */
export function MenuButton() {
  const openDrawer = useDrawerStore((s) => s.openDrawer);
  return <IconButton icon={Menu} label="Menüyü aç" size={44} iconSize={22} onPress={openDrawer} />;
}

/** Sekme başlığı: solda menü düğmesi, yanında dar büyük harfli sekme adı; sağda isteğe bağlı eylem. */
export function TabHeading({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <MenuButton />
      <Heading size="display" accessibilityRole="header" numberOfLines={1} style={{ flex: 1 }}>
        {title}
      </Heading>
      {right}
    </View>
  );
}
