import { useEffect, useState } from 'react';

/**
 * Хук для определения, смонтирован ли компонент на клиенте
 * Используется для предотвращения ошибок гидратации
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return isMounted;
}
