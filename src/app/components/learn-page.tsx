import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "./user-context";
import {
  Search, Microscope, BookOpen, ChevronRight, Star, Zap, Check, X,
  ArrowLeft, ArrowRight, Eye, HelpCircle, Trophy,
} from "lucide-react";

// ============ QUIZ GAME DATA ============
const QUIZ_CHALLENGES = [
  {
    id: "sympetrum",
    image: "https://images.unsplash.com/photo-1618341925859-56aec690f3a2?w=600",
    difficulty: "Medio",
    questions: [
      { text: "¿De qué color es el abdomen?", options: ["Rojo-anaranjado", "Azul", "Verde", "Negro"], correct: 0 },
      { text: "¿Cómo son las alas?", options: ["Transparentes con venas rojas", "Completamente oscuras", "Con manchas azules", "Con bandas negras"], correct: 0 },
      { text: "¿Qué forma tiene el tórax?", options: ["Robusto y ancho", "Largo y delgado", "Aplanado", "Cilíndrico"], correct: 0 },
      { text: "¿Dónde suele posarse?", options: ["En puntas de ramas", "Sobre el agua", "En hojas grandes", "En rocas"], correct: 0 },
    ],
    answers: [
      { name: "Sympetrum striolatum", scientific: "Common Darter", correct: true },
      { name: "Libellula depressa", scientific: "Broad-bodied Chaser", correct: false },
      { name: "Crocothemis erythraea", scientific: "Scarlet Skimmer", correct: false },
      { name: "Orthetrum cancellatum", scientific: "Black-tailed Skimmer", correct: false },
    ],
  },
];

// ============ ACADEMY DATA ============
const ACADEMY_MODULES = [
  { id: "anatomy", icon: "🦟", title: "Anatomía básica", progress: 3, total: 5, xp: 200 },
  { id: "lifecycle", icon: "💧", title: "Ciclo de vida", progress: 0, total: 4, xp: 180 },
  { id: "habitats", icon: "🌍", title: "Hábitats del mundo", progress: 0, total: 6, xp: 250 },
  { id: "coloration", icon: "🎨", title: "Coloración y camuflaje", progress: 0, total: 4, xp: 200 },
  { id: "subfamilies", icon: "🔬", title: "Identificar subfamilias", progress: 0, total: 5, xp: 300 },
];

const ANATOMY_LESSONS = [
  {
    type: "flashcard" as const,
    image: "https://images.unsplash.com/photo-1618341925859-56aec690f3a2?w=600",
    concept: "Pterostigma",
    definition: "Mancha oscura cerca del borde delantero de cada ala. Funciona como contrapeso aerodinámico y ayuda a estabilizar el vuelo a baja velocidad.",
  },
  {
    type: "quiz" as const,
    question: "¿Cuántos pares de alas tiene una libélula?",
    options: ["1 par", "2 pares", "3 pares", "4 pares"],
    correct: 1,
    explanation: "Las libélulas tienen 2 pares de alas (4 alas en total) que pueden mover de forma independiente.",
  },
  {
    type: "quiz" as const,
    question: "¿Qué estructura usan las libélulas para ver?",
    options: ["Antenas largas", "Ojos compuestos", "Bigotes sensoriales", "Palpos labiales"],
    correct: 1,
    explanation: "Sus enormes ojos compuestos contienen hasta 30,000 facetas individuales, proporcionando visión casi de 360°.",
  },
  {
    type: "flashcard" as const,
    image: "https://images.unsplash.com/photo-1703609402747-a0eceaeba876?w=600",
    concept: "Cercos",
    definition: "Apéndices al final del abdomen usados durante el apareamiento. Los machos los usan para sujetar a la hembra por la cabeza o el tórax.",
  },
  {
    type: "quiz" as const,
    question: "¿Qué diferencia a una libélula de un caballito del diablo?",
    options: [
      "Las libélulas son más pequeñas",
      "Los caballitos pliegan las alas al posarse",
      "Las libélulas no tienen alas",
      "Son la misma especie",
    ],
    correct: 1,
    explanation: "Los caballitos del diablo pliegan las alas sobre el cuerpo al posarse, mientras que las libélulas las mantienen extendidas horizontalmente.",
  },
];

export function LearnPage() {
  const [view, setView] = useState<"menu" | "quiz" | "academy">("menu");
  const [academyModule, setAcademyModule] = useState<string | null>(null);

  if (view === "quiz") return <QuizGame onBack={() => setView("menu")} />;
  if (view === "academy" && academyModule) return <AcademyLesson moduleId={academyModule} onBack={() => { setAcademyModule(null); setView("academy"); }} />;
  if (view === "academy") return <AcademyMenu onBack={() => setView("menu")} onSelectModule={(id) => setAcademyModule(id)} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl text-white mb-1">Aprender</h1>
          <p className="text-slate-400 text-sm">Domina la identificación de odonatos</p>
        </motion.div>

        {/* Two game modes */}
        <div className="space-y-4">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            onClick={() => setView("quiz")}
            className="w-full rounded-2xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-emerald-500/20 p-6 text-left hover:border-emerald-500/40 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/30 transition-colors">
                <Search className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-1">¿Qué especie es?</h3>
                <p className="text-slate-400 text-sm">Identifica especies respondiendo preguntas sobre características visibles. Inspirado en árboles de decisión.</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">+100 XP</span>
                  <span className="text-xs text-slate-500">por reto completado</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors mt-1" />
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => setView("academy")}
            className="w-full rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-6 text-left hover:border-purple-500/40 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/30 transition-colors">
                <BookOpen className="w-7 h-7 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-1">Academia Odonata</h3>
                <p className="text-slate-400 text-sm">Aprende anatomía, biología y curiosidades con flashcards y quizzes interactivos.</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">5 módulos</span>
                  <span className="text-xs text-slate-500">con lecciones variadas</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition-colors mt-1" />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ============ QUIZ GAME ============
function QuizGame({ onBack }: { onBack: () => void }) {
  const { addXp } = useUser();
  const challenge = QUIZ_CHALLENGES[0];
  const [step, setStep] = useState(0); // 0 = intro, 1-4 = questions, 5 = final answer, 6 = result
  const [answers, setAnswers] = useState<number[]>([]);
  const [finalAnswer, setFinalAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    setAnswers([...answers, optionIndex]);
    setTimeout(() => setStep(step + 1), 400);
  };

  const handleSkip = () => setStep(challenge.questions.length + 1);

  const handleFinalSubmit = () => {
    setShowResult(true);
    setStep(challenge.questions.length + 2);
    if (finalAnswer === 0) addXp(100, "Reto correcto");
    else addXp(25, "Intento");
  };

  // Intro
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
        <div className="max-w-lg mx-auto px-4 py-6">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <div className="rounded-2xl overflow-hidden border border-slate-800">
            <img src={challenge.image} alt="" className="w-full h-56 object-cover" />
            <div className="p-6 bg-slate-900/50">
              <h2 className="text-white text-xl mb-2">¿Puedes identificarla?</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">{challenge.difficulty}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">+100 XP</span>
              </div>
              <p className="text-slate-400 text-sm mb-6">Responde preguntas sobre las características que observas para identificar la especie.</p>
              <button onClick={() => setStep(1)} className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors">
                Comenzar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result
  if (step === challenge.questions.length + 2) {
    const isCorrect = finalAnswer === 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
        <div className="max-w-lg mx-auto px-4 py-6 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12">
            {isCorrect ? (
              <>
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, repeat: 2 }}>
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-emerald-400" />
                  </div>
                </motion.div>
                <h2 className="text-white text-xl mb-2">¡Correcto!</h2>
                <p className="text-emerald-400 italic mb-1">Sympetrum striolatum</p>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm mt-2"
                >
                  <Zap className="w-4 h-4" /> +100 XP
                </motion.div>
              </>
            ) : (
              <>
                <motion.div animate={{ x: [0, -10, 10, -10, 0] }} transition={{ duration: 0.4 }}>
                  <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <X className="w-10 h-10 text-red-400" />
                  </div>
                </motion.div>
                <h2 className="text-white text-xl mb-2">Casi...</h2>
                <p className="text-slate-400 text-sm mb-1">La respuesta correcta era</p>
                <p className="text-emerald-400 italic">Sympetrum striolatum</p>
                <p className="text-slate-500 text-sm mt-2">El color anaranjado del abdomen y las venas rojas en las alas son clave.</p>
              </>
            )}
            <div className="flex gap-3 mt-8">
              <button onClick={onBack} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors text-sm">
                Jugar de nuevo
              </button>
              <button onClick={onBack} className="flex-1 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm hover:bg-emerald-500/25 transition-colors">
                Agregar a OdonaDex
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Final answer selection
  if (step === challenge.questions.length + 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
        <div className="max-w-lg mx-auto px-4 py-6">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> Salir
          </button>
          <h2 className="text-white text-xl mb-2">¿Qué especie es?</h2>
          <p className="text-slate-400 text-sm mb-6">Selecciona la especie que crees que es:</p>
          <div className="space-y-3">
            {challenge.answers.map((answer, i) => (
              <button
                key={i}
                onClick={() => setFinalAnswer(i)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  finalAnswer === i
                    ? "bg-emerald-500/20 border-emerald-500/40 border"
                    : "bg-slate-900/50 border border-slate-800 hover:border-slate-700"
                }`}
              >
                <p className="text-white text-sm">{answer.name}</p>
                <p className="text-slate-500 text-xs">{answer.scientific}</p>
              </button>
            ))}
          </div>
          <button
            onClick={handleFinalSubmit}
            disabled={finalAnswer === null}
            className={`w-full mt-6 py-3 rounded-xl transition-colors ${
              finalAnswer !== null
                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            ¡Esta es!
          </button>
        </div>
      </div>
    );
  }

  // Questions
  const qIndex = step - 1;
  const q = challenge.questions[qIndex];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" /> Salir
        </button>

        {/* Progress */}
        <div className="flex gap-1 mb-6">
          {challenge.questions.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full ${i <= qIndex ? "bg-emerald-400" : "bg-slate-800"}`} />
          ))}
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-800 mb-6">
          <img src={challenge.image} alt="" className="w-full h-48 object-cover" />
        </div>

        <p className="text-slate-400 text-xs mb-1">Paso {step} de {challenge.questions.length}</p>
        <h3 className="text-white text-lg mb-4">{q.text}</h3>

        <div className="space-y-2">
          {q.options.map((option, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleAnswer(i)}
              className="w-full p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-left text-white text-sm hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all"
            >
              {option}
            </motion.button>
          ))}
        </div>

        {step >= 2 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleSkip}
            className="fixed bottom-24 md:bottom-8 right-4 px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 text-slate-400 text-sm hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4 inline mr-1" /> ¡Ya sé la respuesta!
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ============ ACADEMY ============
function AcademyMenu({ onBack, onSelectModule }: { onBack: () => void; onSelectModule: (id: string) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <div>
          <h2 className="text-white text-xl mb-1">Academia Odonata</h2>
          <p className="text-slate-400 text-sm">Aprende sobre el mundo de los odonatos</p>
        </div>

        {/* Featured module */}
        <div className="rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm">Módulo del día</span>
          </div>
          <p className="text-white text-sm mb-2">🦟 Anatomía básica</p>
          <button
            onClick={() => onSelectModule("anatomy")}
            className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm hover:bg-purple-500/30 transition-colors"
          >
            Continuar →
          </button>
        </div>

        {/* Module list */}
        <div className="space-y-3">
          {ACADEMY_MODULES.map((module, i) => (
            <motion.button
              key={module.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectModule(module.id)}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-left hover:border-slate-700 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl shrink-0">
                {module.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm">{module.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-purple-500" style={{ width: `${(module.progress / module.total) * 100}%` }} />
                  </div>
                  <span className="text-slate-500 text-xs">{module.progress}/{module.total}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-emerald-400">+{module.xp} XP</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AcademyLesson({ moduleId, onBack }: { moduleId: string; onBack: () => void }) {
  const { addXp } = useUser();
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const lessons = ANATOMY_LESSONS;
  const isComplete = step >= lessons.length;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-sm w-full text-center">
          <Trophy className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-white text-xl mb-2">¡Módulo completado!</h2>
          <p className="text-slate-400 text-sm mb-4">{correctCount} de {lessons.filter((l) => l.type === "quiz").length} respuestas correctas</p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 mb-6"
          >
            <Zap className="w-4 h-4" /> +200 XP ganados
          </motion.div>
          <div className="flex gap-3">
            <button onClick={onBack} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors text-sm">
              Ver módulos
            </button>
            <button onClick={onBack} className="flex-1 py-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 text-sm hover:bg-purple-500/25 transition-colors">
              Siguiente módulo
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const lesson = lessons[step];

  const handleQuizAnswer = (i: number) => {
    if (answered) return;
    setSelectedOption(i);
    setAnswered(true);
    if (lesson.type === "quiz" && i === lesson.correct) {
      setCorrectCount((c) => c + 1);
      addXp(30, "Respuesta correcta");
    }
  };

  const next = () => {
    setStep(step + 1);
    setSelectedOption(null);
    setAnswered(false);
    if (step === lessons.length - 1) addXp(200, "Módulo completado");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
            <ArrowLeft className="w-4 h-4" /> Salir
          </button>
          <span className="text-slate-500 text-sm">{step + 1} / {lessons.length}</span>
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-6">
          {lessons.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full ${i <= step ? "bg-purple-400" : "bg-slate-800"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {lesson.type === "flashcard" ? (
              <div className="space-y-4">
                <img src={lesson.image} alt="" className="w-full h-48 object-cover rounded-xl" />
                <div className="p-6 rounded-xl bg-slate-900/50 border border-purple-500/20 text-center">
                  <p className="text-purple-400 text-xs uppercase tracking-wider mb-2">Concepto</p>
                  <h3 className="text-white text-2xl mb-3">{lesson.concept}</h3>
                  <p className="text-slate-300 text-sm">{lesson.definition}</p>
                </div>
                <button onClick={next} className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white transition-colors">
                  Entendido →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 text-sm">Quiz</span>
                </div>
                <h3 className="text-white text-lg">{lesson.question}</h3>
                <div className="space-y-2">
                  {lesson.options.map((option, i) => {
                    let style = "bg-slate-900/50 border-slate-800 hover:border-slate-700";
                    if (answered) {
                      if (i === lesson.correct) style = "bg-emerald-500/15 border-emerald-500/40";
                      else if (i === selectedOption) style = "bg-red-500/15 border-red-500/40";
                    } else if (i === selectedOption) {
                      style = "bg-purple-500/15 border-purple-500/40";
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleQuizAnswer(i)}
                        className={`w-full p-3.5 rounded-xl border text-left text-sm transition-all ${style}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={answered && i === lesson.correct ? "text-emerald-400" : answered && i === selectedOption ? "text-red-400" : "text-white"}>
                            {option}
                          </span>
                          {answered && i === lesson.correct && <Check className="w-4 h-4 text-emerald-400" />}
                          {answered && i === selectedOption && i !== lesson.correct && <X className="w-4 h-4 text-red-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-slate-900/50 border border-slate-800"
                  >
                    <p className="text-slate-300 text-sm">{lesson.explanation}</p>
                  </motion.div>
                )}
                {answered && (
                  <button onClick={next} className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white transition-colors">
                    Siguiente →
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
