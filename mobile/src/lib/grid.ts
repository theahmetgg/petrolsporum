/**
 * FlashList ızgara hücresi aralığı.
 * FlashList'te `columnWrapperStyle` yok; sütun aralığı hücrenin sol iç boşluğuyla verilir.
 * Kart genişliği şu formülle hesaplanmış olmalı: (genişlik − 2·kenar − (sütun−1)·aralık) / sütun.
 *
 * @param edgePadding Liste kapsayıcısına yatay padding verilmediyse ekran kenar boşluğu (ör. başlık tam genişlikse)
 */
export const gridCellStyle = (index: number, columns: number, gap: number, edgePadding = 0) => ({
  paddingLeft: edgePadding + ((index % columns) * (gap - 2 * edgePadding)) / columns,
  paddingBottom: gap,
});
