import type { MatchDayInfo, TicketStep } from "@/types";
import { HOME_VENUE, NEXT_MATCH_ID } from "./matches";

/**
 * Bilet satış adresi. Uygulamada bilet SATILMAZ; taraftar resmi satış sitesine yönlendirilir.
 * DOĞRULANACAK (kulüple): 1. Lig maçlarında bilet ve kombine satışının Passo / Passolig üzerinden yapıldığı
 * varsayıldı; kulübün kendi satış kanalı varsa adres ve aşağıdaki adımlar ona göre değişir.
 */
export const TICKET_URL = "https://www.passo.com.tr";

/** Bilet alma adımları (bilet ve kombine ekranı) */
export const TICKET_STEPS: TicketStep[] = [
  { title: "Passolig kartını hazırla", text: "Bilet, adına kayıtlı Passolig kartıyla alınır. Kartın yoksa Passo üzerinden çıkarabilirsin." },
  { title: "Passo'da maçı seç", text: "Batman Petrolspor maçını bul, tribününü ve koltuğunu seç." },
  { title: "Ödemeyi tamamla", text: "Bilet kartına ya da telefonundaki Passo uygulamasına yüklenir." },
  { title: "Stada gir", text: "Turnikede kartını ya da mobil biletini okut. Kimliğini yanında bulundur." },
];

/**
 * Maç günü rehberi (sıradaki iç saha maçı).
 * - `steps`: ÖRNEK AKIŞ. Kapı açılış ve kadro saatleri resmi değildir; kulüp maç haftasında duyurur. Gerçek sürümde
 *   bu saatler yönetim panelinden girilir.
 * - `weather`: DEMO VERİ. Gerçek sürümde maç saatine göre hava servisinden alınır.
 * - Ulaşım için hat / durak bilgisi yazılmadı (doğrulanmış kaynak yok); taraftar harita uygulamasına yönlendirilir.
 */
export const MATCH_DAY: MatchDayInfo = {
  match_id: NEXT_MATCH_ID,
  stadium: { name: HOME_VENUE, city: "Batman", maps_query: "Batman Şehir Stadyumu, Batman" },
  steps: [
    { key: "gates", label: "Kapılar açılır", minutes_before: 120, note: "Erken gelen turnikede beklemez." },
    { key: "lineup", label: "İlk 11 açıklanır", minutes_before: 60, note: "Açıklanınca uygulamadan haber verilir." },
    { key: "warmup", label: "Takım ısınmaya çıkar", minutes_before: 45 },
    { key: "ceremony", label: "Seremoni", minutes_before: 10 },
    { key: "kickoff", label: "Başlama vuruşu", minutes_before: 0 },
  ],
  weather: { temp_c: 14, condition: "Parçalı bulutlu", rain_chance: 10, wind_kmh: 9 },
  entry_tips: [
    "Passolig kartın ya da mobil biletin",
    "Kimliğin",
    "Atkın ve forman",
    "Büyük çanta, şişe ve yanıcı madde stada alınmaz",
  ],
};
