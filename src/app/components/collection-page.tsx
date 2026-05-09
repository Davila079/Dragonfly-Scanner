import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, X, Star, Calendar, Lock } from "lucide-react";
import { useUser } from "./user-context";
import { SPECIES_DATABASE, RARITY_CONFIG, type SpeciesEntry } from "./species-database";
import { DRAGONFLY_SPECIES } from "./dragonfly-data";
import { HeatMap } from "./heat-map";
import { HabitatMap } from "./habitat-map";

type FilterType = "all" | "dragonfly" | "damselfly" | "region" | "rarity";

export function CollectionPage() {
  const { user } = useUser();
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesEntry | null>(null);
  const [search, setSearch] = useState("");

  const discovered = user.discoveredSpecies;
  const totalSpecies = SPECIES_DATABASE.length;
  const discoveredCount = SPECIES_DATABASE.filter((s) => discovered.includes(s.id)).length;
  const progress = (discoveredCount / totalSpecies) * 100;

  const filtered = SPECIES_DATABASE.filter((s) => {
    if (filter === "dragonfly") return s.type === "dragonfly";
    if (filter === "damselfly") return s.type === "damselfly";
    return true;
  }).filter((s) => {
    if (!search) return true;
    const isDiscovered = discovered.includes(s.id);
    if (!isDiscovered) return false;
    return s.commonName.toLowerCase().includes(search.toLowerCase()) ||
      s.scientificName.toLowerCase().includes(search.toLowerCase());
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "dragonfly", label: "Libélulas" },
    { key: "damselfly", label: "Caballitos" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      <AnimatePresence>
        {selectedSpecies && (
          <SpeciesDetail
            species={selectedSpecies}
            onClose={() => setSelectedSpecies(null)}
            isDiscovered={discovered.includes(selectedSpecies.id)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl text-white mb-1">OdonaDex</h1>
          <p className="text-slate-400 text-sm">Tu colección de odonatos</p>
        </motion.div>

        {/* Progress */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800"
        >
          {/* Circular progress */}
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#1e293b" strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="3"
                strokeDasharray={`${progress * 0.942} 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-emerald-400 text-xs">{Math.round(progress)}%</span>
            </div>
          </div>
          <div>
            <p className="text-white text-lg">{discoveredCount} / {totalSpecies}</p>
            <p className="text-slate-400 text-sm">especies descubiertas</p>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar especie..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                filter === f.key
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-slate-900/50 text-slate-400 border border-slate-800 hover:border-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
          {(["common", "uncommon", "rare", "epic", "legendary"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border ${RARITY_CONFIG[r].bg} ${RARITY_CONFIG[r].border} ${RARITY_CONFIG[r].text}`}
            >
              {RARITY_CONFIG[r].label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((species, i) => {
            const isDiscovered = discovered.includes(species.id);
            const rarityConf = RARITY_CONFIG[species.rarity];
            return (
              <motion.button
                key={species.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => isDiscovered && setSelectedSpecies(species)}
                className={`relative rounded-xl overflow-hidden border transition-all duration-200 text-left ${
                  isDiscovered
                    ? "border-slate-800 hover:border-emerald-500/40 bg-slate-900/50 cursor-pointer"
                    : "border-slate-800/50 bg-slate-900/30 cursor-default"
                }`}
              >
                {/* Image */}
                <div className={`aspect-square relative ${!isDiscovered ? "grayscale blur-[2px] opacity-40" : ""}`}>
                  {species.image ? (
                    <img src={species.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <span className="text-4xl opacity-20">🦟</span>
                    </div>
                  )}
                </div>
                {!isDiscovered && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-slate-500" />
                    </div>
                  </div>
                )}

                {/* Rarity badge */}
                <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] ${rarityConf.bg} ${rarityConf.border} ${rarityConf.text} border`}>
                  {species.rarity === "legendary" && <span className="animate-pulse">✨ </span>}
                  {rarityConf.label}
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <p className={`text-sm truncate ${isDiscovered ? "text-white" : "text-slate-600"}`}>
                    {isDiscovered ? species.commonName : "???"}
                  </p>
                  <p className={`text-xs truncate ${isDiscovered ? "text-slate-500" : "text-slate-700"}`}>
                    {isDiscovered ? species.scientificName : "Especie no descubierta"}
                  </p>
                  {isDiscovered && (
                    <div className="flex items-center gap-1 mt-1 text-slate-600 text-[10px]">
                      <Calendar className="w-3 h-3" />
                      <span>15 Mar 2026</span>
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SpeciesDetail({ species, onClose, isDiscovered }: { species: SpeciesEntry; onClose: () => void; isDiscovered: boolean }) {
  const fullData = DRAGONFLY_SPECIES.find((s) => s.id === species.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm p-4 flex items-center justify-between border-b border-slate-800 z-10">
          <h3 className="text-white">{species.commonName}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 space-y-4">
          {species.image && (
            <img src={species.image} alt={species.commonName} className="w-full h-48 object-cover rounded-xl" />
          )}
          <div>
            <p className="text-emerald-400 italic text-sm">{species.scientificName}</p>
            <p className="text-slate-400 text-sm">{species.family}</p>
            <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs ${RARITY_CONFIG[species.rarity].bg} ${RARITY_CONFIG[species.rarity].border} ${RARITY_CONFIG[species.rarity].text} border`}>
              {RARITY_CONFIG[species.rarity].label}
            </div>
          </div>

          {fullData && (
            <>
              <div>
                <p className="text-slate-400 text-sm mb-2">Datos curiosos</p>
                <div className="space-y-2">
                  {fullData.facts.slice(0, 3).map((fact, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="text-emerald-400 shrink-0">•</span>
                      <span className="text-slate-300">{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
              <HeatMap imageUrl={fullData.image} features={fullData.heatMapFeatures} />
              <HabitatMap habitat={fullData.habitat} />
            </>
          )}

          <button className="w-full py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm hover:bg-emerald-500/25 transition-colors">
            Compartir descubrimiento
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
