import React from "react";
import type { TypographyVariant } from "@/theme";
import { AppText } from "./AppText";

export interface PriceTextProps {
  price?: number | null;
  variant: TypographyVariant;
  /** "₺" işaretinin boyutu (verilmezse rakamla aynı) */
  unitVariant?: TypographyVariant;
  weight?: "medium" | "semibold";
}

/** Fiyat : rakam iri, "₺" bir boy küçük ve soluk. Fiyat yoksa "Fiyat sorunuz". */
export function PriceText({ price, variant, unitVariant, weight = "medium" }: PriceTextProps) {
  if (!price) {
    return (
      <AppText variant={variant} weight={weight}>
        Fiyat sorunuz
      </AppText>
    );
  }
  return (
    <AppText variant={variant} weight={weight} style={{ letterSpacing: variant === "metric" ? -1.5 : -0.3 }}>
      {price.toLocaleString("tr-TR")}
      <AppText variant={unitVariant ?? variant} weight="regular" tone="muted" style={{ letterSpacing: 0 }}>
        {" ₺"}
      </AppText>
    </AppText>
  );
}
