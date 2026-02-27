import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { markAvatarConfigured } from "@/services/progressService";
import { CHARACTERS, PROFILES } from "@/assets/characters";
import banner from "@/assets/banner-blur.jpg";
import { MdEmail, MdPerson, MdPhone, MdLocationOn, MdBadge, MdShield, MdDateRange } from "react-icons/md";
import Input from "@/components/Input";
import { DEPARTMENTS, MUNICIPALITIES_ANTIOQUIA } from "@/data/colombiaData";

const DEPT_MAP = Object.fromEntries(DEPARTMENTS.map((d) => [d.value, d.label]));
const MUN_MAP = Object.fromEntries(MUNICIPALITIES_ANTIOQUIA.map((m) => [m.value, m.label]));

const AGE_LABELS = {
  "16-25": "16 – 25 · Joven",
  "25-34": "25 – 34 · Adulto Joven",
  "35-59": "35 – 59 · Adulto",
  "60+": "60+ · Adulto Mayor",
};
const GENDER_LABELS = {
  male: "Hombre",
  female: "Mujer",
  "non-binary": "Persona no binaria",
  "prefer-not-say": "Prefiero no decirlo",
};
const FOCUS_LABELS = {
  lgbtiq: "Población LGTBIQ+",
  ethnic: "Población étnica",
  "armed-conflict": "Víctima del conflicto armado",
  disability: "Persona con discapacidad",
  "female-head": "Mujer cabeza de hogar",
  none: "Ninguno",
  "prefer-not-say": "Prefiero no decirlo",
};
const DOC_LABELS = { cc: "C.C", ti: "T.I", pa: "P.A" };

function InfoRow({ icon, value, className = "" }) {
  return (
    <div
      className={`flex h-11 w-full items-center gap-3 rounded-full border border-white/12 bg-white/5 px-4 text-sm ${className}`}
    >
      <span className="text-white/30 shrink-0">{icon}</span>
      <span className="text-white/75 truncate">{value || "–"}</span>
    </div>
  );
}

export default function Profile() {
  const { session, updateUser } = useAuth();
  const user = session?.user;
  const location = useLocation();
  const navigate = useNavigate();
  const isSetupFlow = new URLSearchParams(location.search).get("setup") === "1";

  // Estados UI
  const [edit, setEdit] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" }); // "ok" | "err"
  const [errors, setErrors] = useState({ name: "", phone: "" });

  // Form
  const [form, setForm] = useState({
    email: user?.email || "",
    name: user?.name || "",
    phone: user?.phone || "",
  });

  console.log(user)

  // Mantener form sincronizado al cambiar el user (ej: recarga/me)
  useEffect(() => {
    setForm({
      email: user?.email || "",
      name: user?.name || "",
      phone: user?.phone || "",
    });
  }, [user?.email, user?.name, user?.phone]);

  // Validaciones simples
  const validate = () => {
    const next = { name: "", phone: "" };
    if (!form.name?.trim()) next.name = "Nombre requerido";
    // phone opcional, si viene validarlo suave (7-20 chars útiles)
    if (form.phone && !/^[0-9+\s()-]{7,20}$/.test(form.phone)) {
      next.phone = "Teléfono inválido";
    }
    setErrors(next);
    return !next.name && !next.phone;
  };

  // Dirty-state real (compara con user actual)
  const isDirty = useMemo(() => {
    return (
      (form.name ?? "") !== (user?.name ?? "") ||
      (form.phone ?? "") !== (user?.phone ?? "")
    );
  }, [form, user]);

  const canSave = useMemo(() => edit && isDirty && !saving, [edit, isDirty, saving]);

  const avatarId = user?.avatarId ?? 0;
  const avatarSrc = CHARACTERS[avatarId];
  const profileSrc = PROFILES[avatarId];

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      await updateUser({ name: form.name.trim(), phone: form.phone?.trim() || null });
      setEdit(false);
      setToast({ type: "ok", msg: "Cambios guardados" });
    } catch (e) {
      setToast({ type: "err", msg: e?.message || "No se pudo guardar" });
    } finally {
      setSaving(false);
      // limpiar toast en 3s
      setTimeout(() => setToast({ type: "", msg: "" }), 3000);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] px-2 sm:px-4 lg:px-0">
      {/* Setup-flow sticky bottom bar */}
      {isSetupFlow && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#202329]/95 backdrop-blur-md border-t border-white/10 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="max-w-sm mx-auto">
            <p className="text-xs text-white/50 text-center mb-2">Paso 1 de 2 &middot; Personaliza tu avatar</p>
            <button
              type="button"
              onClick={() => { markAvatarConfigured(); navigate("/courses"); }}
              className="w-full rounded-xl py-3 bg-[#00b5e2] hover:brightness-105 active:brightness-95 text-white font-semibold text-sm transition cursor-pointer"
            >
              Listo, continuar al diagnóstico →
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        {/* Columna izquierda */}
        <div className="space-y-6">
          {/* Header card (sin overflow-hidden para no cortar el círculo) */}
          <section className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 md:p-5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)]">
            <div className="relative">
              <img
                src={banner}
                alt=""
                className="h-28 w-full rounded-2xl object-cover md:h-32 select-none"
                draggable={false}
              />
              {/* Overlay sutil para legibilidad y más “chic” */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 z-10">
                {/* Aro con leve gradiente, sin exagerar */}
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-full p-[3px] bg-gradient-to-tr from-[#6C4CFF] via-[#8B7BFF] to-transparent">
                  <div className="h-full w-full rounded-full ring-4 ring-[#1F2336] overflow-hidden bg-white/10 backdrop-blur">
                    <img
                      src={profileSrc}
                      alt="Foto de perfil"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-10">
              <h2 className="text-center text-xl md:text-2xl font-semibold drop-shadow-sm">
                {user?.name || "Usuario"}
              </h2>
            </div>
          </section>

          {/* Card principal: avatar o selector */}
          <section className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 md:p-6 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)]">
            {!showPicker ? (
              <>
                <div className="relative grid place-items-center min-h-[340px]">
                  <img
                    src={avatarSrc}
                    alt="Character"
                    className="max-h-[340px] w-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)] select-none"
                    draggable={false}
                  />
                </div>

                <div className="mt-5 text-center">
                  <h3 className="text-base md:text-lg font-medium mb-3">
                    Personaliza tu avatar y vive una experiencia única
                  </h3>
                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center rounded-full px-7
                               bg-gradient-to-b from-[#7457FF] to-[#5B43EE]
                               shadow-[0_8px_24px_rgba(108,76,255,0.35)]
                               hover:brightness-105 active:brightness-95
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
                               cursor-pointer"
                    onClick={() => setShowPicker(true)}
                  >
                    Personalizar
                  </button>
                </div>

                {toast.msg && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={[
                      "mt-4 text-sm px-3 py-2 rounded-md text-center transition-opacity",
                      toast.type === "ok"
                        ? "bg-emerald-500/15 text-emerald-200 border border-emerald-400/30"
                        : "bg-red-500/15 text-red-200 border border-red-400/30",
                    ].join(" ")}
                  >
                    {toast.msg}
                  </div>
                )}
              </>
            ) : (
              <AvatarPicker
                currentId={avatarId}
                loading={pickerLoading}
                onCancel={() => setShowPicker(false)}
                onConfirm={async (id) => {
                  try {
                    setPickerLoading(true);
                    await updateUser({ avatarId: id }); // endpoint único
                    setShowPicker(false);
                    setToast({ type: "ok", msg: "Avatar actualizado" });
                  } catch (e) {
                    setToast({ type: "err", msg: e?.message || "No se pudo guardar el avatar" });
                  } finally {
                    setPickerLoading(false);
                    setTimeout(() => setToast({ type: "", msg: "" }), 3000);
                  }
                }}
              />
            )}
          </section>
        </div>

        {/* Columna derecha: Datos personales */}
        <aside className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 md:p-7 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)]">
          <h3 className="text-center text-base font-semibold mb-5">
            Datos personales
          </h3>

          {/* Edad pill */}
          <div className="flex justify-center mb-5">
            <div className="flex flex-col items-center rounded-2xl border border-white/12 bg-white/5 px-8 py-2.5 text-center">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/38">
                Grupo de edad
              </span>
              <span className="text-sm font-medium text-white mt-0.5">
                {AGE_LABELS[user?.ageRange] || "–"}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {/* Email */}
            <InfoRow icon={<MdEmail size={16} />} value={user?.email} />

            {/* Documento */}
            <div className="flex gap-2">
              <div className="flex h-11 shrink-0 items-center rounded-full border border-white/12 bg-white/5 px-4 text-sm font-medium text-white/70">
                {DOC_LABELS[user?.documentType] || "–"}
              </div>
              <InfoRow icon={<MdBadge size={16} />} value={user?.dni} className="flex-1" />
            </div>

            {/* Nombre */}
            <InfoRow icon={<MdPerson size={16} />} value={user?.fullName} />

            {/* Género */}
            <InfoRow icon={<MdPerson size={16} />} value={GENDER_LABELS[user?.genero]} />

            {/* Departamento */}
            <InfoRow
              icon={<MdLocationOn size={16} />}
              value={DEPT_MAP[user?.department] || user?.department}
            />

            {/* Municipio */}
            <InfoRow
              icon={<MdLocationOn size={16} />}
              value={MUN_MAP[user?.municipality] || user?.municipality}
            />

            {/* Teléfono */}
            <div className="flex gap-2">
              <div className="flex h-11 shrink-0 items-center rounded-full border border-white/12 bg-white/5 px-4 text-sm font-medium text-white/70">
                +57
              </div>
              <InfoRow icon={<MdPhone size={16} />} value={user?.phone} className="flex-1" />
            </div>

            {/* Enfoque diferencial */}
            <InfoRow icon={<MdShield size={16} />} value={FOCUS_LABELS[user?.differentialFocus]} />
          </div>

          {/* Editar */}
          <div className="mt-5 flex items-center justify-end">
            <button
              className="text-sm text-white/75 hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
              onClick={() => setEdit(true)}
            >
              Editar
            </button>
          </div>

          {/* Nivel de riesgo */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-sm">
            <span className="text-white/55">Nivel de riesgo:</span>
            <span className="text-amber-400 text-base leading-none">⚠</span>
            <span className="font-semibold text-white">{user?.nivel ?? 0}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function AvatarPicker({ currentId = 0, onCancel, onConfirm, loading = false }) {
  const [selected, setSelected] = useState(currentId);

  return (
    <div>
      <h4 className="text-center text-lg font-semibold mb-4">
        Elige tu cuerpo…
      </h4>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 place-items-center">
        {CHARACTERS.map((src, idx) => {
          const active = idx === selected;
          return (
            <li key={idx} className="w-full">
              <button
                type="button"
                onClick={() => setSelected(idx)}
                className={[
                  "group relative w-full aspect-[3/4] rounded-2xl ring-1 transition cursor-pointer",
                  active
                    ? "bg-white/10 ring-[#6C4CFF] shadow-[0_8px_24px_rgba(108,76,255,0.35)]"
                    : "bg-white/5 ring-white/10 hover:bg-white/10",
                ].join(" ")}
                disabled={loading}
              >
                {/* borde/foco accesible */}
                <span className="absolute inset-0 rounded-2xl ring-0 group-focus-visible:ring-2 group-focus-visible:ring-white/70 pointer-events-none" />
                <img
                  src={src}
                  alt={`Avatar ${idx}`}
                  className="absolute inset-0 m-auto max-h-[85%] w-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,.35)] select-none"
                  draggable={false}
                />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          className="h-11 rounded-full px-6 bg-white/10 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 cursor-pointer"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="h-11 rounded-full px-7
                     bg-gradient-to-b from-[#7457FF] to-[#5B43EE]
                     shadow-[0_8px_24px_rgba(108,76,255,0.35)]
                     hover:brightness-105 active:brightness-95 disabled:opacity-60
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 cursor-pointer"
          onClick={() => onConfirm(selected)}
          disabled={loading}
        >
          {loading ? "Guardando…" : "Continuar"}
        </button>
      </div>
    </div>
  );
}