// BU DOSYA KOPYADIR — elle düzenlemeyin. Kaynak: mobile/src/mocks/teams.ts (npm run sync)
import type { Team } from "@/types";

/**
 * Trendyol 1. Lig 2026-27 takımları (kaynak: petrolspor.com puan tablosu, 18 Kasım 2026).
 * Rakip armaları lisanslıdır; uygulamada üç harfli kodla nötr rozet çizilir. Yalnız kendi armamız gerçektir.
 */
export const OWN_TEAM_ID = "batman-petrolspor";

export const TEAMS: Team[] = [
  { id: "batman-petrolspor", name: "Batman Petrolspor", short_name: "Petrolspor", code: "BAT", is_own: true },
  { id: "bursaspor", name: "Bursaspor", short_name: "Bursaspor", code: "BUR" },
  { id: "kayserispor", name: "Kayserispor", short_name: "Kayserispor", code: "KAY" },
  { id: "igdir-fk", name: "Iğdır FK", short_name: "Iğdır FK", code: "IĞD" },
  { id: "keciorengucu", name: "Keçiörengücü", short_name: "Keçiörengücü", code: "KEÇ" },
  { id: "mardin-1969", name: "Mardin 1969 Spor", short_name: "Mardin 1969", code: "MAR" },
  { id: "bodrum-fk", name: "Bodrum FK", short_name: "Bodrum FK", code: "BOD" },
  { id: "antalyaspor", name: "Antalyaspor", short_name: "Antalyaspor", code: "ANT" },
  { id: "fatih-karagumruk", name: "Fatih Karagümrük", short_name: "Karagümrük", code: "FKG" },
  { id: "vanspor", name: "Vanspor FK", short_name: "Vanspor", code: "VAN" },
  { id: "muglaspor", name: "Muğlaspor", short_name: "Muğlaspor", code: "MUĞ" },
  { id: "umraniyespor", name: "Ümraniyespor", short_name: "Ümraniyespor", code: "ÜMR" },
  { id: "sariyer", name: "Sarıyer", short_name: "Sarıyer", code: "SAR" },
  { id: "esenler-erokspor", name: "Esenler Erokspor", short_name: "Erokspor", code: "ERO" },
  { id: "bandirmaspor", name: "Bandırmaspor", short_name: "Bandırmaspor", code: "BAN" },
  { id: "pendikspor", name: "Pendikspor", short_name: "Pendikspor", code: "PEN" },
  { id: "manisa-fk", name: "Manisa FK", short_name: "Manisa FK", code: "MAN" },
  { id: "sivasspor", name: "Sivasspor", short_name: "Sivasspor", code: "SİV" },
  { id: "istanbulspor", name: "İstanbulspor", short_name: "İstanbulspor", code: "İST" },
  { id: "boluspor", name: "Boluspor", short_name: "Boluspor", code: "BOL" },
];

const BY_ID = new Map(TEAMS.map((t) => [t.id, t]));

export const getTeam = (id: string): Team => BY_ID.get(id) ?? { id, name: id, short_name: id, code: "???" };
