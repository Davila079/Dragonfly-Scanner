import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserData {
  isLoggedIn: boolean;
  name: string;
  avatar: string;
  bio: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  dailyXp: number;
  dailyXpGoal: number;
  streak: number;
  discoveredSpecies: string[];
  badges: Badge[];
  friends: Friend[];
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  species: number;
  streak: number;
  recentAction?: string;
  recentTime?: string;
}

export interface XpToast {
  id: number;
  amount: number;
  label?: string;
}

const ALL_BADGES: Badge[] = [
  { id: "first-scan", name: "Primer vistazo", icon: "🔭", description: "Primer escaneo realizado", unlocked: true, unlockedAt: "2026-03-15" },
  { id: "aquatic", name: "Acuático", icon: "🌊", description: "10 especies de hábitat acuático", unlocked: true, unlockedAt: "2026-04-01" },
  { id: "speed", name: "Velocidad", icon: "⚡", description: "Responder sin pistas", unlocked: false },
  { id: "dedicated", name: "Dedicado", icon: "📅", description: "7 días de racha consecutiva", unlocked: true, unlockedAt: "2026-04-10" },
  { id: "traveler", name: "Viajero", icon: "🌍", description: "Especies de 3 continentes", unlocked: false },
  { id: "master", name: "Maestro Odonata", icon: "👑", description: "200 especies descubiertas", unlocked: false },
  { id: "nocturnal", name: "Noctámbulo", icon: "🌙", description: "Escanear después de las 9pm", unlocked: true, unlockedAt: "2026-04-12" },
  { id: "no-hints", name: "Sin pistas", icon: "🎯", description: "Identificar sin usar el árbol de decisiones", unlocked: false },
];

const MOCK_FRIENDS: Friend[] = [
  { id: "1", name: "Ana García", avatar: "AG", xp: 15420, species: 63, streak: 21, recentAction: "encontró Pantala flavescens", recentTime: "hace 12 min" },
  { id: "2", name: "Carlos López", avatar: "CL", xp: 12890, species: 51, streak: 14, recentAction: "completó Academia: Anatomía", recentTime: "hace 35 min" },
  { id: "3", name: "María Torres", avatar: "MT", xp: 18200, species: 89, streak: 45, recentAction: "encontró Anax imperator", recentTime: "hace 1h" },
  { id: "4", name: "Diego Ruiz", avatar: "DR", xp: 9750, species: 38, streak: 7, recentAction: "desbloqueó badge Acuático", recentTime: "hace 2h" },
  { id: "5", name: "Laura Sánchez", avatar: "LS", xp: 22100, species: 104, streak: 60, recentAction: "encontró Cordulegaster boltonii", recentTime: "hace 3h" },
];

const DEFAULT_USER: UserData = {
  isLoggedIn: false,
  name: "Explorador",
  avatar: "EX",
  bio: "Amante de los odonatos 🦟",
  level: 7,
  xp: 3240,
  xpToNextLevel: 5000,
  dailyXp: 320,
  dailyXpGoal: 500,
  streak: 14,
  discoveredSpecies: ["blue-dasher", "flame-skimmer"],
  badges: ALL_BADGES,
  friends: MOCK_FRIENDS,
};

interface UserContextValue {
  user: UserData;
  login: () => void;
  logout: () => void;
  addXp: (amount: number, label?: string) => void;
  discoverSpecies: (id: string) => void;
  xpToasts: XpToast[];
  showLevelUp: boolean;
  dismissLevelUp: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>(DEFAULT_USER);
  const [xpToasts, setXpToasts] = useState<XpToast[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const toastIdRef = useRef(0);

  const login = useCallback(() => {
    setUser((u) => ({ ...u, isLoggedIn: true, name: "Alex Martínez", avatar: "AM" }));
  }, []);

  const logout = useCallback(() => {
    setUser((u) => ({ ...u, isLoggedIn: false, name: "Explorador", avatar: "EX" }));
  }, []);

  const addXp = useCallback((amount: number, label?: string) => {
    const id = ++toastIdRef.current;
    setXpToasts((t) => [...t, { id, amount, label }]);
    setTimeout(() => setXpToasts((t) => t.filter((toast) => toast.id !== id)), 2500);

    setUser((u) => {
      const newXp = u.xp + amount;
      const newDailyXp = u.dailyXp + amount;
      if (newXp >= u.xpToNextLevel) {
        setShowLevelUp(true);
        return { ...u, xp: newXp - u.xpToNextLevel, level: u.level + 1, xpToNextLevel: u.xpToNextLevel + 1000, dailyXp: newDailyXp };
      }
      return { ...u, xp: newXp, dailyXp: newDailyXp };
    });
  }, []);

  const discoverSpecies = useCallback((id: string) => {
    setUser((u) => {
      if (u.discoveredSpecies.includes(id)) return u;
      return { ...u, discoveredSpecies: [...u.discoveredSpecies, id] };
    });
  }, []);

  const dismissLevelUp = useCallback(() => setShowLevelUp(false), []);

  return (
    <UserContext.Provider value={{ user, login, logout, addXp, discoverSpecies, xpToasts, showLevelUp, dismissLevelUp }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be inside UserProvider");
  return ctx;
}
