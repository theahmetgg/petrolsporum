import React from "react";
import { FlatList, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { EmptyState, ListRowSkeleton, ScreenHeader } from "@/components/ui";
import { NewsRow } from "@/components/home/NewsRow";
import { useNews } from "@/hooks/queries";
import { spacing } from "@/theme";

/** Tüm haberler: en yeni en üstte. */
export default function NewsListScreen() {
  const { data: news, isLoading } = useNews();

  return (
    <Screen>
      <ScreenHeader title="Haberler" />
      {isLoading ? (
        <View style={{ paddingHorizontal: spacing.screen }}>
          <ListRowSkeleton count={5} />
        </View>
      ) : (
        <FlatList
          data={news ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingBottom: 32, gap: spacing.boxGap }}
          renderItem={({ item }) => <NewsRow item={item} onPress={() => router.push(`/news/${item.id}`)} />}
          ListEmptyComponent={<EmptyState title="Henüz haber yok" description="Kulüp haberleri burada görünecek." />}
        />
      )}
    </Screen>
  );
}
