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
 * @param {"test-inicial"|"test-salida"|"calificacion"|"introduccion"|"pdf1"|"pdf2"|"pdf3"|"pdf4"} type
 */
export async function submitTest(modulo, type) {
  const token = getAuthToken();
  return http.post("/progress/me/tests", { modulo, type }, { token });
}

/**
 * Marks the intro video/section as viewed for a module.
 * @param {number} modulo  1–6
 */
export async function submitIntroduccion(modulo) {
  return submitTest(modulo, "introduccion");
}

/**
 * Marks a specific PDF as read for a module.
 * @param {number} modulo   1–6
 * @param {1|2|3|4} pdfNum  PDF number
 */
export async function submitPdfRead(modulo, pdfNum) {
  if (pdfNum < 1 || pdfNum > 4) throw new Error("pdfNum must be 1–4");
  return submitTest(modulo, `pdf${pdfNum}`);
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
      introduccionDone: false,
      pdf1Done: false,
      pdf2Done: false,
      pdf3Done: false,
      pdf4Done: false,
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
  return found ?? {
    modulo,
    testInitialDone: false,
    testExitDone: false,
    calificationDone: false,
    introduccionDone: false,
    pdf1Done: false,
    pdf2Done: false,
    pdf3Done: false,
    pdf4Done: false,
  };
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
// Experiencia gamificada tracking  (per-module, localStorage)
// ---------------------------------------------------------------------------

const EXPERIENCIA_PREFIX = "experiencia_done_";

/**
 * Returns true if the user has clicked into the gamified experience for the
 * given module. This is used to gate the Test de Salida within a module.
 * @param {number} modulo  1–6
 */
export function isExperienciaDone(modulo) {
  try { return localStorage.getItem(EXPERIENCIA_PREFIX + modulo) === "true"; } catch { return false; }
}

/** Marks the gamified experience for a module as entered/done. */
export function markExperienciaDone(modulo) {
  try { localStorage.setItem(EXPERIENCIA_PREFIX + modulo, "true"); } catch { /* ignore */ }
}

// ---------------------------------------------------------------------------
// Avatar setup tracking  (localStorage gate for the onboarding flow)
// ---------------------------------------------------------------------------

const AVATAR_KEY = "avatar_configured";

/** Returns true if the user has gone through the initial avatar setup step. */
export function isAvatarConfigured() {
  try {
    return localStorage.getItem(AVATAR_KEY) === "true";
  } catch {
    return false;
  }
}

/** Marks avatar setup as done (called from Profile when returning to /courses). */
export function markAvatarConfigured() {
  try {
    localStorage.setItem(AVATAR_KEY, "true");
  } catch { /* ignore */ }
}

/** Clears avatar setup flag (useful for testing / logout). */
export function clearAvatarConfigured() {
  try {
    localStorage.removeItem(AVATAR_KEY);
  } catch { /* ignore */ }
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
 * Called by fetchProgress after a successful backend response.
 * Keeps localStorage in sync with the backend's testInicialGeneral flag.
 * @param {boolean} done
 */
export function syncDiagnosticoFromBackend(done) {
  try {
    if (done) {
      // Backend confirmed — ensure localStorage also marks it done
      const raw = localStorage.getItem(DIAG_KEY);
      const existing = raw ? JSON.parse(raw) : {};
      if (!existing?.done) {
        localStorage.setItem(DIAG_KEY, JSON.stringify({ ...existing, done: true }));
      }
    } else {
      // Backend says not done — remove stale localStorage flag
      localStorage.removeItem(DIAG_KEY);
    }
  } catch {
    // ignore storage errors
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
  } catch (err) {
    // Local flag is the UI gate; backend sync is best-effort.
    // Log so it's visible in DevTools if something is wrong.
    console.warn("[submitDiagnostico] backend sync failed:", err);
  }
  return payload;
}
