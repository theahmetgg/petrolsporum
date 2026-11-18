import React from "react";
import { SlidersHorizontal } from "lucide-react-native";
import { IconButton } from "./IconButton";

export interface FilterButtonProps {
  onPress: () => void;
  /** Etkin filtre sayısı (varsayılan sıralama sayılmaz); 0 ise rozet yok */
  count?: number;
}

/**
 * İmza gradyan blokta cam arama kutusunun sağındaki filtre butonu (tasarım sistemi §4.1).
 * Arama kutusuyla aynı boy (46); etkin filtre sayısı sağ üstte beyaz rozet.
 * Basınca ekranın `FilterSheet` penceresi açılır.
 */
export function FilterButton({ onPress, count = 0 }: FilterButtonProps) {
  return (
    <IconButton
      icon={SlidersHorizontal}
      label={count > 0 ? `Filtrele, ${count} filtre etkin` : "Filtrele"}
      variant="frost"
      size={46}
      iconSize={18}
      badgeCount={count}
      onPress={onPress}
    />
  );
}
