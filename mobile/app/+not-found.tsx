import React from "react";
import { router } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { EmptyState } from "@/components/ui";

export default function NotFoundScreen() {
  return (
    <Screen contentContainerStyle={{ justifyContent: "center" }}>
      <EmptyState
        title="Sayfa bulunamadı"
        description="Aradığın sayfa kaldırılmış ya da taşınmış olabilir."
        actionLabel="Ana sayfaya dön"
        onAction={() => router.replace("/(tabs)")}
      />
    </Screen>
  );
}
