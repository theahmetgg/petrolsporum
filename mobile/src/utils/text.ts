/** Ad soyadı baş harfleri büyük gösterir (Türkçe kurallarıyla): "mehmet kaya" → "Mehmet Kaya" */
export function formatPersonName(name?: string | null): string {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toLocaleUpperCase("tr-TR") + w.slice(1).toLocaleLowerCase("tr-TR"))
    .join(" ");
}

/** E-postanın @ öncesinden görünen ad üretir: "ahmet.yilmaz@x.com" → "Ahmet Yilmaz" (sahte girişte ad sorulmadığı için) */
export function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const words = local.replace(/[._\-+0-9]+/g, " ").trim();
  return formatPersonName(words) || "Petrolspor Taraftarı";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isValidEmail = (email: string) => EMAIL_RE.test(email.trim());

/**
 * Adın sonuna Türkçe iyelik eki ekler (ünlü uyumuyla): "Ahmet" → "Ahmet'in", "Yusuf" → "Yusuf'un", "Ayşe" → "Ayşe'nin".
 * Ünlüsü olmayan ya da Türkçe olmayan adlarda "'in" kullanılır.
 */
export function genitive(name: string): string {
  const lower = name.toLocaleLowerCase("tr-TR");
  const vowels = lower.match(/[aeıioöuü]/g);
  const last = vowels ? vowels[vowels.length - 1] : "e";
  const suffix = "aı".includes(last) ? "ın" : "ei".includes(last) ? "in" : "ou".includes(last) ? "un" : "ün";
  const endsWithVowel = /[aeıioöuü]$/.test(lower);
  return `${name}'${endsWithVowel ? "n" : ""}${suffix}`;
}
