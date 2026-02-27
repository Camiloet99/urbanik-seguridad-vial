import { http } from "@/services/http";
import { getAuthToken } from "@/services/session";

// ---------------------------------------------------------------------------
// Map: courseKey  →  modulo number (1-6)
// ---------------------------------------------------------------------------
export const COURSE_KEY_TO_MODULO = {
  "punto-cero-calma":   1,
  "bosque-emociones":   2,
  "jardin-mental":      3,
  "lago-suenos":        4,
  "modulo-5":           5,
  "modulo-6":           6,
};

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

/**
 * GET /progress/me
 *
 * Returns:
 * {
 *   general: { testInicialGeneral: bool, testFinalGeneral: bool },
 *   modulos: [
 *     { modulo: 1, testInitialDone, testExitDone, calificationDone },
 *     ...
 *     { modulo: 6, testInitialDone, testExitDone, calificationDone },
 *   ],
 *   monedas: { moneda1, moneda2, moneda3, moneda4, moneda5, moneda6 },
 * }
 */
export async function getMyProgress() {
  const token = getAuthToken();
  return http.get("/progress/me", { token });
}

/**
 * POST /progress/me/tests
 *
 * @param {number} modulo   Module number 1–6.
 * @param {"test-inicial"|"test-salida"|"calificacion"} type
 */
export async function submitTest(modulo, type) {
  const token = getAuthToken();
  return http.post("/progress/me/tests", { modulo, type }, { token });
}

// ---------------------------------------------------------------------------
// Utility helpers  (pure functions – no API calls)
// ---------------------------------------------------------------------------

/**
 * Returns an empty normalised progress object so the UI never crashes
 * while data is loading.
 */
export function emptyProgress() {
  return {
    general: { testInicialGeneral: false, testFinalGeneral: false },
    modulos: [1, 2, 3, 4, 5, 6].map((n) => ({
      modulo: n,
      testInitialDone: false,
      testExitDone: false,
      calificationDone: false,
    })),
    monedas: {
      moneda1: false, moneda2: false, moneda3: false,
      moneda4: false, moneda5: false, moneda6: false,
    },
  };
}

/**
 * Returns the general (pre-module) progress flags.
 *
 * @param {object} progress  Result from getMyProgress()
 * @returns {{ testInicialGeneral: boolean, testFinalGeneral: boolean }}
 */
export function getGeneralProgress(progress) {
  return progress?.general ?? { testInicialGeneral: false, testFinalGeneral: false };
}

/**
 * Returns the ModuloProgress object for a specific module number.
 * Falls back to an all-false object if the backend hasn't returned it yet.
 *
 * @param {object} progress  Result from getMyProgress()
 * @param {number} modulo    1–6
 */
export function getModuleProgress(progress, modulo) {
  const found = progress?.modulos?.find((m) => m.modulo === modulo);
  return found ?? { modulo, testInitialDone: false, testExitDone: false, calificationDone: false };
}

/**
 * Returns the ModuloProgress for the given courseKey.
 * Convenience wrapper around getModuleProgress.
 *
 * @param {object} progress   Result from getMyProgress()
 * @param {string} courseKey  e.g. "bosque-emociones"
 */
export function getCourseProgress(progress, courseKey) {
  const modulo = COURSE_KEY_TO_MODULO[courseKey];
  if (!modulo) return { modulo: null, testInitialDone: false, testExitDone: false, calificationDone: false };
  return getModuleProgress(progress, modulo);
}

/**
 * Returns true if the module-level moneda is earned (moneda N === módulo N).
 *
 * @param {object} progress  Result from getMyProgress()
 * @param {number} modulo    1–6
 */
export function isMonedaEarned(progress, modulo) {
  const key = `moneda${modulo}`;
  return !!progress?.monedas?.[key];
}

/**
 * Returns a plain Map<courseKey, boolean> of moneda completions,
 * suitable for CourseCard / ProgressCard components.
 *
 * @param {object} progress  Result from getMyProgress()
 */
export function buildMonedaMap(progress) {
  const map = new Map();
  Object.entries(COURSE_KEY_TO_MODULO).forEach(([key, modulo]) => {
    map.set(key, isMonedaEarned(progress, modulo));
  });
  return map;
}

// ---------------------------------------------------------------------------
// Diagnóstico de Perfil de Riesgo Vial (test general previo a módulos)
// ---------------------------------------------------------------------------

const DIAG_KEY = "risk_profile";

/**
 * Returns true if the user has completed the general risk-profile diagnostic.
 * Uses localStorage as the source of truth (backend is best-effort).
 */
export function isDiagnosticoDone() {
  try {
    const raw = localStorage.getItem(DIAG_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed?.done;
  } catch {
    return false;
  }
}

/**
 * Returns the saved risk profile result object or null.
 * Shape: { score, profile, version, submittedAt }
 */
export function getDiagnosticoResult() {
  try {
    const raw = localStorage.getItem(DIAG_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Persists the diagnostic result locally and posts it to the backend.
 * @param {{ score: number, profile: "BAJO"|"MEDIO"|"ALTO", responses: object }} result
 */
export async function submitDiagnostico(result) {
  const payload = {
    ...result,
    done: true,
    version: "1.0",
    submittedAt: new Date().toISOString(),
  };
  // Persist locally first — this is the gate used by the UI
  localStorage.setItem(DIAG_KEY, JSON.stringify(payload));

  // Mark testInicialGeneral on the backend (modulo 0, type "test-inicial")
  try {
    const token = getAuthToken();
    await http.post(
      "/progress/me/tests",
      { modulo: 0, type: "test-inicial" },
      { token }
    );
  } catch {
    // Local flag is enough as UI gate; backend sync is best-effort
  }
  return payload;
}
