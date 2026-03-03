// src/components/auth/SignupCredentialsStep.jsx
import { motion } from "framer-motion";
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import Input from "../Input";
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

export default function SignupCredentialsStep({
  emailFixed,
  values,
  setValues,
  errors,
  rules,
  onBack,
  onSubmit,
  onToLogin,
}) {
  return (
    <motion.form
      key="signup-step2"
      onSubmit={onSubmit}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Input
        autoFocus
        aria-invalid={!!errors.email}
        placeholder="Email institucional"
        value={emailFixed}
        onChange={() => {}}
        type="email"
        size="lg"
        iconLeft={<MdEmail size={18} />}
        disabled
      />

      <div className="space-y-5 mt-5">
        <PasswordInput
          placeholder="Contraseña"
          value={values.pass}
          onChange={(e) => setValues((v) => ({ ...v, pass: e.target.value }))}
          size="lg"
          iconLeft={<MdLock size={18} />}
          iconShow={<MdVisibility size={18} />}
          iconHide={<MdVisibilityOff size={18} />}
          error={errors.pass}
        />
        <PasswordInput
          placeholder="Confirmar Contraseña"
          value={values.confirm}
          onChange={(e) =>
            setValues((v) => ({ ...v, confirm: e.target.value }))
          }
          size="lg"
          iconLeft={<MdLock size={18} />}
          iconShow={<MdVisibility size={18} />}
          iconHide={<MdVisibilityOff size={18} />}
          error={errors.confirm}
        />
      </div>

      <ul className="mt-3 mb-4 space-y-1.5 text-sm">
        <Rule ok={rules.len} label="8 caracteres mínimo" />
        <Rule ok={rules.upper} label="1 letra mayúscula" />
        <Rule ok={rules.special} label="1 carácter especial" />
      </ul>

      <div className="mb-2">
        <label className="flex items-start gap-3 cursor-pointer select-none group">
          {/* Hidden native checkbox */}
          <input
            type="checkbox"
            checked={values.accept}
            onChange={(e) =>
              setValues((v) => ({ ...v, accept: e.target.checked }))
            }
            className="sr-only"
          />
          {/* Custom checkbox box */}
          <span
            aria-hidden="true"
            className={[
              "mt-0.5 shrink-0 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
              values.accept
                ? "border-[#00b5e2] bg-[#00b5e2]"
                : errors.accept
                ? "border-red-400 bg-white/5"
                : "border-white/30 bg-white/5 group-hover:border-white/60",
            ].join(" ")}
          >
            {values.accept && (
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path
                  d="M1 4.5L4 7.5L10 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          {/* Label text */}
          <span className={`text-sm leading-snug ${errors.accept ? "text-red-300" : "text-white/75"}`}>
            Acepto el{" "}
            <a
              href="/documents/politica.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-medium text-[#00b5e2] underline underline-offset-2 hover:text-white transition-colors"
            >
              Aviso de Privacidad y Condiciones de Uso
            </a>
          </span>
        </label>
        {errors.accept && (
          <p className="mt-1 text-xs text-red-300">{errors.accept}</p>
        )}
      </div>

      <div className="flex gap-3 mt-4 mb-8">
        <button
          type="button"
          onClick={onBack}
          className="h-12 w-1/3 rounded-full bg-white/10 hover:bg-white/15 transition"
        >
          Volver
        </button>
        <button
          type="submit"
          className="h-12 flex-1 rounded-full bg-[#00b5e2] font-medium shadow-[0_6px_18px_rgba(0,181,226,0.35)] transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          Crear Cuenta
        </button>
      </div>

      <div className="text-center text-sm text-white/80">
        <div>¿Ya tienes cuenta?</div>
        <button
          type="button"
          onClick={onToLogin}
          className="underline underline-offset-4"
        >
          Inicia sesión.
        </button>
      </div>
    </motion.form>
  );
}
