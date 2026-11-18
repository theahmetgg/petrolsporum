"use client";

import { useEffect, useState } from "react";
import { countdownParts, pad2 } from "@/utils/format";

/**
 * Maça geri sayım (gün, saat, dakika, saniye). Saat tarayıcıda işler: sunucuda çizilen sayfada boş kutular
 * görünür, sayfa açılınca saniyede bir güncellenir (sunucu ile tarayıcı saati farkından uyumsuzluk çıkmaz).
 */
export function Countdown({ kickoffAt }: { kickoffAt: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const left = now === null ? null : countdownParts(kickoffAt, now);
  if (now !== null && !left) return <p className="text-center text-sm font-medium text-white">Maç saati geldi.</p>;

  const boxes: [string, string][] = [
    [left ? pad2(left.days) : "--", "GÜN"],
    [left ? pad2(left.hours) : "--", "SAAT"],
    [left ? pad2(left.minutes) : "--", "DAKİKA"],
    [left ? pad2(left.seconds) : "--", "SANİYE"],
  ];

  return (
    <div className="grid grid-cols-4 gap-2" role="timer" aria-label={left ? `Maça ${left.days} gün ${left.hours} saat ${left.minutes} dakika kaldı` : "Geri sayım"}>
      {boxes.map(([value, unit]) => (
        <div key={unit} className="rounded-2xl bg-white/20 py-2 text-center">
          <div className="heading tabular text-2xl text-white md:text-3xl">{value}</div>
          <div className="text-[11px] font-medium text-white/80">{unit}</div>
        </div>
      ))}
    </div>
  );
}
