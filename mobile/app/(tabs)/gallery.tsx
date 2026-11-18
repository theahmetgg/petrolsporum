import React from "react";
import { TabPlaceholder } from "@/components/common/TabPlaceholder";

/** Galeri sekmesi — iskelet. Gerçek ekran: prototip ekran 6. */
export default function GalleryTab() {
  return (
    <TabPlaceholder
      title="Galeri"
      items={[
        { icon: "wallpaper", title: "Duvar kağıtları ve kilit ekranı önizleme", note: "Ekran 6" },
        { icon: "history", title: "Tarihçe ve efsaneler", note: "Sonraki faz" },
        { icon: "anthem", title: "Kulüp marşları", note: "Sonraki faz" },
      ]}
    />
  );
}
