import { PopOnChange } from "@/components/ui/MotionViews";
import { hapticLight } from "@/lib/haptics";
import React, { memo } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { Heart, MessageCircle } from "lucide-react-native";
import type { FanPost } from "@/types";
import { AppText, Avatar, PressableBox, Surface } from "@/components/ui";
import { imageSource } from "@/mocks/images";
import { useFanWallStore } from "@/stores/fanWallStore";
import { timeAgo } from "@/utils/format";
import { radius, useColors } from "@/theme";

export interface FanPostCardProps {
  post: FanPost;
  /** Yorumları açar (kart ya da yorum düğmesi) */
  onOpenComments: () => void;
  /** Ana sayfadaki kısa görünüm: fotoğraf küçük, metin en çok 3 satır */
  compact?: boolean;
}

/**
 * Taraftar duvarı gönderisi: yazan (ad, şehir, zaman), metin, varsa fotoğraf, altında beğeni ve yorum.
 * Beğeni yalnız ekranda çalışır, kaydedilmez (demo).
 */
export const FanPostCard = memo(function FanPostCard({ post, onOpenComments, compact = false }: FanPostCardProps) {
  const colors = useColors();
  const liked = useFanWallStore((s) => !!s.liked[post.id]);
  const extraComments = useFanWallStore((s) => s.comments[post.id]?.length ?? 0);
  const toggleLike = useFanWallStore((s) => s.toggleLike);
  const likeCount = post.like_count + (liked ? 1 : 0);
  const commentCount = post.comments.length + extraComments;

  return (
    <Surface row={false} padding={14}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Avatar uri={null} name={post.author_name} size={40} />
        <View style={{ flex: 1 }}>
          <AppText variant="small" weight="medium" numberOfLines={1}>
            {post.author_name}
          </AppText>
          <AppText variant="caption" tone="muted" numberOfLines={1}>
            {post.author_city} · {timeAgo(post.created_at)}
          </AppText>
        </View>
      </View>

      <AppText variant="body" numberOfLines={compact ? 3 : undefined}>
        {post.text}
      </AppText>

      {post.image ? (
        <Image source={imageSource(post.image)} style={{ width: "100%", aspectRatio: compact ? 2.2 : 1.6, borderRadius: radius.thumb }} contentFit="cover" transition={150} />
      ) : null}

      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <PressableBox
          onPress={() => {
            if (!liked) hapticLight();
            toggleLike(post.id);
          }}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityState={{ selected: liked }}
          accessibilityLabel={liked ? "Beğeniyi geri al" : "Beğen"}
          style={() => ({ flexDirection: "row", alignItems: "center", gap: 6, minHeight: 32 })}
        >
          <PopOnChange trigger={liked ? 1 : 0} peak={1.3}>
            <Heart size={20} color={liked ? colors.media.like : colors.ink.secondary} fill={liked ? colors.media.like : "transparent"} strokeWidth={1.5} />
          </PopOnChange>
          <AppText variant="small" tone="secondary" style={{ fontVariant: ["tabular-nums"] }}>
            {likeCount}
          </AppText>
        </PressableBox>
        <PressableBox
          onPress={onOpenComments}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`Yorumlar, ${commentCount}`}
          style={() => ({ flexDirection: "row", alignItems: "center", gap: 6, minHeight: 32 })}
        >
          <MessageCircle size={20} color={colors.ink.secondary} strokeWidth={1.5} />
          <AppText variant="small" tone="secondary" style={{ fontVariant: ["tabular-nums"] }}>
            {commentCount}
          </AppText>
        </PressableBox>
      </View>
    </Surface>
  );
});
