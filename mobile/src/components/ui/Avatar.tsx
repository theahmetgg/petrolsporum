import React, { useState } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { Image } from "expo-image";
import { User, type LucideIcon } from "lucide-react-native";
import { useColors } from "@/theme";
import { resolveImageUrl } from "@/utils/image";

export interface AvatarProps {
  uri?: string | null;
  name?: string | null;
  size?: number;
  /** Sağ altta yeşil çevrimiçi noktası */
  online?: boolean;
  /** Görsel yoksa çizilecek ikon (varsayılan kişi silüeti; firma logosu için ör. `Store`) */
  icon?: LucideIcon;
  style?: StyleProp<ViewStyle>;
}

/** Geriye dönük uyumluluk için korunur. */
export const getInitials = (name?: string | null) =>
  (name || "Kullanıcı")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toLocaleUpperCase("tr-TR"))
    .join("");

/**
 * Profil fotoğrafı; yoksa veya yüklenemezse nötr kullanıcı silüeti (tasarım sistemi §4.7: gri kutu rengi zemin + ince çerçeve).
 * Adres burada çözümlenir; çağıranın `resolveImageUrl` çağırması gerekmez (çözülmüş adresi tekrar çözmek zararsızdır).
 */
export function Avatar({ uri, name, size = 40, online = false, icon: FallbackIcon = User, style }: AvatarProps) {
  const colors = useColors();
  const [failed, setFailed] = useState(false);
  const [lastUri, setLastUri] = useState(uri);

  if (uri !== lastUri) {
    setLastUri(uri);
    setFailed(false);
  }

  const imageUri = resolveImageUrl(uri, "");
  const showImage = !!imageUri && !failed;
  const iconSize = Math.max(14, Math.round(size * 0.52));

  return (
    <View style={[{ width: size, height: size }, style]} accessibilityLabel={name ? `${name} profil fotoğrafı` : undefined}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: "hidden",
          backgroundColor: colors.mono.fillStrong,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showImage ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: size, height: size }}
            contentFit="cover"
            transition={150}
            cachePolicy="memory-disk"
            onError={() => setFailed(true)}
          />
        ) : (
          <FallbackIcon size={iconSize} color={colors.ink.muted} strokeWidth={1.5} />
        )}
      </View>
      {online ? (
        <View
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: Math.max(10, size * 0.26),
            height: Math.max(10, size * 0.26),
            borderRadius: size,
            backgroundColor: colors.success.DEFAULT,
            borderWidth: 2,
            borderColor: colors.surface.DEFAULT,
          }}
        />
      ) : null}
    </View>
  );
}
