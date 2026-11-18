import { QueryClient, onlineManager } from "@tanstack/react-query";

// React Query sorgularını varsayılan olarak online tut.
// Android NetInfo cold-start sırasında gecikmeli veya hatalı false döndüğünde
// sorguların durdurulmasını (fetchStatus: "paused") engellemek için doğrudan online çalıştırılır.
onlineManager.setOnline(true);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Varsayılan: 5 dk taze, kullanılmayan sorgu 10 dk sonra bellekten atılır.
      // Veri tipine göre farklı süreler hook'larda: hava 10 dk, haber 5 dk, sözleşme 1 gün,
      // taksonomi 1 gün, okunmamış mesaj sayısı 30 sn, namaz vakti 24 sa.
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      // Kalıcı hatalarda (4xx) tekrar deneme yok; yalnızca ağ hatası / 5xx'te 1 kez
      retry: (failureCount, error: any) => {
        const status = error?.response?.status;
        const isTransient = !status || status >= 500;
        return isTransient && failureCount < 1;
      },
      // Ağ durumundan bağımsız olarak istekleri doğrudan atar; ağ yoksa Axios hatayı temizce yakalar.
      networkMode: "always",
    },
    mutations: {
      networkMode: "always",
    },
  },
});


/**
 * Detay ekranı: veri gelmediyse bu bir yükleme hatası mı (ağ / sunucu → "Tekrar dene"),
 * yoksa kayıt gerçekten yok mu (404/410/403 → "bulunamadı")?
 */
export const isLoadFailure = (error: unknown): boolean => {
  if (!error) return false;
  const status = (error as { response?: { status?: number } })?.response?.status;
  return !status || status >= 500 || status === 408 || status === 429;
};
