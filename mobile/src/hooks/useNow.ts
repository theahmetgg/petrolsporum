import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

/**
 * Verilen aralıkla güncellenen "şimdi" (ms). Geri sayım gibi zamanla değişen parçalar için.
 * Ekran odakta değilken durur: arkadaki sekmeler her saniye yeniden çizilmez.
 */
export function useNow(intervalMs = 1000): number {
  const focused = useIsFocused();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!focused) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [focused, intervalMs]);

  return now;
}
