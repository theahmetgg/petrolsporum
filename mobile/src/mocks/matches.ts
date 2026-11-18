import type { Match } from "@/types";
import { OWN_TEAM_ID } from "./teams";

/**
 * Batman Petrolspor 2026-27 Trendyol 1. Lig fikstürü: 38 hafta.
 * Kaynak: starting11.com fikstür sayfası (tarih ve skorlar, 18 Kasım 2026) + petrolspor.com haberleri (özet ve stat).
 * İlk 14 hafta oynandı (7 galibiyet, 3 beraberlik, 4 mağlubiyet; 27 gol attı, 24 yedi).
 * Yalnız 15. haftanın saati açıklandı (13:30); sonraki maçlarda `time_tbd` true'dur, ekranda "Saat açıklanacak" yazar.
 */

export const COMPETITION = "Trendyol 1. Lig";
export const SEASON = "2026-27";
export const HOME_VENUE = "Batman Şehir Stadyumu";

/** [hafta, tarih, rakip, iç saha mı, bizim gol, rakip gol, özet] */
type Played = [number, string, string, boolean, number, number, string?];

const PLAYED: Played[] = [
  [1, "2026-08-10", "pendikspor", false, 2, 2, "1. Lig'e merhaba dediğimiz maçta Pendik deplasmanından 2-2'lik beraberlikle döndük."],
  [2, "2026-08-17", "boluspor", true, 2, 0, "Batman Şehir Stadyumu'nda taraftarımızın önünde Boluspor'u 2-0 yendik."],
  [3, "2026-08-23", "sariyer", false, 2, 1, "Zorlu Sarıyer deplasmanından 2-1'lik galibiyetle, 3 puanla döndük."],
  [4, "2026-08-29", "sivasspor", true, 2, 1],
  [5, "2026-09-02", "vanspor", false, 2, 0],
  [6, "2026-09-06", "fatih-karagumruk", true, 4, 3, "7 golün atıldığı nefes kesen maçta Fatih Karagümrük'ü 4-3 yendik."],
  [7, "2026-09-12", "bodrum-fk", false, 0, 4],
  [8, "2026-09-19", "bursaspor", true, 1, 2, "Üstün oynadığımız maçta Bursaspor'a 2-1 kaybettik."],
  [9, "2026-10-10", "igdir-fk", false, 1, 2],
  [10, "2026-10-14", "istanbulspor", true, 4, 2],
  [11, "2026-10-18", "kayserispor", false, 2, 2, "Lider Kayserispor deplasmanında yürekli bir oyunla 2-2 berabere kaldık."],
  [12, "2026-10-25", "esenler-erokspor", true, 3, 2, "Beş gole sahne olan maçta Esenler Erokspor'u 3-2 yendik."],
  [13, "2026-10-31", "manisa-fk", false, 1, 2, "Manisa 19 Mayıs Stadyumu'nda oynanan maçı ev sahibi 2-1 kazandı."],
  [14, "2026-11-08", "mardin-1969", false, 1, 1, "1-0 geriye düştüğümüz Mardin deplasmanında Biron'un golüyle 1 puanı aldık."],
];

/** [hafta, tarih, rakip, iç saha mı, saat (açıklandıysa)] */
type Upcoming = [number, string, string, boolean, string?];

const UPCOMING: Upcoming[] = [
  [15, "2026-11-22", "muglaspor", true, "13:30"],
  [16, "2026-11-29", "bandirmaspor", false],
  [17, "2026-12-06", "keciorengucu", true],
  [18, "2026-12-13", "umraniyespor", false],
  [19, "2026-12-20", "antalyaspor", true],
  [20, "2027-01-10", "pendikspor", true],
  [21, "2027-01-17", "boluspor", false],
  [22, "2027-01-24", "sariyer", true],
  [23, "2027-01-31", "sivasspor", false],
  [24, "2027-02-07", "vanspor", true],
  [25, "2027-02-14", "fatih-karagumruk", false],
  [26, "2027-02-17", "bodrum-fk", true],
  [27, "2027-02-21", "bursaspor", false],
  [28, "2027-02-28", "igdir-fk", true],
  [29, "2027-03-07", "istanbulspor", false],
  [30, "2027-03-14", "kayserispor", true],
  [31, "2027-03-21", "esenler-erokspor", false],
  [32, "2027-04-04", "manisa-fk", true],
  [33, "2027-04-11", "mardin-1969", true],
  [34, "2027-04-14", "muglaspor", false],
  [35, "2027-04-18", "bandirmaspor", true],
  [36, "2027-04-25", "keciorengucu", false],
  [37, "2027-05-02", "umraniyespor", true],
  [38, "2027-05-08", "antalyaspor", false],
];

const base = (week: number, date: string, opponent: string, home: boolean, time?: string) => ({
  id: `2026-27-h${week}`,
  competition: COMPETITION,
  season: SEASON,
  week,
  home_team_id: home ? OWN_TEAM_ID : opponent,
  away_team_id: home ? opponent : OWN_TEAM_ID,
  kickoff_at: `${date}T${time ?? "00:00"}:00+03:00`,
  venue: home ? HOME_VENUE : null,
});

export const MATCHES: Match[] = [
  ...PLAYED.map(
    ([week, date, opponent, home, gf, ga, summary]): Match => ({
      ...base(week, date, opponent, home),
      time_tbd: true,
      status: "finished",
      home_score: home ? gf : ga,
      away_score: home ? ga : gf,
      summary,
    })
  ),
  ...UPCOMING.map(
    ([week, date, opponent, home, time]): Match => ({
      ...base(week, date, opponent, home, time),
      time_tbd: !time,
      status: "scheduled",
      home_score: null,
      away_score: null,
    })
  ),
];

/** Sıradaki maç (15. hafta, Muğlaspor). Canlı maç simülasyonu ve skor tahmini bu maç üzerinden çalışır. */
export const NEXT_MATCH_ID = "2026-27-h15";
