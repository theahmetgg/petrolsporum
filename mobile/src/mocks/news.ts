import type { NewsItem } from "@/types";

/**
 * Kulüp haberleri (kaynak: petrolspor.com/haberler, 18 Kasım 2026). Başlık, tarih ve özet siteden alındı;
 * özetler sitedeki giriş cümlesidir. Görseller haberin sitedeki fotoğrafıdır.
 */
export const NEWS: NewsItem[] = [
  {
    id: "mardin-1969-spor-1-1-petrolspor",
    title: "Mardin 1969 Spor 1 – 1 Petrolspor",
    summary:
      "Trendyol 1. Lig'in 14. haftasında Batman Petrolspor, deplasmanda Mardin 1969 Spor ile karşılaştı. 21 Kasım Şehir Stadyumu'nda oynanan karşılaşma 1-1 eşitlikle tamamlandı. Kırmızı-Beyazlılar, 1-0 geriye düştüğü maçta Biron'un golüyle 1 puanı aldı.",
    published_at: "2026-11-10",
    category: "Maç Sonucu",
    image: "news-mardin",
    source_url: "https://petrolspor.com/mardin-1969-spor-1-1-petrolspor/",
  },
  {
    id: "petrolspor-1-2-manisa-fk",
    title: "Manisa FK 2 – 1 Petrolspor",
    summary:
      "Trendyol 1. Lig'in 13. haftasında Batman Petrolspor, deplasmanda Manisa Futbol Kulübü ile karşılaştı. Manisa 19 Mayıs Stadyumu'nda oynanan karşılaşmayı ev sahibi ekip 2-1 kazandı.",
    published_at: "2026-11-02",
    category: "Maç Sonucu",
    image: "news-manisa",
    source_url: "https://petrolspor.com/petrolspor-1-2-manisa-fk/",
  },
  {
    id: "petrolspor-3-2-esenler-erokspor",
    title: "Petrolspor 3 – 2 Esenler Erokspor",
    summary:
      "Trendyol 1. Lig'in 12. haftasında Batman Petrolspor, sahasında Esenler Erokspor'u konuk etti. Batman Şehir Stadyumu'nda oynanan ve beş gole sahne olan karşılaşma, ev sahibi ekibin 3-2'lik galibiyetiyle sona erdi.",
    published_at: "2026-10-26",
    category: "Maç Sonucu",
    image: "news-karagumruk",
    source_url: "https://petrolspor.com/petrolspor-3-2-esenler-erokspor/",
  },
  {
    id: "kayserispor-2-2-petrolspor",
    title: "Kayserispor 2 – 2 Petrolspor",
    summary:
      "Trendyol 1. Lig'in 11. haftasında Batman Petrolspor, deplasmanda lig lideri Kayserispor'a konuk oldu. Kadir Has Stadyumu'nda oynanan ve nefesleri kesen 90 dakika 2-2 sona erdi.",
    published_at: "2026-10-19",
    category: "Maç Sonucu",
    image: "news-kayseri",
    source_url: "https://petrolspor.com/kayserispor-2-2-petrolspor/",
  },
  {
    id: "batman-petrolspor-1-2-bursaspor",
    title: "Batman Petrolspor 1 – 2 Bursaspor",
    summary:
      "Trendyol 1. Lig'in 8. haftasında Batman Petrolspor, sahasında Bursaspor'u konuk etti. Müthiş karşılaşma, ev sahibi ekibimizin üstün futboluna rağmen konuk takımın 2-1'lik üstünlüğüyle sona erdi.",
    published_at: "2026-09-21",
    category: "Maç Sonucu",
    image: "news-bursa",
    source_url: "https://petrolspor.com/batman-petrolspor-1-2-bursaspor/",
  },
  {
    id: "batman-petrolspor-4-3-fatih-karagumruk",
    title: "Batman Petrolspor 4 – 3 Fatih Karagümrük",
    summary:
      "Trendyol 1. Lig'in 6. haftasında Batman Petrolspor, sahasında Fatih Karagümrük'ü konuk etti. Taraftarının büyük desteğiyle sahaya çıkan kırmızı-beyazlı temsilcimiz, tam 7 golün atıldığı mücadeleden 4-3'lük zaferle ayrıldı.",
    published_at: "2026-09-10",
    category: "Maç Sonucu",
    image: "news-karagumruk",
    source_url: "https://petrolspor.com/batman-petrolspor-4-3-fatih-karagumruk/",
  },
  {
    id: "sariyer-1-2-batman-petrol-spor-a-s",
    title: "Sarıyer 1 – 2 Batman Petrolspor",
    summary:
      "Batman Petrolspor, deplasmanda Sarıyer'e konuk oldu. Zorlu deplasmanda sahaya çıkan kırmızı-beyazlı temsilcimiz, sergilediği disiplinli futbolla mücadeleden 2-1'lik galibiyetle ayrılarak Batman'a 3 puanla döndü.",
    published_at: "2026-08-25",
    category: "A Takımı",
    image: "news-sariyer",
    source_url: "https://petrolspor.com/sariyer-1-2-batman-petrol-spor-a-s/",
  },
  {
    id: "tff-1-lig-debutu",
    title: "1. Lig'e İstanbul'dan Değerli Bir Puanla Başladık",
    summary:
      "TFF 1. Lig'e merhaba diyen Batman Petrolspor, sezonun açılış haftasında zorlu Pendik deplasmanına konuk oldu. Kırmızı-Beyazlı ekibimiz sahadan 2-2'lik beraberlikle ayrıldı.",
    published_at: "2026-08-18",
    category: "A Takımı",
    image: "news-pendik",
    source_url: "https://petrolspor.com/batman-petrolspor-tff-1-lig-debutunda-istanbuldan-degerli-bir-puanla-donuyor/",
  },
];
