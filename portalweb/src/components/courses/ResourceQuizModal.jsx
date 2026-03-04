/**
 * ResourceQuizModal.jsx
 *
 * Full-screen quiz overlay for resource quizzes.
 *
 * Props:
 *   modulo        {number}   – Module number 1–6
 *   quizNum       {number}   – Quiz number 1–4 (matches pdf index)
 *   resourceLabel {string}   – Display name of the resource
 *   onClose       {function} – Called when the user closes without passing
 *   onPassed      {function} – Called after a successful submission to the backend
 */

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MODULE_QUIZZES, QUIZ_PASS_THRESHOLD } from "@/data/moduleQuizzes";
import { submitQuizResult } from "@/services/progressService";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

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
        fill="none" stroke="rgba(255,255,255,.10)" strokeWidth={stroke}
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
    <div className="rounded-[18px] ring-1 ring-white/10 bg-white/[0.04] p-5">
      <p className="text-[15px] font-medium text-white/90 mb-4 leading-relaxed">
        <span className="text-[#00b5e2] font-semibold mr-2">{index + 1}.</span>
        {question.text}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {question.options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={[
                "flex items-start gap-3 text-left rounded-xl px-4 py-3 text-sm transition ring-1",
                isSelected
                  ? "bg-[#00b5e2]/15 ring-[#00b5e2] text-white shadow-[0_4px_16px_rgba(0,181,226,0.22)]"
                  : "bg-white/[0.03] ring-white/10 text-white/75 hover:bg-white/[0.08] hover:ring-white/25",
              ].join(" ")}
            >
              <span
                className={[
                  "mt-0.5 flex-shrink-0 h-5 w-5 rounded-full border-2 grid place-items-center transition",
                  isSelected ? "border-[#00b5e2] bg-[#00b5e2]" : "border-white/30",
                ].join(" ")}
              >
                {isSelected && (
                  <svg viewBox="0 0 10 10" className="h-3 w-3" fill="none">
                    <path
                      d="M2 5l2.5 2.5L8 3"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
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

function ResultOverlay({ correct, total, onRetry, onClose, onFailed, isPassing }) {
  const pct = Math.round((correct / total) * 100);
  const ringColor = isPassing ? "#34d399" : "#f87171";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex items-center justify-center bg-[#0b1120]/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.28 }}
        className="bg-[#12171f] rounded-[28px] ring-1 ring-white/10 p-8 max-w-sm w-full text-center shadow-2xl"
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

        <h2 className="text-xl font-bold text-white mb-1">
          {isPassing ? "¡Quiz superado!" : "No pasaste esta vez"}
        </h2>
        <p className="text-white/55 text-sm mb-6">
          {isPassing
            ? "Has demostrado que dominás el contenido del recurso."
            : `Necesitas al menos ${Math.round(QUIZ_PASS_THRESHOLD * 100)}% para pasar. ¡Repasa el documento e inténtalo de nuevo!`}
        </p>

        {/* Score ring */}
        <div className="flex items-center justify-center gap-6 mb-7">
          <div className="relative">
            <ProgressRing percent={pct} size={96} stroke={10} color={ringColor} />
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
              {pct}%
            </span>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-white">
              {correct}/{total}
            </div>
            <div className="text-white/50 text-sm">respuestas correctas</div>
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
            onClick={onClose}
            className="w-full rounded-xl py-3 bg-emerald-500 hover:brightness-110 text-white font-semibold transition shadow-[0_8px_20px_rgba(52,211,153,0.30)]"
          >
            Continuar
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={onRetry}
              className="w-full rounded-xl py-3 bg-[#00b5e2] hover:brightness-110 text-white font-semibold transition shadow-[0_8px_20px_rgba(0,181,226,0.30)]"
            >
              Reintentar quiz
            </button>
            <button
              onClick={onFailed}
              className="w-full rounded-xl py-3 bg-white/6 hover:bg-white/10 ring-1 ring-white/12 text-white/70 font-medium transition text-sm"
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
  const questions = quizData?.questions ?? [];
  const title = quizData?.title ?? `Quiz — Recurso ${quizNum}`;

  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { correct, total, isPassing }

  const answered = Object.keys(answers).length;
  const total = questions.length;
  const isComplete = answered === total;
  const progressPct = total > 0 ? Math.round((answered / total) * 100) : 0;

  const handleAnswer = useCallback((qIndex, optId) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optId }));
  }, []);

  const handleRetry = useCallback(() => {
    setAnswers({});
    setResult(null);
  }, []);

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

    if (isPassing) {
      onPassed?.();
    }
  };

  // Scroll to top when retrying
  const scrollRef = useMemo(() => ({ current: null }), []);

  if (!quizData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-[#12171f] rounded-2xl p-8 text-white text-center max-w-sm w-full ring-1 ring-white/10">
          <p className="mb-4 text-white/70">Quiz no disponible para este recurso.</p>
          <button
            onClick={onClose}
            className="rounded-xl bg-[#00b5e2] hover:brightness-110 text-white font-semibold px-6 py-2 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b1120]/95 backdrop-blur-sm overflow-hidden">
      {/* ── Header ── */}
      <div className="shrink-0 flex items-center justify-between gap-4 px-4 sm:px-8 py-4 border-b border-white/8 bg-white/[0.02]">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00b5e2]/80 mb-0.5">
            Quiz de Recurso
          </p>
          <h1 className="text-base sm:text-lg font-bold text-white truncate">
            {title}
          </h1>
          <p className="text-xs text-white/45 truncate mt-0.5">{resourceLabel}</p>
        </div>

        {/* Progress indicator */}
        <div className="shrink-0 flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs text-white/45">Respondidas</span>
            <span className="text-sm font-bold text-white">
              {answered}/{total}
            </span>
          </div>
          <div className="relative">
            <ProgressRing percent={progressPct} size={48} stroke={5} />
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
              {progressPct}%
            </span>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 grid place-items-center rounded-full bg-white/6 hover:bg-white/12 ring-1 ring-white/10 text-white/60 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
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
      <div className="shrink-0 px-4 sm:px-8 py-4 border-t border-white/8 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <p className="text-sm text-white/45">
            {isComplete
              ? "¡Todas las preguntas respondidas! Puedes enviar."
              : `Faltan ${total - answered} pregunta${total - answered !== 1 ? "s" : ""} por responder.`}
          </p>
          <button
            disabled={!isComplete || submitting}
            onClick={handleSubmit}
            className={[
              "shrink-0 rounded-xl px-6 py-2.5 font-semibold text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00b5e2]",
              isComplete && !submitting
                ? "bg-[#00b5e2] hover:brightness-110 text-white shadow-[0_6px_18px_rgba(0,181,226,0.30)] cursor-pointer"
                : "bg-white/8 text-white/30 cursor-not-allowed ring-1 ring-white/10",
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
            onFailed={() => { onFailed?.(); onClose?.(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
