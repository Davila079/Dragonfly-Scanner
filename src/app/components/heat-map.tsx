import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Crosshair, Info, X } from "lucide-react";
import type { HeatMapFeature } from "./dragonfly-data";

interface HeatMapProps {
  imageUrl: string;
  features: HeatMapFeature[];
}

export function HeatMap({ imageUrl, features }: HeatMapProps) {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(true);

  const active = features.find((f) => f.id === activeFeature);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-emerald-400" />
          <h3 className="text-white">Identification Heat Map</h3>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs px-3 py-1 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
        >
          {showAll ? "Hide Overlays" : "Show Overlays"}
        </button>
      </div>

      <p className="text-slate-400 text-sm">
        Tap or hover on highlighted regions to see which features led to this
        identification.
      </p>

      {/* Heat Map Image */}
      <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
        <img
          src={imageUrl}
          alt="Dragonfly heat map"
          className="w-full aspect-[4/3] object-cover"
        />

        {/* Heat map overlays */}
        <AnimatePresence>
          {showAll &&
            features.map((feature, i) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.15 }}
                className="absolute cursor-pointer group"
                style={{
                  left: `${feature.x}%`,
                  top: `${feature.y}%`,
                  width: `${feature.width}%`,
                  height: `${feature.height}%`,
                }}
                onClick={() =>
                  setActiveFeature(
                    activeFeature === feature.id ? null : feature.id
                  )
                }
                onMouseEnter={() => setActiveFeature(feature.id)}
              >
                {/* Colored overlay */}
                <div
                  className="absolute inset-0 rounded-lg transition-opacity duration-200"
                  style={{
                    backgroundColor: feature.color,
                    opacity: activeFeature === feature.id ? 0.4 : 0.2,
                    boxShadow: `0 0 15px ${feature.color}40`,
                  }}
                />
                {/* Border */}
                <div
                  className="absolute inset-0 rounded-lg border-2 transition-opacity duration-200"
                  style={{
                    borderColor: feature.color,
                    opacity: activeFeature === feature.id ? 1 : 0.5,
                  }}
                />
                {/* Label */}
                <motion.div
                  className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-xs"
                  style={{
                    backgroundColor: feature.color,
                    color: "white",
                  }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{
                    opacity: activeFeature === feature.id ? 1 : 0,
                    y: activeFeature === feature.id ? 0 : 5,
                  }}
                >
                  {feature.label}
                </motion.div>
                {/* Pulse dot */}
                <motion.div
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: feature.color }}
                  animate={{
                    scale: [1, 1.6, 1],
                    opacity: [1, 0.4, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* Feature Details Panel */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: `${active.color}10`,
                borderColor: `${active.color}30`,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: active.color }}
                  />
                  <span className="text-white text-sm">{active.label}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {active.bodyPart}
                  </span>
                </div>
                <button
                  onClick={() => setActiveFeature(null)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-slate-300 text-sm mb-2">
                {active.description}
              </p>
              <div className="flex items-center gap-2">
                <div className="text-xs text-slate-400">
                  Feature confidence:
                </div>
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${active.confidence}%`,
                      backgroundColor: active.color,
                    }}
                  />
                </div>
                <span className="text-xs text-white">
                  {active.confidence}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature Legend */}
      <div className="grid grid-cols-2 gap-2">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() =>
              setActiveFeature(
                activeFeature === feature.id ? null : feature.id
              )
            }
            className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all duration-200 ${
              activeFeature === feature.id
                ? "bg-slate-800"
                : "bg-slate-900/50 hover:bg-slate-800/50"
            }`}
          >
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: feature.color }}
            />
            <div className="min-w-0">
              <p className="text-white text-xs truncate">{feature.label}</p>
              <p className="text-slate-500 text-xs">{feature.confidence}% match</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
