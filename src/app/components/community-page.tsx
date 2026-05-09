import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Heart, Flame, Trophy, Search, Users, Crown, Medal } from "lucide-react";
import { useUser } from "./user-context";

const FEED_ITEMS = [
  { id: 1, user: "María Torres", avatar: "MT", action: "encontró", species: "Anax imperator", emoji: "🔵", time: "hace 1h", likes: 12, fires: 5 },
  { id: 2, user: "Carlos López", avatar: "CL", action: "completó", species: "Academia: Anatomía", emoji: "📚", time: "hace 2h", likes: 8, fires: 3 },
  { id: 3, user: "Ana García", avatar: "AG", action: "encontró", species: "Pantala flavescens", emoji: "🟡", time: "hace 3h", likes: 15, fires: 9 },
  { id: 4, user: "Diego Ruiz", avatar: "DR", action: "desbloqueó", species: "Badge: Acuático 🌊", emoji: "🏆", time: "hace 4h", likes: 22, fires: 11 },
  { id: 5, user: "Laura Sánchez", avatar: "LS", action: "encontró", species: "Cordulegaster boltonii", emoji: "🟣", time: "hace 5h", likes: 31, fires: 18 },
];

const LEADERBOARD = [
  { rank: 1, name: "Laura Sánchez", avatar: "LS", xp: 4520 },
  { rank: 2, name: "María Torres", avatar: "MT", xp: 3890 },
  { rank: 3, name: "Ana García", avatar: "AG", xp: 3210 },
  { rank: 4, name: "Carlos López", avatar: "CL", xp: 2650 },
  { rank: 5, name: "Diego Ruiz", avatar: "DR", xp: 1980 },
];

export function CommunityPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"feed" | "leaderboard">("feed");
  const [reactions, setReactions] = useState<Record<number, { heart: boolean; fire: boolean }>>({});

  const toggleReaction = (id: number, type: "heart" | "fire") => {
    setReactions((prev) => ({
      ...prev,
      [id]: { ...prev[id], [type]: !prev[id]?.[type] },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl text-white mb-1">Comunidad</h1>
          <p className="text-slate-400 text-sm">Descubre qué encuentran otros exploradores</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl border border-slate-800">
          <button
            onClick={() => setTab("feed")}
            className={`flex-1 py-2 rounded-lg text-sm transition-all ${tab === "feed" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 border border-transparent"}`}
          >
            <Users className="w-4 h-4 inline mr-1" /> Feed
          </button>
          <button
            onClick={() => setTab("leaderboard")}
            className={`flex-1 py-2 rounded-lg text-sm transition-all ${tab === "leaderboard" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 border border-transparent"}`}
          >
            <Trophy className="w-4 h-4 inline mr-1" /> Ranking
          </button>
        </div>

        {tab === "feed" ? (
          <div className="space-y-3">
            {FEED_ITEMS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl bg-slate-900/50 border border-slate-800 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-sm shrink-0">
                    {item.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="text-white">{item.user}</span>{" "}
                      <span className="text-slate-400">{item.action}</span>{" "}
                      <span className="text-emerald-400">{item.species}</span>
                    </p>
                    <p className="text-slate-600 text-xs mt-0.5">{item.time}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => toggleReaction(item.id, "fire")}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-all ${
                          reactions[item.id]?.fire
                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                            : "bg-slate-800/50 text-slate-500 border border-slate-700/50 hover:text-orange-400"
                        }`}
                      >
                        🔥 {item.fires + (reactions[item.id]?.fire ? 1 : 0)}
                      </button>
                      <button
                        onClick={() => toggleReaction(item.id, "heart")}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-all ${
                          reactions[item.id]?.heart
                            ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                            : "bg-slate-800/50 text-slate-500 border border-slate-700/50 hover:text-pink-400"
                        }`}
                      >
                        ❤️ {item.likes + (reactions[item.id]?.heart ? 1 : 0)}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Podium */}
            <div className="flex items-end justify-center gap-3 pt-4 pb-2">
              {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((entry, i) => {
                const heights = ["h-20", "h-28", "h-16"];
                const colors = ["text-slate-300", "text-yellow-400", "text-amber-600"];
                const bgColors = ["bg-slate-400/10", "bg-yellow-500/10", "bg-amber-600/10"];
                const borderColors = ["border-slate-400/20", "border-yellow-500/20", "border-amber-600/20"];
                const icons = [Medal, Crown, Medal];
                const Icon = icons[i];
                return (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-sm border-2 border-slate-700">
                      {entry.avatar}
                    </div>
                    <p className="text-white text-xs text-center">{entry.name.split(" ")[0]}</p>
                    <div className={`w-20 ${heights[i]} rounded-t-xl ${bgColors[i]} border ${borderColors[i]} flex flex-col items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${colors[i]}`} />
                      <span className={`text-xs ${colors[i]}`}>{entry.xp.toLocaleString()} XP</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Full list */}
            <div className="space-y-2">
              {LEADERBOARD.map((entry, i) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800"
                >
                  <span className={`w-6 text-center text-sm ${entry.rank <= 3 ? "text-yellow-400" : "text-slate-500"}`}>
                    {entry.rank}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
                    {entry.avatar}
                  </div>
                  <span className="text-white text-sm flex-1">{entry.name}</span>
                  <span className="text-emerald-400 text-sm">{entry.xp.toLocaleString()} XP</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
