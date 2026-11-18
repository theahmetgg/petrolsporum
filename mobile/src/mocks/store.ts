import type { Product, ProductCategory } from "@/types";

/**
 * MAĞAZA ÜRÜNLERİ (kaynak: petrolspor.com/magaza, 19 Kasım 2026). Ürün adları, fiyatlar, bedenler ve fotoğraflar
 * kulübün kendi mağazasından alındı; sitedeki 56 üründen 24'ü seçildi (her kategoriden).
 * İndirimli ürünlerde `old_price` sitedeki üstü çizili fiyattır. Ölçüye göre fiyatı değişen ürünlerde (bayraklar)
 * `price` en düşük, `price_max` en yüksek fiyattır.
 */

/**
 * Sipariş henüz alınmıyor (karar, 19 Kasım 2026): mağaza vitrin olarak yayındadır; sepet ve ödeme yoktur.
 * Ürün sayfasında "Sipariş yakında" yazar ve "Açılınca haber ver" seçilebilir. Sipariş açılınca bu değer true olur
 * ve sepet / ödeme akışı eklenir (ödeme altyapısı Ar-Ge belgesi Faz 3).
 */
export const STORE_ORDERING_OPEN = false;

export const PRODUCT_CATEGORIES: ("Tümü" | ProductCategory)[] = ["Tümü", "Forma", "Çocuk", "Giyim", "Aksesuar"];

const ADULT = ["S", "M", "L", "XL", "XXL"];
const ADULT_XS = ["XS", ...ADULT];
const KIDS = ["3-4 Yaş", "5-6 Yaş", "7-8 Yaş", "9-10 Yaş", "11-12 Yaş", "13-14 Yaş"];
const FAN_KIT_NOTE = "Taraftar formaları standart kalıplara göre dar kesimdir; her zamanki bedeninden bir beden büyük almanı öneririz.";

const url = (slug: string) => `https://petrolspor.com/urun/${slug}/`;

export const PRODUCTS: Product[] = [
  // ── 2026-27 sezon formaları ──
  { id: "p1", name: "2026-2027 Parçalı Forma", category: "Forma", price: 3500, option_label: "Beden", options: ADULT_XS, image: "p1", is_new: true, source_url: url("2026-2027-batman-petrolspor-parcali-forma") },
  { id: "p2", name: "2026-2027 Kırmızı Forma", category: "Forma", price: 3500, option_label: "Beden", options: ADULT, image: "p2", is_new: true, source_url: url("2026-2027-batman-petrolspor-kirmizi-forma") },
  { id: "p3", name: "2026-2027 Beyaz Forma", category: "Forma", price: 3500, option_label: "Beden", options: ADULT, image: "p3", is_new: true, source_url: url("2026-2027-batman-petrolspor-beyaz-forma") },
  { id: "p4", name: "2026-2027 Siyah Forma", category: "Forma", price: 3000, option_label: "Beden", options: ADULT_XS, image: "p4", is_new: true, source_url: url("2026-2027-batman-petrolspor-siyah-forma") },
  { id: "p5", name: "2026-2027 Gold Forma", category: "Forma", price: 3000, option_label: "Beden", options: ADULT, image: "p5", is_new: true, source_url: url("2026-2027-batman-petrolspor-gold-forma") },
  // ── Taraftar formaları ve geçen sezon ──
  { id: "p6", name: "Parçalı Taraftar Forma", category: "Forma", price: 1500, old_price: 1799, option_label: "Beden", options: ADULT, note: FAN_KIT_NOTE, image: "p6", source_url: url("parcali-taraftar-forma") },
  { id: "p7", name: "Çubuklu 1960 Taraftar Forma", category: "Forma", price: 1000, old_price: 1299, option_label: "Beden", options: ADULT, note: FAN_KIT_NOTE, image: "p7", source_url: url("cubuklu-1960-taraftar-forma") },
  { id: "p8", name: "Batman Petrolspor Kırmızı Forma", category: "Forma", price: 1850, old_price: 2499, option_label: "Beden", options: ADULT, image: "p8", source_url: url("batman-petrolspor-kirmizi-forma") },
  // ── Çocuk ──
  { id: "p9", name: "Çocuk Parçalı Forma", category: "Çocuk", price: 1400, option_label: "Yaş", options: KIDS, image: "p9", source_url: url("cocuk-parcali-forma") },
  { id: "p10", name: "Çocuk Kırmızı Sarı Şampiyon Tişört", category: "Çocuk", price: 1100, option_label: "Yaş", options: KIDS, image: "p10", source_url: url("cocuk-kirmizi-sari-sampiyon-tshirt") },
  { id: "p11", name: "Çocuk Beyaz Şampiyon Tişört", category: "Çocuk", price: 1100, option_label: "Yaş", options: KIDS, image: "p11", source_url: url("cocuk-beyaz-sampiyon-tshirt") },
  { id: "p12", name: "Çocuk Beyaz Kırmızı 1960 Tişört", category: "Çocuk", price: 1100, option_label: "Yaş", options: KIDS, image: "p12", source_url: url("cocuk-beyaz-kirmizi-1960-tshirt") },
  // ── Giyim ──
  { id: "p13", name: "Micro Çizgili Tişört", category: "Giyim", price: 1500, option_label: "Beden", options: ADULT, image: "p13", source_url: url("micro-cizgili-tshirt") },
  { id: "p14", name: "Polo Yaka Kırmızı Tişört", category: "Giyim", price: 1600, option_label: "Beden", options: ADULT, image: "p14", source_url: url("polo-yaka-kirmizi-tshirt") },
  { id: "p15", name: "Polo Yaka Siyah Baskılı Tişört", category: "Giyim", price: 1600, option_label: "Beden", options: ADULT, image: "p15", source_url: url("polo-yaka-siyah-baskili-tshirt") },
  { id: "p16", name: "Siyah Kırmızı Petrolspor Tişört", category: "Giyim", price: 1300, option_label: "Beden", options: ADULT, image: "p16", source_url: url("siyah-kirmizi-petrolspor-tshirt") },
  { id: "p17", name: "Adidas 1960 Polo Tişört", category: "Giyim", price: 2199, option_label: "Beden", options: ADULT, image: "p17", source_url: url("adidas-1960-polo-tshirt") },
  { id: "p18", name: "Kapüşonlu Kırmızı Sweatshirt", category: "Giyim", price: 1799.9, old_price: 2499, options: [], image: "p18", source_url: url("sweatshirt-kapsonlu-kirmizi") },
  { id: "p19", name: "Adidas Kırmızı Eşofman Üstü", category: "Giyim", price: 3999, options: [], image: "p19", source_url: url("adidas-kirmizi-erkek-esofman-ustu-hirka") },
  // ── Aksesuar ──
  { id: "p20", name: "Beyaz Şapka", category: "Aksesuar", price: 350, options: [], image: "p20", source_url: url("beyaz-sapka") },
  {
    id: "p21",
    name: "Asma Bayrak",
    category: "Aksesuar",
    price: 420,
    price_max: 1250,
    option_label: "Ölçü (cm)",
    options: ["100 × 150", "150 × 225", "200 × 300"],
    note: "Tek kat raşel kumaşa baskılı; üst fitil kısmı dar dokuma, plastik kopçalı.",
    image: "p21",
    source_url: url("asma-bayrak"),
  },
  {
    id: "p22",
    name: "Elde Sallama Bayrak",
    category: "Aksesuar",
    price: 150,
    price_max: 700,
    option_label: "Ölçü (cm)",
    options: ["50 × 75", "60 × 90", "70 × 105", "100 × 150", "120 × 180"],
    note: "Tek kat raşel kumaşa baskılı; 70 cm plastik çubuklu.",
    image: "p22",
    source_url: url("elde-sallama-bayrak"),
  },
  { id: "p23", name: "Çubuklu Şal Atkı", category: "Aksesuar", price: 200, old_price: 300, options: [], image: "p23", source_url: url("cubuklu-sal-atki") },
  { id: "p24", name: "Adidas Sırt Çantası", category: "Aksesuar", price: 1960, options: [], image: "p24", source_url: url("adidas-sirt-cantasi") },
];

/** Vitrinde öne çıkan ürün: yeni sezon parçalı forması */
export const FEATURED_PRODUCT_ID = "p1";
