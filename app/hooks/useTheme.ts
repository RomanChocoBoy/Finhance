import { useState, useEffect } from 'react';

/**
 * Хук для работы с темой с предотвращением ошибок гидратации
 * Загружает тему из localStorage только после гидратации
 */
export function useTheme() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Загружаем тему из localStorage только после гидратации
    const savedTheme = localStorage.getItem('finhance-theme');
    const theme = savedTheme === 'true';
    
    setIsDarkTheme(theme);
    setIsLoaded(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('finhance-theme', newTheme.toString());
  };

  return {
    isDarkTheme,
    toggleTheme,
    isLoaded
  };
}
