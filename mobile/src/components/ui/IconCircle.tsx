import React from "react";
import { View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useColors } from "@/theme";

export interface IconCircleProps {
  icon: LucideIcon;
  /** Marka kırmızısıyla çizilir (yalnız küçük vurgu: canlı, seçili); varsayılan metin rengi */
  accent?: boolean;
  size?: number;
}

/** Bilgi satırı / yer tutucu ikonu: `mono.fillStrong` daire (çerçevesiz), içinde tek renk Lucide ikon */
export function IconCircle({ icon: Icon, accent, size = 48 }: IconCircleProps) {
  const colors = useColors();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.mono.fillStrong,
      }}
    >
      <Icon size={Math.round(size * 0.42)} color={accent ? colors.brand.strong : colors.ink.DEFAULT} strokeWidth={1.5} />
    </View>
  );
}
