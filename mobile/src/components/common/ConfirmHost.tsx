import React, { useCallback, useEffect, useRef } from "react";
import { useConfirmStore, type ConfirmRequest } from "@/stores/confirmStore";
import { ConfirmModal } from "./ConfirmModal";

let nextHostId = 1;

/**
 * `confirm()` isteklerini gösteren tek nokta. Kökte (`app/_layout.tsx`) bir kez mount edilir.
 * React Native `<Modal>` Android'de ayrı bir pencere açtığı için kök host modalın arkasında kalır;
 * bu yüzden onay isteyen RN Modal'lar kendi `BottomSheetModalProvider`'ı içine de bir host koyar.
 * İstekleri en son mount olan host gösterir.
 */
export function ConfirmHost() {
  const hostIdRef = useRef(0);
  if (hostIdRef.current === 0) hostIdRef.current = nextHostId++;
  const hostId = hostIdRef.current;

  const isActive = useConfirmStore((state) => state.hostIds[state.hostIds.length - 1] === hostId);
  const request = useConfirmStore((state) => (isActive ? state.request : null));
  const settle = useConfirmStore((state) => state.settle);

  useEffect(() => {
    const { registerHost, unregisterHost } = useConfirmStore.getState();
    registerHost(hostId);
    return () => unregisterHost(hostId);
  }, [hostId]);

  // Kapanış animasyonu boyunca içerik boşalmasın diye son istek tutulur
  const lastRequestRef = useRef<ConfirmRequest | null>(null);
  if (request) lastRequestRef.current = request;
  const content = request ?? lastRequestRef.current;

  const requestId = content?.id;
  const handleConfirm = useCallback(() => {
    if (requestId !== undefined) settle(requestId, true);
  }, [requestId, settle]);
  const handleCancel = useCallback(() => {
    if (requestId !== undefined) settle(requestId, false);
  }, [requestId, settle]);

  if (!content) return null;

  return (
    <ConfirmModal
      visible={!!request}
      title={content.title}
      message={content.message}
      confirmText={content.confirmText}
      cancelText={content.cancelText}
      tone={content.tone}
      icon={content.icon}
      onMedia={content.onMedia}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
}
