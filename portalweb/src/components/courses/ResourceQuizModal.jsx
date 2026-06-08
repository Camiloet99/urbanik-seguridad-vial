import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MODULE_QUIZZES, QUIZ_PASS_THRESHOLD } from "@/data/moduleQuizzes";
import { submitQuizResult } from "@/services/progressService";

function ProgressRing({ percent, size = 84, stroke = 10, color = "#00b5e2" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * (percent / 100);
  const id = `prg-${color.replace("#", "")}-${size}`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity={0.7} />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="rgba(29,71,137,.15)" strokeWidth={stroke}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={`url(#${id})`} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray .4s ease" }}
      />
    </svg>
  );
}

function QuestionCard({ index, question, selected, onChange }) {
  return (
    <div className="rounded-[18px] border border-[#1D4789]/20 bg-white p-5">
      <p className="text-[15px] font-medium text-[#1a1a1a] mb-4 leading-relaxed">
        <span className="text-[#1D4789] font-semibold mr-2">{index + 1}.</span>
        {question.text}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {question.options.map((opt, optIdx) => {
          const isSelected = selected === opt.id;
          const letter = ["A", "B", "C", "D"][optIdx] ?? opt.id.toUpperCase();
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={[
                "flex items-start gap-3 text-left rounded-xl px-4 py-3 text-sm transition ring-1",
                isSelected
                  ? "bg-[#1D4789]/15 ring-[#1D4789] text-[#1D4789] shadow-[0_4px_16px_rgba(29,71,137,0.22)]"
                  : "bg-[#F5F5F6] ring-[#1a1a1a]/15 text-[#1a1a1a]/75 hover:bg-[#EEEEEE] hover:ring-[#1D4789]/30",
              ].join(" ")}
            >
              <span
                className={[
                  "mt-0.5 flex-shrink-0 h-5 w-5 rounded-full border-2 grid place-items-center transition text-[11px] font-bold",
                  isSelected ? "border-[#1D4789] bg-[#1D4789] text-white" : "border-[#1a1a1a]/25 text-[#1a1a1a]/50",
                ].join(" ")}
              >
                {letter}
              </span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result overlay (shown after submission)
// ---------------------------------------------------------------------------

function ResultOverlay({ correct, total, onRetry, onClose, onFailed, onPassed, isPassing }) {
  const pct = Math.round((correct / total) * 100);
  const ringColor = isPassing ? "#34d399" : "#f87171";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex items-center justify-center bg-[#F5F5F6]/85 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.28 }}
        className="bg-[#EEEEEE] rounded-[28px] border border-[#1D4789] p-8 max-w-sm w-full text-center shadow-2xl"
      >
        {/* Icon */}
        <div
          className={[
            "mx-auto w-20 h-20 rounded-full grid place-items-center text-4xl mb-5",
            isPassing
              ? "bg-emerald-400/15 text-emerald-400"
              : "bg-red-400/15 text-red-400",
          ].join(" ")}
        >
          {isPassing ? "🎉" : "😅"}
        </div>

        <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">
          {isPassing ? "¡Quiz superado!" : "No pasaste esta vez"}
        </h2>
        <p className="text-[#1a1a1a]/55 text-sm mb-6">
          {isPassing
            ? "Has demostrado que dominás el contenido del recurso."
            : `Necesitas al menos ${Math.round(QUIZ_PASS_THRESHOLD * 100)}% para pasar. ¡Repasa el documento e inténtalo de nuevo!`}
        </p>

        {/* Score ring */}
        <div className="flex items-center justify-center gap-6 mb-7">
          <div className="relative">
            <ProgressRing percent={pct} size={96} stroke={10} color={ringColor} />
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#1a1a1a]">
              {pct}%
            </span>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-[#1a1a1a]">
              {correct}/{total}
            </div>
            <div className="text-[#1a1a1a]/50 text-sm">respuestas correctas</div>
            <div
              className={[
                "mt-1 text-xs font-semibold",
                isPassing ? "text-emerald-400" : "text-red-400",
              ].join(" ")}
            >
              {isPassing ? "✓ APROBADO" : "✗ NO APROBADO"}
            </div>
          </div>
        </div>

        {isPassing ? (
          <button
            onClick={onPassed}
            className="w-full rounded-xl py-3 bg-emerald-500 hover:brightness-110 text-white font-semibold transition shadow-[0_8px_20px_rgba(52,211,153,0.30)]"
          >
            Continuar
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={onRetry}
              className="w-full rounded-xl py-3 bg-[#1D4789] hover:brightness-110 text-white font-semibold transition shadow-[0_8px_20px_rgba(29,71,137,0.30)]"
            >
              Reintentar quiz
            </button>
            <button
              onClick={onFailed}
              className="w-full rounded-xl py-3 bg-white hover:bg-[#F5F5F6] ring-1 ring-[#1D4789]/20 text-[#1a1a1a]/70 font-medium transition text-sm"
            >
              Volver al módulo
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Helpers for randomization and padding
// ---------------------------------------------------------------------------

const GENERIC_QUESTIONS = [
  {
    id: "gq_1",
    text: "La seguridad vial es un compromiso colectivo de todos los actores de la vía. (Verdadero / Falso)",
    options: [
      { id: "a", text: "Verdadero" },
      { id: "b", text: "Falso" }
    ],
    correct: "a"
  },
  {
    id: "gq_2",
    text: "¿Cuál es el límite máximo de velocidad permitido en zonas residenciales y escolares en Colombia?",
    options: [
      { id: "a", text: "30 km/h" },
      { id: "b", text: "50 km/h" },
      { id: "c", text: "60 km/h" },
      { id: "d", text: "80 km/h" }
    ],
    correct: "a"
  },
  {
    id: "gq_3",
    text: "El peatón siempre tiene la prelación en la vía en zonas urbanas y pasos peatonales. (Verdadero / Falso)",
    options: [
      { id: "a", text: "Verdadero" },
      { id: "b", text: "Falso" }
    ],
    correct: "a"
  },
  {
    id: "gq_4",
    text: "¿Qué elemento de protección es obligatorio y vital para los motociclistas?",
    options: [
      { id: "a", text: "Casco reglamentario debidamente abrochado" },
      { id: "b", text: "Guantes de cuero únicamente" },
      { id: "c", text: "Chaqueta impermeable" },
      { id: "d", text: "Ninguno de los anteriores" }
    ],
    correct: "a"
  },
  {
    id: "gq_5",
    text: "Conducir bajo el efecto del alcohol aumenta significativamente la probabilidad de un siniestro vial. (Verdadero / Falso)",
    options: [
      { id: "a", text: "Verdadero" },
      { id: "b", text: "Falso" }
    ],
    correct: "a"
  },
  {
    id: "gq_6",
    text: "¿Qué luz del semáforo nos indica que debemos detenernos por completo?",
    options: [
      { id: "a", text: "Luz roja" },
      { id: "b", text: "Luz amarilla" },
      { id: "c", text: "Luz verde" },
      { id: "d", text: "Luz intermitente" }
    ],
    correct: "a"
  },
  {
    id: "gq_7",
    text: "Las señales de tránsito de color rojo con bordes blancos son de tipo:",
    options: [
      { id: "a", text: "Reglamentarias o prohibitivas" },
      { id: "b", text: "Informativas" },
      { id: "c", text: "Preventivas" },
      { id: "d", text: "Transitorias" }
    ],
    correct: "a"
  },
  {
    id: "gq_8",
    text: "El uso del cinturón de seguridad es obligatorio para todos los ocupantes del vehículo. (Verdadero / Falso)",
    options: [
      { id: "a", text: "Verdadero" },
      { id: "b", text: "Falso" }
    ],
    correct: "a"
  },
  {
    id: "gq_9",
    text: "¿Cuál es la distancia mínima recomendada de seguridad que se debe mantener con el vehículo de adelante?",
    options: [
      { id: "a", text: "La regla de los 3 segundos" },
      { id: "b", text: "1 metro" },
      { id: "c", text: "El largo de un carro" },
      { id: "d", text: "No hay distancia mínima obligatoria" }
    ],
    correct: "a"
  },
  {
    id: "gq_10",
    text: "En caso de lluvia o niebla, se debe reducir la velocidad y encender las luces para mejorar la visibilidad. (Verdadero / Falso)",
    options: [
      { id: "a", text: "Verdadero" },
      { id: "b", text: "Falso" }
    ],
    correct: "a"
  },
  {
    id: "gq_11",
    text: "¿Qué significan las señales de tránsito preventivas (de color amarillo)?",
    options: [
      { id: "a", text: "Advierten sobre un peligro o condición especial en la vía" },
      { id: "b", text: "Indican una prohibición obligatoria" },
      { id: "c", text: "Brindan información turística o de servicios" },
      { id: "d", text: "Ninguna de las anteriores" }
    ],
    correct: "a"
  },
  {
    id: "gq_12",
    text: "Utilizar el teléfono celular mientras se conduce distrae la atención y multiplica el riesgo de siniestro. (Verdadero / Falso)",
    options: [
      { id: "a", text: "Verdadero" },
      { id: "b", text: "Falso" }
    ],
    correct: "a"
  },
  {
    id: "gq_13",
    text: "¿Qué se debe hacer al aproximarse a un paso de cebra o cruce peatonal?",
    options: [
      { id: "a", text: "Disminuir la velocidad y ceder el paso si hay peatones cruzando" },
      { id: "b", text: "Aumentar la velocidad para pasar rápido" },
      { id: "c", text: "Tocar la bocina para advertir que pasará primero" },
      { id: "d", text: "Continuar a la misma velocidad sin detenerse" }
    ],
    correct: "a"
  },
  {
    id: "gq_14",
    text: "Los ciclistas deben transitar por la derecha de las vías o por las ciclorrutas destinadas para ellos. (Verdadero / Falso)",
    options: [
      { id: "a", text: "Verdadero" },
      { id: "b", text: "Falso" }
    ],
    correct: "a"
  },
  {
    id: "gq_15",
    text: "¿Cuál de los siguientes es considerado un elemento de seguridad activa de un vehículo?",
    options: [
      { id: "a", text: "Los frenos y llantas" },
      { id: "b", text: "El airbag o bolsa de aire" },
      { id: "c", text: "El cinturón de seguridad" },
      { id: "d", text: "El chasis deformable" }
    ],
    correct: "a"
  },
  {
    id: "gq_16",
    text: "En una glorieta o rotonda, tiene la prelación el vehículo que ya se encuentra circulando dentro de ella. (Verdadero / Falso)",
    options: [
      { id: "a", text: "Verdadero" },
      { id: "b", text: "Falso" }
    ],
    correct: "a"
  },
  {
    id: "gq_17",
    text: "¿Qué significan las líneas amarillas dobles y continuas pintadas en la mitad de la calzada?",
    options: [
      { id: "a", text: "Prohíben el adelantamiento en ambos sentidos" },
      { id: "b", text: "Permiten el adelantamiento en ambos sentidos" },
      { id: "c", text: "Indican zona de estacionamiento permitido" },
      { id: "d", text: "Indican reducción de carril" }
    ],
    correct: "a"
  },
  {
    id: "gq_18",
    text: "El mantenimiento preventivo de frenos, llantas y dirección ayuda a prevenir siniestros viales por fallas mecánicas. (Verdadero / Falso)",
    options: [
      { id: "a", text: "Verdadero" },
      { id: "b", text: "Falso" }
    ],
    correct: "a"
  },
  {
    id: "gq_19",
    text: "¿Qué actor vial tiene la mayor vulnerabilidad física ante un siniestro de tránsito?",
    options: [
      { id: "a", text: "El peatón" },
      { id: "b", text: "El conductor del automóvil" },
      { id: "c", text: "El pasajero del bus" },
      { id: "d", text: "El conductor del camión" }
    ],
    correct: "a"
  },
  {
    id: "gq_20",
    text: "Es obligatorio el uso de luces direccionales antes de realizar cualquier giro o cambio de carril. (Verdadero / Falso)",
    options: [
      { id: "a", text: "Verdadero" },
      { id: "b", text: "Falso" }
    ],
    correct: "a"
  }
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRandomGenericQuestions(count, existingTexts = []) {
  const normalizedExisting = existingTexts.map(t => t.trim().toLowerCase());
  const filtered = GENERIC_QUESTIONS.filter(g => !normalizedExisting.includes(g.text.trim().toLowerCase()));
  const shuffled = shuffleArray(filtered.length > 0 ? filtered : GENERIC_QUESTIONS);
  return shuffled.slice(0, count);
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ResourceQuizModal({
  modulo,
  quizNum,
  resourceLabel,
  onClose,
  onPassed,
  onFailed,
}) {
  const quizData = MODULE_QUIZZES[modulo]?.[quizNum];
  const title = quizData?.title ?? `Quiz — Recurso ${quizNum}`;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { correct, total, isPassing }

  const initializeQuiz = useCallback(() => {
    if (!quizData) {
      setQuestions([]);
      setAnswers({});
      setResult(null);
      return;
    }

    let rawQuestions = quizData.questions ?? [];
    
    // If we have fewer than 20 questions, pad it to 20 with generic random questions
    if (rawQuestions.length < 20) {
      const needed = 20 - rawQuestions.length;
      const extra = getRandomGenericQuestions(needed, rawQuestions.map(q => q.text));
      rawQuestions = [...rawQuestions, ...extra];
    }

    // Now shuffle the 20 questions and pick the first 10
    const shuffled = shuffleArray(rawQuestions);
    const selected = shuffled.slice(0, 10);

    setQuestions(selected);
    setAnswers({});
    setResult(null);
  }, [quizData]);

  useEffect(() => {
    initializeQuiz();
  }, [initializeQuiz]);

  const answered = Object.keys(answers).length;
  const total = questions.length;
  const isComplete = answered === total && total > 0;
  const progressPct = total > 0 ? Math.round((answered / total) * 100) : 0;

  const handleAnswer = useCallback((qIndex, optId) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optId }));
  }, []);

  const handleRetry = useCallback(() => {
    initializeQuiz();
  }, [initializeQuiz]);

  const handleSubmit = async () => {
    if (!isComplete || submitting) return;
    setSubmitting(true);

    const correct = questions.reduce((acc, q, i) => {
      return acc + (answers[i] === q.correct ? 1 : 0);
    }, 0);

    const isPassing = correct / total >= QUIZ_PASS_THRESHOLD;

    try {
      await submitQuizResult(modulo, quizNum, isPassing);
    } catch (err) {
      console.warn("[ResourceQuizModal] backend sync failed:", err);
    }

    setSubmitting(false);
    setResult({ correct, total, isPassing });
    // onPassed is called by the user clicking "Continuar" in the result overlay,
    // NOT here — so the overlay has time to display the score.
  };

  // Scroll to top when retrying
  const scrollRef = useMemo(() => ({ current: null }), []);

  if (!quizData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-[#EEEEEE] rounded-2xl p-8 text-[#1a1a1a] text-center max-w-sm w-full border border-[#1D4789]">
          <p className="mb-4 text-[#1a1a1a]/70">Quiz no disponible para este recurso.</p>
          <button
            onClick={onClose}
            className="rounded-xl bg-[#1D4789] hover:brightness-110 text-white font-semibold px-6 py-2 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F5F5F6] overflow-hidden">
      {/* ── Header ── */}
      <div className="shrink-0 flex items-center justify-between gap-4 px-4 sm:px-8 py-4 border-b border-[#1D4789]/20 bg-[#EEEEEE]">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1D4789]/80 mb-0.5">
            Quiz de Recurso
          </p>
          <h1 className="text-base sm:text-lg font-bold text-[#1a1a1a] truncate">
            {title}
          </h1>
          <p className="text-xs text-[#1a1a1a]/45 truncate mt-0.5">{resourceLabel}</p>
        </div>

        {/* Progress indicator */}
        <div className="shrink-0 flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs text-[#1a1a1a]/45">Respondidas</span>
            <span className="text-sm font-bold text-[#1a1a1a]">
              {answered}/{total}
            </span>
          </div>
          <div className="relative">
            <ProgressRing percent={progressPct} size={48} stroke={5} color="#1D4789" />
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[#1a1a1a]">
              {progressPct}%
            </span>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 grid place-items-center rounded-full bg-[#1a1a1a]/5 hover:bg-[#1a1a1a]/10 ring-1 ring-[#1a1a1a]/15 text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4789]/40"
            aria-label="Cerrar quiz"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Body: questions list ── */}
      <div
        ref={(el) => { scrollRef.current = el; }}
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-6"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence mode="wait">
            {questions.map((q, i) => (
              <motion.div
                key={`${quizNum}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.025, duration: 0.22 }}
              >
                <QuestionCard
                  index={i}
                  question={q}
                  selected={answers[i]}
                  onChange={(optId) => handleAnswer(i, optId)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Footer: submit button ── */}
      <div className="shrink-0 px-4 sm:px-8 py-4 border-t border-[#1D4789]/20 bg-[#EEEEEE]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <p className="text-sm text-[#1a1a1a]/55">
            {isComplete
              ? "¡Todas las preguntas respondidas! Puedes enviar."
              : `Faltan ${total - answered} pregunta${total - answered !== 1 ? "s" : ""} por responder.`}
          </p>
          <button
            disabled={!isComplete || submitting}
            onClick={handleSubmit}
            className={[
              "shrink-0 rounded-xl px-6 py-2.5 font-semibold text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4789]",
              isComplete && !submitting
                ? "bg-[#1D4789] hover:brightness-110 text-white shadow-[0_6px_18px_rgba(29,71,137,0.30)] cursor-pointer"
                : "bg-[#1a1a1a]/8 text-[#1a1a1a]/30 cursor-not-allowed ring-1 ring-[#1a1a1a]/10",
            ].join(" ")}
          >
            {submitting ? "Enviando…" : "Enviar respuestas"}
          </button>
        </div>
      </div>

      {/* ── Result overlay ── */}
      <AnimatePresence>
        {result && (
          <ResultOverlay
            correct={result.correct}
            total={result.total}
            isPassing={result.isPassing}
            onRetry={() => {
              handleRetry();
              scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onClose={onClose}
            onPassed={() => { onPassed?.(); onClose?.(); }}
            onFailed={() => { onFailed?.(); onClose?.(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}