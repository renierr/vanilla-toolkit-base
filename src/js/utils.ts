export const isDev = Boolean(import.meta.env.DEV);

export function getSystemTheme(): 'dark' | 'light' {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isDark ? 'dark' : 'light';
}
