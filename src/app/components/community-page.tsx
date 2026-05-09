import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Users,
  Crown,
  Medal,
  UserPlus,
  X,
  Loader2,
  Mail,
  Check,
  Bell,
  Bug,
} from "lucide-react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useUser, type ActivityItem } from "./user-context";

// ── helpers ──────────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "ahora mismo";
  if (mins < 60) return `hace ${mins} min`;
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${days}d`;
}

// ── Community Page ────────────────────────────────────────────────────────────

export function CommunityPage() {
  const { user, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = useUser();

  const [tab, setTab] = useState<"feed" | "amigos" | "leaderboard">("feed");

  // Feed state
  const [feedItems, setFeedItems] = useState<ActivityItem[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedLoaded, setFeedLoaded] = useState(false);
  const [reactions, setReactions] = useState<Record<string, { heart: boolean; fire: boolean }>>({});

  // Add-friend form state
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState<{ text: string; success: boolean } | null>(null);

  // Request actions
  const [processingReq, setProcessingReq] = useState<string | null>(null);

  // ── Load friend activity feed from Firestore ────────────────────────────────
  const loadFeed = useCallback(async () => {
    if (user.friends.length === 0) {
      setFeedItems([]);
      setFeedLoading(false);
      setFeedLoaded(true);
      return;
    }
    setFeedLoading(true);
    try {
      const perFriend = await Promise.all(
        user.friends.map(async (friend) => {
          const q = query(
            collection(db, "users", friend.id, "activities"),
            orderBy("createdAt", "desc"),
            limit(6)
          );
          const snap = await getDocs(q);
          return snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              uid: friend.id,
              userName: friend.name,
              userAvatar: friend.avatar,
              type: (data.type ?? "discovery") as "discovery" | "badge",
              speciesName: data.speciesName,
              speciesId: data.speciesId,
              createdAt: data.createdAt?.toDate() ?? new Date(),
            } satisfies ActivityItem;
          });
        })
      );
      const sorted = perFriend
        .flat()
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 25);
      setFeedItems(sorted);
    } finally {
      setFeedLoading(false);
      setFeedLoaded(true);
    }
  }, [user.friends]);

  // Load feed when tab becomes active (lazy, cached)
  useEffect(() => {
    if (tab === "feed" && !feedLoaded && user.isLoggedIn) {
      loadFeed();
    }
  }, [tab, feedLoaded, user.isLoggedIn, loadFeed]);

  // Reload feed when friends list changes
  useEffect(() => {
    if (feedLoaded) {
      setFeedLoaded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.friends.length]);

  // ── Derived ranking ─────────────────────────────────────────────────────────
  const ranking = [
    {
      uid: user.uid,
      name: user.name,
      avatar: user.avatar,
      xp: user.level * 1000 + user.xp,
      isCurrentUser: true,
    },
    ...user.friends.map((f) => ({ uid: f.id, name: f.name, avatar: f.avatar, xp: f.xp, isCurrentUser: false })),
  ]
    .sort((a, b) => b.xp - a.xp)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const toggleReaction = (id: string, type: "heart" | "fire") =>
    setReactions((p) => ({ ...p, [id]: { ...p[id], [type]: !p[id]?.[type] } }));

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendEmail.trim()) return;
    setSending(true);
    setSendMsg(null);
    const result = await sendFriendRequest(friendEmail.trim());
    setSendMsg({ text: result.message, success: result.success });
    setSending(false);
    if (result.success) {
      setFriendEmail("");
      setTimeout(() => {
        setShowAddFriend(false);
        setSendMsg(null);
      }, 2500);
    }
  };

  const handleAccept = async (requestId: string, fromUid: string) => {
    setProcessingReq(requestId);
    await acceptFriendRequest(requestId, fromUid);
    setProcessingReq(null);
    setFeedLoaded(false); // refresh feed after new friend
  };

  const handleReject = async (requestId: string) => {
    setProcessingReq(requestId);
    await rejectFriendRequest(requestId);
    setProcessingReq(null);
  };

  const pendingCount = user.incomingRequests.length;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl text-white mb-1">Comunidad</h1>
            <p className="text-slate-400 text-sm">Descubre qué encuentran otros exploradores</p>
          </div>
          {user.isLoggedIn && (
            <button
              onClick={() => { setShowAddFriend(true); setTab("amigos"); }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm hover:bg-emerald-500/30 transition-all shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Agregar amigo</span>
            </button>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl border border-slate-800">
          {(
            [
              { id: "feed", label: "Feed", Icon: Users },
              {
                id: "amigos",
                label: `Amigos${user.friends.length ? ` (${user.friends.length})` : ""}`,
                Icon: UserPlus,
                badge: pendingCount,
              },
              { id: "leaderboard", label: "Ranking", Icon: Trophy },
            ] as const
          ).map(({ id, label, Icon, badge }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-1.5 relative ${
                tab === id
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 border border-transparent hover:text-slate-300"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden xs:inline truncate">{label}</span>
              {badge ? (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] flex items-center justify-center font-bold">
                  {badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* ── FEED TAB ── */}
        {tab === "feed" && (
          <div className="space-y-3">
            {!user.isLoggedIn ? (
              <EmptyState
                icon={<Users className="w-7 h-7 text-slate-600" />}
                title="Inicia sesión para ver el feed"
                subtitle="Conecta con otros exploradores"
              />
            ) : feedLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
              </div>
            ) : feedItems.length === 0 ? (
              <EmptyState
                icon={<Users className="w-7 h-7 text-slate-600" />}
                title={user.friends.length === 0 ? "Aún no tienes amigos" : "Tus amigos no tienen actividad aún"}
                subtitle={user.friends.length === 0 ? "Agrega amigos para ver sus hallazgos aquí" : "Cuando descubran libélulas aparecerán aquí"}
                action={
                  user.friends.length === 0
                    ? { label: "Agregar amigo", onClick: () => { setTab("amigos"); setShowAddFriend(true); } }
                    : undefined
                }
              />
            ) : (
              feedItems.map((item, i) => (
                <motion.div
                  key={`${item.uid}-${item.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl bg-slate-900/50 border border-slate-800 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-sm shrink-0">
                      {item.userAvatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="text-white">{item.userName}</span>{" "}
                        <span className="text-slate-400">
                          {item.type === "discovery" ? "encontró" : "desbloqueó"}
                        </span>{" "}
                        <span className="text-emerald-400">{item.speciesName ?? "una especie"}</span>
                      </p>
                      <p className="text-slate-600 text-xs mt-0.5">{timeAgo(item.createdAt)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        {(["fire", "heart"] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => toggleReaction(`${item.uid}-${item.id}`, type)}
                            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-all ${
                              reactions[`${item.uid}-${item.id}`]?.[type]
                                ? type === "fire"
                                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                  : "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                                : "bg-slate-800/50 text-slate-500 border border-slate-700/50 hover:text-slate-300"
                            }`}
                          >
                            {type === "fire" ? "🔥" : "❤️"}{" "}
                            {reactions[`${item.uid}-${item.id}`]?.[type] ? 1 : 0}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* ── AMIGOS TAB ── */}
        {tab === "amigos" && (
          <div className="space-y-4">
            {!user.isLoggedIn ? (
              <EmptyState
                icon={<Users className="w-7 h-7 text-slate-600" />}
                title="Inicia sesión para agregar amigos"
                subtitle="Comparte tus hallazgos con la comunidad"
              />
            ) : (
              <>
                {/* Incoming requests */}
                {user.incomingRequests.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Bell className="w-4 h-4 text-emerald-400" />
                      <span className="text-white text-sm">
                        Solicitudes recibidas ({user.incomingRequests.length})
                      </span>
                    </div>
                    {user.incomingRequests.map((req) => (
                      <motion.div
                        key={req.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
                      >
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-sm shrink-0">
                          {req.fromAvatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm">{req.fromName}</p>
                          <p className="text-slate-500 text-xs truncate">{req.fromEmail}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleAccept(req.id, req.fromUid)}
                            disabled={processingReq === req.id}
                            className="w-8 h-8 rounded-full bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/30 text-emerald-400 flex items-center justify-center transition-all disabled:opacity-50"
                          >
                            {processingReq === req.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            disabled={processingReq === req.id}
                            className="w-8 h-8 rounded-full bg-slate-800/50 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/30 text-slate-500 hover:text-red-400 flex items-center justify-center transition-all disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Add friend form */}
                <AnimatePresence>
                  {showAddFriend && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-xl bg-slate-900/50 border border-emerald-500/30 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-white text-sm">Enviar solicitud de amistad</h3>
                          <button
                            onClick={() => { setShowAddFriend(false); setSendMsg(null); setFriendEmail(""); }}
                            className="text-slate-500 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <form onSubmit={handleSendRequest} className="flex gap-2">
                          <div className="relative flex-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                              type="email"
                              placeholder="Correo del explorador"
                              value={friendEmail}
                              onChange={(e) => setFriendEmail(e.target.value)}
                              autoFocus
                              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 text-sm"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={sending || !friendEmail.trim()}
                            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-sm transition-colors flex items-center gap-1 shrink-0"
                          >
                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar"}
                          </button>
                        </form>
                        {sendMsg && (
                          <p className={`text-xs mt-2 ${sendMsg.success ? "text-emerald-400" : "text-red-400"}`}>
                            {sendMsg.text}
                          </p>
                        )}
                        <p className="text-slate-600 text-xs mt-2">
                          La otra persona deberá aceptar tu solicitud para que sean amigos.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Friends list */}
                {user.friends.length === 0 ? (
                  <EmptyState
                    icon={<Users className="w-7 h-7 text-slate-600" />}
                    title="Aún no tienes amigos"
                    subtitle="Envía una solicitud con el correo de otro explorador"
                    action={
                      !showAddFriend
                        ? { label: "Enviar solicitud", onClick: () => setShowAddFriend(true) }
                        : undefined
                    }
                  />
                ) : (
                  <div className="space-y-3">
                    {user.friends.map((friend, i) => (
                      <motion.div
                        key={friend.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-xl bg-slate-900/50 border border-slate-800 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-sm shrink-0">
                            {friend.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm">{friend.name}</p>
                            <p className="text-slate-500 text-xs">Nivel {Math.floor(friend.xp / 1000) + 1}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-emerald-400 text-sm">{friend.xp.toLocaleString()} XP</p>
                            <p className="text-slate-500 text-xs">{friend.species} especies</p>
                          </div>
                        </div>
                        <div className="flex gap-6 mt-3 pt-3 border-t border-slate-800/70">
                          <div className="text-center">
                            <p className="text-white text-sm">{friend.species}</p>
                            <p className="text-slate-600 text-[10px]">Especies</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white text-sm">{friend.xp.toLocaleString()}</p>
                            <p className="text-slate-600 text-[10px]">XP</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white text-sm">{friend.streak} 🔥</p>
                            <p className="text-slate-600 text-[10px]">Racha</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {!showAddFriend && (
                      <button
                        onClick={() => setShowAddFriend(true)}
                        className="w-full py-3 rounded-xl border border-slate-700 border-dashed text-slate-500 hover:text-emerald-400 hover:border-emerald-500/40 text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" /> Enviar nueva solicitud
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── LEADERBOARD TAB ── */}
        {tab === "leaderboard" && (
          <div className="space-y-4">
            {!user.isLoggedIn || ranking.length === 0 ? (
              <EmptyState
                icon={<Trophy className="w-7 h-7 text-slate-600" />}
                title={!user.isLoggedIn ? "Inicia sesión para ver tu ranking" : "Agrega amigos para competir"}
                subtitle={!user.isLoggedIn ? "Compara tu progreso con amigos" : "El ranking se construye con tus amigos"}
                action={
                  user.isLoggedIn && ranking.length <= 1
                    ? { label: "Agregar amigo", onClick: () => { setTab("amigos"); setShowAddFriend(true); } }
                    : undefined
                }
              />
            ) : (
              <>
                {/* Podium (top 3) */}
                {ranking.length >= 2 && (
                  <div className="flex items-end justify-center gap-3 pt-4 pb-2">
                    {[ranking[1], ranking[0], ranking[2]]
                      .filter(Boolean)
                      .map((entry, i) => {
                        const heights = ["h-20", "h-28", "h-16"];
                        const colors = ["text-slate-300", "text-yellow-400", "text-amber-600"];
                        const bgColors = ["bg-slate-400/10", "bg-yellow-500/10", "bg-amber-600/10"];
                        const borderColors = ["border-slate-400/20", "border-yellow-500/20", "border-amber-600/20"];
                        const icons = [Medal, Crown, Medal];
                        const Icon = icons[i];
                        return (
                          <motion.div
                            key={entry.uid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.12 }}
                            className="flex flex-col items-center gap-2"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm border-2 ${
                                entry.isCurrentUser
                                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                  : "bg-slate-800 border-slate-700 text-slate-400"
                              }`}
                            >
                              {entry.avatar}
                            </div>
                            <p className="text-white text-xs text-center">
                              {entry.name.split(" ")[0]}
                              {entry.isCurrentUser && <span className="text-emerald-400"> (tú)</span>}
                            </p>
                            <div
                              className={`w-20 ${heights[i]} rounded-t-xl ${bgColors[i]} border ${borderColors[i]} flex flex-col items-center justify-center`}
                            >
                              <Icon className={`w-5 h-5 ${colors[i]}`} />
                              <span className={`text-xs ${colors[i]}`}>{entry.xp.toLocaleString()}</span>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                )}

                {/* Full list */}
                <div className="space-y-2">
                  {ranking.map((entry, i) => (
                    <motion.div
                      key={entry.uid}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${
                        entry.isCurrentUser
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : "bg-slate-900/50 border-slate-800"
                      }`}
                    >
                      <span
                        className={`w-6 text-center text-sm ${
                          entry.rank === 1
                            ? "text-yellow-400"
                            : entry.rank === 2
                            ? "text-slate-300"
                            : entry.rank === 3
                            ? "text-amber-600"
                            : "text-slate-500"
                        }`}
                      >
                        {entry.rank}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                          entry.isCurrentUser
                            ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {entry.avatar}
                      </div>
                      <span className="text-white text-sm flex-1">
                        {entry.name}
                        {entry.isCurrentUser && (
                          <span className="text-emerald-400 text-xs ml-1">(tú)</span>
                        )}
                      </span>
                      <span className="text-emerald-400 text-sm">{entry.xp.toLocaleString()} XP</span>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Reusable empty state ──────────────────────────────────────────────────────

function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <p className="text-slate-300 mb-1 text-sm">{title}</p>
      <p className="text-slate-500 text-sm mb-6">{subtitle}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
