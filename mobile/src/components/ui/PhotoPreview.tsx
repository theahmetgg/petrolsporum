import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { X } from "lucide-react-native";
import { FullScreenOverlay } from "@/components/layout/FullScreenOverlay";
import { useNavigationMode } from "@/hooks/useNavigationMode";
import { useNavigationBarOverride } from "@/hooks/useSystemNavigationBar";
import { mediaColors, spacing } from "@/theme";
import { IconButton } from "./IconButton";

export interface PhotoPreviewProps {
  /** Gösterilecek (çözümlenmiş) fotoğraf adresi; `null` iken kapalı */
  uri: string | null;
  onClose: () => void;
}

/**
 * Tek fotoğrafın tam ekran önizlemesi (tasarım sistemi §4.7 / §7-L): siyah medya zemini, fotoğraf kırpılmadan (contain),
 * sağ üstte cam kapat butonu. RN `<Modal>` değil `FullScreenOverlay` ile açılır; Android geri tuşu kapatır,
 * jest çizgisi siyah zeminde görünsün diye açık renge alınır.
 */
export function PhotoPreview({ uri, onClose }: PhotoPreviewProps) {
  const { insetTop } = useNavigationMode();
  useNavigationBarOverride("light", Boolean(uri));
  return (
    <FullScreenOverlay visible={Boolean(uri)} onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: mediaColors.bg, alignItems: "center", justifyContent: "center" }}>
        {uri ? <Image cachePolicy="memory-disk" source={{ uri }} style={{ width: "100%", height: "80%" }} contentFit="contain" transition={150} /> : null}
        <View style={{ position: "absolute", top: insetTop + 12, right: spacing.screen }}>
          <IconButton icon={X} label="Kapat" variant="frost" onPress={onClose} size={40} />
        </View>
      </View>
    </FullScreenOverlay>
  );
}
