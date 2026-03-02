// src/components/auth/SignupIdentityStep.jsx
import { useEffect } from "react";
import { motion } from "framer-motion";
import { MdEmail, MdLock, MdPerson, MdPhone, MdLocationOn } from "react-icons/md";
import Input from "../Input";
import SearchableSelect from "../SearchableSelect";

const ALLOWED_MUNICIPALITIES = [
  { value: "bello", label: "Bello" },
  { value: "rionegro", label: "Rionegro" },
  { value: "itagui", label: "Itagüí" },
  { value: "barbosa", label: "Barbosa" },
  { value: "copacabana", label: "Copacabana" },
  { value: "envigado", label: "Envigado" },
  { value: "guarne", label: "Guarne" },
  { value: "remedios", label: "Remedios" },
  { value: "vegachi", label: "Vegachí" },
  { value: "el_bagre", label: "El Bagre" },
];

const variants = {
  initial: { opacity: 0, x: -12 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: "easeOut" },
  },
  exit: { opacity: 0, x: 12, transition: { duration: 0.22, ease: "easeIn" } },
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

export default function SignupIdentityStep({
  values,
  setValues,
  errors,
  generalError,
  isVerifying,
  onValidate,
  onToLogin,
}) {
  // Default Antioquia on mount
  useEffect(() => {
    setValues((v) => ({
      ...v,
      department: v.department || "antioquia",
    }));
  }, []);

  return (
    <motion.form
      key="signup-step1"
      onSubmit={onValidate}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="space-y-5">
        {/* Departamento bloqueado: solo Antioquia */}
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 h-12 px-4 cursor-not-allowed opacity-60 select-none">
          <MdLocationOn size={18} className="text-white/30 shrink-0" />
          <span className="flex-1 text-sm text-white/70">Antioquia</span>
          <MdLock size={14} className="text-white/30 shrink-0" />
        </div>

        <SearchableSelect
          options={ALLOWED_MUNICIPALITIES}
          value={values.municipality || ""}
          onChange={(value) =>
            setValues((v) => ({ ...v, municipality: value }))
          }
          placeholder="Buscar municipio..."
          error={!!errors.municipality}
        />
        {errors.municipality && (
          <p className="text-xs text-red-300 -mt-4">{errors.municipality}</p>
        )}

        <Input
          placeholder="Nombres y Apellidos"
          value={values.fullName || ""}
          onChange={(e) =>
            setValues((v) => ({ ...v, fullName: e.target.value }))
          }
          size="lg"
          iconLeft={<MdPerson size={18} />}
          error={errors.fullName}
        />

        <div className="flex gap-2">
          <label className="block w-auto">
            <div
              className={`group flex items-center gap-2 rounded-full border h-12 px-2 transition-colors ${
                errors.documentType
                  ? "border-red-400/70 focus-within:border-red-300 bg-red-500/5"
                  : "border-white/15 focus-within:border-white/25 bg-white/5 focus-within:bg-white/10"
              }`}
            >
              <select
                value={values.documentType || "cc"}
                onChange={(e) =>
                  setValues((v) => ({ ...v, documentType: e.target.value }))
                }
                aria-invalid={!!errors.documentType}
                className="peer min-w-0 bg-transparent text-white outline-none appearance-none cursor-pointer text-sm text-center"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.2rem center",
                  paddingRight: "1rem",
                  width: "64px",
                  textAlignLast: "center",
                }}
              >
                <option value="cc">C.C</option>
                <option value="ti">T.I</option>
                <option value="pa">P.A</option>
              </select>
            </div>
          </label>

          <div className="flex-1">
            <Input
              placeholder="Número de Documento"
              value={values.dni || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setValues((v) => ({ ...v, dni: value }));
              }}
              size="lg"
              iconLeft={<MdLock size={18} />}
              error={errors.dni}
            />
          </div>
        </div>
        {errors.documentType && (
          <p className="text-xs text-red-300 mt-2">{errors.documentType}</p>
        )}

        <Input
          autoFocus
          aria-invalid={!!errors.email}
          placeholder="Correo Electrónico"
          value={values.email || ""}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          type="email"
          size="lg"
          iconLeft={<MdEmail size={18} />}
          error={errors.email}
          helperText={
            !errors.email && values.email
              ? isValidEmail(values.email)
                ? "Correo válido"
                : "Correo inválido"
              : ""
          }
        />

        <div className="flex gap-2">
          <label className="block w-auto">
            <div
              className="group flex items-center gap-2 rounded-full border h-12 px-2 transition-colors border-white/15 bg-white/5"
            >
              <select
                value="+57"
                disabled
                className="peer bg-transparent text-white outline-none appearance-none cursor-not-allowed text-sm text-center"
                style={{
                  width: "52px",
                  textAlignLast: "center",
                }}
              >
                <option value="+57">+57</option>
              </select>
            </div>
          </label>

          <div className="flex-1">
            <Input
              placeholder="Número de Celular"
              value={values.phone || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setValues((v) => ({ ...v, phone: value }));
              }}
              size="lg"
              iconLeft={<MdPhone size={18} />}
              error={errors.phone}
              helperText={
                !errors.phone && values.phone
                  ? isValidPhoneNumber(values.phone)
                    ? "Número válido"
                    : "Debe ser 10 dígitos"
                  : ""
              }
            />
          </div>
        </div>
        {generalError && (
          <div
            role="alert"
            className="text-sm rounded-md bg-red-500/10 border border-red-400/40 text-red-200 px-3 py-2"
          >
            {generalError}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isVerifying}
        className="mt-7 mb-8 h-12 w-full rounded-full bg-[#00b5e2] text-white font-medium shadow-[0_6px_18px_rgba(0,181,226,0.35)] transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00b5e2]/60 disabled:opacity-60"
      >
        {isVerifying ? "Cargando..." : "Continuar"}
      </button>

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
