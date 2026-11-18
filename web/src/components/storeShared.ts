/**
 * Mağazanın hem sunucuda hem tarayıcıda kullanılan sabitleri. `store.tsx` bir istemci dosyasıdır ("use client");
 * oradan dışa verilen düz fonksiyonlar sunucu sayfalarında çağrılamaz. Bu yüzden ortak parçalar burada durur.
 */

/** Ürün fotoğrafının adresi (arka planı silinmiş, şeffaf WebP) */
export const productImage = (key: string) => `/store/${key}.webp`;

/**
 * Ürün zemini ("sahne"): ürün fotoğrafları şeffaftır, ürün bu zeminin üstünde durur. Zemin temaya uyan nötr gri ve
 * ortadan kenarlara azalan Petrolspor kırmızısı ışımadır; tanımı `globals.css` içindeki `.stage` sınıfındadır.
 */
export const STAGE = "stage";
