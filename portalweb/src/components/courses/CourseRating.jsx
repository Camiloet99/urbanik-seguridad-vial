import { useMemo, useState } from "react";


const OPTIONS = [
  { value: 1, label: "Muy malo", key: "awful" },
  { value: 2, label: "Malo", key: "bad" },
  { value: 3, label: "Neutral", key: "neutral" },
  { value: 4, label: "Bueno", key: "good" },
  { value: 5, label: "Muy bueno", key: "great" },
];


function palette(v) {
  if (!v) {
    return {
      text: "text-[#1a1a1a]/60",
      ring: "ring-[#1D4789]/25",
      bg: "bg-white",
      glow: "",
    };
  }

  return {
    text: "text-[#1D4789]",
    ring: "ring-[#1D4789]",
    bg: "bg-white",
    glow: "shadow-[0_8px_24px_rgba(29,71,137,0.22)]",
  };
}


function FaceSvgAwful(props) {
  return (
    <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true" {...props}>
      <circle cx="20" cy="20" r="14.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="16.8" cy="15.5" r="1.1" fill="currentColor" />
      <circle cx="23.2" cy="15.5" r="1.1" fill="currentColor" />
      <path d="M15 21c1.6-1.2 3.2-1.8 5-1.8s3.4.6 5 1.8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function FaceSvgBad(props) {
  return (
    <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true" {...props}>
      <circle cx="20" cy="20" r="14.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="16.8" cy="15.5" r="1.1" fill="currentColor" />
      <circle cx="23.2" cy="15.5" r="1.1" fill="currentColor" />
      <path d="M15 21c1.7-1 3.3-1.4 5-1.4s3.3.4 5 1.4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function FaceSvgNeutral(props) {
  return (
    <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true" {...props}>
      <circle cx="20" cy="20" r="14.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="16.8" cy="15.5" r="1.1" fill="currentColor" />
      <circle cx="23.2" cy="15.5" r="1.1" fill="currentColor" />
      <path d="M16 21h8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function FaceSvgGood(props) {
  return (
    <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true" {...props}>
      <circle cx="20" cy="20" r="14.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="16.8" cy="15.5" r="1.1" fill="currentColor" />
      <circle cx="23.2" cy="15.5" r="1.1" fill="currentColor" />
      <path d="M15 20c1.6 1.6 3.3 2.4 5 2.4s3.4-.8 5-2.4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function FaceSvgGreat(props) {
  return (
    <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true" {...props}>
      <circle cx="20" cy="20" r="14.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      {/* ojos "felices" */}
      <path d="M15.5 15c.8-.8 1.8-1.2 3-1.2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M21.5 13.8c1.2 0 2.2.4 3 1.2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M15 19c1.6 2.2 3.3 3.3 5 3.3s3.4-1.1 5-3.3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function FaceSvg({ kind, className }) {
  const common = { className };
  switch (kind) {
    case "awful":
      return <FaceSvgAwful {...common} />;
    case "bad":
      return <FaceSvgBad {...common} />;
    case "neutral":
      return <FaceSvgNeutral {...common} />;
    case "good":
      return <FaceSvgGood {...common} />;
    case "great":
      return <FaceSvgGreat {...common} />;
    default:
      return null;
  }
}

/**
 * Componente principal de calificación.
 *
 * Props IMPORTANTES:
 * - courseKey: identificador del curso/módulo (viene de la ruta /courses/:courseKey/rating)
 * - userId: opcional (si el front lo tiene; si no, el backend puede inferirlo del token)
 * - moduleName: solo UI
 * - onSubmit: función async para conectar el backend (parametrizado)
 *   Ejemplo: onSubmit = (payload) => api.post("/ratings", payload)
 */
export default function CourseRating({
  courseKey,
  userId,
  moduleName = "Fundamentos de Seguridad Vial",
  onSubmit,
}) {
  /**
   * ESTADO QUE GUARDA LA SELECCIÓN DEL USUARIO
   * rating guarda el valor 1..5 elegido por el usuario.
   * - null = aún no ha elegido
   */
  const [rating, setRating] = useState(null);

  /**
   * sending y sent son estados de UX:
   * - sending: bloquea el botón mientras se envía
   * - sent: evita envíos repetidos y permite mostrar Gracias
   */
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  /**
   * PAYLOAD LISTO PARA BD
   * Este objeto es lo que se enviará al backend para guardarlo.
   *
   * Se recalcula automáticamente cada vez que cambie:
   * - courseKey
   * - userId
   * - rating 
   */
  const payload = useMemo(() => {
    return {
      courseKey,           // qué curso se califica
      userId,              // quién califica 
      rating,              // valor 1..5 
      createdAt: new Date().toISOString(), // backend puede generarlo también
    };
  }, [courseKey, userId, rating]);

  /**
   * ENVÍ / GUARDADO 
   * Aquí NO se guarda en BD directamente porque el backend aún no está conectado.
   *
   * Regla:
   * - si no hay rating => no envía
   * - si ya fue enviado => no repite
   *
   * Cuando el ingeniero conecte backend, debe pasar un onSubmit que haga POST.
   */
  const handleSubmit = async () => {
    if (!rating || sent) return;

    try {
      setSending(true);

      // CONEXIÓN AL BACKEND
      // onSubmit debe ser una función async que reciba el payload y lo persista.
;
      if (typeof onSubmit === "function") {
        await onSubmit(payload);
      } else {
        // placeholder para desarrollo (sirve para validar lo que se enviaría)
        console.log("Rating payload (placeholder):", payload);
      }

      // marca como enviado para UX (bloquea reenvío)
      setSent(true);
    } catch (err) {
      // aquí podrías mostrar un toast/alert
      console.error("Error sending rating:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-4 py-10">
      <div className="w-full max-w-[920px] rounded-[32px] bg-white border border-[#1D4789]/20 shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-10">
        <h3 className="text-center text-[#1a1a1a] text-xl leading-snug">
          Cómo calificarías el módulo de <span className="font-semibold text-[#1D4789]">{moduleName}</span> ?
        </h3>

        <div className="mt-8 rounded-[26px] bg-[#EEEEEE] border border-[#1D4789]/20 p-6">
          <div className="rounded-[18px] bg-white border border-[#1D4789]/20 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              {OPTIONS.map((opt) => {
                /**
                 * active determina si esta opción es la elegida.
                 * Se vuelve true cuando rating === opt.value
                 */
                const active = rating === opt.value;
                const pal = palette(opt.value);

                return (
                  <button
                    key={opt.value}
                    type="button"
                    /**
                     * GUARD LA ELECCION:
                     * al hacer click se setea rating con el value (1..5)
                     */
                    onClick={() => setRating(opt.value)}
                    className={[
                      "h-14 w-14 rounded-full grid place-items-center",
                      "ring-1 ring-[#1D4789]/20 bg-white",
                      "transition active:scale-[0.98]",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4789]/45",
                      // Estilos de la opción activa (solo UI)
                      active ? `ring-2 ${pal.ring} ${pal.bg} ${pal.glow}` : "hover:bg-[#F5F5F6]",
                    ].join(" ")}
                    aria-label={opt.label}
                    title={opt.label}
                  >
                    {/*  reemplazar FaceSvg por <img src="..." /> */}
                    <FaceSvg kind={opt.key} className={active ? pal.text : "text-[#1a1a1a]/55"} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[#1a1a1a]/70 text-base">
            <span>Muy malo</span>
            <span>Muy bueno</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            /**
             * disabled:
             * - no permite enviar si no hay selección
             * - bloquea si está enviando
             * - bloquea si ya se envió
             */
            disabled={!rating || sending || sent}
            className={[
              "rounded-full px-12 py-3 text-base font-semibold",
              "bg-[#1D4789] hover:bg-[#163672] active:scale-[0.98] transition",
              "text-white shadow-sm",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4789]/45",
              "disabled:opacity-50 disabled:hover:bg-[#1D4789] disabled:active:scale-100",
            ].join(" ")}
          >
            {sent ? "¡Gracias!" : sending ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
