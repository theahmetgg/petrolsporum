import React from "react";
import { View } from "react-native";
import { Redirect } from "expo-router";
import { useSessionStore } from "@/stores/sessionStore";
import { useColors } from "@/theme";

/** Başlangıç ekranı: oturum varsa sekmelere, yoksa karşılama ekranına yönlendirir. */
export default function StartScreen() {
  const colors = useColors();
  const fan = useSessionStore((s) => s.fan);
  const isLoading = useSessionStore((s) => s.isLoading);

  // Oturum okunurken boş zemin (açılış katmanı zaten üstte)
  if (isLoading) return <View style={{ flex: 1, backgroundColor: colors.surface.bg }} />;
  return <Redirect href={fan ? "/(tabs)" : "/(auth)/welcome"} />;
}
