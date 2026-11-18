// BU DOSYA KOPYADIR — elle düzenlemeyin. Kaynak: mobile/src/mocks/store.data.ts (npm run sync)
// BU DOSYA ÜRETİLMİŞTİR. Kaynak: petrolspor.com/magaza (19 Kasım 2026), sitedeki 56 ürünün tamamı, sitedeki sırayla
// (en yeni üstte). Ürün adları, fiyatlar ve seçenekler siteden alındı; "Tshirt" → "Tişört" gibi yazım düzeltmeleri yapıldı.
import type { Product } from "@/types";

export const PRODUCT_DATA: Product[] = [
  {
    "id": "p1",
    "name": "2026-2027 Parçalı Forma",
    "category": "Forma",
    "price": 3500,
    "option_label": "Beden",
    "options": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p1",
    "is_new": true,
    "source_url": "https://petrolspor.com/urun/2026-2027-batman-petrolspor-parcali-forma/"
  },
  {
    "id": "p2",
    "name": "2026-2027 Siyah Forma",
    "category": "Forma",
    "price": 3000,
    "option_label": "Beden",
    "options": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p2",
    "is_new": true,
    "source_url": "https://petrolspor.com/urun/2026-2027-batman-petrolspor-siyah-forma/"
  },
  {
    "id": "p3",
    "name": "2026-2027 Kırmızı Forma",
    "category": "Forma",
    "price": 3500,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p3",
    "is_new": true,
    "source_url": "https://petrolspor.com/urun/2026-2027-batman-petrolspor-kirmizi-forma/"
  },
  {
    "id": "p4",
    "name": "2026-2027 Gold Forma",
    "category": "Forma",
    "price": 3000,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p4",
    "is_new": true,
    "source_url": "https://petrolspor.com/urun/2026-2027-batman-petrolspor-gold-forma/"
  },
  {
    "id": "p5",
    "name": "2026-2027 Beyaz Forma",
    "category": "Forma",
    "price": 3500,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p5",
    "is_new": true,
    "source_url": "https://petrolspor.com/urun/2026-2027-batman-petrolspor-beyaz-forma/"
  },
  {
    "id": "p6",
    "name": "Parçalı Taraftar Forma",
    "category": "Forma",
    "price": 1500,
    "old_price": 1799,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "note": "Taraftar formaları standart kalıplara göre dar kesimdir; her zamanki bedeninden bir beden büyük almanı öneririz.",
    "image": "p6",
    "source_url": "https://petrolspor.com/urun/parcali-taraftar-forma/"
  },
  {
    "id": "p7",
    "name": "Çocuk Parçalı Forma",
    "category": "Çocuk",
    "price": 1400,
    "option_label": "Yaş",
    "options": [
      "3-4 Yaş",
      "5-6 Yaş",
      "7-8 Yaş",
      "9-10 Yaş",
      "11-12 Yaş",
      "13-14 Yaş"
    ],
    "image": "p7",
    "source_url": "https://petrolspor.com/urun/cocuk-parcali-forma/"
  },
  {
    "id": "p8",
    "name": "Çocuk Kırmızı Sarı Şampiyon Tişört",
    "category": "Çocuk",
    "price": 1100,
    "option_label": "Yaş",
    "options": [
      "3-4 Yaş",
      "5-6 Yaş",
      "7-8 Yaş",
      "9-10 Yaş",
      "11-12 Yaş",
      "13-14 Yaş"
    ],
    "image": "p8",
    "source_url": "https://petrolspor.com/urun/cocuk-kirmizi-sari-sampiyon-tshirt/"
  },
  {
    "id": "p9",
    "name": "Çocuk Beyaz Şampiyon Tişört",
    "category": "Çocuk",
    "price": 1100,
    "option_label": "Yaş",
    "options": [
      "3-4 Yaş",
      "5-6 Yaş",
      "7-8 Yaş",
      "9-10 Yaş",
      "11-12 Yaş",
      "13-14 Yaş"
    ],
    "image": "p9",
    "source_url": "https://petrolspor.com/urun/cocuk-beyaz-sampiyon-tshirt/"
  },
  {
    "id": "p10",
    "name": "Çocuk Beyaz Kırmızı 1960 Tişört",
    "category": "Çocuk",
    "price": 1100,
    "option_label": "Yaş",
    "options": [
      "3-4 Yaş",
      "5-6 Yaş",
      "7-8 Yaş",
      "9-10 Yaş",
      "11-12 Yaş",
      "13-14 Yaş"
    ],
    "image": "p10",
    "source_url": "https://petrolspor.com/urun/cocuk-beyaz-kirmizi-1960-tshirt/"
  },
  {
    "id": "p11",
    "name": "Micro Çizgili Tişört",
    "category": "Giyim",
    "price": 1500,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p11",
    "source_url": "https://petrolspor.com/urun/micro-cizgili-tshirt/"
  },
  {
    "id": "p12",
    "name": "Micro 1960 Baskılı Tişört",
    "category": "Giyim",
    "price": 1500,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p12",
    "source_url": "https://petrolspor.com/urun/micro-1960-baskili-tshirt/"
  },
  {
    "id": "p13",
    "name": "Retro Micro Üç Logolu Tişört",
    "category": "Giyim",
    "price": 1500,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p13",
    "source_url": "https://petrolspor.com/urun/retro-micro-uc-logolu-tshirt/"
  },
  {
    "id": "p14",
    "name": "Polo Yaka Siyah Baskılı Tişört",
    "category": "Giyim",
    "price": 1600,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p14",
    "source_url": "https://petrolspor.com/urun/polo-yaka-siyah-baskili-tshirt/"
  },
  {
    "id": "p15",
    "name": "Polo Yaka Parçalı Üç Renk Tişört",
    "category": "Giyim",
    "price": 1600,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p15",
    "source_url": "https://petrolspor.com/urun/polo-yaka-parcali-uc-renk-tshirt/"
  },
  {
    "id": "p16",
    "name": "Polo Yaka Lacivert Tişört",
    "category": "Giyim",
    "price": 1600,
    "options": [],
    "image": "p16",
    "source_url": "https://petrolspor.com/urun/polo-yaka-larcivert-tshirt/"
  },
  {
    "id": "p17",
    "name": "Polo Yaka Gri Tişört",
    "category": "Giyim",
    "price": 1600,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p17",
    "source_url": "https://petrolspor.com/urun/polo-yaka-gri-tshirt/"
  },
  {
    "id": "p18",
    "name": "Polo Yaka Kırmızı Tişört",
    "category": "Giyim",
    "price": 1600,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p18",
    "source_url": "https://petrolspor.com/urun/polo-yaka-kirmizi-tshirt/"
  },
  {
    "id": "p19",
    "name": "Polo Yaka Beyaz Tişört",
    "category": "Giyim",
    "price": 1600,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p19",
    "source_url": "https://petrolspor.com/urun/polo-yaka-beyaz-tshirt/"
  },
  {
    "id": "p20",
    "name": "Beyaz Şapka",
    "category": "Aksesuar",
    "price": 350,
    "options": [],
    "image": "p20",
    "source_url": "https://petrolspor.com/urun/beyaz-sapka/"
  },
  {
    "id": "p21",
    "name": "Siyah Kupa Baskılı Tişört",
    "category": "Giyim",
    "price": 1300,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p21",
    "source_url": "https://petrolspor.com/urun/siyah-kupa-baskili-tshirt/"
  },
  {
    "id": "p22",
    "name": "Siyah Kırmızı Baskılı Tişört",
    "category": "Giyim",
    "price": 1300,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p22",
    "source_url": "https://petrolspor.com/urun/siyah-kirmizi-baskili-tshirt/"
  },
  {
    "id": "p23",
    "name": "Siyah Kırmızı Petrolspor Tişört",
    "category": "Giyim",
    "price": 1300,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p23",
    "source_url": "https://petrolspor.com/urun/siyah-kirmizi-petrolspor-tshirt/"
  },
  {
    "id": "p24",
    "name": "Siyah Beyaz 1960 Tişört",
    "category": "Giyim",
    "price": 1300,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p24",
    "source_url": "https://petrolspor.com/urun/siyah-beyaz-1960-tshirt/"
  },
  {
    "id": "p25",
    "name": "Beyaz Şampiyon Tişört",
    "category": "Giyim",
    "price": 1300,
    "options": [],
    "image": "p25",
    "source_url": "https://petrolspor.com/urun/beyaz-sampiyon-tshirt/"
  },
  {
    "id": "p26",
    "name": "Beyaz Kırmızı 1960 Tişört",
    "category": "Giyim",
    "price": 1300,
    "options": [],
    "image": "p26",
    "source_url": "https://petrolspor.com/urun/beyaz-kirmizi-1960-tshirt/"
  },
  {
    "id": "p27",
    "name": "Kırmızı 1960 Baskılı Tişört",
    "category": "Giyim",
    "price": 1300,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p27",
    "source_url": "https://petrolspor.com/urun/kirmizi-1960-baskili-tshirt/"
  },
  {
    "id": "p28",
    "name": "Gri Siyah 1960 Tişört",
    "category": "Giyim",
    "price": 1300,
    "options": [],
    "image": "p28",
    "source_url": "https://petrolspor.com/urun/gri-siyah-1960-tshirt/"
  },
  {
    "id": "p29",
    "name": "Kırmızı Siyah Yaka Tişört",
    "category": "Giyim",
    "price": 1300,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p29",
    "source_url": "https://petrolspor.com/urun/kirmizi-siyah-yaka-tshirt/"
  },
  {
    "id": "p30",
    "name": "Kırmızı Sarı Şampiyon Baskılı Tişört",
    "category": "Giyim",
    "price": 1300,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p30",
    "source_url": "https://petrolspor.com/urun/kirmizi-sari-sampiyon-baskili-tshirt/"
  },
  {
    "id": "p31",
    "name": "Asma Bayrak",
    "category": "Aksesuar",
    "price": 420,
    "price_max": 1250,
    "option_label": "Ölçü (cm)",
    "options": [
      "100 × 150",
      "150 × 225",
      "200 × 300"
    ],
    "note": "Tek kat raşel kumaşa baskılı; üst fitil kısmı dar dokuma, plastik kopçalı.",
    "image": "p31",
    "source_url": "https://petrolspor.com/urun/asma-bayrak/"
  },
  {
    "id": "p32",
    "name": "Elde Sallama Bayrak",
    "category": "Aksesuar",
    "price": 150,
    "price_max": 700,
    "option_label": "Ölçü (cm)",
    "options": [
      "50 × 75",
      "60 × 90",
      "70 × 105",
      "100 × 150",
      "120 × 180"
    ],
    "note": "Tek kat raşel kumaşa baskılı; 70 cm plastik çubuklu.",
    "image": "p32",
    "source_url": "https://petrolspor.com/urun/elde-sallama-bayrak/"
  },
  {
    "id": "p33",
    "name": "Çubuklu Şal Atkı",
    "category": "Aksesuar",
    "price": 200,
    "old_price": 300,
    "options": [],
    "note": "Kutu görsel amaçlıdır.",
    "image": "p33",
    "source_url": "https://petrolspor.com/urun/cubuklu-sal-atki/"
  },
  {
    "id": "p34",
    "name": "1960 Yan Beyaz Baskılı Tişört",
    "category": "Giyim",
    "price": 1000,
    "old_price": 1299,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p34",
    "source_url": "https://petrolspor.com/urun/1960-yan-beyaz-baskili-tshirt/"
  },
  {
    "id": "p35",
    "name": "Kırmızı Beyaz Baskılı Tişört",
    "category": "Giyim",
    "price": 1000,
    "old_price": 1299,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p35",
    "source_url": "https://petrolspor.com/urun/kirmizi-beyaz-baskili-tshirt/"
  },
  {
    "id": "p36",
    "name": "1960 Beyaz Baskılı Tişört",
    "category": "Giyim",
    "price": 1000,
    "old_price": 1299,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p36",
    "source_url": "https://petrolspor.com/urun/1960-beyaz-baskili-tshirt/"
  },
  {
    "id": "p37",
    "name": "Adidas 1960 Polo Tişört",
    "category": "Giyim",
    "price": 2199,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p37",
    "source_url": "https://petrolspor.com/urun/adidas-1960-polo-tshirt/"
  },
  {
    "id": "p38",
    "name": "Adidas Petrolspor Beyaz Tişört",
    "category": "Giyim",
    "price": 1500,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p38",
    "source_url": "https://petrolspor.com/urun/adidas-petrolspor-beyaz-tshirt/"
  },
  {
    "id": "p39",
    "name": "Adidas Petrolspor Siyah Tişört",
    "category": "Giyim",
    "price": 1800,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p39",
    "source_url": "https://petrolspor.com/urun/adidas-petrolspor-siyah-tshirt/"
  },
  {
    "id": "p40",
    "name": "Adidas Petrolspor Tişört",
    "category": "Giyim",
    "price": 1550,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p40",
    "source_url": "https://petrolspor.com/urun/adidas-petrolspor-tshirt/"
  },
  {
    "id": "p41",
    "name": "Adidas Batman Petrolspor Tişört",
    "category": "Giyim",
    "price": 1800,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p41",
    "source_url": "https://petrolspor.com/urun/adidas-batman-petrolspor-tshirt/"
  },
  {
    "id": "p42",
    "name": "Adidas 1960 Petrolspor Tişört",
    "category": "Giyim",
    "price": 1550,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p42",
    "source_url": "https://petrolspor.com/urun/adidas-1960-petrolspor-tshirt/"
  },
  {
    "id": "p43",
    "name": "Çubuklu 1960 Taraftar Forma",
    "category": "Forma",
    "price": 1000,
    "old_price": 1299,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "note": "Taraftar formaları standart kalıplara göre dar kesimdir; her zamanki bedeninden bir beden büyük almanı öneririz.",
    "image": "p43",
    "source_url": "https://petrolspor.com/urun/cubuklu-1960-taraftar-forma/"
  },
  {
    "id": "p44",
    "name": "Beyaz 1960 Taraftar Forma",
    "category": "Forma",
    "price": 1000,
    "old_price": 1299,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "note": "Taraftar formaları standart kalıplara göre dar kesimdir; her zamanki bedeninden bir beden büyük almanı öneririz.",
    "image": "p44",
    "source_url": "https://petrolspor.com/urun/beyaz-1960-taraftar-forma/"
  },
  {
    "id": "p45",
    "name": "Kırmızı 1960 Taraftar Forma",
    "category": "Forma",
    "price": 1000,
    "old_price": 1299,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "note": "Taraftar formaları standart kalıplara göre dar kesimdir; her zamanki bedeninden bir beden büyük almanı öneririz.",
    "image": "p45",
    "source_url": "https://petrolspor.com/urun/kirmizi-1960-taraftar-forma/"
  },
  {
    "id": "p46",
    "name": "Siyah 1960 Taraftar Forma",
    "category": "Forma",
    "price": 1000,
    "old_price": 1299,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "note": "Taraftar formaları standart kalıplara göre dar kesimdir; her zamanki bedeninden bir beden büyük almanı öneririz.",
    "image": "p46",
    "source_url": "https://petrolspor.com/urun/siyah-1960-taraftar-forma/"
  },
  {
    "id": "p47",
    "name": "Batman Petrol Spor Siyah Forma",
    "category": "Forma",
    "price": 1850,
    "old_price": 2999,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p47",
    "source_url": "https://petrolspor.com/urun/batman-petrol-spor-siyah-forma/"
  },
  {
    "id": "p48",
    "name": "Batman Petrolspor Beyaz Forma",
    "category": "Forma",
    "price": 1850,
    "old_price": 2499,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p48",
    "source_url": "https://petrolspor.com/urun/batman-petrolspor-beyaz-forma/"
  },
  {
    "id": "p49",
    "name": "Batman Petrolspor Kırmızı Forma",
    "category": "Forma",
    "price": 1850,
    "old_price": 2499,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p49",
    "source_url": "https://petrolspor.com/urun/batman-petrolspor-kirmizi-forma/"
  },
  {
    "id": "p50",
    "name": "Adidas Lacivert Eşofman Üstü",
    "category": "Giyim",
    "price": 3999,
    "option_label": "Beden",
    "options": [
      "M"
    ],
    "image": "p50",
    "source_url": "https://petrolspor.com/urun/adidas-lacivert-erkek-esofman-ustu-hirka/"
  },
  {
    "id": "p51",
    "name": "Gri 1960 Baskılı Tişört",
    "category": "Giyim",
    "price": 1000,
    "old_price": 1299,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p51",
    "source_url": "https://petrolspor.com/urun/gri-1960-baskili-tshirt/"
  },
  {
    "id": "p52",
    "name": "Sarı 1960 Baskılı Tişört",
    "category": "Giyim",
    "price": 1000,
    "old_price": 1299,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p52",
    "source_url": "https://petrolspor.com/urun/sari-1960-baskili-tshirt/"
  },
  {
    "id": "p53",
    "name": "Kapüşonlu Beyaz Sweatshirt",
    "category": "Giyim",
    "price": 1799.9,
    "old_price": 2499,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p53",
    "source_url": "https://petrolspor.com/urun/sweatshirt-kapsonlu-beyaz/"
  },
  {
    "id": "p54",
    "name": "Kapüşonlu Kırmızı Sweatshirt",
    "category": "Giyim",
    "price": 1799.9,
    "old_price": 2499,
    "option_label": "Beden",
    "options": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "image": "p54",
    "source_url": "https://petrolspor.com/urun/sweatshirt-kapsonlu-kirmizi/"
  },
  {
    "id": "p55",
    "name": "Adidas Kırmızı Eşofman Üstü",
    "category": "Giyim",
    "price": 3999,
    "option_label": "Beden",
    "options": [
      "M"
    ],
    "image": "p55",
    "source_url": "https://petrolspor.com/urun/adidas-kirmizi-erkek-esofman-ustu-hirka/"
  },
  {
    "id": "p56",
    "name": "Adidas Sırt Çantası",
    "category": "Aksesuar",
    "price": 1960,
    "options": [],
    "image": "p56",
    "source_url": "https://petrolspor.com/urun/adidas-sirt-cantasi/"
  }
];
