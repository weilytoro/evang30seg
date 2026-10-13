import { useEffect, useRef } from 'react';

// Fecha o modal ao pressionar Escape. Só escuta enquanto `active` for true (ex.: modal aberto).
export const useEscapeKey = (onClose: () => void, active: boolean = true) => {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active]);
};
