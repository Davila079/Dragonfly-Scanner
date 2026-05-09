import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useUser } from "./user-context";
import { Settings, LogOut, Calendar, Zap, Flame, Bug, Trophy, ChevronRight } from "lucide-react";
import { SPECIES_DATABASE, RARITY_CONFIG } from "./species-database";

export function ProfilePage() {
  const { user, login, logout } = useUser();
  const navigate = useNavigate();

  if (!user.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Bug className="w-8 h-8 text-slate-500" />
          </div>
          <h2 className="text-white mb-2">Inicia sesión</h2>
          <p className="text-slate-400 text-sm mb-6">Accede a tu colección, juegos y comunidad.</p>
          <button onClick={login} className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors">
            Crear cuenta / Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  const discoveredSpecies = SPECIES_DATABASE.filter((s) => user.discoveredSpecies.includes(s.id));
  const unlockedBadges = user.badges.filter((b) => b.unlocked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 h-32"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_60%)]" />
          <button onClick={logout} className="absolute top-3 right-3 p-2 rounded-lg bg-slate-900/50 text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Avatar & Name */}
        <div className="-mt-10 ml-6 relative z-10 flex items-end gap-4">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-4 border-slate-950 flex items-center justify-center text-emerald-400 text-xl">
            {user.avatar}
          </div>
          <div className="pb-1">
            <h2 className="text-white">{user.name}</h2>
            <p className="text-slate-400 text-sm">{user.bio}</p>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { icon: Bug, label: "Especies", value: user.discoveredSpecies.length },
            { icon: Zap, label: "XP Total", value: (user.level * 5000 + user.xp).toLocaleString() },
            { icon: Flame, label: "Racha", value: `${user.streak} días` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-slate-900/50 border border-slate-800 p-3 text-center">
              <stat.icon className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="text-white text-lg">{stat.value}</p>
              <p className="text-slate-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-slate-900/50 border border-slate-800 p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">Nivel {user.level}</span>
            <span className="text-slate-500 text-xs">{user.xp} / {user.xpToNextLevel} XP</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <p className="text-slate-500 text-xs mt-1">
            {user.level >= 10 ? "Maestro Entomólogo" : user.level >= 7 ? "Entomólogo Avanzado" : "Explorador"}
          </p>
        </motion.div>

        {/* Badges */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span className="text-white text-sm">Logros ({unlockedBadges.length}/{user.badges.length})</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-xl p-3 text-center transition-all ${
                  badge.unlocked
                    ? "bg-slate-900/50 border border-slate-800"
                    : "bg-slate-900/20 border border-slate-800/30 opacity-40"
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className={`text-[10px] ${badge.unlocked ? "text-slate-300" : "text-slate-600"}`}>{badge.name}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent species */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-white text-sm">Últimas especies</span>
            <button onClick={() => navigate("/collection")} className="text-emerald-400 text-xs flex items-center gap-1">
              Ver todo <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {discoveredSpecies.slice(0, 4).map((sp) => (
              <div key={sp.id} className="rounded-xl bg-slate-900/50 border border-slate-800 overflow-hidden">
                {sp.image ? (
                  <img src={sp.image} alt="" className="w-full h-24 object-cover" />
                ) : (
                  <div className="w-full h-24 bg-slate-800 flex items-center justify-center text-3xl opacity-20">🦟</div>
                )}
                <div className="p-2">
                  <p className="text-white text-xs truncate">{sp.commonName}</p>
                  <p className="text-slate-500 text-[10px] truncate">{sp.scientificName}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
