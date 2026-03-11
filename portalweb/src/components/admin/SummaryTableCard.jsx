// src/components/admin/SummaryTableCard.jsx
import { useMemo, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { DEPARTMENTS } from "@/data/colombiaData";

// ── Label maps ────────────────────────────────────────────────────────────────
const DEPT_MAP = Object.fromEntries(DEPARTMENTS.map((d) => [d.value, d.label]));

const GENERO_MAP = {
  male:              "Masculino",
  female:            "Femenino",
  "non-binary":      "No binario/a",
  "prefer-not-say":  "Prefiero no decirlo",
};

const FOCUS_MAP = {
  lgbtiq:           "Población LGBTIQ+",
  ethnic:           "Población étnica",
  "armed-conflict": "Víctima del conflicto",
  disability:       "Persona con discapacidad",
  "female-head":    "Mujer cabeza de hogar",
  none:             "Ninguno",
  "prefer-not-say": "Prefiero no decirlo",
};

const AGE_MAP = {
  "16-25": "16 – 25",
  "16-24": "16 – 24",
  "25-34": "25 – 34",
  "35-59": "35 – 59",
  "60+":   "60+",
};

// Capitalize first letter of each word (for raw municipality slugs like "rionegro" → "Rionegro")
const toLabel = (slug) =>
  slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

function getCompletionState(rawStatus) {
  const progress = getProgressFromStatus(rawStatus);
  return progress >= 100 ? "complete" : "progress";
}

function StatusPill({ status }) {
  const state = getCompletionState(status); // "complete" o "progress"
  const isComplete = state === "complete";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium",
        isComplete
          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/60"
          : "bg-sky-500/10 text-sky-300 border border-sky-500/60",
      ].join(" ")}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {isComplete ? "Finalizado" : "En proceso"}
    </span>
  );
}

function RiskPill({ profile }) {
  if (!profile) return <span className="text-white/30 text-[11px]">–</span>;
  const cfg = {
    BAJO:  { cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40", dot: "🟢" },
    MEDIO: { cls: "bg-amber-500/10   text-amber-300   border-amber-500/40",   dot: "🟡" },
    ALTO:  { cls: "bg-red-500/10     text-red-300     border-red-500/40",     dot: "🔴" },
  }[profile] ?? { cls: "bg-white/5 text-white/50 border-white/20", dot: "⚪" };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border ${cfg.cls}`}>
      <span className="text-[10px] leading-none">{cfg.dot}</span>
      {profile}
    </span>
  );
}

function getProgressFromStatus(rawStatus) {
  // Caso nuevo: número directo (0-100)
  if (typeof rawStatus === "number" && !Number.isNaN(rawStatus)) {
    return Math.min(Math.max(rawStatus, 0), 100);
  }

  // Caso string numérica: "80"
  if (typeof rawStatus === "string") {
    const parsed = parseInt(rawStatus, 10);
    if (!Number.isNaN(parsed)) {
      return Math.min(Math.max(parsed, 0), 100);
    }
  }

  // Compatibilidad hacia atrás: antes enviábamos "complete" / "progress"
  if (rawStatus === "complete") return 100;
  if (rawStatus === "progress") return 60;

  // Por defecto, nada hecho
  return 0;
}

/** Header con icono de orden y estado activo */
function SortableHeader({ label, field, sortConfig, onSort }) {
  const isActive = sortConfig.field === field;
  const isAsc = sortConfig.direction === "asc";

  return (
    <th className="py-2 px-4 text-left font-medium">
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1 text-[11px] md:text-xs text-white/60 hover:text-white/90 transition-colors"
      >
        <span>{label}</span>
        <span className="inline-flex flex-col leading-none">
          {/* flecha arriba */}
          <svg
            className={`h-2.5 w-2.5 ${
              isActive && isAsc ? "opacity-100" : "opacity-40"
            }`}
            viewBox="0 0 12 12"
            aria-hidden="true"
          >
            <path d="M6 3L3.5 6h5L6 3z" fill="currentColor" />
          </svg>
          {/* flecha abajo */}
          <svg
            className={`h-2.5 w-2.5 -mt-[2px] ${
              isActive && !isAsc ? "opacity-100" : "opacity-40"
            }`}
            viewBox="0 0 12 12"
            aria-hidden="true"
          >
            <path d="M6 9l2.5-3h-5L6 9z" fill="currentColor" />
          </svg>
        </span>
      </button>
    </th>
  );
}

export default function SummaryTableCard({
  users,
  loading,
  error,
  page = 0,
  size = 20,
  total = 0,
  onPageChange,
}) {
  const [sortConfig, setSortConfig] = useState({
    field: "name",
    direction: "asc",
  });

  const handleSort = (field) => {
    setSortConfig((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { field, direction: "asc" }
    );
  };

  const sortedUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];

    const dir = sortConfig.direction === "asc" ? 1 : -1;

    const getValue = (u) => {
      switch (sortConfig.field) {
        case "name":       return u.fullName || u.name || "";
        case "document":   return u.dni || "";
        case "department": return u.department || "";
        case "municipality": return u.municipality || "";
        case "phone":      return u.phone || "";
        case "genero":     return u.genero || "";
        case "edad":       return u.ageRange || u.edad || "";
        case "enfoque":    return u.differentialFocus || u.enfoqueDiferencial || "";
        case "riesgo":     return u.riskProfile || "";
        case "avance":     return getProgressFromStatus(u.experienceStatus);
        default:           return "";
      }
    };

    const clone = [...users];
    clone.sort((a, b) => {
      const va = getValue(a);
      const vb = getValue(b);

      if (typeof va === "number" && typeof vb === "number") {
        return (va - vb) * dir;
      }
      return String(va).localeCompare(String(vb)) * dir;
    });

    return clone;
  }, [users, sortConfig]);

  const totalPages = Math.max(Math.ceil(total / size), 1);
  const canGoPrev = page > 0;
  const canGoNext = page + 1 < totalPages;

  const handlePrev = () => {
    if (!onPageChange || !canGoPrev) return;
    onPageChange(page - 1);
  };

  const handleNext = () => {
    if (!onPageChange || !canGoNext) return;
    onPageChange(page + 1);
  };

  return (
    <section className="rounded-[32px] bg-[#2a2e40] border border-black/20 px-5 py-4 md:px-6 md:py-5 shadow-[0_16px_36px_rgba(0,0,0,0.45)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base md:text-lg font-semibold">Tabla resumen</h3>
        <span className="text-[11px] md:text-xs text-white/60">
          Estados:{" "}
          <span className="text-emerald-300 font-medium">Finalizado</span> /{" "}
          <span className="text-sky-300 font-medium">En proceso</span>
        </span>
      </div>

      {loading ? (
        <div className="py-10 flex justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-sm text-red-300">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-white/70">
          No hay usuarios registrados aún.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <SortableHeader label="Estudiante"          field="name"       sortConfig={sortConfig} onSort={handleSort} />
                  <SortableHeader label="Documento"           field="document"   sortConfig={sortConfig} onSort={handleSort} />
                  <SortableHeader label="Departamento"        field="department" sortConfig={sortConfig} onSort={handleSort} />
                  <SortableHeader label="Municipio"           field="municipality" sortConfig={sortConfig} onSort={handleSort} />
                  <SortableHeader label="Teléfono"            field="phone"      sortConfig={sortConfig} onSort={handleSort} />
                  <SortableHeader label="Género"              field="genero"     sortConfig={sortConfig} onSort={handleSort} />
                  <SortableHeader label="Rango de edad"       field="edad"       sortConfig={sortConfig} onSort={handleSort} />
                  <SortableHeader label="Enfoque diferencial" field="enfoque"    sortConfig={sortConfig} onSort={handleSort} />
                  <SortableHeader label="Perfil de riesgo"    field="riesgo"     sortConfig={sortConfig} onSort={handleSort} />
                  <SortableHeader label="% de avance"         field="avance"     sortConfig={sortConfig} onSort={handleSort} />
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((u) => {
                  const progress = getProgressFromStatus(u.experienceStatus);
                  return (
                    <tr
                      key={u.id ?? u.email}
                      className="border-b border-white/5 last:border-b-0 hover:bg-white/5"
                    >
                      {/* Estudiante */}
                      <td className="py-2 pr-4 align-middle">
                        <div className="flex flex-col">
                          <span className="text-xs md:text-sm text-white/75">
                            {u.fullName || u.name || "-"}
                          </span>
                          <span className="text-[11px] text-white/50">{u.email}</span>
                        </div>
                      </td>

                      {/* Documento */}
                      <td className="py-2 px-4 align-middle text-[11px] md:text-xs whitespace-nowrap">
                        <span className="text-white/40 mr-1 uppercase">{u.documentType || "CC"}</span>
                        {u.dni || "-"}
                      </td>

                      {/* Departamento */}
                      <td className="py-2 px-4 align-middle text-[11px] md:text-xs">
                        {DEPT_MAP[u.department] || toLabel(u.department) || "-"}
                      </td>

                      {/* Municipio */}
                      <td className="py-2 px-4 align-middle text-[11px] md:text-xs">
                        {toLabel(u.municipality) || "-"}
                      </td>

                      {/* Teléfono */}
                      <td className="py-2 px-4 align-middle text-[11px] md:text-xs whitespace-nowrap">
                        {u.phone || "-"}
                      </td>

                      {/* Género */}
                      <td className="py-2 px-4 align-middle text-[11px] md:text-xs">
                        {GENERO_MAP[u.genero] || toLabel(u.genero) || "-"}
                      </td>

                      {/* Rango de edad */}
                      <td className="py-2 px-4 align-middle text-[11px] md:text-xs whitespace-nowrap">
                        {AGE_MAP[u.ageRange ?? u.edad] || u.ageRange || u.edad || "-"}
                      </td>

                      {/* Enfoque diferencial */}
                      <td className="py-2 px-4 align-middle text-[11px] md:text-xs max-w-[160px]">
                        <span className="line-clamp-2">
                          {FOCUS_MAP[u.differentialFocus ?? u.enfoqueDiferencial] ||
                            u.differentialFocus || u.enfoqueDiferencial || "-"}
                        </span>
                      </td>

                      {/* Perfil de riesgo */}
                      <td className="py-2 px-4 align-middle">
                        <RiskPill profile={u.riskProfile} />
                      </td>

                      {/* % de avance */}
                      <td className="py-2 px-4 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="relative h-2 w-16 sm:w-20 md:w-24 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-sky-400"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-[11px] md:text-xs text-white/70">
                            {progress}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginador */}
          <div className="mt-4 flex items-center justify-between text-[11px] md:text-xs text-white/70">
            <span>
              Página {page + 1} de {totalPages} · {users.length} registros en
              esta página · {total} total
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!canGoPrev}
                className={[
                  "px-3 py-1 rounded-full border border-white/20",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  "hover:bg-white/10 transition-colors",
                ].join(" ")}
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext}
                className={[
                  "px-3 py-1 rounded-full border border-white/20",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  "hover:bg-white/10 transition-colors",
                ].join(" ")}
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
