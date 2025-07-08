'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}

export type User = {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  telefon?: string;
  slika?: string;
};

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAndFetchProfile() {
      try {
        // Ne šalji zahteve na /prijava i /registracija rutama
        if (typeof window !== 'undefined') {
          const path = window.location.pathname;
          if (path === '/prijava' || path === '/registracija') {
            setUser(null);
            setLoading(false);
            return;
          }
        }
        // Prvo proveri da li je korisnik prijavljen
        const resAuth = await fetch('/api/provera-stanja', { credentials: 'include' });
        const dataAuth = await resAuth.json();
        if (!dataAuth.isLoggedIn) {
          setUser(null);
          setLoading(false);
          return;
        }
        // Ako jeste, tek onda fetchuj profil
        const res = await fetch('/api/profil', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }
    checkAndFetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}; 