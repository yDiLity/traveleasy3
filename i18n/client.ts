// Экспортируем пустые заглушки для навигационных API
// Это временное решение, пока мы не решим проблему с next-intl

export const Link = ({ children, href, ...props }: any) => {
  return <a href={href} {...props}>{children}</a>;
};

export const redirect = (path: string) => {
  window.location.href = path;
};

export const usePathname = () => {
  return window.location.pathname;
};

export const useRouter = () => {
  return {
    push: (path: string) => {
      window.location.href = path;
    },
    replace: (path: string) => {
      window.location.href = path;
    }
  };
};
