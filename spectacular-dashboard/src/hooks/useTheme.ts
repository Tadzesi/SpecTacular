import { useThemeContext } from '../contexts/ThemeContext';

export function useTheme() {
  const { theme, toggleTheme, setTheme } = useThemeContext();

  const isDark = theme === 'dark';

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  };
}
