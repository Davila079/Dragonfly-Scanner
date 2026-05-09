import { motion, AnimatePresence } from "motion/react";
import { useUser } from "./user-context";
import { Zap, X, PartyPopper } from "lucide-react";

export function XpToastOverlay() {
  const { xpToasts } = useUser();

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {xpToasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-xl"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm">+{toast.amount} XP</span>
            {toast.label && <span className="text-slate-400 text-xs">{toast.label}</span>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function LevelUpModal() {
  const { user, showLevelUp, dismissLevelUp } = useUser();

  if (!showLevelUp) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={dismissLevelUp}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 max-w-sm w-full text-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_70%)]" />
        <div className="relative">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            <PartyPopper className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-white mb-1">¡Subiste de nivel!</h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-4">
            <span className="text-emerald-400 text-2xl">Nivel {user.level}</span>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            {user.level >= 10 ? "Maestro Entomólogo" : user.level >= 7 ? "Entomólogo Avanzado" : "Explorador de Odonatos"}
          </p>
          <button
            onClick={dismissLevelUp}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
          >
            ¡Genial!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
