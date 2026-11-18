import React from "react";
import { TabPlaceholder } from "@/components/common/TabPlaceholder";

/** Oyna sekmesi — iskelet. Gerçek ekranlar: prototip ekran 4 ve 5. */
export default function PlayTab() {
  return (
    <TabPlaceholder
      title="Oyna"
      items={[
        { icon: "prediction", title: "Skor tahmini", note: "Ekran 4" },
        { icon: "leaderboard", title: "Liderlik tabloları", note: "Ekran 4" },
        { icon: "lineup", title: "İlk 11'ini Kur", note: "Ekran 5" },
        { icon: "motm", title: "Maçın Adamı oylaması", note: "Faz 1 dışında" },
        { icon: "trivia", title: "Bilgi yarışması", note: "Faz 1 dışında" },
      ]}
    />
  );
}
