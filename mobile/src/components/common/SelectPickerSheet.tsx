import React, { forwardRef, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Search } from "lucide-react-native";
import SheetModal from "./SheetModal";
import { AppText, PressableBox, Radio, SheetHeader } from "@/components/ui";
import { AppFonts } from "@/lib/fonts";
import { typography, useColors } from "@/theme";

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  /** Satırın solunda logo / avatar (ör. firma seçimi) */
  leading?: React.ReactNode;
  /** Satır bir işlem bekliyor (ör. konum bulunuyor): radyo yerine çark döner, satır basılamaz */
  loading?: boolean;
  /** false: dokununca pencere kapanmaz; çağıran işi bitince kendisi kapatır (ör. otomatik konum). Varsayılan true */
  closeOnSelect?: boolean;
}

export interface SelectPickerSheetProps {
  title: string;
  subtitle?: string;
  options: (string | SelectOption)[];
  selected?: string;
  onSelect: (value: string) => void;
  /** null → pencere içerik kadar açılır (az seçenek). Verilmezse ["55%", "85%"] */
  snapPoints?: string[] | null;
  /** Pencere kapanınca (seçimle ya da seçimsiz) */
  onDismiss?: () => void;
  /** Listenin üstünde kısa not / uyarı (ör. "Konum alınamadı · Ayarlardan aç") */
  notice?: React.ReactNode;
}

/** Bu sayıdan fazla seçenekte üstte arama kutusu çıkar (tasarım sistemi §5.2 Seçim) */
const SEARCH_THRESHOLD = 8;

/**
 * Tekil seçim sheet'i (tasarım sistemi §5.2 "Seçim"): satır + sağda radyo, seçili satır gri kutu rengi;
 * dokununca seçilir ve kapanır. 8'den fazla seçenekte üstte arama (Tip 2, `BottomSheetTextInput`).
 */
export const SelectPickerSheet = forwardRef<BottomSheetModal, SelectPickerSheetProps>(
  function SelectPickerSheet({ title, subtitle, options, selected, onSelect, snapPoints = ["55%", "85%"], onDismiss, notice }, ref) {
    const colors = useColors();
    const [query, setQuery] = useState("");

    const normalizedOptions: SelectOption[] = useMemo(
      () => options.map((opt) => (typeof opt === "string" ? { label: opt, value: opt } : opt)),
      [options]
    );
    const searchable = normalizedOptions.length > SEARCH_THRESHOLD;
    const q = query.trim().toLocaleLowerCase("tr-TR");
    const visible = q ? normalizedOptions.filter((o) => o.label.toLocaleLowerCase("tr-TR").includes(q)) : normalizedOptions;

    return (
      <SheetModal
        ref={ref}
        snapPoints={snapPoints ?? undefined}
        scrollable={true}
        keyboardBehavior={searchable ? "extend" : "interactive"}
        onDismiss={() => {
          setQuery("");
          onDismiss?.();
        }}
      >
        <View style={{ paddingBottom: 24, gap: 2 }}>
          <SheetHeader title={title} subtitle={subtitle} onClose={() => (ref as any)?.current?.dismiss()} />
          {searchable ? (
            <View
              style={{
                height: 46,
                borderRadius: 999,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingHorizontal: 14,
                marginBottom: 8,
                backgroundColor: colors.mono.fillStrong,
              }}
            >
              <Search size={18} color={colors.ink.muted} />
              <BottomSheetTextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Ara"
                placeholderTextColor={colors.ink.muted}
                autoCorrect={false}
                style={{ flex: 1, fontFamily: AppFonts.regular, fontSize: typography.body[0], color: colors.ink.DEFAULT, paddingVertical: 0 }}
              />
            </View>
          ) : null}
          {notice}
          {visible.map((opt) => {
            const active = selected === opt.value || selected === opt.label;
            return (
              <PressableBox
                key={opt.value}
                onPress={() => {
                  onSelect(opt.value);
                  if (opt.closeOnSelect !== false) (ref as any)?.current?.dismiss();
                }}
                disabled={opt.loading}
                accessibilityRole="radio"
                accessibilityState={{ selected: active, busy: opt.loading }}
                style={(pressed) => ({
                  minHeight: 56,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 14,
                  backgroundColor: active || pressed ? colors.mono.fill : "transparent",
                })}
              >
                {opt.leading}
                <View style={{ flex: 1, gap: 2 }}>
                  <AppText variant="body" weight={active ? "medium" : "regular"} numberOfLines={opt.leading ? 1 : undefined}>
                    {opt.label}
                  </AppText>
                  {opt.description ? (
                    <AppText variant="caption" tone="muted">
                      {opt.description}
                    </AppText>
                  ) : null}
                </View>
                {opt.loading ? <ActivityIndicator size="small" color={colors.ink.secondary} /> : <Radio checked={active} />}
              </PressableBox>
            );
          })}
          {searchable && !visible.length ? (
            <AppText variant="small" tone="muted" align="center" style={{ paddingVertical: 24 }}>
              Sonuç yok
            </AppText>
          ) : null}
        </View>
      </SheetModal>
    );
  }
);
