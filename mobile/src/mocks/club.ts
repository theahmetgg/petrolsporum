/**
 * Kulüp bilgileri (kaynak: petrolspor.com "Hakkımızda", "Tarihçemiz", "Yönetim Kadrosu", "İletişim"; 18 Kasım 2026).
 */
export const CLUB = {
  name: "Batman Petrolspor",
  legal_name: "Batman Petrolspor A.Ş.",
  founded: 1960,
  colors: "Kırmızı - Beyaz",
  stadium: "Batman Şehir Stadyumu",
  address: "Site Mah. Barış Manço Sk. No:32, Merkez / Batman",
  website: "https://petrolspor.com",
  store_url: "https://petrolspor.com/magaza/",
  president: "Av. Mehmet Hakan Toy",
  board: [
    { name: "Av. Mehmet Hakan Toy", role: "Kulüp Başkanı" },
    { name: "Mert Nasıroğlu", role: "As Başkan" },
    { name: "Cemal Kaya", role: "Genel Sekreter" },
  ],
} as const;

/** Tarihçe (kaynak: "Hakkımızda" metni). Her madde sitedeki cümlelerden özetlendi. */
export const HISTORY: { year: string; title: string; text: string; image?: string }[] = [
  {
    year: "1960",
    title: "Kuruluş",
    text: "Kulüp Batman'da kuruldu. Futbolun yanında başka branşlarda da faaliyet gösterdi; güreşte Türkiye ve dünya şampiyonlukları kazandı.",
    image: "history-1969-1970",
  },
  {
    year: "1985-86",
    title: "Profesyonel lig",
    text: "Futbol takımı 3. Lig'de mücadele etmeye başladı.",
    image: "history-1981-1982",
  },
  {
    year: "1996-97",
    title: "Şampiyonluk",
    text: "3. Lig 1. Grup'ta şampiyon olarak 2. Lig'e yükseldi; 2. Lig'de play-off yarı finali oynadı.",
    image: "history-1991-1992",
  },
  {
    year: "2021-22",
    title: "Yeniden 2. Lig",
    text: "2014'te Batman Petrolspor A.Ş. adıyla şirketleşen kulüp, 2021-22 sezonunda şampiyon olarak 2. Lig'e yükseldi.",
  },
  {
    year: "2025-26",
    title: "1. Lig'e yükseliş",
    text: "2. Lig Beyaz Grup'u şampiyon tamamlayan takım Trendyol 1. Lig'e yükseldi.",
  },
  {
    year: "2026-27",
    title: "1. Lig'de ilk sezon",
    text: "Batman Petrolspor, Trendyol 1. Lig'de mücadele ediyor. 14. hafta sonunda 24 puanla 5. sırada.",
  },
];

/** Tarihçe fotoğrafları (kaynak: petrolspor.com/tarihimiz); sıra sitedeki gibidir. */
export const HISTORY_PHOTOS: { year: string; image: string }[] = [
  { year: "1969-70", image: "history-1969-1970" },
  { year: "1972-73", image: "history-1972-1973" },
  { year: "1974-75", image: "history-1974-1975" },
  { year: "1976", image: "history-1976" },
  { year: "1981-82", image: "history-1981-1982" },
  { year: "1991-92", image: "history-1991-1992" },
];
