/**
 * Görsel adresi çözümleme. Prototipte sunucu yok: adresler sahte veri klasöründen tam (https) ya da yerel gelir.
 * Sunucu geldiğinde (Faz 2) medya deposu / küçük kopya mantığı Batman360'taki `utils/image.ts`'ten buraya taşınır;
 * bileşenler (`AppImage`, `Avatar`, `MediaHero`) değişmez.
 */

/** Boş, "null" ya da geçersiz adreste `fallback` (varsayılan: boş) döner; çağıran taraf yer tutucu gösterir. */
export function resolveImageUrl(url: string | null | undefined, fallback: string = ""): string {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return fallback;
  return trimmed;
}

/** Kart ve listeler için küçük kopya adresi. Prototipte küçük kopya yok; orijinal döner. */
export function thumbnailUrl(url: string | null | undefined): string {
  return resolveImageUrl(url);
}

/** Avatar adresi; yoksa boş döner (`Avatar` baş harf gösterir). */
export function resolveAvatarUrl(url?: string | null, _name?: string | null): string {
  return resolveImageUrl(url, "");
}
