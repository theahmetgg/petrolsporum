// BU DOSYA KOPYADIR — elle düzenlemeyin. Kaynak: mobile/src/utils/format.ts (npm run sync)
/**
 * Tarih, saat ve para biçimleri. Maç saatleri Türkiye saatiyle (+03:00) saklanır ve telefonun saat dilimi ne olursa
 * olsun Türkiye saatiyle gösterilir; bu yüzden gün ve saat ISO metninden okunur, `Date`'in yerel saatinden değil.
 */

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

/** "2026-11-22T13:30:00+03:00" → { y: 2026, m: 11, d: 22, hh: "13", mm: "30" } */
const parts = (iso: string) => ({
  y: Number(iso.slice(0, 4)),
  m: Number(iso.slice(5, 7)),
  d: Number(iso.slice(8, 10)),
  hh: iso.slice(11, 13) || "00",
  mm: iso.slice(14, 16) || "00",
});

const weekday = (y: number, m: number, d: number) => DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];

/** "22 Kasım" */
export const formatDayMonth = (iso: string) => {
  const { m, d } = parts(iso);
  return `${d} ${MONTHS[m - 1]}`;
};

/** "22 Kasım Pazar" */
export const formatMatchDay = (iso: string) => {
  const { y, m, d } = parts(iso);
  return `${d} ${MONTHS[m - 1]} ${weekday(y, m, d)}`;
};

/** "22 Kasım 2026" */
export const formatLongDate = (iso: string) => {
  const { y, m, d } = parts(iso);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

/** "13:30" */
export const formatTime = (iso: string) => {
  const { hh, mm } = parts(iso);
  return `${hh}:${mm}`;
};

/** "Kasım 2026" (fikstür ay başlığı) */
export const formatMonthYear = (iso: string) => {
  const { y, m } = parts(iso);
  return `${MONTHS[m - 1]} ${y}`;
};

/** Kısa gün etiketi: { day: "22", month: "KAS", weekday: "Paz" } */
export const dayBadge = (iso: string) => {
  const { y, m, d } = parts(iso);
  return { day: String(d), month: MONTHS[m - 1].slice(0, 3).toLocaleUpperCase("tr-TR"), weekday: weekday(y, m, d).slice(0, 3) };
};

/** Geçen süre: "az önce", "12 dk önce", "3 sa önce", "5 gün önce", sonra tarih */
export const timeAgo = (iso: string, now: number = Date.now()) => {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return "az önce";
  if (min < 60) return `${min} dk önce`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours} sa önce`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} gün önce`;
  return formatLongDate(iso);
};

/** Maça kalan süre parçaları; süre dolduysa `null` */
export const countdownParts = (iso: string, now: number = Date.now()) => {
  const diff = new Date(iso).getTime() - now;
  if (diff <= 0) return null;
  const totalSec = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  };
};

export const pad2 = (n: number) => String(n).padStart(2, "0");

/** 1284 → "1.284" */
export const formatNumber = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** 428500 → "428.500 TL" */
export const formatTL = (n: number) => `${formatNumber(n)} TL`;

/** 1262000 → "1,26 Mn TL", 428500 → "428,5 B TL" (kokpit kutuları) */
export const formatCompactTL = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace(".", ",")} Mn TL`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(".", ",").replace(",0", "")} B TL`;
  return formatTL(n);
};

/** Ürün fiyatı: 3500 → "3.500 TL", 1799.9 → "1.799,90 TL" (kuruş yalnız varsa yazılır) */
export const formatPrice = (n: number) => {
  const whole = Math.floor(n);
  const cents = Math.round((n - whole) * 100);
  return cents ? `${formatNumber(whole)},${pad2(cents)} TL` : `${formatNumber(whole)} TL`;
};

/** İndirim oranı (tam sayı yüzde): 1799 → 1500 için 17 */
export const discountPercent = (oldPrice: number, price: number) => Math.round(((oldPrice - price) / oldPrice) * 100);
