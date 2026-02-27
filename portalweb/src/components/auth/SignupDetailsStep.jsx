// src/components/auth/SignupDetailsStep.jsx
import { motion } from "framer-motion";
import {
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import PasswordInput from "../PasswordInput";

const variants = {
  initial: { opacity: 0, x: -12 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: "easeOut" },
  },
  exit: { opacity: 0, x: 12, transition: { duration: 0.22, ease: "easeIn" } },
};

const AGE_RANGES = [
  { value: "16-25", label: "16 – 25 · Joven" },
  { value: "25-34", label: "25 – 34 · Adulto Joven" },
  { value: "35-59", label: "35 – 59 · Adulto" },
  { value: "60+", label: "60+ · Adulto Mayor" },
];

const GENDERS = [
  { value: "male", label: "Hombre" },
  { value: "female", label: "Mujer" },
  { value: "non-binary", label: "Persona no binaria" },
  { value: "prefer-not-say", label: "Prefiero no decirlo" },
];

const DIFFERENTIAL_FOCUS = [
  { value: "lgbtiq", label: "Población LGTBIQ+" },
  { value: "ethnic", label: "Población étnica (afro, indígena, raizal, Rrom)" },
  { value: "armed-conflict", label: "Víctima del conflicto armado" },
  { value: "disability", label: "Persona con discapacidad" },
  { value: "female-head", label: "Mujer cabeza de hogar" },
  { value: "none", label: "Ninguno" },
  { value: "prefer-not-say", label: "Prefiero no decirlo" },
];

// Custom chevron arrow encoded for the select background
const CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300b5e2' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`;

function SelectField({ placeholder, value, onChange, options, error }) {
  const hasValue = value !== "";
  return (
    <div className="relative group">
      <div
        className={`flex items-center rounded-2xl border h-12 px-4 transition-all duration-200 ${
          error
            ? "border-red-400/60 bg-red-500/5 shadow-[0_0_0_3px_rgba(248,113,113,0.1)]"
            : hasValue
            ? "border-[#00b5e2]/50 bg-white/5 shadow-[0_0_0_3px_rgba(0,181,226,0.08)]"
            : "border-white/12 bg-white/5 focus-within:border-[#00b5e2]/50 focus-within:bg-white/8 focus-within:shadow-[0_0_0_3px_rgba(0,181,226,0.08)]"
        }`}
      >
        <select
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          className="peer min-w-0 flex-1 bg-transparent outline-none appearance-none cursor-pointer text-sm transition-colors"
          style={{
            backgroundImage: CHEVRON,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.25rem center",
            paddingRight: "1.5rem",
            color: hasValue ? "white" : "rgba(255,255,255,0.38)",
          }}
        >
          <option value="" disabled style={{ color: "#888", background: "#202329" }}>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              style={{ color: "white", background: "#202329" }}
            >
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-300 pl-1">{error}</p>
      )}
    </div>
  );
}

function Rule({ ok, label }) {
  return (
    <li
      className={`flex items-center gap-2 ${
        ok ? "text-white/85" : "text-white/55"
      }`}
    >
      {ok ? (
        <MdCheckCircle size={18} className="text-emerald-400" />
      ) : (
        <MdCancel size={18} className="text-red-300/80" />
      )}
      <span>{label}</span>
    </li>
  );
}

export default function SignupDetailsStep({
  values,
  setValues,
  errors,
  rules,
  onBack,
  onSubmit,
  isSubmitting,
}) {
  return (
    <motion.form
      key="signup-details"
      onSubmit={onSubmit}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="space-y-4">
        <SelectField
          placeholder="Rango de edad"
          value={values.ageRange || ""}
          onChange={(e) => setValues((v) => ({ ...v, ageRange: e.target.value }))}
          options={AGE_RANGES}
          error={errors.ageRange}
        />

        <SelectField
          placeholder="Género"
          value={values.gender || ""}
          onChange={(e) => setValues((v) => ({ ...v, gender: e.target.value }))}
          options={GENDERS}
          error={errors.gender}
        />

        <SelectField
          placeholder="Enfoque diferencial"
          value={values.differentialFocus || ""}
          onChange={(e) =>
            setValues((v) => ({ ...v, differentialFocus: e.target.value }))
          }
          options={DIFFERENTIAL_FOCUS}
          error={errors.differentialFocus}
        />

        <PasswordInput
          placeholder="Contraseña"
          value={values.pass || ""}
          onChange={(e) => setValues((v) => ({ ...v, pass: e.target.value }))}
          size="lg"
          iconShow={<MdVisibility size={18} />}
          iconHide={<MdVisibilityOff size={18} />}
          error={errors.pass}
        />

        <PasswordInput
          placeholder="Confirmar Contraseña"
          value={values.confirm || ""}
          onChange={(e) =>
            setValues((v) => ({ ...v, confirm: e.target.value }))
          }
          size="lg"
          iconShow={<MdVisibility size={18} />}
          iconHide={<MdVisibilityOff size={18} />}
          error={errors.confirm}
        />
      </div>

      <ul className="mt-3 mb-6 space-y-1.5 text-sm">
        <Rule ok={rules.len} label="8 caracteres mínimo" />
        <Rule ok={rules.upper} label="1 letra mayúscula" />
        <Rule ok={rules.special} label="1 carácter especial" />
      </ul>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 h-12 rounded-full border border-white/20 font-medium text-white transition hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          Atrás
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-12 rounded-full bg-[#00b5e2] text-white font-medium shadow-[0_6px_18px_rgba(0,181,226,0.35)] transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00b5e2]/60 disabled:opacity-60"
        >
          {isSubmitting ? "Creando..." : "Crear Cuenta"}
        </button>
      </div>
    </motion.form>
  );
}
