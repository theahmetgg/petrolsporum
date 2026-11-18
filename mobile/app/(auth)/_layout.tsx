import React from "react";
import { Redirect, Stack } from "expo-router";
import { useSessionStore } from "@/stores/sessionStore";
import { useColors } from "@/theme";

/** Karşılama, giriş ve üyelik ekranları. Oturum açıkken bu ekranlara girilmez; sekmelere yönlenir. */
export default function AuthLayout() {
  const colors = useColors();
  const fan = useSessionStore((s) => s.fan);
  if (fan) return <Redirect href="/(tabs)" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface.bg },
        animation: "fade_from_bottom",
        animationDuration: 260,
      }}
    />
  );
}
