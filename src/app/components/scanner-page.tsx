import { useState, useCallback, useRef, useEffect } from "react";
import { Camera, Upload, Bug, ChevronRight, Sparkles, X, RotateCcw, ImageIcon } from "lucide-react";
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
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureInputRef = useRef<HTMLInputElement>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const openCamera = useCallback(
    async (facing: "environment" | "user" = "environment") => {
      setCameraReady(false);
      stopStream();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraOpen(true);
      } catch {
        // Fallback for mobile or denied permissions: use native capture
        captureInputRef.current?.click();
      }
    },
    [stopStream]
  );

  const closeCamera = useCallback(() => {
    stopStream();
    setCameraOpen(false);
    setCameraReady(false);
  }, [stopStream]);

  // Cleanup stream on unmount
  useEffect(() => () => stopStream(), [stopStream]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const imageUrl = canvas.toDataURL("image/jpeg", 0.92);
    closeCamera();
    const speciesId = Math.random() > 0.5 ? "blue-dasher" : "flame-skimmer";
    setTimeout(() => onScan(speciesId, imageUrl), 300);
  }, [onScan, closeCamera]);

  const switchCamera = useCallback(() => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    openCamera(next);
  }, [facingMode, openCamera]);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      const speciesId = Math.random() > 0.5 ? "blue-dasher" : "flame-skimmer";
      setTimeout(() => onScan(speciesId, url), 500);
    },
    [onScan]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFile(e.target.files?.[0]);
      e.target.value = "";
    },
    [handleFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  return (
    <>
      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
      {/* capture="environment" opens native camera on mobile as fallback */}
      <input ref={captureInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileInput} />

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ── Camera modal ── */}
      <AnimatePresence>
        {cameraOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-gradient-to-b from-black/70 to-transparent absolute top-0 left-0 right-0 z-10">
              <button
                onClick={closeCamera}
                className="p-2.5 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-white/80 text-sm">Capturar libélula</span>
              <button
                onClick={switchCamera}
                className="p-2.5 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
                title="Cambiar cámara"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Video stream */}
            <div className="flex-1 relative overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onCanPlay={() => setCameraReady(true)}
                className="w-full h-full object-cover"
              />

              {/* Loading overlay */}
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Viewfinder */}
              {cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-64 h-64">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-emerald-400 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-emerald-400 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-emerald-400 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-emerald-400 rounded-br-xl" />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom bar with capture button */}
            <div className="shrink-0 bg-gradient-to-t from-black/80 to-transparent py-8 flex items-center justify-center">
              <button
                onClick={capturePhoto}
                disabled={!cameraReady}
                className="w-18 h-18 rounded-full border-4 border-white bg-white/10 hover:bg-white/20 disabled:opacity-40 transition-all active:scale-95 flex items-center justify-center"
                style={{ width: 72, height: 72 }}
              >
                <div className="w-14 h-14 rounded-full bg-white" style={{ width: 56, height: 56 }} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main page ── */}
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_70%)]" />
          <div className="relative max-w-5xl mx-auto px-4 pt-10 pb-6 sm:pt-16 sm:pb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-5">
                <Bug className="w-4 h-4" />
                <span className="text-sm">IA · Identificación de especies</span>
              </div>
              <h1 className="text-4xl sm:text-6xl text-white mb-3 tracking-tight">
                Dragonfly <span className="text-emerald-400">Scanner</span>
              </h1>
              <p className="text-slate-400 text-base max-w-xl mx-auto">
                Fotografía o sube una imagen de una libélula y la IA identificará la especie al instante.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 pb-8 space-y-6">
          {/* Primary action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Camera */}
            <button
              onClick={() => openCamera(facingMode)}
              className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all duration-300 p-6 flex flex-col items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center transition-all duration-300">
                <Camera className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-medium mb-0.5">Abrir cámara</p>
                <p className="text-slate-500 text-xs">Foto en tiempo real</p>
              </div>
            </button>

            {/* Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all duration-300 p-6 flex flex-col items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 group-hover:bg-cyan-500/20 border border-cyan-500/20 flex items-center justify-center transition-all duration-300">
                <Upload className="w-7 h-7 text-cyan-400" />
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-medium mb-0.5">Subir foto</p>
                <p className="text-slate-500 text-xs">JPG, PNG, WEBP</p>
              </div>
            </button>
          </motion.div>

          {/* Drag & drop zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 p-6 text-center cursor-pointer group ${
                dragOver
                  ? "border-emerald-400 bg-emerald-400/10"
                  : "border-slate-800 hover:border-slate-600 bg-slate-900/30 hover:bg-slate-900/50"
              }`}
            >
              <div className="flex items-center justify-center gap-3 text-slate-500 group-hover:text-slate-400 transition-colors">
                <ImageIcon className="w-5 h-5 shrink-0" />
                <p className="text-sm">
                  {dragOver ? "Suelta la imagen aquí" : "O arrastra una foto aquí"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sample images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <p className="text-slate-400 text-sm">O prueba con una foto de ejemplo</p>
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
                      <p className="text-slate-400 text-xs">Toca para escanear</p>
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
    </>
  );
}
