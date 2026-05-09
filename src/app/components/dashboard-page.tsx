import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Flame, Zap, Target, Scan, UserPlus, ChevronRight, Camera, Upload, Sparkles } from "lucide-react";
import { useUser } from "./user-context";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useCallback } from "react";

export function DashboardPage() {
  const { user, login } = useUser();
  const navigate = useNavigate();
  const [dragOver, setDragOver] = useState(false);

  const handleScan = useCallback(() => {
    navigate("/scan/select");
  }, [navigate]);

  if (!user.isLoggedIn) {
    return <GuestDashboard onLogin={login} onScan={handleScan} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400">
              {user.avatar}
            </div>
            <div>
              <p className="text-slate-400 text-sm">Hola de nuevo,</p>
              <p className="text-white">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/25">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 text-sm">{user.streak}</span>
            </div>
          </div>
        </motion.div>

        {/* XP Bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-xl bg-slate-900/50 border border-slate-800 p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs">
                {user.level}
              </div>
              <span className="text-slate-400 text-sm">Nivel {user.level}</span>
            </div>
            <span className="text-slate-500 text-xs">{user.xp} / {user.xpToNextLevel} XP</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Zap className="w-3 h-3" />
              <span>Hoy: {user.dailyXp} / {user.dailyXpGoal} XP</span>
            </div>
            <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500/50" style={{ width: `${Math.min((user.dailyXp / user.dailyXpGoal) * 100, 100)}%` }} />
            </div>
          </div>
        </motion.div>

        {/* Daily Challenge */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <span className="text-white text-sm">Reto diario</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">+150 XP</span>
          </div>
          <p className="text-slate-300 text-sm mb-3">Escanea una libélula del género <span className="text-emerald-400">Libellula</span> hoy</p>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500/60 w-[30%]" />
          </div>
          <p className="text-slate-500 text-xs mt-1">0 / 1 completado</p>
        </motion.div>

        {/* CTA Scan Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={handleScan}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 flex items-center justify-center gap-3 hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Scan className="w-6 h-6" />
          <span className="text-lg">Escanear ahora</span>
        </motion.button>

        {/* Friend Activity */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-400 text-sm">Actividad de amigos</p>
            <button onClick={() => navigate("/community")} className="text-emerald-400 text-xs flex items-center gap-1">
              Ver todo <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {user.friends.slice(0, 3).map((friend, i) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs shrink-0">
                  {friend.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">
                    <span className="text-slate-400">{friend.name}</span> {friend.recentAction}
                  </p>
                </div>
                <span className="text-slate-600 text-xs shrink-0">{friend.recentTime}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function GuestDashboard({ onLogin, onScan }: { onLogin: () => void; onScan: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_70%)]" />
        <div className="relative max-w-2xl mx-auto px-4 pt-12 pb-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">IA para identificación</span>
            </div>
            <h1 className="text-4xl sm:text-5xl text-white mb-4 tracking-tight">
              Dragonfly <span className="text-emerald-400">Scanner</span>
            </h1>
            <p className="text-slate-400 max-w-lg mx-auto mb-8">
              Identifica libélulas con inteligencia artificial. Escanea, aprende y colecciona especies.
            </p>

            <motion.button
              onClick={onScan}
              className="w-full max-w-sm mx-auto py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 flex items-center justify-center gap-3 hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/20 mb-4"
            >
              <Camera className="w-6 h-6" />
              <span className="text-lg">Escanear libélula</span>
            </motion.button>

            <p className="text-slate-500 text-sm mb-6">Sin necesidad de registrarte</p>

            {/* Sign up invite */}
            <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-5 text-left max-w-sm mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <span className="text-white text-sm">¿Quieres más?</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                Regístrate para acceder a juegos, colección de especies, gamificación y comunidad.
              </p>
              <button
                onClick={onLogin}
                className="w-full py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm hover:bg-emerald-500/25 transition-colors"
              >
                Crear cuenta gratis
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
