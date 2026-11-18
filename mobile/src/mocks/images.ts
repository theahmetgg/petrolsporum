/**
 * Uygulamaya gömülü görseller: anahtar → dosya. Veri dosyaları (haber, duvar kağıdı) görseli anahtarla anar;
 * sunucu geldiğinde anahtarın yerini tam adres alır, ekranlar değişmez.
 * Kaynak: petrolspor.com (arma, logo, maç ve tarihçe fotoğrafları; kulübe aittir). Duvar kağıtları bu görsellerden
 * üretildi. Mağazada yayın için kulübün yazılı izni gerekir (Ar-Ge belgesi 10.2, "Görsel hakları").
 */
export const IMAGES = {
  crest: require("../../assets/club/crest.png"),
  logoWhite: require("../../assets/club/logo-white.png"),
  logoDark: require("../../assets/club/logo-dark.png"),

  "news-mardin": require("../../assets/club/news-mardin.jpg"),
  "news-manisa": require("../../assets/club/news-manisa.jpg"),
  "news-kayseri": require("../../assets/club/news-kayseri.jpg"),
  "news-bursa": require("../../assets/club/news-bursa.jpg"),
  "news-karagumruk": require("../../assets/club/news-karagumruk.jpg"),
  "news-sariyer": require("../../assets/club/news-sariyer.jpg"),
  "news-pendik": require("../../assets/club/news-pendik.jpg"),

  "history-1969-1970": require("../../assets/club/history-1969-1970.jpg"),
  "history-1972-1973": require("../../assets/club/history-1972-1973.jpg"),
  "history-1974-1975": require("../../assets/club/history-1974-1975.jpg"),
  "history-1976": require("../../assets/club/history-1976.jpg"),
  "history-1981-1982": require("../../assets/club/history-1981-1982.jpg"),
  "history-1991-1992": require("../../assets/club/history-1991-1992.jpg"),

  "wp-matchday-muglaspor": require("../../assets/wallpapers/matchday-muglaspor.jpg"),
  "wp-minimal-crest": require("../../assets/wallpapers/minimal-crest.jpg"),
  "wp-minimal-1960": require("../../assets/wallpapers/minimal-1960.jpg"),
  "wp-minimal-stripes": require("../../assets/wallpapers/minimal-stripes.jpg"),
  "wp-minimal-black": require("../../assets/wallpapers/minimal-black.jpg"),
  "wp-photo-goal": require("../../assets/wallpapers/photo-goal.jpg"),
  "wp-photo-team-red": require("../../assets/wallpapers/photo-team-red.jpg"),
  "wp-photo-team-black": require("../../assets/wallpapers/photo-team-black.jpg"),
  "wp-nostalgia-1976": require("../../assets/wallpapers/nostalgia-1976.jpg"),
  "wp-nostalgia-1991": require("../../assets/wallpapers/nostalgia-1991.jpg"),

  // Mağaza ürün fotoğrafları (petrolspor.com/magaza); anahtar = ürün kimliği
  p1: require("../../assets/store/p1.jpg"),
  p2: require("../../assets/store/p2.jpg"),
  p3: require("../../assets/store/p3.jpg"),
  p4: require("../../assets/store/p4.jpg"),
  p5: require("../../assets/store/p5.jpg"),
  p6: require("../../assets/store/p6.jpg"),
  p7: require("../../assets/store/p7.jpg"),
  p8: require("../../assets/store/p8.jpg"),
  p9: require("../../assets/store/p9.jpg"),
  p10: require("../../assets/store/p10.jpg"),
  p11: require("../../assets/store/p11.jpg"),
  p12: require("../../assets/store/p12.jpg"),
  p13: require("../../assets/store/p13.jpg"),
  p14: require("../../assets/store/p14.jpg"),
  p15: require("../../assets/store/p15.jpg"),
  p16: require("../../assets/store/p16.jpg"),
  p17: require("../../assets/store/p17.jpg"),
  p18: require("../../assets/store/p18.jpg"),
  p19: require("../../assets/store/p19.jpg"),
  p20: require("../../assets/store/p20.jpg"),
  p21: require("../../assets/store/p21.jpg"),
  p22: require("../../assets/store/p22.jpg"),
  p23: require("../../assets/store/p23.jpg"),
  p24: require("../../assets/store/p24.jpg"),
} as const;

export type ImageKey = keyof typeof IMAGES;

/** Anahtardan görsel kaynağı; bilinmeyen anahtarda `undefined` (çağıran yer tutucu gösterir) */
export const imageSource = (key?: string | null) => (key && key in IMAGES ? IMAGES[key as ImageKey] : undefined);
