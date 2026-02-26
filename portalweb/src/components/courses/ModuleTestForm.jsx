import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MODULE_TESTS, MODULO_TO_COURSE_KEY } from "@/data/moduleTests";
import { submitInitialTest, submitExitTest } from "@/services/testsService";

function ProgressRing({ percent, size = 84, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * (percent / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="prg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00b5e2" />
          <stop offset="100%" stopColor="#5944F9" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="url(#prg)" strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray .35s ease" }}
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
                    <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

function ResultModal({ result, onContinue }) {
  const pct = Math.round((result.correct / result.total) * 100);
  const passed = pct >= 60;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.3 }}
        className="bg-[#1a1d24] rounded-[28px] ring-1 ring-white/10 p-8 max-w-sm w-full text-center shadow-2xl"
      >
        {/* Icon */}
        <div
          className={[
            "mx-auto w-20 h-20 rounded-full grid place-items-center text-4xl mb-5",
            passed ? "bg-[#00b5e2]/15 text-[#00b5e2]" : "bg-amber-500/15 text-amber-400",
          ].join(" ")}
        >
          {passed ? "🎉" : "📚"}
        </div>

        <h2 className="text-xl font-bold text-white mb-1">
          {passed ? "¡Muy bien!" : "Sigue practicando"}
        </h2>
        <p className="text-white/60 text-sm mb-6">
          {passed
            ? "Has completado el test exitosamente."
            : "No te preocupes, repasa el contenido del módulo."}
        </p>

        {/* Score ring */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="relative">
            <ProgressRing percent={pct} size={96} stroke={10} />
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
              {pct}%
            </span>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-white">
              {result.correct}/{result.total}
            </div>
            <div className="text-white/60 text-sm">respuestas correctas</div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full rounded-xl py-3 bg-[#00b5e2] hover:brightness-110 text-white font-semibold transition shadow-[0_8px_20px_rgba(0,181,226,0.30)]"
        >
          {passed ? "Continuar" : "Volver al módulo"}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function ModuleTestForm({ type }) {
  const { modulo } = useParams();
  const moduloNum = parseInt(modulo) || 1;
  const navigate = useNavigate();

  const isInitial = type === "test-inicial";
  const moduleData = MODULE_TESTS[moduloNum];
  const questions = moduleData?.[isInitial ? "initial" : "exit"] ?? [];

  const [answers, setAnswers] = useState({});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const answered = Object.keys(answers).length;
  const total = questions.length;
  const isComplete = answered === total;
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

  const handleAnswer = (qIndex, optId) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optId }));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    if (!isComplete) {
      setError(`Faltan ${total - answered} pregunta(s) por responder.`);
      return;
    }

    const correct = questions.filter((q, i) => answers[i] === q.correct).length;
    const score = Math.round((correct / total) * 100);

    setSending(true);
    setError("");
    try {
      const payload = {
        answers: Object.fromEntries(
          Object.entries(answers).map(([i, v]) => [questions[i].id, v])
        ),
        score,
        submittedAt: new Date().toISOString(),
      };
      if (isInitial) {
        await submitInitialTest(moduloNum, payload);
      } else {
        await submitExitTest(moduloNum, payload);
      }
      setResult({ correct, total, score });
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el test. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  const handleContinue = () => {
    const courseKey = MODULO_TO_COURSE_KEY[moduloNum];
    if (courseKey) {
      navigate(`/courses/${courseKey}`, { replace: true });
    } else {
      navigate("/courses", { replace: true });
    }
  };

  if (!moduleData || questions.length === 0) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-white/60">
        No hay preguntas disponibles para este módulo.
      </div>
    );
  }

  const typeLabel = isInitial ? "Test Inicial" : "Test Final";
  const typeColor = isInitial ? "#00b5e2" : "#5944F9";

  return (
    <div className="min-h-[calc(80vh-80px)] pb-24">
      <div className="mb-6">
        <span
          className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-2"
          style={{ background: `${typeColor}22`, color: typeColor }}
        >
          Módulo {moduloNum} · {typeLabel}
        </span>
        <h1 className="text-2xl font-bold text-white leading-tight">
          {moduleData.title}
        </h1>
        <p className="text-white/55 text-sm mt-1">
          {isInitial
            ? "Responde las siguientes preguntas para evaluar tus conocimientos previos."
            : "Demuestra lo que aprendiste en este módulo respondiendo las siguientes preguntas."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              index={i}
              question={q}
              selected={answers[i]}
              onChange={(optId) => handleAnswer(i, optId)}
            />
          ))}
        </div>

        <aside className="xl:sticky xl:top-6 self-start rounded-[22px] ring-1 ring-white/10 bg-white/[0.04] backdrop-blur-md p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <ProgressRing percent={progress} />
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                {progress}%
              </span>
            </div>
            <div>
              <div className="text-white font-semibold text-lg leading-none">{answered}/{total}</div>
              <div className="text-white/55 text-sm mt-0.5">respondidas</div>
            </div>
          </div>
          <p className="text-white/65 text-sm leading-relaxed">
            {isComplete
              ? "¡Todo respondido! Puedes enviar el test."
              : `Responde las ${total - answered} pregunta(s) restante(s) para habilitar el envío.`}
          </p>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-lg bg-red-500/10 text-red-200 text-sm px-3 py-2 ring-1 ring-red-400/30"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleSubmit}
            disabled={!isComplete || sending}
            className={[
              "w-full rounded-xl py-3 font-semibold text-white transition",
              isComplete && !sending
                ? "bg-[#00b5e2] hover:brightness-110 shadow-[0_8px_20px_rgba(0,181,226,0.30)]"
                : "bg-white/10 text-white/40 cursor-not-allowed",
            ].join(" ")}
          >
            {sending ? "Enviando…" : "Enviar respuestas"}
          </button>
        </aside>
      </div>

      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#202329]/95 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1">
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#00b5e2] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-white/50 mt-1">{answered}/{total} respondidas</div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!isComplete || sending}
            className={[
              "rounded-xl px-5 py-2.5 font-semibold text-sm text-white transition",
              isComplete && !sending
                ? "bg-[#00b5e2] shadow-[0_4px_12px_rgba(0,181,226,0.30)]"
                : "bg-white/10 text-white/40 cursor-not-allowed",
            ].join(" ")}
          >
            {sending ? "…" : "Enviar"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && <ResultModal result={result} onContinue={handleContinue} />}
      </AnimatePresence>
    </div>
  );
}
