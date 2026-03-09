/**
 * RiskProfileTest.jsx
 *
 * Diagnóstico de Perfil de Riesgo Vial — test general que el usuario completa
 * UNA SOLA VEZ antes de acceder a los módulos.
 *
 * Algoritmo v1.0 (ver spec):
 *   score = pts_edad + pts_actor_vial + (opcional) pts_frecuencia + pts_horario + pts_experiencia
 *   BAJO: 0–3 | MEDIO: 4–6 | ALTO: ≥7
 */

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { submitDiagnostico } from "@/services/progressService";

// ─────────────────────────────────────────────────────────────────────────────
// Question data (spec-driven)
// ─────────────────────────────────────────────────────────────────────────────

const ACTOR_VIAL = [
  { id: "peatón",             label: "Peatón",                                           pts: 1 },
  { id: "motociclista",       label: "Motociclista",                                     pts: 3 },
  { id: "ciclista",           label: "Ciclista",                                         pts: 2 },
  { id: "micromovilidad",     label: "Micromovilidad (patineta / scooter eléctrico)",    pts: 2 },
  { id: "conductor_liviano",  label: "Conductor de vehículo liviano (carro/camioneta)",  pts: 1 },
  { id: "conductor_pesado",   label: "Conductor de vehículo pesado (camión/bus)",        pts: 2 },
];

const FRECUENCIA = [
  { id: "diario",    label: "Diario (6–7 días/semana)",            pts: 2 },
  { id: "frecuente", label: "Frecuente (3–5 días/semana)",         pts: 1 },
  { id: "ocasional", label: "Ocasional (1–2 días/semana o menos)", pts: 0 },
];

const HORARIO = [
  { id: "mañana",    label: "Mañana (5:00 a.m. – 12:00 p.m.)",   pts: 0 },
  { id: "tarde",     label: "Tarde (12:00 p.m. – 6:00 p.m.)",    pts: 0 },
  { id: "noche",     label: "Noche (6:00 p.m. – 10:00 p.m.)",    pts: 1 },
  { id: "madrugada", label: "Madrugada (10:00 p.m. – 5:00 a.m.)", pts: 1 },
];

const EXPERIENCIA = [
  { id: "menos_1", label: "Menos de 1 año", pts: 1 },
  { id: "1_3",     label: "1 a 3 años",     pts: 0 },
  { id: "mas_3",   label: "Más de 3 años",  pts: 0 },
];

const PROTECCION = [
  { id: "siempre",     label: "Siempre",      pts: 0 },
  { id: "aveces",      label: "A veces",      pts: 1 },
  { id: "casi_nunca",  label: "Casi nunca",   pts: 2 },
];

const AGE_PTS = { "16-24": 2, "25-34": 1, "35-59": 0, "60+": 2 };

// Actors where the "experience" question applies with driving logic
const CONDUCTORES = ["motociclista", "conductor_liviano", "conductor_pesado"];

// ─────────────────────────────────────────────────────────────────────────────
// Score algorithm
// ─────────────────────────────────────────────────────────────────────────────

function calcScore(form, ageRange) {
  let score = 0;
  score += AGE_PTS[ageRange] ?? 0;
  score += ACTOR_VIAL.find((o) => o.id === form.actorVial)?.pts ?? 0;
  if (form.frecuencia) score += FRECUENCIA.find((o) => o.id === form.frecuencia)?.pts ?? 0;
  if (form.horario)    score += HORARIO.find((o) => o.id === form.horario)?.pts ?? 0;
  if (form.experiencia) score += EXPERIENCIA.find((o) => o.id === form.experiencia)?.pts ?? 0;
  if (form.proteccion)  score += PROTECCION.find((o) => o.id === form.proteccion)?.pts ?? 0;
  return score;
}

function scoreToProfile(score) {
  if (score >= 7) return "ALTO";
  if (score >= 4) return "MEDIO";
  return "BAJO";
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function OptionBtn({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-3 w-full text-left rounded-xl px-4 py-3 text-sm transition ring-1",
        selected
          ? "bg-[#00b5e2]/15 ring-[#00b5e2] text-white shadow-[0_4px_14px_rgba(0,181,226,0.2)]"
          : "bg-white/[0.03] ring-white/10 text-white/75 hover:bg-white/[0.07] hover:ring-white/25",
      ].join(" ")}
    >
      <span
        className={[
          "flex-shrink-0 h-5 w-5 rounded-full border-2 grid place-items-center transition",
          selected ? "border-[#00b5e2] bg-[#00b5e2]" : "border-white/30",
        ].join(" ")}
      >
        {selected && (
          <svg viewBox="0 0 10 10" className="h-3 w-3" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </button>
  );
}

function QuestionBlock({ number, title, subtitle, options, value, onChange, required = false }) {
  return (
    <div className="rounded-[18px] ring-1 ring-white/10 bg-white/[0.04] p-5 space-y-3">
      <div>
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex-shrink-0 h-6 w-6 rounded-full bg-[#00b5e2]/20 text-[#00b5e2] text-xs font-bold grid place-items-center">
            {number}
          </span>
          <p className="text-[15px] font-semibold text-white leading-snug">
            {title}
            {required && <span className="text-red-400 ml-1">*</span>}
          </p>
        </div>
        {subtitle && <p className="mt-1 ml-8 text-xs text-white/55">{subtitle}</p>}
      </div>
      <div className="ml-0 grid gap-2 sm:grid-cols-2">
        {options.map((opt) => (
          <OptionBtn
            key={opt.id}
            label={opt.label}
            selected={value === opt.id}
            onClick={() => onChange(opt.id)}
          />
        ))}
      </div>
    </div>
  );
}

/** Result modal after submission */
function ResultModal({ score, profile, onContinue }) {
  const COLOR = {
    BAJO:  { bg: "bg-emerald-500/15",  text: "text-emerald-300",  border: "ring-emerald-500/40",  emoji: "🟢" },
    MEDIO: { bg: "bg-amber-500/15",    text: "text-amber-300",    border: "ring-amber-500/40",    emoji: "🟡" },
    ALTO:  { bg: "bg-red-500/15",      text: "text-red-300",      border: "ring-red-500/40",      emoji: "🔴" },
  }[profile];

  const DESC = {
    BAJO:  "Tu perfil indica un riesgo vial bajo. ¡Sigue manteniendo tus hábitos seguros!",
    MEDIO: "Tu perfil indica un riesgo vial medio. Te recomendamos reforzar tus medidas de seguridad.",
    ALTO:  "Tu perfil indica un riesgo vial alto. Es importante que trabajes en fortalecer tus hábitos de protección.",
  }[profile];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.28 }}
        className="bg-[#1a1d24] rounded-[28px] ring-1 ring-white/10 p-8 max-w-sm w-full text-center shadow-2xl"
      >
        <div className="text-5xl mb-4">{COLOR.emoji}</div>
        <h2 className="text-xl font-bold text-white mb-1">Diagnóstico Completado</h2>
        <p className="text-white/55 text-sm mb-5">Tu perfil de riesgo vial inicial</p>

        <div className={`rounded-2xl ${COLOR.bg} ring-1 ${COLOR.border} px-6 py-4 mb-5`}>
          <div className={`text-2xl font-extrabold ${COLOR.text} tracking-wide`}>
            RIESGO {profile}
          </div>
          <div className="text-white/60 text-sm mt-1">Score: {score} puntos · v1.0</div>
        </div>

        <p className="text-white/70 text-sm leading-relaxed mb-6">{DESC}</p>

        <div className="text-xs text-white/40 mb-6">
          Umbrales: Bajo 0–3 · Medio 4–6 · Alto ≥7
        </div>

        <button
          onClick={onContinue}
          className="w-full rounded-xl py-3 bg-[#00b5e2] hover:brightness-110 text-white font-semibold transition shadow-[0_8px_20px_rgba(0,181,226,0.30)]"
        >
          Continuar al Módulo 1 →
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function RiskProfileTest() {
  const navigate = useNavigate();
  const { session, updateUser } = useAuth();
  const ageRange = session?.user?.ageRange ?? "25-34";

  const [form, setForm] = useState({
    actorVial:   null,
    frecuencia:  null,
    horario:     null,
    experiencia: null,
    proteccion:  null,
  });
  const [sending, setSending] = useState(false);
  const [error, setError]   = useState("");
  const [result, setResult] = useState(null); // { score, profile }

  const set = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  // Mandatory: only actorVial
  const canSubmit = !!form.actorVial;

  // Progress: count filled optional fields + mandatory
  const filled = Object.values(form).filter(Boolean).length;
  const total  = Object.keys(form).length;
  const pct    = Math.round((filled / total) * 100);

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError("El campo 'Actor vial principal' es obligatorio.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const score   = calcScore(form, ageRange);
      const profile = scoreToProfile(score);
      await submitDiagnostico({
        score,
        profile,
        responses: form,
        ageRange,
      });
      // Refresh live session so Profile.jsx shows the result immediately
      try {
        await updateUser({ riskScore: score, riskProfile: profile });
      } catch { /* best-effort */ }
      setResult({ score, profile });
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el diagnóstico. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  const handleContinue = () => {
    navigate("/courses", { replace: true });
  };

  return (
    <div className="min-h-[calc(80vh-80px)] pb-24">
      {/* Page header */}
      <div className="mb-6">
        <span className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#00b5e2]/15 text-[#00b5e2] mb-2">
          Diagnóstico Inicial · Una sola vez
        </span>
        <h1 className="text-2xl font-bold text-white leading-tight">
          Diagnóstico de Perfil de Riesgo Vial
        </h1>
        <p className="text-white/55 text-sm mt-1 max-w-2xl">
          Este breve cuestionario complementa los datos de tu cuenta con información sobre tu
          movilidad diaria y hábitos de circulación. Tus respuestas nos permiten estimar un perfil
          de riesgo inicial (Bajo, Medio o Alto) para adaptar mejor los contenidos y
          recomendaciones dentro de la plataforma. Son solo 5 preguntas — no hay respuestas
          correctas ni incorrectas.
        </p>
      </div>

      {/* Layout: questions | side panel */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
        {/* Questions */}
        <div className="space-y-4">
          <QuestionBlock
            number={1}
            title="Actor vial principal"
            subtitle="¿Con cuál rol te desplazas con mayor frecuencia?"
            options={ACTOR_VIAL}
            value={form.actorVial}
            onChange={(v) => set("actorVial", v)}
            required
          />

          <QuestionBlock
            number={2}
            title="Frecuencia de desplazamiento"
            subtitle="¿Con qué frecuencia te movilizas por la ciudad o vías? (opcional)"
            options={FRECUENCIA}
            value={form.frecuencia}
            onChange={(v) => set("frecuencia", v)}
          />

          <QuestionBlock
            number={3}
            title="Horario de mayor movilidad"
            subtitle="¿En qué momento del día sueles desplazarte más? (opcional)"
            options={HORARIO}
            value={form.horario}
            onChange={(v) => set("horario", v)}
          />

          <QuestionBlock
            number={4}
            title="Experiencia en la vía"
            subtitle={
              CONDUCTORES.includes(form.actorVial)
                ? "En tu rol de conductor, ¿cuánto tiempo llevas manejando habitualmente?"
                : "¿Cuánto tiempo llevas desplazándote de forma autónoma en la ciudad? (opcional)"
            }
            options={EXPERIENCIA}
            value={form.experiencia}
            onChange={(v) => set("experiencia", v)}
          />

          <QuestionBlock
            number={5}
            title="Hábitos de protección"
            subtitle="En general, ¿con qué frecuencia usas elementos de protección o cumples medidas básicas de seguridad? (opcional)"
            options={PROTECCION}
            value={form.proteccion}
            onChange={(v) => set("proteccion", v)}
          />

          {/* Protection examples note */}
          <p className="text-xs text-white/40 px-1">
            Ejemplos de protección: casco, cinturón de seguridad, luces / reflectivos, respetar
            semáforos y límites de velocidad, etc.
          </p>
        </div>

        {/* Side panel */}
        <aside className="xl:sticky xl:top-6 self-start rounded-[22px] ring-1 ring-white/10 bg-white/[0.04] p-6 space-y-5">
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white/70">Completado</span>
              <span className="font-semibold text-white">{pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#00b5e2] transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-white/45 mt-2">
              {filled}/{total} preguntas respondidas
              {!canSubmit && (
                <span className="block text-red-300 mt-0.5">
                  ¡La pregunta 1 es obligatoria!
                </span>
              )}
            </p>
          </div>

          {/* What happens next */}
          <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/10 p-4 space-y-2">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">
              ¿Qué pasa después?
            </p>
            <ul className="text-xs text-white/55 space-y-1.5">
              <li>✓ Se calcula tu perfil de riesgo inicial</li>
              <li>✓ Los contenidos se adaptan a tu perfil</li>
              <li>✓ Puedes acceder al Módulo 1</li>
              <li className="text-white/30">✗ No se repite este diagnóstico</li>
            </ul>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
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
            disabled={!canSubmit || sending}
            className={[
              "w-full rounded-xl py-3 font-semibold text-white transition",
              canSubmit && !sending
                ? "bg-[#00b5e2] hover:brightness-110 shadow-[0_8px_20px_rgba(0,181,226,0.30)]"
                : "bg-white/10 text-white/40 cursor-not-allowed",
            ].join(" ")}
          >
            {sending ? "Calculando…" : "Ver mi perfil de riesgo"}
          </button>
        </aside>
      </div>

      {/* Mobile bottom bar */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#202329]/95 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1">
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#00b5e2] transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="text-xs text-white/50 mt-1">{filled}/{total} respondidas</div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || sending}
            className={[
              "rounded-xl px-5 py-2.5 font-semibold text-sm text-white transition",
              canSubmit && !sending
                ? "bg-[#00b5e2] shadow-[0_4px_12px_rgba(0,181,226,0.30)]"
                : "bg-white/10 text-white/40 cursor-not-allowed",
            ].join(" ")}
          >
            {sending ? "…" : "Enviar"}
          </button>
        </div>
      </div>

      {/* Result modal */}
      <AnimatePresence>
        {result && (
          <ResultModal
            score={result.score}
            profile={result.profile}
            onContinue={handleContinue}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
