/**
 * Ortak tipler. Alan adları Ar-Ge belgesi Bölüm 6'daki tablolarla (snake_case) aynı tutulur;
 * sunucu geldiğinde (Faz 2) web ile paylaşılır. Web uygulaması bu dosyayı doğrudan içe aktarır.
 */

/** Sayfalı liste zarfı (Batman360 sunucusuyla aynı biçim) */
export interface Page<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

/* ───────────── Takım, oyuncu ───────────── */

export interface Team {
  id: string;
  /** Tam ad: "Batman Petrolspor" */
  name: string;
  /** Kısa ad (dar alan): "Petrolspor" */
  short_name: string;
  /** Üç harfli kod (arma yerine rozet): "BAT" */
  code: string;
  /** Yalnız kendi kulübümüz için true: gerçek arma çizilir; rakipler kodlu nötr rozetle gösterilir */
  is_own?: boolean;
}

export type PlayerLine = "GK" | "DEF" | "MID" | "FWD";

export interface Player {
  id: string;
  shirt_number: number;
  /** Formadaki / kadro listesindeki kısa ad: "Biron" */
  name: string;
  /** Biliniyorsa tam ad */
  full_name?: string;
  line: PlayerLine;
  /** Ayrıntılı mevki: "Sol bek", "Santrfor" */
  position: string;
  age: number | null;
  nationality: string | null;
  /** Bu sezon lig maçı / ilk 11 / dakika (kaynak: kadro sayfası) */
  appearances: number;
  starts: number;
  minutes: number;
}

/* ───────────── Maç ───────────── */

export type MatchStatus = "scheduled" | "live" | "finished";

export interface Match {
  id: string;
  competition: string;
  season: string;
  week: number;
  home_team_id: string;
  away_team_id: string;
  /** ISO tarih-saat (Türkiye saati, +03:00). Saat açıklanmadıysa gün başı verilir ve `time_tbd` true olur */
  kickoff_at: string;
  time_tbd?: boolean;
  venue: string | null;
  status: MatchStatus;
  home_score: number | null;
  away_score: number | null;
  /** Canlı maçta oynanan dakika */
  minute?: number;
  /** Biten maçın kısa özeti (kulüp sitesindeki haberden) */
  summary?: string;
}

export type MatchEventType = "KICKOFF" | "GOAL" | "YELLOW_CARD" | "RED_CARD" | "SUBSTITUTION" | "HALF_TIME" | "SECOND_HALF" | "FULL_TIME" | "COMMENT";

/** `match_events` satırı; canlı bağlantıdaki `MATCH_EVENT_NEW` mesajının `data` alanıyla aynı */
export interface MatchEvent {
  id: string;
  match_id: string;
  minute: number;
  event_type: MatchEventType;
  /** Olay hangi takımın: "home" | "away"; genel olaylarda yok */
  side?: "home" | "away";
  home_score: number;
  away_score: number;
  player_name?: string;
  /** Oyuncu değişikliğinde çıkan oyuncu */
  player_out_name?: string;
  description: string;
}

export interface MatchStat {
  label: string;
  home: number;
  away: number;
  /** Yüzde olarak gösterilir (topla oynama) */
  percent?: boolean;
}

export interface StandingRow {
  team_id: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goal_diff: number;
  points: number;
}

/** Sıra numarası eklenmiş puan durumu satırı */
export interface RankedStanding extends StandingRow {
  rank: number;
  /** Canlı maç yüzünden sıra değişimi: +1 yükseldi, -1 düştü, 0 aynı */
  rank_change: number;
  live?: boolean;
}

/* ───────────── İçerik ───────────── */

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  /** ISO tarih */
  published_at: string;
  category: string;
  /** `src/mocks/images.ts` içindeki görsel anahtarı */
  image: string;
  source_url: string;
}

export type WallpaperCategory = "Maç Günü" | "Minimalist" | "Maç Fotoğrafı" | "Nostalji";

export interface Wallpaper {
  id: string;
  title: string;
  category: WallpaperCategory;
  image: string;
  download_count: number;
}

/* ───────────── Mağaza ───────────── */

export type ProductCategory = "Forma" | "Çocuk" | "Giyim" | "Aksesuar";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  /** Satış fiyatı (TL). Ölçüye göre değişen üründe en düşük fiyat */
  price: number;
  /** İndirimden önceki fiyat (üstü çizili gösterilir) */
  old_price?: number;
  /** Ölçüye göre değişen üründe en yüksek fiyat */
  price_max?: number;
  /** Seçeneğin adı: "Beden", "Yaş", "Ölçü (cm)" */
  option_label?: string;
  /** Beden / yaş / ölçü seçenekleri; yoksa boş dizi (tek seçenek) */
  options: string[];
  /** Ürün notu (kalıp, kumaş) */
  note?: string;
  /** Görsel anahtarı: mobilde gömülü dosya, web'de /store/<anahtar>.jpg */
  image: string;
  is_new?: boolean;
  /** Ürünün kulüp sitesindeki sayfası */
  source_url: string;
}

/* ───────────── Taraftar ───────────── */

export interface FanProfile {
  id: string;
  full_name: string;
  email: string;
  city: string;
  /** Taraftar kart numarası: "BP-1960-004217" */
  fan_card_no: string;
  member_since: string;
  petrol_puan: number;
  is_guest?: boolean;
}

export interface Prediction {
  match_id: string;
  home_score: number;
  away_score: number;
  first_scorer_id: string | null;
  created_at: string;
  /** Maç bitince hesaplanır */
  points?: number;
}

export interface LeaderboardRow {
  rank: number;
  fan_id: string;
  full_name: string;
  city: string;
  points: number;
  is_me?: boolean;
}

export type BrickType = "red" | "white" | "gold" | "platinum";

export interface MonumentBrick {
  id: string;
  brick_type: BrickType;
  owner_name: string;
  message: string;
  certificate_no: string;
  /** Duvardaki yer: satır ve sütun */
  row: number;
  col: number;
  is_mine?: boolean;
}

export interface MemoryTicket {
  id: string;
  match_id: string;
  title: string;
  /** "2-0" */
  score: string;
  date: string;
  seat: string;
}

export interface FanPostComment {
  id: string;
  author_name: string;
  text: string;
  created_at: string;
}

export interface FanPost {
  id: string;
  author_name: string;
  author_city: string;
  text: string;
  image?: string;
  created_at: string;
  like_count: number;
  comments: FanPostComment[];
}

/* ───────────── Başkan Kokpiti ───────────── */

export interface CockpitStats {
  active_fans: number;
  new_fans_this_week: number;
  plus_members: number;
  bricks_sold: number;
  brick_revenue: number;
  store_revenue: number;
  city_distribution: { city: string; fans: number }[];
  top_products: { name: string; sold: number; revenue: number }[];
  weekly_active: { label: string; value: number }[];
}
