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
  addDoc,
  serverTimestamp,
  deleteDoc,
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

export interface FriendRequest {
  id: string;
  fromUid: string;
  fromName: string;
  fromAvatar: string;
  fromEmail: string;
  createdAt: Date;
}

export interface ActivityItem {
  id: string;
  uid: string;
  userName: string;
  userAvatar: string;
  type: "discovery" | "badge";
  speciesName?: string;
  speciesId?: string;
  createdAt: Date;
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
  incomingRequests: FriendRequest[];
  sentRequestUids: string[];
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
  incomingRequests: [],
  sentRequestUids: [],
};

interface UserContextValue {
  user: UserData;
  authLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  sendFriendRequest: (email: string) => Promise<{ success: boolean; message: string }>;
  acceptFriendRequest: (requestId: string, fromUid: string) => Promise<void>;
  rejectFriendRequest: (requestId: string) => Promise<void>;
  addXp: (amount: number, label?: string) => void;
  discoverSpecies: (id: string, speciesName?: string) => void;
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
  // Always-current snapshot of user state for use inside callbacks
  const userRef = useRef<UserData>(DEFAULT_USER);
  useEffect(() => { userRef.current = user; }, [user]);

  const loadUserFromFirestore = useCallback(async (uid: string) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) return null;
    const data = userDoc.data();

    // Load friends
    const friends: Friend[] = [];
    await Promise.all(
      (data.friendUids ?? []).map(async (fuid: string) => {
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
          });
        }
      })
    );

    // Load incoming pending friend requests
    const reqSnap = await getDocs(
      query(collection(db, "friendRequests"), where("toUid", "==", uid))
    );
    const incomingRequests: FriendRequest[] = reqSnap.docs
      .filter((d) => d.data().status === "pending")
      .map((d) => {
        const rd = d.data();
        return {
          id: d.id,
          fromUid: rd.fromUid,
          fromName: rd.fromName,
          fromAvatar: rd.fromAvatar,
          fromEmail: rd.fromEmail,
          createdAt: rd.createdAt?.toDate() ?? new Date(),
        };
      });

    // Load outgoing pending request UIDs
    const sentSnap = await getDocs(
      query(collection(db, "friendRequests"), where("fromUid", "==", uid))
    );
    const sentRequestUids: string[] = sentSnap.docs
      .filter((d) => d.data().status === "pending")
      .map((d) => d.data().toUid);

    return { ...data, friends, badges: data.badges ?? ALL_BADGES, incomingRequests, sentRequestUids };
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const data = await loadUserFromFirestore(fbUser.uid);
        if (data) {
          setUser({
            isLoggedIn: true,
            uid: fbUser.uid,
            email: fbUser.email ?? "",
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
            incomingRequests: data.incomingRequests,
            sentRequestUids: data.sentRequestUids,
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
    const avatar = name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase();
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

  const sendFriendRequest = useCallback(
    async (email: string): Promise<{ success: boolean; message: string }> => {
      const currentUser = auth.currentUser;
      if (!currentUser) return { success: false, message: "Debes iniciar sesión" };
      if (email.toLowerCase() === currentUser.email?.toLowerCase())
        return { success: false, message: "No puedes agregarte a ti mismo" };

      // Find target user by email
      const snap = await getDocs(query(collection(db, "users"), where("email", "==", email)));
      if (snap.empty) return { success: false, message: "No se encontró ningún usuario con ese correo" };

      const targetDoc = snap.docs[0];
      const targetUid = targetDoc.id;
      const targetData = targetDoc.data();

      const current = userRef.current;
      if (current.friends.some((f) => f.id === targetUid))
        return { success: false, message: "Ya son amigos" };
      if (current.sentRequestUids.includes(targetUid))
        return { success: false, message: "Ya enviaste una solicitud a este usuario" };

      // Check if they already sent us a request (suggest accepting instead)
      if (current.incomingRequests.some((r) => r.fromUid === targetUid))
        return { success: false, message: "Este usuario ya te envió una solicitud. ¡Acéptala en tus solicitudes!" };

      await addDoc(collection(db, "friendRequests"), {
        fromUid: currentUser.uid,
        fromName: current.name,
        fromAvatar: current.avatar,
        fromEmail: currentUser.email,
        toUid: targetUid,
        toEmail: targetData.email,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setUser((u) => ({ ...u, sentRequestUids: [...u.sentRequestUids, targetUid] }));
      return { success: true, message: `Solicitud enviada a ${targetData.name}` };
    },
    []
  );

  const acceptFriendRequest = useCallback(async (requestId: string, fromUid: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // Add each other as friends in Firestore
    await Promise.all([
      updateDoc(doc(db, "users", currentUser.uid), { friendUids: arrayUnion(fromUid) }),
      updateDoc(doc(db, "users", fromUid), { friendUids: arrayUnion(currentUser.uid) }),
      deleteDoc(doc(db, "friendRequests", requestId)),
    ]);

    // Load the new friend's data for local state
    const friendDoc = await getDoc(doc(db, "users", fromUid));
    const fd = friendDoc.exists() ? friendDoc.data() : null;
    const newFriend: Friend | null = fd
      ? {
          id: fromUid,
          name: fd.name,
          avatar: fd.avatar,
          xp: fd.xp ?? 0,
          species: fd.discoveredSpecies?.length ?? 0,
          streak: fd.streak ?? 0,
        }
      : null;

    setUser((u) => ({
      ...u,
      incomingRequests: u.incomingRequests.filter((r) => r.id !== requestId),
      friends: newFriend ? [...u.friends, newFriend] : u.friends,
    }));
  }, []);

  const rejectFriendRequest = useCallback(async (requestId: string) => {
    await deleteDoc(doc(db, "friendRequests", requestId));
    setUser((u) => ({
      ...u,
      incomingRequests: u.incomingRequests.filter((r) => r.id !== requestId),
    }));
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
        const newLevel = u.level + 1;
        const newXpToNext = u.xpToNextLevel + 1000;
        if (auth.currentUser) {
          updateDoc(doc(db, "users", auth.currentUser.uid), {
            xp: newXp - u.xpToNextLevel,
            level: newLevel,
            xpToNextLevel: newXpToNext,
            dailyXp: newDailyXp,
          }).catch(console.error);
        }
        return { ...u, xp: newXp - u.xpToNextLevel, level: newLevel, xpToNextLevel: newXpToNext, dailyXp: newDailyXp };
      }
      if (auth.currentUser) {
        updateDoc(doc(db, "users", auth.currentUser.uid), { xp: newXp, dailyXp: newDailyXp }).catch(console.error);
      }
      return { ...u, xp: newXp, dailyXp: newDailyXp };
    });
  }, []);

  const discoverSpecies = useCallback((id: string, speciesName?: string) => {
    setUser((u) => {
      if (u.discoveredSpecies.includes(id)) return u;
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        const current = userRef.current;
        // Persist discovery
        updateDoc(doc(db, "users", uid), { discoveredSpecies: arrayUnion(id) }).catch(console.error);
        // Log activity for friends' feed
        addDoc(collection(db, "users", uid, "activities"), {
          type: "discovery",
          speciesName: speciesName ?? id,
          speciesId: id,
          userName: current.name,
          userAvatar: current.avatar,
          createdAt: serverTimestamp(),
        }).catch(console.error);
      }
      return { ...u, discoveredSpecies: [...u.discoveredSpecies, id] };
    });
  }, []);

  const dismissLevelUp = useCallback(() => setShowLevelUp(false), []);

  return (
    <UserContext.Provider
      value={{
        user,
        authLoading,
        loginWithEmail,
        register,
        logout,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        addXp,
        discoverSpecies,
        xpToasts,
        showLevelUp,
        dismissLevelUp,
      }}
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
