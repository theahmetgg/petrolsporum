import React from "react";
import { TabPlaceholder } from "@/components/common/TabPlaceholder";

/** Profil sekmesi — iskelet. Gerçek ekran: prototip ekran 9. */
export default function ProfileTab() {
  return (
    <TabPlaceholder
      title="Profil"
      items={[
        { icon: "fancard", title: "Taraftar kartı (QR)", note: "Ekran 9" },
        { icon: "ticket", title: "Hatıra bileti koleksiyonu", note: "Ekran 9" },
        { icon: "certificate", title: "Tuğlam ve sertifikam", note: "Ekran 7" },
        { icon: "leaderboard", title: "Sıralamam", note: "Ekran 9" },
        { icon: "cockpit", title: "Başkan Kokpiti (demo)", note: "Ekran 10" },
      ]}
    />
  );
}
