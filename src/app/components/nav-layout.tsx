import { type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import { Scan, BookOpen, Users, GraduationCap, User } from "lucide-react";
import { motion } from "motion/react";
import { XpToastOverlay, LevelUpModal } from "./xp-overlay";

const NAV_ITEMS = [
  { path: "/", icon: Scan, label: "Escanear" },
  { path: "/collection", icon: BookOpen, label: "Colección" },
  { path: "/community", icon: Users, label: "Comunidad" },
  { path: "/learn", icon: GraduationCap, label: "Aprender" },
  { path: "/profile", icon: User, label: "Perfil" },
];

export function NavLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col w-20 lg:w-56 bg-slate-900/50 border-r border-slate-800/50 p-4 shrink-0 sticky top-0 h-screen">
        <button
          onClick={() => navigate("/scan/select")}
          className="flex items-center gap-2 mb-8 px-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Scan className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-emerald-400 hidden lg:block text-sm">Dragonfly Scanner</span>
        </button>
        <div className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-slate-500 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="hidden lg:block text-sm">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="desktop-indicator"
                    className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0 overflow-auto">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/50">
        <div className="flex items-center justify-around px-2 py-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200 relative ${
                  active ? "text-emerald-400" : "text-slate-500"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="mobile-indicator"
                    className="absolute -top-1 w-6 h-0.5 rounded-full bg-emerald-400"
                  />
                )}
                <item.icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <XpToastOverlay />
      <LevelUpModal />
    </div>
  );
}
