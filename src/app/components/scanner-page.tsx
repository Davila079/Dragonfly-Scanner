import { useState, useCallback } from "react";
import { Camera, Upload, Bug, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const SAMPLE_IMAGES = [
  {
    id: "blue-dasher",
    url: "https://images.unsplash.com/photo-1698429563719-eae3a1b71857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFnb25mbHklMjBibHVlJTIwcG9uZHxlbnwxfHx8fDE3NzMzODYwMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    label: "Blue Dragonfly",
  },
  {
    id: "flame-skimmer",
    url: "https://images.unsplash.com/photo-1668685837491-2fe9ebf196bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFnb25mbHklMjByZWQlMjBwZXJjaGVkfGVufDF8fHx8MTc3MzM4NjAyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    label: "Red Dragonfly",
  },
];

interface ScannerPageProps {
  onScan: (speciesId: string, imageUrl: string) => void;
}

export function ScannerPage({ onScan }: ScannerPageProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setUploadedImage(url);
        // Randomly assign a species for uploaded images
        const speciesId = Math.random() > 0.5 ? "blue-dasher" : "flame-skimmer";
        setTimeout(() => onScan(speciesId, url), 500);
      }
    },
    [onScan]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setUploadedImage(url);
        const speciesId = Math.random() > 0.5 ? "blue-dasher" : "flame-skimmer";
        setTimeout(() => onScan(speciesId, url), 500);
      }
    },
    [onScan]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_70%)]" />
        <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-8 sm:pt-20 sm:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
              <Bug className="w-4 h-4" />
              <span className="text-sm">AI-Powered Identification</span>
            </div>
            <h1 className="text-4xl sm:text-6xl text-white mb-4 tracking-tight">
              Dragonfly <span className="text-emerald-400">Scanner</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Upload a photo of any dragonfly and our AI will identify the
              species, highlight key features, and share fascinating facts about
              your find.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center cursor-pointer group ${
              dragOver
                ? "border-emerald-400 bg-emerald-400/10"
                : "border-slate-700 hover:border-emerald-500/50 bg-slate-900/50 hover:bg-slate-900/80"
            }`}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
            <div className="flex flex-col items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  dragOver
                    ? "bg-emerald-400/20"
                    : "bg-slate-800 group-hover:bg-emerald-500/10"
                }`}
              >
                <Upload
                  className={`w-7 h-7 transition-colors ${
                    dragOver ? "text-emerald-400" : "text-slate-500 group-hover:text-emerald-400"
                  }`}
                />
              </div>
              <div>
                <p className="text-white mb-1">
                  Drop your dragonfly photo here
                </p>
                <p className="text-slate-500 text-sm">
                  or click to browse — supports JPG, PNG, WEBP
                </p>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Camera className="w-4 h-4" />
                <span>Tip: Close-up shots work best for accurate identification</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sample Images */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <p className="text-slate-400 text-sm">Or try a sample image</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SAMPLE_IMAGES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onScan(sample.id, sample.url)}
                className="group relative rounded-xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 aspect-[16/10]"
              >
                <ImageWithFallback
                  src={sample.url}
                  alt={sample.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-white text-sm">{sample.label}</p>
                    <p className="text-slate-400 text-xs">Click to scan</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/40 transition-colors">
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
