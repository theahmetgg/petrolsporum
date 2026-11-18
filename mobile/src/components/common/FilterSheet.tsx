import React, { forwardRef, useEffect, useState } from "react";
import { View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import SheetModal from "./SheetModal";
import { AppText, Button, Pill, PressableBox, Radio, SheetHeader, TextField } from "@/components/ui";
import { useColors } from "@/theme";

export interface FilterOption {
  value: string;
  label: string;
}

/**
 * Pencerenin bölümleri:
 * - `sort`: sıralama, radyolu satırlar (ilk seçenek varsayılan; sayaca girmez)
 * - `choice`: tek seçim, beyaz zemin hapları; başta "Tümü" (değer yok)
 * - `range`: en az / en çok sayı alanları (fiyat, indirim)
 */
export type FilterSection =
  | { type: "sort"; key: string; title: string; options: FilterOption[] }
  | { type: "choice"; key: string; title: string; options: FilterOption[]; allLabel?: string }
  | { type: "range"; minKey: string; maxKey: string; title: string };

/** Bölüm anahtarı → seçili değer; boş değer "seçim yok" (Tümü / varsayılan sıralama) */
export type FilterValues = Record<string, string | undefined>;

/** Rozet için etkin filtre sayısı: varsayılandan farklı sıralama, seçili hap ve dolu aralık birer sayılır */
export function countActiveFilters(sections: FilterSection[], values: FilterValues): number {
  return sections.reduce((n, s) => {
    if (s.type === "sort") return n + (values[s.key] && values[s.key] !== s.options[0]?.value ? 1 : 0);
    if (s.type === "choice") return n + (values[s.key] ? 1 : 0);
    return n + (values[s.minKey] || values[s.maxKey] ? 1 : 0);
  }, 0);
}

export interface FilterSheetProps {
  sections: FilterSection[];
  /** Ekranda uygulanmış değerler (ekranın state'i; her render'da yeni nesne verilmez); pencere bunlardan başlar */
  values: FilterValues;
  /** "Uygula": taslak ekrana geçer ve pencere kapanır */
  onApply: (values: FilterValues) => void;
  title?: string;
}

const onlyDigits = (text: string) => text.replace(/[^0-9]/g, "");

/** "En az" "En çok"tan büyük yazıldıysa ikisi yer değiştirir */
function normalizeRanges(sections: FilterSection[], values: FilterValues): FilterValues {
  const out = { ...values };
  for (const s of sections) {
    if (s.type !== "range") continue;
    const min = out[s.minKey];
    const max = out[s.maxKey];
    if (min && max && Number(min) > Number(max)) {
      out[s.minKey] = max;
      out[s.maxKey] = min;
    }
  }
  return out;
}

/**
 * Ortak filtre penceresi (tasarım sistemi §5.2 "Filtre"): sıralama + tek seçimli hap grupları + sayı aralığı tek pencerede.
 * Seçimler taslakta tutulur; "Uygula" ile ekrana geçer, kapatınca taslak atılır. "Temizle" taslağı varsayılana döndürür.
 * Kategori bu pencereye girmez: imza bloktaki cam hap şeridinde kalır.
 */
export const FilterSheet = forwardRef<BottomSheetModal, FilterSheetProps>(function FilterSheet({ sections, values, onApply, title = "Filtrele" }, ref) {
  const colors = useColors();
  const [draft, setDraft] = useState<FilterValues>(values);

  // Ekrandaki değer değişince (ör. dışarıdan temizlendi) taslak da onu izler
  useEffect(() => setDraft(values), [values]);

  const set = (key: string, value: string | undefined) => setDraft((d) => ({ ...d, [key]: value || undefined }));
  const close = () => (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
  const isDirty = countActiveFilters(sections, draft) > 0;

  return (
    <SheetModal ref={ref} onDismiss={() => setDraft(values)}>
      <SheetHeader title={title} onClose={close} />
      <View style={{ gap: 24 }}>
        {sections.map((section) => {
          if (section.type === "sort") {
            const current = draft[section.key] ?? section.options[0]?.value;
            return (
              <View key={section.key} style={{ gap: 4 }}>
                <AppText variant="small" weight="medium" style={{ marginBottom: 6 }}>
                  {section.title}
                </AppText>
                {section.options.map((opt) => {
                  const active = current === opt.value;
                  return (
                    <PressableBox
                      key={opt.value}
                      onPress={() => set(section.key, opt.value)}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: active }}
                      style={(pressed) => ({
                        minHeight: 48,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        paddingHorizontal: 12,
                        borderRadius: 14,
                        backgroundColor: active || pressed ? colors.mono.fill : "transparent",
                      })}
                    >
                      <AppText variant="body" weight={active ? "medium" : "regular"} style={{ flex: 1 }}>
                        {opt.label}
                      </AppText>
                      <Radio checked={active} />
                    </PressableBox>
                  );
                })}
              </View>
            );
          }
          if (section.type === "choice") {
            const current = draft[section.key];
            return (
              <View key={section.key}>
                <AppText variant="small" weight="medium" style={{ marginBottom: 10 }}>
                  {section.title}
                </AppText>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  <Pill label={section.allLabel ?? "Tümü"} selected={!current} onPress={() => set(section.key, undefined)} />
                  {section.options.map((opt) => (
                    <Pill key={opt.value} label={opt.label} selected={current === opt.value} onPress={() => set(section.key, opt.value)} />
                  ))}
                </View>
              </View>
            );
          }
          return (
            <View key={section.minKey}>
              <AppText variant="small" weight="medium" style={{ marginBottom: 8 }}>
                {section.title}
              </AppText>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <TextField
                  inSheet
                  value={draft[section.minKey] ?? ""}
                  onChangeText={(t) => set(section.minKey, onlyDigits(t))}
                  placeholder="En az"
                  keyboardType="number-pad"
                  accessibilityLabel={`${section.title}, en az`}
                  containerStyle={{ flex: 1 }}
                />
                <View style={{ width: 10, height: 1, backgroundColor: colors.mono.line }} />
                <TextField
                  inSheet
                  value={draft[section.maxKey] ?? ""}
                  onChangeText={(t) => set(section.maxKey, onlyDigits(t))}
                  placeholder="En çok"
                  keyboardType="number-pad"
                  accessibilityLabel={`${section.title}, en çok`}
                  containerStyle={{ flex: 1 }}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Seçim penceresinin çoklu seçim düzeni (§5.2): solda metin "Temizle", sağda siyah "Uygula" */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 28 }}>
        <Button title="Temizle" variant="ghost" size="lg" disabled={!isDirty} onPress={() => setDraft({})} />
        <Button
          title="Uygula"
          size="lg"
          style={{ flex: 1 }}
          onPress={() => {
            onApply(normalizeRanges(sections, draft));
            close();
          }}
        />
      </View>
    </SheetModal>
  );
});
