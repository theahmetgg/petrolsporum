// BU DOSYA KOPYADIR — elle düzenlemeyin. Kaynak: mobile/src/mocks/players.ts (npm run sync)
import type { Player, PlayerLine } from "@/types";

/**
 * Batman Petrolspor 2026-27 A takım kadrosu (kaynak: starting11.com kadro sayfası, 8 Kasım 2026 güncellemesi;
 * Mardin 1969 - Batman Petrolspor maçından sonra). Kulübün sitesindeki oyuncu listesi geçen sezonun kadrosudur
 * ("Güncelleniyor" notuyla); o yüzden kullanılmadı.
 * Kaynak yalnız formadaki kısa adı veriyor; tam ad yalnız başka kaynakla doğrulananlarda yazıldı.
 * Oyuncu fotoğrafı yok: görsel hakları netleşene kadar forma numaralı yer tutucu çizilir.
 */
const p = (
  shirt_number: number,
  name: string,
  line: PlayerLine,
  position: string,
  age: number | null,
  nationality: string | null,
  appearances: number,
  starts: number,
  minutes: number,
  full_name?: string
): Player => ({ id: `p${shirt_number}`, shirt_number, name, full_name, line, position, age, nationality, appearances, starts, minutes });

export const PLAYERS: Player[] = [
  // Kaleciler
  p(13, "Tetik", "GK", "Kaleci", 31, "Türkiye", 5, 5, 450),
  p(25, "Akbaba", "GK", "Kaleci", 31, "Türkiye", 4, 4, 270),
  // Defans
  p(3, "Subaşı", "DEF", "Sol bek", 30, "Türkiye", 6, 4, 270),
  p(4, "Mert", "DEF", "Stoper", 27, "Türkiye", 9, 9, 720),
  p(21, "Dória", "DEF", "Stoper", 32, "Brezilya", 9, 9, 720),
  p(27, "Artan", "DEF", "Sağ bek", 27, "Türkiye", 8, 7, 500),
  p(28, "Sipahioğlu", "DEF", "Defans", 23, null, 0, 0, 0),
  p(53, "Albayrak", "DEF", "Defans", 35, "Türkiye", 5, 2, 185),
  // Orta saha
  p(5, "Aydoğan", "MID", "Orta saha", 29, "Türkiye", 3, 0, 13, "Emirhan Aydoğan"),
  p(6, "Jin-Ho", "MID", "Merkez orta saha", 23, "Güney Kore", 8, 8, 626),
  p(8, "Gürbulak", "MID", "Merkez orta saha", 34, "Türkiye", 5, 3, 283),
  p(10, "Pedrinho", "MID", "Merkez orta saha", 29, "Brezilya", 8, 4, 327),
  p(17, "Karadeniz", "MID", "Orta saha", 36, "Türkiye", 5, 0, 57, "Gökhan Karadeniz"),
  p(26, "Çağıran", "MID", "Merkez orta saha", 31, "Türkiye", 5, 4, 252, "Rahman Buğra Çağıran"),
  p(34, "Cissokho", "MID", "Ön libero", 26, "Senegal", 9, 7, 556),
  p(72, "Yaldır", "MID", "Orta saha", 23, "Türkiye", 7, 7, 481),
  p(77, "Benny", "MID", "Sağ kanat", 26, "Portekiz", 9, 9, 626),
  // Forvet
  p(7, "Biron", "FWD", "Forvet", 29, "Martinik", 8, 8, 689),
  p(9, "Córdova", "FWD", "Forvet", 29, "Venezuela", 3, 2, 89),
  p(11, "Imeri", "FWD", "Forvet", 26, "Arnavutluk", 4, 2, 137),
  p(15, "David", "FWD", "Forvet", 22, "Brezilya", 7, 0, 91),
  p(79, "Altıparmak", "FWD", "Santrfor", 25, "Türkiye", 8, 5, 522, "Sami Gökhan Altıparmak"),
];

export const HEAD_COACH = { name: "Selçuk Şahin", since: "Ağustos 2026" } as const;

export const LINE_LABELS: Record<PlayerLine, string> = { GK: "Kaleciler", DEF: "Defans", MID: "Orta saha", FWD: "Forvet" };

const BY_ID = new Map(PLAYERS.map((pl) => [pl.id, pl]));
export const getPlayer = (id: string): Player | undefined => BY_ID.get(id);
/** Forma numarasından oyuncu (diziliş tanımları numarayla yazılır) */
export const byNumber = (n: number): Player => BY_ID.get(`p${n}`)!;

/**
 * Sezonun en çok ilk 11 çıkan on biri (kaynak: aynı sayfa, "Most common starting XI", 9 resmi maç).
 * Sıra `@/constants/formations` içindeki 4-3-3 yuvalarıyla aynıdır: kaleci, defans (sağdan sola), orta saha
 * (sağ, orta, sol), forvet (sağ, orta, sol). Maç detayındaki "Kadro" sekmesi ve "İlk 11'ini Kur" başlangıç
 * dizilişi bunu kullanır. Diziliş (4-3-3) oyuncuların mevkilerinden çıkarılmıştır; kaynak dizilişi vermiyor.
 */
export const USUAL_XI = { formation: "4-3-3", numbers: [13, 27, 4, 21, 3, 6, 34, 72, 77, 79, 7] } as const;
