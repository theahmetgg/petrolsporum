import type { MatchEvent, MatchStat } from "@/types";
import { NEXT_MATCH_ID } from "./matches";

/**
 * CANLI MAÇ SİMÜLASYONU (demo). Bu maç henüz oynanmadı; aşağıdaki olaylar gerçek değildir.
 * Amaç: yönetim sunumunda canlı maç merkezinin nasıl çalıştığını göstermek (gol gelince skor, akış ve puan durumu
 * birlikte değişir). Ekranda "Demo simülasyon" etiketiyle gösterilir.
 * Olay biçimi Ar-Ge belgesi 6.2'deki `MATCH_EVENT_NEW` mesajıyla aynıdır; sunucu geldiğinde bu dosyanın yerini
 * canlı bağlantı alır.
 */
type Script = Omit<MatchEvent, "id" | "match_id">;

const SCRIPT: Script[] = [
  { minute: 0, event_type: "KICKOFF", home_score: 0, away_score: 0, description: "Hakemin düdüğüyle Batman Şehir Stadyumu'nda maç başladı." },
  { minute: 7, event_type: "COMMENT", side: "home", home_score: 0, away_score: 0, description: "Benny sağ kanattan ortaladı, Altıparmak'ın kafa vuruşu az farkla auta çıktı." },
  { minute: 18, event_type: "YELLOW_CARD", side: "away", home_score: 0, away_score: 0, description: "Muğlaspor'da sarı kart: orta sahadaki sert müdahale." },
  { minute: 24, event_type: "GOAL", side: "home", home_score: 1, away_score: 0, player_name: "Biron", description: "GOOOL! Jin-Ho'nun ara pasında Biron kaleciyle karşı karşıya kaldı ve topu ağlara gönderdi." },
  { minute: 38, event_type: "COMMENT", side: "home", home_score: 1, away_score: 0, description: "Tetik'ten kritik kurtarış! Ceza sahası dışından gelen şutu kornere çeldi." },
  { minute: 45, event_type: "HALF_TIME", home_score: 1, away_score: 0, description: "İlk yarı sona erdi. Petrolspor soyunma odasına 1-0 önde gidiyor." },
  { minute: 46, event_type: "SECOND_HALF", home_score: 1, away_score: 0, description: "İkinci yarı başladı." },
  { minute: 54, event_type: "GOAL", side: "away", home_score: 1, away_score: 1, description: "Muğlaspor beraberliği yakaladı. Korner sonrası karambolde top ağlarla buluştu." },
  { minute: 61, event_type: "SUBSTITUTION", side: "home", home_score: 1, away_score: 1, player_name: "Pedrinho", player_out_name: "Yaldır", description: "Petrolspor'da oyuncu değişikliği: Yaldır çıktı, Pedrinho girdi." },
  { minute: 68, event_type: "YELLOW_CARD", side: "home", home_score: 1, away_score: 1, player_name: "Cissokho", description: "Cissokho, rakibin hızlı hücumunu faulle kesti ve sarı kart gördü." },
  { minute: 72, event_type: "GOAL", side: "home", home_score: 2, away_score: 1, player_name: "Altıparmak", description: "GOOOL! 72. dakikada Batman Petrolspor öne geçiyor! Pedrinho'nun ortasında Altıparmak kafayı vurdu." },
  { minute: 80, event_type: "COMMENT", home_score: 2, away_score: 1, description: "Maçın Adamı oylaması açıldı. Oyunu uygulamadan kullanabilirsin." },
  { minute: 84, event_type: "SUBSTITUTION", side: "home", home_score: 2, away_score: 1, player_name: "Córdova", player_out_name: "Biron", description: "Petrolspor'da oyuncu değişikliği: Biron çıktı, Córdova girdi. Tribünler Biron'u ayakta alkışlıyor." },
  { minute: 90, event_type: "FULL_TIME", home_score: 2, away_score: 1, description: "Maç bitti! Batman Petrolspor, Muğlaspor'u 2-1 yendi ve 3 puanın sahibi oldu." },
];

export const LIVE_MATCH_ID = NEXT_MATCH_ID;

export const LIVE_SCRIPT: MatchEvent[] = SCRIPT.map((e, i) => ({ ...e, id: `${LIVE_MATCH_ID}-e${i}`, match_id: LIVE_MATCH_ID }));

/** Maç sonu istatistikleri (simülasyon). Canlıyken dakikaya göre orantılanır; topla oynama sabit kalır. */
export const LIVE_FINAL_STATS: MatchStat[] = [
  { label: "Topla oynama", home: 56, away: 44, percent: true },
  { label: "Şut", home: 14, away: 8 },
  { label: "İsabetli şut", home: 6, away: 3 },
  { label: "Korner", home: 7, away: 3 },
  { label: "Faul", home: 11, away: 14 },
  { label: "Ofsayt", home: 2, away: 1 },
];
