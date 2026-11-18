import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

/** Ekran yığında görünür olduğu sürece true; arka plandaki ekranlarda periyodik yenilemeyi durdurmak için */
export function useScreenFocused(): boolean {
  const [focused, setFocused] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, [])
  );
  return focused;
}
