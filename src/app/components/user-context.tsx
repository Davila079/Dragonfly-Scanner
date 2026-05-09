import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

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
  uid: string;
  email: string;
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
  { id: "first-scan", name: "Primer vistazo", icon: "🔭", description: "Primer escaneo realizado", unlocked: false },
  { id: "aquatic", name: "Acuático", icon: "🌊", description: "10 especies de hábitat acuático", unlocked: false },
  { id: "speed", name: "Velocidad", icon: "⚡", description: "Responder sin pistas", unlocked: false },
  { id: "dedicated", name: "Dedicado", icon: "📅", description: "7 días de racha consecutiva", unlocked: false },
  { id: "traveler", name: "Viajero", icon: "🌍", description: "Especies de 3 continentes", unlocked: false },
  { id: "master", name: "Maestro Odonata", icon: "👑", description: "200 especies descubiertas", unlocked: false },
  { id: "nocturnal", name: "Noctámbulo", icon: "🌙", description: "Escanear después de las 9pm", unlocked: false },
  { id: "no-hints", name: "Sin pistas", icon: "🎯", description: "Identificar sin usar el árbol de decisiones", unlocked: false },
];

const DEFAULT_USER: UserData = {
  isLoggedIn: false,
  uid: "",
  email: "",
  name: "Explorador",
  avatar: "EX",
  bio: "Amante de los odonatos 🦟",
  level: 1,
  xp: 0,
  xpToNextLevel: 1000,
  dailyXp: 0,
  dailyXpGoal: 500,
  streak: 0,
  discoveredSpecies: [],
  badges: ALL_BADGES,
  friends: [],
};

interface UserContextValue {
  user: UserData;
  authLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  addFriend: (email: string) => Promise<{ success: boolean; message: string }>;
  addXp: (amount: number, label?: string) => void;
  discoverSpecies: (id: string) => void;
  xpToasts: XpToast[];
  showLevelUp: boolean;
  dismissLevelUp: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>(DEFAULT_USER);
  const [authLoading, setAuthLoading] = useState(true);
  const [xpToasts, setXpToasts] = useState<XpToast[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const toastIdRef = useRef(0);

  const loadUserFromFirestore = useCallback(async (uid: string) => {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) return null;
    const data = userDoc.data();

    const friends: Friend[] = [];
    const friendUids: string[] = data.friendUids ?? [];
    await Promise.all(
      friendUids.map(async (fuid) => {
        const fDoc = await getDoc(doc(db, "users", fuid));
        if (fDoc.exists()) {
          const fd = fDoc.data();
          friends.push({
            id: fuid,
            name: fd.name,
            avatar: fd.avatar,
            xp: fd.xp ?? 0,
            species: fd.discoveredSpecies?.length ?? 0,
            streak: fd.streak ?? 0,
            recentAction: "usa Dragonfly Scanner",
            recentTime: "recientemente",
          });
        }
      })
    );

    return { ...data, friends, badges: data.badges ?? ALL_BADGES };
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const data = await loadUserFromFirestore(firebaseUser.uid);
        if (data) {
          setUser({
            isLoggedIn: true,
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? "",
            name: data.name,
            avatar: data.avatar,
            bio: data.bio ?? "Amante de los odonatos 🦟",
            level: data.level ?? 1,
            xp: data.xp ?? 0,
            xpToNextLevel: data.xpToNextLevel ?? 1000,
            dailyXp: data.dailyXp ?? 0,
            dailyXpGoal: data.dailyXpGoal ?? 500,
            streak: data.streak ?? 0,
            discoveredSpecies: data.discoveredSpecies ?? [],
            badges: data.badges,
            friends: data.friends,
          });
        }
      } else {
        setUser(DEFAULT_USER);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, [loadUserFromFirestore]);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(fbUser, { displayName: name });
    const avatar = name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    await setDoc(doc(db, "users", fbUser.uid), {
      email,
      name,
      avatar,
      bio: "Amante de los odonatos 🦟",
      level: 1,
      xp: 0,
      xpToNextLevel: 1000,
      dailyXp: 0,
      dailyXpGoal: 500,
      streak: 0,
      discoveredSpecies: [],
      badges: ALL_BADGES,
      friendUids: [],
    });
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(DEFAULT_USER);
  }, []);

  const addFriend = useCallback(
    async (email: string): Promise<{ success: boolean; message: string }> => {
      if (!auth.currentUser) return { success: false, message: "Debes iniciar sesión" };
      if (email.toLowerCase() === auth.currentUser.email?.toLowerCase()) {
        return { success: false, message: "No puedes agregarte a ti mismo" };
      }

      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return { success: false, message: "No se encontró ningún usuario con ese correo" };
      }

      const friendDoc = snapshot.docs[0];
      const friendUid = friendDoc.id;
      const fd = friendDoc.data();

      const currentDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const friendUids: string[] = currentDoc.data()?.friendUids ?? [];
      if (friendUids.includes(friendUid)) {
        return { success: false, message: "Ya es tu amigo" };
      }

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        friendUids: arrayUnion(friendUid),
      });

      const newFriend: Friend = {
        id: friendUid,
        name: fd.name,
        avatar: fd.avatar,
        xp: fd.xp ?? 0,
        species: fd.discoveredSpecies?.length ?? 0,
        streak: fd.streak ?? 0,
        recentAction: "se unió a Dragonfly Scanner",
        recentTime: "recientemente",
      };

      setUser((u) => ({ ...u, friends: [...u.friends, newFriend] }));
      return { success: true, message: `¡${fd.name} agregado como amigo!` };
    },
    []
  );

  const addXp = useCallback((amount: number, label?: string) => {
    const id = ++toastIdRef.current;
    setXpToasts((t) => [...t, { id, amount, label }]);
    setTimeout(() => setXpToasts((t) => t.filter((toast) => toast.id !== id)), 2500);

    setUser((u) => {
      const newXp = u.xp + amount;
      const newDailyXp = u.dailyXp + amount;
      if (newXp >= u.xpToNextLevel) {
        setShowLevelUp(true);
        const newLevel = u.level + 1;
        const newXpToNextLevel = u.xpToNextLevel + 1000;
        if (auth.currentUser) {
          updateDoc(doc(db, "users", auth.currentUser.uid), {
            xp: newXp - u.xpToNextLevel,
            level: newLevel,
            xpToNextLevel: newXpToNextLevel,
            dailyXp: newDailyXp,
          }).catch(console.error);
        }
        return { ...u, xp: newXp - u.xpToNextLevel, level: newLevel, xpToNextLevel: newXpToNextLevel, dailyXp: newDailyXp };
      }
      if (auth.currentUser) {
        updateDoc(doc(db, "users", auth.currentUser.uid), { xp: newXp, dailyXp: newDailyXp }).catch(console.error);
      }
      return { ...u, xp: newXp, dailyXp: newDailyXp };
    });
  }, []);

  const discoverSpecies = useCallback((id: string) => {
    setUser((u) => {
      if (u.discoveredSpecies.includes(id)) return u;
      if (auth.currentUser) {
        updateDoc(doc(db, "users", auth.currentUser.uid), {
          discoveredSpecies: arrayUnion(id),
        }).catch(console.error);
      }
      return { ...u, discoveredSpecies: [...u.discoveredSpecies, id] };
    });
  }, []);

  const dismissLevelUp = useCallback(() => setShowLevelUp(false), []);

  return (
    <UserContext.Provider
      value={{ user, authLoading, loginWithEmail, register, logout, addFriend, addXp, discoverSpecies, xpToasts, showLevelUp, dismissLevelUp }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be inside UserProvider");
  return ctx;
}
