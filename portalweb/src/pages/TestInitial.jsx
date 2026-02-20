import { useEffect, useMemo, useRef, useState } from "react";
import { submitInitialTest } from "@/services/testsService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Definiciones de opciones para el cuestionario de riesgo vial
const ACTOR_VIAL_OPTIONS = [
  { id: "peatón", label: "Peatón", points: 1 },
  { id: "motociclista", label: "Motociclista", points: 3 },
  { id: "ciclista", label: "Ciclista", points: 2 },
  { id: "micromovilidad", label: "Micromovilidad (patineta/scooter)", points: 2 },
  { id: "conductor_liviano", label: "Conductor vehículo liviano", points: 1 },
  { id: "conductor_pesado", label: "Conductor vehículo pesado", points: 2 },
];

const FREQUENCY_OPTIONS = [
  { id: "diario", label: "Diario (6–7 días/semana)", points: 2 },
  { id: "frecuente", label: "Frecuente (3–5 días/semana)", points: 1 },
  { id: "ocasional", label: "Ocasional (1–2 días/semana o menos)", points: 0 },
];

const SCHEDULE_OPTIONS = [
  { id: "mañana", label: "Mañana (5:00 a.m. – 12:00 p.m.)", points: 0 },
  { id: "tarde", label: "Tarde (12:00 p.m. – 6:00 p.m.)", points: 0 },
  { id: "noche", label: "Noche (6:00 p.m. – 10:00 p.m.)", points: 1 },
  { id: "madrugada", label: "Madrugada (10:00 p.m. – 5:00 a.m.)", points: 1 },
];

const EXPERIENCE_OPTIONS = [
  { id: "menos_1", label: "Menos de 1 año", points: 1 },
  { id: "1_3", label: "1 a 3 años", points: 0 },
  { id: "mas_3", label: "Más de 3 años", points: 0 },
];

const PROTECTION_OPTIONS = [
  { id: "siempre", label: "Siempre", points: 0 },
  { id: "aveces", label: "A veces", points: 1 },
  { id: "casi_nunca", label: "Casi nunca", points: 2 },
];

// Componente para selección de opciones (botones)
function OptionGroup({ label, options, selected, onChange, required = false }) {
  return (
    <div className="rounded-xl px-4 py-4 ring-1 ring-white/10 bg-white/3 hover:bg-white/[0.07] transition">
      <p className="text-sm font-medium mb-3 text-white/90">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={[
              "px-3 py-2 rounded-full text-sm transition ring-1",
              selected === opt.id
                ? "bg-[#5944F9] text-white shadow-[0_8px_20px_rgba(89,68,249,0.35)] ring-[#5944F9]"
                : "bg-white/5 text-white/80 hover:bg-white/10 ring-white/15",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProgressMini({ percent }) {
  const size = 84;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * (percent / 100);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#74E0E6" />
          <stop offset="50%" stopColor="#7B6CFF" />
          <stop offset="100%" stopColor="#5B7CFF" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,.15)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#g)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

// Barra inferior sticky
function StickyActionBar({ visible, onSubmit, disabled, sending, progress }) {
  return (
    <div
      aria-hidden={!visible}
      className={[
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl px-4 pb-4">
        <div className="pointer-events-auto rounded-2xl bg-[#0B0B11]/70 backdrop-blur-md ring-1 ring-white/10 shadow-[0_20px_40px_rgba(0,0,0,.35)] p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white/5 ring-1 ring-white/10 grid place-items-center text-xs">
              {progress}%
            </div>
            <p className="text-sm text-white/80 hidden sm:block">
              {progress === 100
                ? "Listo para enviar"
                : "Responde el campo obligatorio para habilitar el envío"}
            </p>
          </div>
          <button
            onClick={onSubmit}
            disabled={disabled}
            className={[
              "rounded-xl px-5 py-2.5 font-medium transition",
              !disabled
                ? "bg-[#5944F9] hover:brightness-110 shadow-[0_10px_24px_rgba(89,68,249,0.35)]"
                : "bg-white/10 text-white/60 cursor-not-allowed",
            ].join(" ")}
          >
            {sending ? "Enviando..." : "Enviar respuestas"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal de resultado del score
function RiskProfileModal({ show, riskScore, riskProfile, onClose }) {
  if (!show) return null;

  const profileColor = {
    BAJO: "bg-green-500/20 text-green-300 border-green-500/30",
    MEDIO: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    ALTO: "bg-red-500/20 text-red-300 border-red-500/30",
  }[riskProfile];

  const profileLabel = {
    BAJO: "Riesgo Bajo",
    MEDIO: "Riesgo Medio",
    ALTO: "Riesgo Alto",
  }[riskProfile];

  const profileDescription = {
    BAJO: "Tu perfil indica un riesgo vial bajo. Continúa manteniendo tus hábitos seguros y responsables.",
    MEDIO: "Tu perfil indica un riesgo vial medio. Te recomendamos prestar más atención a los hábitos de seguridad.",
    ALTO: "Tu perfil indica un riesgo vial alto. Es importante que refuerces tus medidas de protección y seguridad.",
  }[riskProfile];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="rounded-2xl bg-[#0B0B11] ring-1 ring-white/10 p-6 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <h3 className="text-2xl font-semibold mb-4">Tu Perfil de Riesgo Vial</h3>
        
        <div className={`rounded-xl border-2 p-4 mb-6 text-center ${profileColor}`}>
          <div className="text-lg font-bold">{profileLabel}</div>
          <div className="text-sm mt-1">Score: {riskScore} puntos</div>
        </div>

        <div className="text-white/80 text-sm space-y-2 mb-6">
          <p>{profileDescription}</p>
          <p className="text-xs text-white/60 mt-3">
            <strong>Rangos de score:</strong><br/>
            Bajo (0–3) • Medio (4–6) • Alto (7+)
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-[#5944F9] hover:brightness-110 text-white font-medium py-3 transition shadow-[0_10px_24px_rgba(89,68,249,0.35)]"
        >
          Continuar a Actividades
        </button>
      </div>
    </div>
  );
}

// Función para calcular el score de riesgo vial
function calculateRiskScore(formData, userAgeRange) {
  let score = 0;

  // 1. Puntos por edad (del perfil del usuario)
  const agePoints = {
    "16-24": 2,
    "25-34": 1,
    "35-59": 0,
    "60+": 2,
  };
  score += agePoints[userAgeRange] || 0;

  // 2. Puntos por actor vial principal (obligatorio)
  const actorVial = ACTOR_VIAL_OPTIONS.find(opt => opt.id === formData.actorVial);
  if (actorVial) {
    score += actorVial.points;
  }

  // 3. Ajustes opcionales por exposición
  // Frecuencia
  if (formData.frequency) {
    const freq = FREQUENCY_OPTIONS.find(opt => opt.id === formData.frequency);
    if (freq) score += freq.points;
  }

  // Horario
  if (formData.schedule) {
    const sched = SCHEDULE_OPTIONS.find(opt => opt.id === formData.schedule);
    if (sched) score += sched.points;
  }

  // Experiencia (solo si conduce)
  const isDriver = ["motociclista", "conductor_liviano", "conductor_pesado"].includes(formData.actorVial);
  if (formData.experience && isDriver) {
    const exp = EXPERIENCE_OPTIONS.find(opt => opt.id === formData.experience);
    if (exp) score += exp.points;
  }

  // Hábitos de protección (opcional)
  if (formData.protection) {
    const prot = PROTECTION_OPTIONS.find(opt => opt.id === formData.protection);
    if (prot) score += prot.points;
  }

  // 4. Determinar perfil según umbrales
  let profile = "BAJO";
  if (score >= 7) {
    profile = "ALTO";
  } else if (score >= 4) {
    profile = "MEDIO";
  }

  return { score, profile };
}

export default function TestInitial() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const user = session?.user;

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("risk-profile-form");
    return saved
      ? JSON.parse(saved)
      : {
          actorVial: null,
          frequency: null,
          schedule: null,
          experience: null,
          protection: null,
        };
  });

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [riskResult, setRiskResult] = useState({ score: 0, profile: "BAJO" });

  const asideBtnRef = useRef(null);
  const [actionBarVisible, setActionBarVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem("risk-profile-form", JSON.stringify(formData));
  }, [formData]);

  // Verificar si se completaron campos obligatorios
  const isComplete = formData.actorVial !== null;

  // Calcular progreso (incluyendo campos opcionales)
  const progress = useMemo(() => {
    const fields = [
      formData.actorVial !== null,
      formData.frequency !== null,
      formData.schedule !== null,
      formData.experience !== null,
      formData.protection !== null,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [formData]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setError("");

    if (!isComplete) {
      setError("Por favor completa el campo obligatorio: Actor vial principal.");
      return;
    }

    // Calcular score
    const ageRange = user?.ageRange || "25-34"; // fallback
    const result = calculateRiskScore(formData, ageRange);
    setRiskResult(result);
    setShowModal(true);

    // Enviar el resultado al servidor
    setSending(true);
    try {
      const payload = {
        kind: "risk-profile",
        riskScore: result.score,
        riskProfile: result.profile,
        riskVersion: "1.0",
        responses: formData,
        submittedAt: new Date().toISOString(),
      };
      await submitInitialTest(payload);
      localStorage.removeItem("risk-profile-form");
    } catch (err) {
      console.error("Error al enviar:", err);
      setError("No se pudo guardar el perfil. Intenta nuevamente.");
    } finally {
      setSending(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/experience", { replace: true });
  };

  useEffect(() => {
    const el = asideBtnRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setActionBarVisible(!entry.isIntersecting);
      },
      { root: null, threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-[calc(80vh-80px)]">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        {/* Sección principal */}
        <section className="rounded-[22px] ring-1 ring-white/10 bg-white/5 backdrop-blur-md p-6">
          <h2 className="text-center text-xl font-semibold mb-4">
            Diagnóstico de Perfil de Riesgo Vial
          </h2>
          <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10 text-white/85 text-[14px] leading-relaxed">
            <p className="mb-3">
              Este breve cuestionario complementa tus datos de registro con información sobre tu movilidad diaria. 
              Tus respuestas nos permiten estimar tu perfil de riesgo inicial para personalizar tu experiencia en la plataforma.
            </p>
            <p className="text-xs text-white/60">
              El campo marcado con <span className="text-red-400">*</span> es obligatorio. Los demás son opcionales.
            </p>
          </div>
        </section>

        {/* Aside con progreso */}
        <aside className="rounded-[22px] ring-1 ring-white/10 bg-white/5 backdrop-blur-md p-6">
          <div className="flex items-center gap-5">
            <ProgressMini percent={progress} />
            <div>
              <div className="text-2xl font-semibold">{progress}%</div>
              <div className="text-white/70 text-sm -mt-1">Completado</div>
            </div>
          </div>

          <div className="mt-4 text-sm text-white/80">
            Completa el campo obligatorio y envía cuando estés listo.
          </div>

          {error && (
            <div className="mt-3 rounded-lg bg-red-500/10 text-red-200 text-sm px-3 py-2 ring-1 ring-red-400/30">
              {error}
            </div>
          )}

          <button
            ref={asideBtnRef}
            onClick={handleSubmit}
            disabled={!isComplete || sending}
            className={[
              "mt-5 w-full rounded-xl py-3 font-medium transition",
              isComplete && !sending
                ? "bg-[#5944F9] hover:brightness-110 shadow-[0_10px_24px_rgba(89,68,249,0.35)]"
                : "bg-white/10 text-white/60 cursor-not-allowed",
            ].join(" ")}
          >
            {sending ? "Enviando..." : "Enviar respuestas"}
          </button>
        </aside>
      </div>

      {/* Preguntas */}
      <div className="mt-6 rounded-[22px] ring-1 ring-white/10 bg-white/5 backdrop-blur-md p-4 md:p-6">
        <div className="space-y-4">
          {/* 1. Actor vial principal (OBLIGATORIO) */}
          <OptionGroup
            label="1. Actor vial principal - ¿Con cuál rol te desplazas con mayor frecuencia?"
            options={ACTOR_VIAL_OPTIONS}
            selected={formData.actorVial}
            onChange={(val) => handleFieldChange("actorVial", val)}
            required={true}
          />

          {/* 2. Frecuencia (OPCIONAL) */}
          <OptionGroup
            label="2. Frecuencia de desplazamiento - ¿Con qué frecuencia te movilizas por la ciudad?"
            options={FREQUENCY_OPTIONS}
            selected={formData.frequency}
            onChange={(val) => handleFieldChange("frequency", val)}
            required={false}
          />

          {/* 3. Horario (OPCIONAL) */}
          <OptionGroup
            label="3. Horario de mayor movilidad - ¿En qué momento del día sueles desplazarte más?"
            options={SCHEDULE_OPTIONS}
            selected={formData.schedule}
            onChange={(val) => handleFieldChange("schedule", val)}
            required={false}
          />

          {/* 4. Experiencia (OPCIONAL, solo conductores) */}
          {["motociclista", "conductor_liviano", "conductor_pesado"].includes(
            formData.actorVial
          ) && (
            <OptionGroup
              label="4. Experiencia en tu rol principal - ¿Cuánto tiempo llevas desplazándote de forma habitual?"
              options={EXPERIENCE_OPTIONS}
              selected={formData.experience}
              onChange={(val) => handleFieldChange("experience", val)}
              required={false}
            />
          )}

          {/* 5. Hábitos de protección (OPCIONAL) */}
          <OptionGroup
            label="5. Hábitos de protección - ¿Con qué frecuencia usas elementos de protección o cumples medidas básicas de seguridad?"
            options={PROTECTION_OPTIONS}
            selected={formData.protection}
            onChange={(val) => handleFieldChange("protection", val)}
            required={false}
          />

          <div className="text-xs text-white/60 mt-4 p-3 rounded-lg bg-white/[0.02]">
            <p className="font-semibold text-white/70 mb-1">Ejemplos de protección:</p>
            Casco, cinturón de seguridad, luces/reflectivos, respetar semáforos y límites de velocidad, etc.
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <StickyActionBar
        visible={actionBarVisible}
        onSubmit={handleSubmit}
        disabled={!isComplete || sending}
        sending={sending}
        progress={progress}
      />

      {/* Modal de resultado */}
      <RiskProfileModal
        show={showModal}
        riskScore={riskResult.score}
        riskProfile={riskResult.profile}
        onClose={handleModalClose}
      />
    </div>
  );
}
