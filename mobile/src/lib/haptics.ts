import * as Haptics from "expo-haptics";

/**
 * Dokunma titreşimleri (karar, 19 Kasım 2026). Az ve anlamlı kullanılır: her basışta değil, yalnız bir şeyin
 * "olduğu" anlarda. Cihaz desteklemiyorsa ya da kullanıcı titreşimi kapattıysa sessizce geçilir.
 *  - `hapticSelect`: seçim değişti (sekme değişimi).
 *  - `hapticLight`: küçük bir eylem tamamlandı (beğeni).
 *  - `hapticSuccess`: önemli bir iş başarıyla bitti (tahmin kaydı, tuğla alımı).
 */
export const hapticSelect = () => {
  Haptics.selectionAsync().catch(() => {});
};

export const hapticLight = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};

export const hapticSuccess = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
};
