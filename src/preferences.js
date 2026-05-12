const THEME_KEY = 'pokedex_theme_v1';

export const getStoredTheme = () => localStorage.getItem(THEME_KEY) || 'light';

const setStoredTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};

export const applyTheme = (theme) => {
  document.body.classList.toggle('theme-dark', theme === 'dark');
};

export const toggleTheme = () => {
  const current = getStoredTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  setStoredTheme(next);
  applyTheme(next);
  return next;
};

export const initTheme = () => {
  const theme = getStoredTheme();
  applyTheme(theme);
  return theme;
};