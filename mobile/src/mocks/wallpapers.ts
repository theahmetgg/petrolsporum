import type { Wallpaper } from "@/types";

/**
 * Duvar kağıtları (1080 x 1920). Afiş ve minimalist olanlar kulübün arması ve logosundan üretildi;
 * fotoğraflı olanlar kulüp sitesindeki maç ve tarihçe fotoğraflarından kırpıldı.
 * İndirme sayıları örnektir (demo).
 */
export const WALLPAPERS: Wallpaper[] = [
  { id: "wp1", title: "Maç Günü: Muğlaspor", category: "Maç Günü", image: "wp-matchday-muglaspor", download_count: 1284 },
  { id: "wp2", title: "Gol Sevinci", category: "Maç Fotoğrafı", image: "wp-photo-goal", download_count: 2310 },
  { id: "wp3", title: "Kırmızı Arma", category: "Minimalist", image: "wp-minimal-crest", download_count: 3172 },
  { id: "wp4", title: "1960", category: "Minimalist", image: "wp-minimal-1960", download_count: 1905 },
  { id: "wp5", title: "Şehir Stadı", category: "Maç Fotoğrafı", image: "wp-photo-team-red", download_count: 1466 },
  { id: "wp6", title: "Çubuklu", category: "Minimalist", image: "wp-minimal-stripes", download_count: 988 },
  { id: "wp7", title: "Siyah Forma", category: "Maç Fotoğrafı", image: "wp-photo-team-black", download_count: 1127 },
  { id: "wp8", title: "Efsane Kadro 1976", category: "Nostalji", image: "wp-nostalgia-1976", download_count: 764 },
  { id: "wp9", title: "Siyah Gece", category: "Minimalist", image: "wp-minimal-black", download_count: 1533 },
  { id: "wp10", title: "Efsane Kadro 1991-92", category: "Nostalji", image: "wp-nostalgia-1991", download_count: 692 },
];

export const WALLPAPER_CATEGORIES = ["Tümü", "Maç Günü", "Minimalist", "Maç Fotoğrafı", "Nostalji"] as const;
