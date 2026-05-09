import { motion } from "motion/react";
import { MapPin, Globe } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HabitatMapProps {
  habitat: {
    description: string;
    regions: string[];
    mapPoints: { lat: number; lng: number; label: string }[];
    image: string;
  };
}

// Simple world map SVG rendering with dots
function WorldMapSVG({
  points,
}: {
  points: { lat: number; lng: number; label: string }[];
}) {
  // Convert lat/lng to SVG coordinates (simple Mercator-like projection)
  const toSvg = (lat: number, lng: number) => ({
    x: ((lng + 180) / 360) * 800,
    y: ((90 - lat) / 180) * 400,
  });

  // Simplified continent outlines as paths
  return (
    <svg viewBox="0 0 800 400" className="w-full h-full">
      {/* Background */}
      <rect width="800" height="400" fill="#0f172a" rx="8" />

      {/* Grid lines */}
      {[...Array(7)].map((_, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={57 * i}
          x2="800"
          y2={57 * i}
          stroke="#1e293b"
          strokeWidth="0.5"
        />
      ))}
      {[...Array(9)].map((_, i) => (
        <line
          key={`v${i}`}
          x1={89 * i}
          y1="0"
          x2={89 * i}
          y2="400"
          stroke="#1e293b"
          strokeWidth="0.5"
        />
      ))}

      {/* Simplified continents */}
      {/* North America */}
      <ellipse cx="200" cy="140" rx="90" ry="60" fill="#1e293b" opacity="0.8" />
      {/* South America */}
      <ellipse cx="250" cy="270" rx="50" ry="70" fill="#1e293b" opacity="0.8" />
      {/* Europe */}
      <ellipse cx="430" cy="120" rx="40" ry="35" fill="#1e293b" opacity="0.8" />
      {/* Africa */}
      <ellipse cx="440" cy="220" rx="45" ry="65" fill="#1e293b" opacity="0.8" />
      {/* Asia */}
      <ellipse cx="560" cy="140" rx="90" ry="55" fill="#1e293b" opacity="0.8" />
      {/* Australia */}
      <ellipse cx="640" cy="290" rx="40" ry="25" fill="#1e293b" opacity="0.8" />

      {/* Habitat points */}
      {points.map((point, i) => {
        const pos = toSvg(point.lat, point.lng);
        return (
          <g key={i}>
            {/* Pulse ring */}
            <circle cx={pos.x} cy={pos.y} r="12" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.3">
              <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
            </circle>
            {/* Solid dot */}
            <circle cx={pos.x} cy={pos.y} r="4" fill="#10b981" />
            <circle cx={pos.x} cy={pos.y} r="2" fill="#34d399" />
            {/* Label */}
            <text
              x={pos.x + 8}
              y={pos.y - 8}
              fill="#94a3b8"
              fontSize="9"
              fontFamily="system-ui"
            >
              {point.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function HabitatMap({ habitat }: HabitatMapProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-emerald-400" />
        <h3 className="text-white">Habitat & Distribution</h3>
      </div>

      {/* Interactive Map */}
      <div className="rounded-xl overflow-hidden border border-slate-800">
        <WorldMapSVG points={habitat.mapPoints} />
      </div>

      {/* Habitat Description */}
      <p className="text-slate-300 text-sm">{habitat.description}</p>

      {/* Regions */}
      <div className="flex flex-wrap gap-2">
        {habitat.regions.map((region, i) => (
          <motion.span
            key={region}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs"
          >
            <MapPin className="w-3 h-3" />
            {region}
          </motion.span>
        ))}
      </div>

      {/* Habitat Photo */}
      <div className="rounded-xl overflow-hidden border border-slate-800">
        <ImageWithFallback
          src={habitat.image}
          alt="Typical habitat"
          className="w-full h-48 object-cover"
        />
        <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800">
          <p className="text-slate-400 text-xs">
            Typical habitat: freshwater marshes and pond edges with emergent vegetation
          </p>
        </div>
      </div>
    </div>
  );
}
