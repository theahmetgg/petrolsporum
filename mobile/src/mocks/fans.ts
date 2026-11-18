import type { BrickType, FanPost, FanProfile, LeaderboardRow, MemoryTicket, MonumentBrick } from "@/types";

/**
 * TARAFTAR VERİLERİ — tamamı ÖRNEKTİR (demo). Gerçek kişi ya da gerçek kayıt değildir.
 * Adlar bilerek "Ad S." biçimindedir. Sunucu geldiğinde (Faz 2) bu dosyanın yerini gerçek kayıtlar alır.
 */

/** Giriş yapılınca oluşan örnek taraftar profili; ad ve e-posta giriş ekranından gelir */
export const makeFanProfile = (full_name: string, email: string, is_guest = false): FanProfile => ({
  id: "fan-me",
  full_name,
  email,
  city: "Batman",
  fan_card_no: "BP-1960-004217",
  member_since: "2026-08-10",
  petrol_puan: 1240,
  is_guest,
});

const NAMES = [
  "Mehmet K.", "Ayşe D.", "Mustafa Y.", "Zeynep A.", "Ali R.", "Fatma Ö.", "Hüseyin T.", "Elif Ş.", "İbrahim Ç.", "Hatice B.",
  "Yusuf E.", "Emine G.", "Ömer P.", "Merve S.", "Hasan U.", "Büşra N.", "Murat İ.", "Esra C.", "Ramazan V.", "Kübra H.",
  "Serkan M.", "Dilan F.", "Baran Z.", "Rojin L.", "Welat O.", "Berfin J.", "Cihan Ü.", "Sevda I.", "Azad K.", "Nurcan D.",
];
const CITIES = ["Batman", "Batman", "Batman", "İstanbul", "Batman", "İzmir", "Diyarbakır", "Batman", "Mersin", "Bursa", "Batman", "Almanya", "Ankara", "Batman", "Hollanda"];

/** Sabit tohumlu sözde rastgele sayı: her açılışta aynı örnek veri çıksın */
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const board = (top: number, step: number, seed: number, myRank: number, myPoints: number): LeaderboardRow[] => {
  const rnd = seeded(seed);
  const rows: LeaderboardRow[] = [];
  let points = top;
  for (let i = 0; i < 20; i++) {
    const rank = i + 1;
    if (rank === myRank) {
      rows.push({ rank, fan_id: "fan-me", full_name: "Sen", city: "Batman", points: myPoints, is_me: true });
      points = myPoints;
    } else {
      rows.push({ rank, fan_id: `fan-${seed}-${i}`, full_name: NAMES[(i * 7 + seed) % NAMES.length], city: CITIES[(i * 3 + seed) % CITIES.length], points });
    }
    points -= Math.max(5, Math.round(step * (0.5 + rnd())));
  }
  return rows;
};

/** Skor tahmini liderlik tabloları. Puanlama: tam skor 100, sonuç 35, ilk gol +25, katılım +5 (Ar-Ge belgesi Bölüm 3, madde 4). */
export const LEADERBOARDS: Record<"weekly" | "monthly" | "season", LeaderboardRow[]> = {
  weekly: board(130, 12, 3, 14, 40),
  monthly: board(395, 28, 5, 9, 215),
  season: board(1310, 55, 8, 12, 760),
};

/** Hatıra biletleri: bu sezonun iç saha galibiyetleri (maçlar gerçek, biletler örnek) */
export const MEMORY_TICKETS: MemoryTicket[] = [
  { id: "t1", match_id: "2026-27-h2", title: "Batman Petrolspor – Boluspor", score: "2-0", date: "2026-08-17", seat: "Maraton · Blok C" },
  { id: "t2", match_id: "2026-27-h4", title: "Batman Petrolspor – Sivasspor", score: "2-1", date: "2026-08-29", seat: "Maraton · Blok C" },
  { id: "t3", match_id: "2026-27-h6", title: "Batman Petrolspor – Fatih Karagümrük", score: "4-3", date: "2026-09-06", seat: "Kale Arkası · Blok A" },
  { id: "t4", match_id: "2026-27-h10", title: "Batman Petrolspor – İstanbulspor", score: "4-2", date: "2026-10-14", seat: "Maraton · Blok C" },
  { id: "t5", match_id: "2026-27-h12", title: "Batman Petrolspor – Esenler Erokspor", score: "3-2", date: "2026-10-25", seat: "Maraton · Blok D" },
];

/* ───────────── Anıt duvarı ───────────── */

export const WALL_COLS = 12;
export const WALL_ROWS = 22;

/** Tuğla türleri ve fiyatları (Ar-Ge belgesi 2.1) */
export const BRICK_TYPES: Record<BrickType, { label: string; price: number; note: string }> = {
  red: { label: "Kırmızı Tuğla", price: 250, note: "Adın duvarda" },
  white: { label: "Beyaz Tuğla", price: 500, note: "Adın ve kısa mesajın" },
  gold: { label: "Altın Raman Tuğlası", price: 1000, note: "Altın çerçeve, öne çıkan yer" },
  platinum: { label: "Platin Kurumsal Blok", price: 5000, note: "Şirketler ve esnaf için geniş blok" },
};

const MESSAGES = ["Sonsuza dek Petrolspor", "Raman'ın çocukları", "1960'tan beri", "Babamın takımı", "Gurbetten selam", "Batman'ın gururu", "Kırmızı beyaz aşk", "Yarasalar burada"];

/** Örnek satılmış tuğlalar: duvarın yaklaşık üçte biri dolu */
export const SOLD_BRICKS: MonumentBrick[] = (() => {
  const rnd = seeded(1960);
  const bricks: MonumentBrick[] = [];
  let n = 0;
  for (let row = 0; row < WALL_ROWS; row++) {
    for (let col = 0; col < WALL_COLS; col++) {
      // Alt sıralar daha dolu: duvar aşağıdan yukarı örülür
      const fillChance = 0.12 + (row / WALL_ROWS) * 0.5;
      if (rnd() > fillChance) continue;
      const roll = rnd();
      const brick_type: BrickType = roll > 0.97 ? "platinum" : roll > 0.88 ? "gold" : roll > 0.6 ? "white" : "red";
      n += 1;
      bricks.push({
        id: `brick-${row}-${col}`,
        brick_type,
        owner_name: brick_type === "platinum" ? `Örnek Firma ${n % 9 + 1}` : NAMES[(n * 5) % NAMES.length],
        message: MESSAGES[(n * 3) % MESSAGES.length],
        certificate_no: `BP-AD-${String(1000 + n).padStart(5, "0")}`,
        row,
        col,
      });
    }
  }
  return bricks;
})();

/* ───────────── Taraftar duvarı ───────────── */

export const FAN_POSTS: FanPost[] = [
  {
    id: "post1",
    author_name: "Baran Z.",
    author_city: "Batman",
    text: "Mardin deplasmanından 1 puan. Biron yine sahnede! Pazar günü Muğlaspor maçında tribünü dolduralım.",
    image: "news-mardin",
    created_at: "2026-11-09T21:40:00+03:00",
    like_count: 214,
    comments: [
      { id: "c1", author_name: "Dilan F.", text: "Pazar günü oradayız!", created_at: "2026-11-09T22:05:00+03:00" },
      { id: "c2", author_name: "Azad K.", text: "İlk 5 çok iyi, play-off hayal değil.", created_at: "2026-11-09T22:31:00+03:00" },
    ],
  },
  {
    id: "post2",
    author_name: "Zeynep A.",
    author_city: "İstanbul",
    text: "İstanbul'dan selamlar. Gurbette de olsak kalbimiz Batman Şehir Stadı'nda atıyor.",
    created_at: "2026-11-08T19:12:00+03:00",
    like_count: 156,
    comments: [{ id: "c3", author_name: "Mehmet K.", text: "Ümraniye deplasmanında buluşalım.", created_at: "2026-11-08T19:50:00+03:00" }],
  },
  {
    id: "post3",
    author_name: "Welat O.",
    author_city: "Batman",
    text: "Erokspor maçındaki 3-2 unutulmaz. O atmosferi yaşayan herkese helal olsun.",
    image: "news-manisa",
    created_at: "2026-10-25T23:02:00+03:00",
    like_count: 388,
    comments: [
      { id: "c4", author_name: "Berfin J.", text: "Son dakikadaki gol hâlâ kulaklarımda.", created_at: "2026-10-25T23:20:00+03:00" },
      { id: "c5", author_name: "Cihan Ü.", text: "Hatıra biletim koleksiyonda.", created_at: "2026-10-26T08:14:00+03:00" },
      { id: "c6", author_name: "Rojin L.", text: "Tribün 12. adamdı.", created_at: "2026-10-26T09:03:00+03:00" },
    ],
  },
  {
    id: "post4",
    author_name: "Yusuf E.",
    author_city: "Almanya",
    text: "Almanya'dan anıt duvarına tuğlamı koydum. Sertifikayı salona astım.",
    created_at: "2026-10-20T14:45:00+03:00",
    like_count: 97,
    comments: [],
  },
  {
    id: "post5",
    author_name: "Elif Ş.",
    author_city: "Batman",
    text: "Kayseri deplasmanında liderden puan almak kolay değil. Bu takım 1. Lig'e yakışıyor.",
    image: "news-kayseri",
    created_at: "2026-10-18T22:10:00+03:00",
    like_count: 271,
    comments: [{ id: "c7", author_name: "Hasan U.", text: "Selçuk hoca takımı çok iyi oynatıyor.", created_at: "2026-10-18T22:48:00+03:00" }],
  },
];
