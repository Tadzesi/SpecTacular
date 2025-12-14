import { useState, useCallback, useRef } from 'react';

interface UseNavigationHistoryReturn {
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => string | null;
  goForward: () => string | null;
  pushHistory: (path: string) => void;
  currentPath: string | null;
}

export function useNavigationHistory(): UseNavigationHistoryReturn {
  // Use refs to track the actual state for synchronous access in callbacks
  const historyRef = useRef<string[]>([]);
  const indexRef = useRef(-1);

  // State for triggering re-renders
  const [, forceUpdate] = useState(0);

  const canGoBack = indexRef.current > 0;
  const canGoForward = indexRef.current < historyRef.current.length - 1;
  const currentPath = indexRef.current >= 0 ? historyRef.current[indexRef.current] : null;

  // Normalize path for comparison (handle Windows case sensitivity and slashes)
  const normalizePath = useCallback((p: string): string => {
    return p.replace(/\\/g, '/').toLowerCase();
  }, []);

  const pushHistory = useCallback((path: string) => {
    const currentIdx = indexRef.current;
    const currentHistory = historyRef.current;
    const normalizedPath = normalizePath(path);

    // If we're already at this path (current position), don't modify history
    // This prevents truncation when selectFile messages arrive for current file
    if (currentIdx >= 0 && currentIdx < currentHistory.length) {
      if (normalizePath(currentHistory[currentIdx]) === normalizedPath) {
        return; // Already at this path, preserve forward history
      }
    }

    // Truncate forward history if we're not at the end
    const newHistory = currentHistory.slice(0, currentIdx + 1);

    // Don't add duplicate consecutive entries (normalized comparison)
    if (newHistory.length > 0 && normalizePath(newHistory[newHistory.length - 1]) === normalizedPath) {
      return; // Already at this path, don't add duplicate
    }

    // Add new path and update refs
    newHistory.push(path);
    historyRef.current = newHistory;
    indexRef.current = newHistory.length - 1;

    // Trigger re-render
    forceUpdate((n) => n + 1);
  }, [normalizePath]);

  const goBack = useCallback((): string | null => {
    if (indexRef.current <= 0) return null;

    indexRef.current -= 1;
    const path = historyRef.current[indexRef.current];

    // Trigger re-render
    forceUpdate((n) => n + 1);

    return path;
  }, []);

  const goForward = useCallback((): string | null => {
    if (indexRef.current >= historyRef.current.length - 1) return null;

    indexRef.current += 1;
    const path = historyRef.current[indexRef.current];

    // Trigger re-render
    forceUpdate((n) => n + 1);

    return path;
  }, []);

  return {
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    pushHistory,
    currentPath,
  };
}
