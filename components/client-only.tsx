import { useIsMounted } from '@/hooks/useIsMounted';
import { ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Компонент для рендеринга содержимого только на клиенте
 * Помогает избежать ошибок гидратации
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
