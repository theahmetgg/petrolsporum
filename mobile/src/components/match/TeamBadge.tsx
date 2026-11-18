import React, { memo } from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { HeadingFonts } from "@/lib/fonts";
import { IMAGES } from "@/mocks/images";
import { getTeam } from "@/mocks/teams";
import { useColors } from "@/theme";

export interface TeamBadgeProps {
  teamId: string;
  size?: number;
  /** Kırmızı gradyan / fotoğraf üstünde: rakip rozeti yarı saydam beyaz çizilir */
  onBrand?: boolean;
}

/**
 * Takım rozeti. Kendi kulübümüzde gerçek arma; rakiplerde üç harfli kodla nötr daire.
 * Rakip armaları lisanslıdır ve izin alınmadan kullanılamaz (Ar-Ge belgesi 8.3, "Kullanılmayacaklar").
 */
export const TeamBadge = memo(function TeamBadge({ teamId, size = 44, onBrand = false }: TeamBadgeProps) {
  const colors = useColors();
  const team = getTeam(teamId);

  if (team.is_own) {
    return <Image source={IMAGES.crest} style={{ width: size, height: size }} contentFit="contain" transition={0} accessibilityLabel={`${team.name} arması`} />;
  }

  return (
    <View
      accessibilityLabel={team.name}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: onBrand ? colors.glass.DEFAULT : colors.mono.fillStrong,
        borderWidth: onBrand ? 1 : 0,
        borderColor: colors.glass.border,
      }}
    >
      <Text
        allowFontScaling={false}
        style={{ fontFamily: HeadingFonts.bold, fontSize: Math.round(size * 0.34), letterSpacing: 0.5, color: onBrand ? colors.ink.inverse : colors.ink.DEFAULT }}
      >
        {team.code}
      </Text>
    </View>
  );
});
