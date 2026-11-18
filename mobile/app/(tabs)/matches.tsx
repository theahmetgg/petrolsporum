import React from "react";
import { TabPlaceholder } from "@/components/common/TabPlaceholder";

/** Maçlar sekmesi — iskelet. Gerçek ekran: prototip ekran 3. */
export default function MatchesTab() {
  return (
    <TabPlaceholder
      title="Maçlar"
      items={[
        { icon: "fixtures", title: "Fikstür", note: "Ekran 3" },
        { icon: "live", title: "Canlı maç: akış, kadro, istatistik", note: "Ekran 3" },
        { icon: "standings", title: "Puan durumu", note: "Ekran 3" },
        { icon: "squad", title: "Kadro", note: "Ekran 3" },
      ]}
    />
  );
}
