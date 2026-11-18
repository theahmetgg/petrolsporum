import React, { useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Send } from "lucide-react-native";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Screen } from "@/components/layout/Screen";
import { AppText, Avatar, EmptyState, IconButton, ListRowSkeleton, ScreenHeader, SheetHeader, TextField } from "@/components/ui";
import SheetModal from "@/components/common/SheetModal";
import { FanPostCard } from "@/components/fan/FanPostCard";
import { useFanPosts } from "@/hooks/queries";
import { useFanWallStore } from "@/stores/fanWallStore";
import { useSessionStore } from "@/stores/sessionStore";
import type { FanPost, FanPostComment } from "@/types";
import { timeAgo } from "@/utils/format";
import { spacing } from "@/theme";

const MAX_COMMENT = 200;
const NO_COMMENTS: FanPostComment[] = [];

/** Yorum satırı: baş harf dairesi, ad · zaman, metin */
function CommentRow({ comment }: { comment: FanPostComment }) {
  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      <Avatar uri={null} name={comment.author_name} size={36} />
      <View style={{ flex: 1 }}>
        <AppText variant="caption" tone="muted">
          {comment.author_name} · {timeAgo(comment.created_at)}
        </AppText>
        <AppText variant="small">{comment.text}</AppText>
      </View>
    </View>
  );
}

/**
 * Taraftar Duvarı (prototip ekran 11, örnek verilerle). Gönderiler örnektir; beğenme ve yorum yazma yalnız
 * ekranda çalışır, kaydedilmez. Gerçek sürümde gönderiler moderasyondan geçer (Ar-Ge belgesi 11.7, açık karar).
 */
export default function FanWallScreen() {
  const params = useLocalSearchParams<{ open?: string }>();
  const { data: posts, isLoading } = useFanPosts();
  const fan = useSessionStore((s) => s.fan);
  const addComment = useFanWallStore((s) => s.addComment);
  const [active, setActive] = useState<FanPost | null>(null);
  const [draft, setDraft] = useState("");
  const sheet = useRef<BottomSheetModal>(null);
  const extra = useFanWallStore((s) => (active ? s.comments[active.id] : undefined)) ?? NO_COMMENTS;

  const open = (post: FanPost) => {
    setActive(post);
    setDraft("");
    sheet.current?.present();
  };

  // Ana sayfadan bir gönderinin yorumlarıyla açılabilir
  const opened = useRef(false);
  useEffect(() => {
    if (opened.current || !params.open || !posts) return;
    const post = posts.find((p) => p.id === params.open);
    if (post) {
      opened.current = true;
      open(post);
    }
  }, [params.open, posts]);

  const send = () => {
    if (!active || !draft.trim()) return;
    addComment(active.id, fan?.full_name ?? "Taraftar", draft);
    setDraft("");
  };

  const comments = active ? [...active.comments, ...extra] : [];

  return (
    <Screen>
      <ScreenHeader title="Taraftar Duvarı" />
      {isLoading ? (
        <View style={{ paddingHorizontal: spacing.screen }}>
          <ListRowSkeleton count={4} />
        </View>
      ) : (
        <FlatList
          data={posts ?? []}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingBottom: 32, gap: spacing.boxGap }}
          renderItem={({ item }) => <FanPostCard post={item} onOpenComments={() => open(item)} />}
          ListEmptyComponent={<EmptyState title="Henüz paylaşım yok" description="Taraftarların paylaşımları burada görünecek." />}
          ListFooterComponent={
            <AppText variant="caption" tone="muted" align="center" style={{ marginTop: 8 }}>
              Demo sürüm: gönderiler örnektir; beğeni ve yorumlar kaydedilmez.
            </AppText>
          }
        />
      )}

      <SheetModal ref={sheet} snapPoints={["70%", "92%"]} keyboardBehavior="extend" onDismiss={() => setActive(null)}>
        <SheetHeader title="Yorumlar" subtitle={active ? `${active.author_name} · ${comments.length} yorum` : undefined} onClose={() => sheet.current?.dismiss()} />
        <View style={{ gap: 16 }}>
          {comments.length ? comments.map((c) => <CommentRow key={c.id} comment={c} />) : <EmptyState compact title="İlk yorumu sen yaz" />}
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8, marginTop: 20 }}>
          <TextField inSheet value={draft} onChangeText={setDraft} placeholder="Yorum yaz" maxLength={MAX_COMMENT} multiline containerStyle={{ flex: 1 }} accessibilityLabel="Yorum yaz" />
          <IconButton icon={Send} label="Yorumu gönder" size={50} disabled={!draft.trim()} onPress={send} />
        </View>
      </SheetModal>
    </Screen>
  );
}
