import type { CockpitStats } from "@/types";

/**
 * BAŞKAN KOKPİTİ — tamamı ÖRNEKTİR (demo). Gerçek üye, satış ya da gelir verisi değildir.
 * Amaç: yönetim sunumunda kokpitin nasıl görüneceğini göstermek. Rakamlar Ar-Ge belgesi Bölüm 2'deki
 * hedeflerle uyumlu seçildi (ör. tuğla fiyatları 250 / 500 / 1.000 / 5.000 TL); "hedef"tir, "gerçekleşen" değil.
 * Mağaza ürün adları ve fiyatları kulübün sitesindeki mağazadan alındı (petrolspor.com/magaza).
 */
export const COCKPIT: CockpitStats = {
  active_fans: 18420,
  new_fans_this_week: 612,
  plus_members: 1340,
  bricks_sold: 846,
  brick_revenue: 428500,
  store_revenue: 1262000,
  city_distribution: [
    { city: "Batman", fans: 9870 },
    { city: "İstanbul", fans: 3120 },
    { city: "İzmir", fans: 1180 },
    { city: "Mersin", fans: 940 },
    { city: "Bursa", fans: 760 },
    { city: "Diyarbakır", fans: 690 },
    { city: "Almanya", fans: 1020 },
    { city: "Diğer", fans: 840 },
  ],
  top_products: [
    { name: "2026-2027 Kırmızı Forma", sold: 148, revenue: 518000 },
    { name: "2026-2027 Parçalı Forma", sold: 121, revenue: 423500 },
    { name: "2026-2027 Siyah Forma", sold: 64, revenue: 192000 },
    { name: "Parçalı Taraftar Forma", sold: 57, revenue: 85500 },
    { name: "Micro 1960 Baskılı Tişört", sold: 29, revenue: 43500 },
  ],
  weekly_active: [
    { label: "9. hf", value: 8200 },
    { label: "10. hf", value: 9400 },
    { label: "11. hf", value: 11800 },
    { label: "12. hf", value: 13100 },
    { label: "13. hf", value: 12600 },
    { label: "14. hf", value: 14900 },
  ],
};

/** Tek tuşla bildirim için hazır şablonlar */
export const PUSH_TEMPLATES = [
  { id: "transfer", title: "Transfer", text: "Yeni transferimiz imzayı attı! Ayrıntılar uygulamada." },
  { id: "matchday", title: "Maç günü", text: "Bugün maç günü! 13:30'da Batman Şehir Stadyumu'nda buluşuyoruz." },
  { id: "ticket", title: "Bilet", text: "Muğlaspor maçı biletleri satışa çıktı." },
  { id: "store", title: "Mağaza", text: "Yeni sezon formaları mağazada. Taraftar kartına özel indirim." },
] as const;
