import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { markAvatarConfigured, submitAvatarDone } from "@/services/progressService";
import { CHARACTERS, PROFILES } from "@/assets/characters";
import banner from "@/assets/banner-blur.jpg";
import { MdEmail, MdPerson, MdPhone, MdLocationOn, MdBadge, MdShield, MdDateRange } from "react-icons/md";
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

  const [edit, setEdit] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });
  const [errors, setErrors] = useState({ fullName: "" });

  const buildForm = (u) => ({
    fullName: u?.fullName || "",
    genero: u?.genero || "",
    ageRange: u?.ageRange || "",
    department: u?.department || "",
    municipality: u?.municipality || "",
    differentialFocus: u?.differentialFocus || "",
  });

  const [form, setForm] = useState(() => buildForm(user));

  useEffect(() => {
    setForm(buildForm(user));
  }, [user?.fullName, user?.genero, user?.ageRange, user?.department, user?.municipality, user?.differentialFocus]);

  const validate = () => {
    const next = { fullName: "" };
    if (!form.fullName?.trim()) next.fullName = "Nombre requerido";
    setErrors(next);
    return !next.fullName;
  };

  const isDirty = useMemo(() => {
    return (
      (form.fullName         ?? "") !== (user?.fullName         ?? "") ||
      (form.genero           ?? "") !== (user?.genero           ?? "") ||
      (form.ageRange         ?? "") !== (user?.ageRange         ?? "") ||
      (form.department       ?? "") !== (user?.department       ?? "") ||
      (form.municipality     ?? "") !== (user?.municipality     ?? "") ||
      (form.differentialFocus ?? "") !== (user?.differentialFocus ?? "")
    );
  }, [form, user]);

  const canSave = useMemo(() => edit && isDirty && !saving, [edit, isDirty, saving]);

  const avatarId = user?.avatarId ?? 0;
  const avatarSrc = CHARACTERS[avatarId];
  const profileSrc = PROFILES[avatarId];

  const handleCancel = () => {
    setEdit(false);
    setErrors({ fullName: "" });
    setForm(buildForm(user));
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      await updateUser({
        name: form.fullName.trim(),
        genero: form.genero || null,
        ageRange: form.ageRange || null,
        department: form.department || null,
        municipality: form.municipality || null,
        differentialFocus: form.differentialFocus || null,
      });
      setEdit(false);
      setToast({ type: "ok", msg: "Cambios guardados" });
    } catch (e) {
      setToast({ type: "err", msg: e?.message || "No se pudo guardar" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast({ type: "", msg: "" }), 3000);
    }
  };

  return (
    <div className={`mx-auto w-full max-w-[1200px] px-2 sm:px-4 lg:px-0${isSetupFlow ? " pb-28" : ""}`}>
      {isSetupFlow && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#202329]/95 backdrop-blur-md border-t border-white/10 p-4 pb-[calc(8rem+env(safe-area-inset-bottom))] lg:pb-4">
          <div className="max-w-sm mx-auto">
            <p className="text-xs text-white/50 text-center mb-2">Paso 1 de 2 &middot; Personaliza tu avatar</p>
            <button
              type="button"
              onClick={async () => {
                markAvatarConfigured();
                try { await submitAvatarDone(); } catch { /* best-effort */ }
                navigate("/courses");
              }}
              className="w-full rounded-xl py-3 bg-[#00b5e2] hover:brightness-105 active:brightness-95 text-white font-semibold text-sm transition cursor-pointer"
            >
              Listo, continuar al diagnóstico →
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <section className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 md:p-5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)]">
            <div className="relative">
              <img
                src={banner}
                alt=""
                className="h-28 w-full rounded-2xl object-cover md:h-32 select-none"
                draggable={false}
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 z-10">
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-full p-[3px] bg-gradient-to-tr from-[#00b5e2] via-[#5dd3f0] to-transparent">
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
                {user?.fullName || "Usuario"}
              </h2>
            </div>
          </section>

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
                               bg-gradient-to-b from-[#6EB9FF] to-[#6EB9FF]
                               shadow-[0_8px_24px_rgba(0,181,226,0.35)]
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
                    await updateUser({ avatarId: id });
                    // Mark avatar as configured on backend (best-effort)
                    try { await submitAvatarDone(); markAvatarConfigured(); } catch { /* ignore */ }
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

          {/* Edad pill / select editable */}
          {edit ? (
            <div className="mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/38 text-center mb-1.5">Grupo de edad</p>
              <select
                value={form.ageRange}
                onChange={(e) => setForm((f) => ({ ...f, ageRange: e.target.value }))}
                className="h-11 w-full rounded-full border border-white/12 bg-[#1c1f2a] px-4 text-sm text-white/80 focus:outline-none focus:border-[#6EB9FF]/50 cursor-pointer"
              >
                <option value="">– Selecciona –</option>
                {Object.entries(AGE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          ) : (
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
          )}

          <div className="space-y-2.5">
            {/* Email - siempre solo lectura */}
            <InfoRow icon={<MdEmail size={16} />} value={user?.email} />

            {/* Documento - siempre solo lectura */}
            <div className="flex gap-2">
              <div className="flex h-11 shrink-0 items-center rounded-full border border-white/12 bg-white/5 px-4 text-sm font-medium text-white/70">
                {DOC_LABELS[user?.documentType] || "–"}
              </div>
              <InfoRow icon={<MdBadge size={16} />} value={user?.dni} className="flex-1" />
            </div>

            {/* Nombre */}
            {edit ? (
              <div>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  placeholder="Nombre completo"
                  className="h-11 w-full rounded-full border border-white/12 bg-[#1c1f2a] px-4 text-sm text-white/85 focus:outline-none focus:border-[#6EB9FF]/50 placeholder:text-white/30"
                />
                {errors.fullName && (
                  <p className="text-xs text-red-400 mt-1 pl-4">{errors.fullName}</p>
                )}
              </div>
            ) : (
              <InfoRow icon={<MdPerson size={16} />} value={user?.fullName} />
            )}

            {/* Género */}
            {edit ? (
              <select
                value={form.genero}
                onChange={(e) => setForm((f) => ({ ...f, genero: e.target.value }))}
                className="h-11 w-full rounded-full border border-white/12 bg-[#1c1f2a] px-4 text-sm text-white/80 focus:outline-none focus:border-[#6EB9FF]/50 cursor-pointer"
              >
                <option value="">– Género –</option>
                {Object.entries(GENDER_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            ) : (
              <InfoRow icon={<MdPerson size={16} />} value={GENDER_LABELS[user?.genero]} />
            )}

            {/* Departamento */}
            {edit ? (
              <select
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value, municipality: "" }))}
                className="h-11 w-full rounded-full border border-white/12 bg-[#1c1f2a] px-4 text-sm text-white/80 focus:outline-none focus:border-[#6EB9FF]/50 cursor-pointer"
              >
                <option value="">– Departamento –</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            ) : (
              <InfoRow
                icon={<MdLocationOn size={16} />}
                value={DEPT_MAP[user?.department] || user?.department}
              />
            )}

            {/* Municipio */}
            {edit ? (
              <select
                value={form.municipality}
                onChange={(e) => setForm((f) => ({ ...f, municipality: e.target.value }))}
                className="h-11 w-full rounded-full border border-white/12 bg-[#1c1f2a] px-4 text-sm text-white/80 focus:outline-none focus:border-[#6EB9FF]/50 cursor-pointer"
              >
                <option value="">– Municipio –</option>
                {MUNICIPALITIES_ANTIOQUIA.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            ) : (
              <InfoRow
                icon={<MdLocationOn size={16} />}
                value={MUN_MAP[user?.municipality] || user?.municipality}
              />
            )}

            {/* Teléfono - siempre solo lectura */}
            <div className="flex gap-2">
              <div className="flex h-11 shrink-0 items-center rounded-full border border-white/12 bg-white/5 px-4 text-sm font-medium text-white/70">
                +57
              </div>
              <InfoRow icon={<MdPhone size={16} />} value={user?.phone} className="flex-1" />
            </div>

            {/* Enfoque diferencial */}
            {edit ? (
              <select
                value={form.differentialFocus}
                onChange={(e) => setForm((f) => ({ ...f, differentialFocus: e.target.value }))}
                className="h-11 w-full rounded-full border border-white/12 bg-[#1c1f2a] px-4 text-sm text-white/80 focus:outline-none focus:border-[#6EB9FF]/50 cursor-pointer"
              >
                <option value="">– Enfoque diferencial –</option>
                {Object.entries(FOCUS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            ) : (
              <InfoRow icon={<MdShield size={16} />} value={FOCUS_LABELS[user?.differentialFocus]} />
            )}
          </div>

          {/* Toast de guardado */}
          {toast.msg && (
            <div
              role="status"
              aria-live="polite"
              className={[
                "mt-3 text-sm px-3 py-2 rounded-md text-center transition-opacity",
                toast.type === "ok"
                  ? "bg-emerald-500/15 text-emerald-200 border border-emerald-400/30"
                  : "bg-red-500/15 text-red-200 border border-red-400/30",
              ].join(" ")}
            >
              {toast.msg}
            </div>
          )}

          {/* Botones editar / guardar / cancelar */}
          {edit ? (
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                className="text-sm text-white/50 hover:text-white/80 underline underline-offset-4 cursor-pointer transition-colors"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!canSave}
                onClick={handleSave}
                className="h-9 rounded-full px-5 bg-[#00b5e2] hover:brightness-105 active:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition cursor-pointer"
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          ) : (
            <div className="mt-5 flex items-center justify-end">
              <button
                className="text-sm text-white/75 hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
                onClick={() => setEdit(true)}
              >
                Editar
              </button>
            </div>
          )}

          {/* Perfil de riesgo vial */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-3">
              Diagnóstico de riesgo vial
            </p>
            {user?.riskProfile ? (() => {
              const cfg = {
                BAJO:  { bg: "bg-emerald-500/10", ring: "ring-emerald-500/30", text: "text-emerald-300", badge: "bg-emerald-500/20 text-emerald-300", dot: "🟢" },
                MEDIO: { bg: "bg-amber-500/10",   ring: "ring-amber-500/30",   text: "text-amber-300",   badge: "bg-amber-500/20   text-amber-300",   dot: "🟡" },
                ALTO:  { bg: "bg-red-500/10",     ring: "ring-red-500/30",     text: "text-red-300",     badge: "bg-red-500/20     text-red-300",     dot: "🔴" },
              }[user.riskProfile] ?? { bg: "bg-white/5", ring: "ring-white/10", text: "text-white", badge: "bg-white/10 text-white", dot: "⚪" };
              return (
                <div className={`rounded-2xl ring-1 ${cfg.ring} ${cfg.bg} px-4 py-3 flex items-center justify-between gap-3`}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl leading-none">{cfg.dot}</span>
                    <div>
                      <p className={`text-sm font-bold ${cfg.text}`}>RIESGO {user.riskProfile}</p>
                      <p className="text-xs text-white/45 mt-0.5">Score: {user.riskScore} pts · v1.0</p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${cfg.badge}`}>
                    {user.riskProfile === "BAJO" ? "Bajo" : user.riskProfile === "MEDIO" ? "Medio" : "Alto"}
                  </span>
                </div>
              );
            })() : (
              <div className="rounded-2xl ring-1 ring-white/8 bg-white/[0.03] px-4 py-3 flex items-center gap-2.5 text-sm text-white/40">
                <span className="text-base">⏳</span>
                <span>Diagnóstico no realizado aún</span>
              </div>
            )}
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
                    ? "bg-white/10 ring-[#6EB9FF] shadow-[0_8px_24px_rgba(0,181,226,0.35)]"
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
                     bg-gradient-to-b from-[#6EB9FF] to-[#6EB9FF]
                     shadow-[0_8px_24px_rgba(0,181,226,0.35)]
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