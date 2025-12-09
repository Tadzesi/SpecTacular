import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { vscodeApi } from '../vscodeApi';

export type Theme = 'dark' | 'light';

export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): Theme {
  // Try to get saved state from VS Code
  const savedState = vscodeApi.getState<{ theme: Theme }>();
  if (savedState?.theme) {
    return savedState.theme;
  }

  // Default to dark for VS Code environments
  return 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Listen for theme changes from VS Code
  useEffect(() => {
    const unsubscribe = vscodeApi.on('themeChange', (newTheme: unknown) => {
      if (newTheme === 'dark' || newTheme === 'light') {
        setThemeState(newTheme);
      }
    });

    // Also listen for config updates which include theme
    const unsubConfig = vscodeApi.on('config', (config: { theme?: Theme }) => {
      if (config.theme) {
        setThemeState(config.theme);
      }
    });

    return () => {
      unsubscribe();
      unsubConfig();
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Persist to VS Code state
    vscodeApi.setState({ theme });
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
