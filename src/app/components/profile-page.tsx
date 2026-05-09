import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useUser } from "./user-context";
import { LogOut, Zap, Flame, Bug, Trophy, ChevronRight, Mail, Lock, User, Loader2 } from "lucide-react";
import { SPECIES_DATABASE } from "./species-database";

function AuthForm() {
  const { loginWithEmail, register } = useUser();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (code: string) => {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
        return "Correo o contraseña incorrectos";
      case "auth/user-not-found":
        return "No existe una cuenta con ese correo";
      case "auth/email-already-in-use":
        return "Ya existe una cuenta con ese correo";
      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres";
      case "auth/invalid-email":
        return "Correo electrónico inválido";
      default:
        return "Ocurrió un error. Intenta de nuevo";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === "register" && !name.trim()) {
      setError("Por favor ingresa tu nombre");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
      } else {
        await register(email, password, name.trim());
      }
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setError(null);
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <Bug className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-white mb-1">Dragonfly Scanner</h2>
          <p className="text-slate-400 text-sm">
            {mode === "login" ? "Inicia sesión para continuar" : "Crea tu cuenta de explorador"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 text-sm"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 text-sm"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="password"
              placeholder="Contraseña (mín. 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 text-sm"
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center px-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-medium transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button onClick={switchMode} className="text-emerald-400 hover:text-emerald-300 transition-colors">
            {mode === "login" ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export function ProfilePage() {
  const { user, logout, authLoading } = useUser();
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!user.isLoggedIn) {
    return <AuthForm />;
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
          <button
            onClick={() => logout()}
            className="absolute top-3 right-3 p-2 rounded-lg bg-slate-900/50 text-slate-400 hover:text-white transition-colors"
          >
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
            { icon: Zap, label: "XP Total", value: (user.level * 1000 + user.xp).toLocaleString() },
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
            <span className="text-slate-500 text-xs">
              {user.xp} / {user.xpToNextLevel} XP
            </span>
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
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-white text-sm">
              Logros ({unlockedBadges.length}/{user.badges.length})
            </span>
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
        {discoveredSpecies.length > 0 && (
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
        )}
      </div>
    </div>
  );
}
