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

} as const;

export type ImageKey = keyof typeof IMAGES;

/** Anahtardan görsel kaynağı; bilinmeyen anahtarda `undefined` (çağıran yer tutucu gösterir) */
export const imageSource = (key?: string | null) => (key && key in IMAGES ? IMAGES[key as ImageKey] : undefined);
