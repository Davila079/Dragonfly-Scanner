import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Scan, Brain, Dna, CheckCircle2 } from "lucide-react";

const SCAN_STAGES = [
  { icon: Scan, label: "Capturing image features...", duration: 1200 },
  { icon: Brain, label: "Running AI classification model...", duration: 1500 },
  { icon: Dna, label: "Matching morphological patterns...", duration: 1300 },
  { icon: CheckCircle2, label: "Species identified!", duration: 800 },
];

interface ScanningAnimationProps {
  imageUrl: string;
  onComplete: () => void;
}

export function ScanningAnimation({
  imageUrl,
  onComplete,
}: ScanningAnimationProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let totalElapsed = 0;
    const totalDuration = SCAN_STAGES.reduce((sum, s) => sum + s.duration, 0);

    const interval = setInterval(() => {
      totalElapsed += 50;
      const pct = Math.min((totalElapsed / totalDuration) * 100, 100);
      setProgress(pct);

      // Determine current stage
      let elapsed = 0;
      for (let i = 0; i < SCAN_STAGES.length; i++) {
        elapsed += SCAN_STAGES[i].duration;
        if (totalElapsed < elapsed) {
          setCurrentStage(i);
          break;
        }
        if (i === SCAN_STAGES.length - 1) {
          setCurrentStage(i);
        }
      }

      if (totalElapsed >= totalDuration) {
        clearInterval(interval);
        setTimeout(onComplete, 600);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  const StageIcon = SCAN_STAGES[currentStage].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        {/* Scanning Image */}
        <div className="relative rounded-2xl overflow-hidden mb-8 aspect-square max-w-xs mx-auto">
          <img
            src={imageUrl}
            alt="Scanning"
            className="w-full h-full object-cover"
          />
          {/* Scan overlay */}
          <div className="absolute inset-0 bg-emerald-500/5" />

          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
            style={{ boxShadow: "0 0 20px rgba(16,185,129,0.5)" }}
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />

          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br" />

          {/* Pulsing dots */}
          {[
            { top: "25%", left: "30%" },
            { top: "45%", left: "60%" },
            { top: "65%", left: "40%" },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-emerald-400"
              style={{ top: pos.top, left: pos.left }}
              animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0.3, 0.8] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />
          ))}
        </div>

        {/* Progress */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-emerald-400">
            <motion.div
              animate={{ rotate: currentStage < 3 ? 360 : 0 }}
              transition={{
                duration: 1.5,
                repeat: currentStage < 3 ? Infinity : 0,
                ease: "linear",
              }}
            >
              <StageIcon className="w-5 h-5" />
            </motion.div>
            <span className="text-sm">{SCAN_STAGES[currentStage].label}</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Stage indicators */}
          <div className="flex justify-between px-2">
            {SCAN_STAGES.map((stage, i) => (
              <div
                key={i}
                className={`flex items-center gap-1 text-xs transition-colors duration-300 ${
                  i <= currentStage ? "text-emerald-400" : "text-slate-600"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    i <= currentStage ? "bg-emerald-400" : "bg-slate-700"
                  }`}
                />
                <span className="hidden sm:inline">{stage.label.split("...")[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
