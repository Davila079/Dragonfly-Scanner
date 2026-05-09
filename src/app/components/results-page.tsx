import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Ruler,
  Clock,
  Shield,
  Utensils,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Share2,
  BookOpen,
} from "lucide-react";
import type { DragonflySpecies } from "./dragonfly-data";
import { HeatMap } from "./heat-map";
import { HabitatMap } from "./habitat-map";

interface ResultsPageProps {
  species: DragonflySpecies;
  scannedImage: string;
  onScanAgain: () => void;
}

export function ResultsPage({
  species,
  scannedImage,
  onScanAgain,
}: ResultsPageProps) {
  const [showFullReasoning, setShowFullReasoning] = useState(false);
  const [activeTab, setActiveTab] = useState<"heatmap" | "facts" | "habitat">(
    "heatmap"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onScanAgain}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Scan Again</span>
          </button>
          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Match Found</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Species Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden bg-slate-900/50 border border-slate-800"
        >
          {/* Hero image */}
          <div className="relative h-56 sm:h-72">
            <img
              src={scannedImage}
              alt={species.commonName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl text-white mb-1">
                    {species.commonName}
                  </h1>
                  <p className="text-emerald-400 italic text-sm">
                    {species.scientificName}
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    {species.family}
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-sm">
                      {species.confidence}%
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">AI Confidence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-6">
            <p className="text-slate-300 text-sm">{species.description}</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                {
                  icon: Ruler,
                  label: "Wingspan",
                  value: species.wingspan,
                },
                {
                  icon: Ruler,
                  label: "Body Length",
                  value: species.bodyLength,
                },
                {
                  icon: Clock,
                  label: "Lifespan",
                  value: species.lifespan,
                },
                {
                  icon: Shield,
                  label: "Conservation",
                  value: species.conservation,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <stat.icon className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-400 text-xs">{stat.label}</span>
                  </div>
                  <p className="text-white text-xs">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* AI Reasoning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white">Why This Species?</h3>
          </div>
          <p className="text-slate-300 text-sm">
            {showFullReasoning
              ? species.identificationReasoning
              : species.identificationReasoning.slice(0, 200) + "..."}
          </p>
          <button
            onClick={() => setShowFullReasoning(!showFullReasoning)}
            className="flex items-center gap-1 mt-2 text-emerald-400 text-sm hover:text-emerald-300 transition-colors"
          >
            {showFullReasoning ? (
              <>
                Show less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Read full analysis <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl border border-slate-800 mb-6">
            {(
              [
                { key: "heatmap", label: "Heat Map" },
                { key: "facts", label: "Fun Facts" },
                { key: "habitat", label: "Habitat" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-white border border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6">
            {activeTab === "heatmap" && (
              <HeatMap
                imageUrl={scannedImage}
                features={species.heatMapFeatures}
              />
            )}

            {activeTab === "facts" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-white">
                    Interesting Facts
                  </h3>
                </div>
                <div className="space-y-3">
                  {species.facts.map((fact, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-emerald-400 text-xs">
                          {i + 1}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">{fact}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Diet */}
                <div className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Utensils className="w-4 h-4 text-emerald-400" />
                    <span className="text-white text-sm">Diet</span>
                  </div>
                  <p className="text-slate-300 text-sm">{species.diet}</p>
                </div>
              </div>
            )}

            {activeTab === "habitat" && (
              <HabitatMap habitat={species.habitat} />
            )}
          </div>
        </motion.div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 pb-8"
        >
          <button
            onClick={onScanAgain}
            className="flex-1 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center justify-center gap-2"
          >
            Scan Another Dragonfly
          </button>
          <button className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center justify-center">
            <Share2 className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
