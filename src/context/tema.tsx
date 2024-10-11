'use client'
import { createContext, useState, useEffect, ReactNode } from 'react';

// Definir el tipo del contexto
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// Inicializar el contexto
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Definir el tipo de las props del proveedor del contexto
interface ThemeProviderProps {
  children: ReactNode;
}

// Proveedor del contexto con el tipo especificado
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
