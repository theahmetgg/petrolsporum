import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { TabPlaceholder } from "@/components/common/TabPlaceholder";
import { Button, SectionHeader } from "@/components/ui";
import { spacing } from "@/theme";

/** Ana Sayfa sekmesi — iskelet. Gerçek ekran: prototip ekran 2. */
export default function HomeTab() {
  return (
    <TabPlaceholder
      title="Ana Sayfa"
      items={[
        { icon: "news", title: "Manşet haberler", note: "Ekran 2" },
        { icon: "football", title: "Sıradaki maç ve geri sayım", note: "Ekran 2" },
        { icon: "tribune", title: "Tribün Modu (yalnız maç günü)", note: "Ekran 8" },
        { icon: "monument", title: "Anıt Duvarı", note: "Ekran 7" },
        { icon: "fanwall", title: "Taraftar duvarı", note: "Ekran 11" },
      ]}
      footer={
        __DEV__ ? (
          <View style={{ marginTop: spacing.section }}>
            <SectionHeader title="Geliştirici" inset={false} />
            <View style={{ gap: 10 }}>
              <Button title="Tasarım duvarı" variant="secondary" fullWidth onPress={() => router.push("/dev/design-wall")} />
              <Button title="Bileşen vitrini" variant="secondary" fullWidth onPress={() => router.push("/dev/ui-kit")} />
            </View>
          </View>
        ) : null
      }
    />
  );
}
