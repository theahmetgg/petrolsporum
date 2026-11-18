/**
 * Yakalanan render hatasının bildirimi. Prototipte sunucu yok; hata yalnız geliştirme konsoluna yazılır.
 * Faz 2'de Batman360'taki gibi sunucuya (POST /client-errors) gönderilir; çağıran taraf (`ErrorBoundary`) değişmez.
 */
export function reportClientError(error: Error, options: { screen?: string; componentStack?: string | null } = {}) {
  if (__DEV__) console.warn("[hata]", options.screen ?? "?", error.message);
}
