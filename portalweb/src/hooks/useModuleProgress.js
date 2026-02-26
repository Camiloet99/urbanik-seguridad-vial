import { useCallback, useEffect, useState } from "react";
import {
  emptyProgress,
  getCourseProgress,
  getModuleProgress,
  getMyProgress,
  isMonedaEarned,
  buildMonedaMap,
  submitTest,
} from "@/services/progressService";

/**
 * Hook that loads `/progress/me` and exposes typed helpers.
 *
 * Usage (in a course page or form):
 *
 *   const {
 *     progress, loading, error, refresh,
 *     getModule,     // (modulo: 1-6) => { testInitialDone, testExitDone, calificationDone }
 *     getCourse,     // (courseKey)   => same as above
 *     monedaMap,     // Map<courseKey, boolean>
 *     markDone,      // async (modulo, type) => void  – calls POST and refreshes
 *   } = useModuleProgress();
 */
export function useModuleProgress() {
  const [progress, setProgress] = useState(() => emptyProgress());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await getMyProgress();
      setProgress(data ?? emptyProgress());
    } catch (e) {
      console.error("[useModuleProgress] fetch error:", e);
      setError(e?.message ?? "Error cargando progreso");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * Marks a test/calification as done and refreshes progress.
   *
   * @param {number} modulo   1–6
   * @param {"test-inicial"|"test-salida"|"calificacion"} type
   */
  const markDone = useCallback(
    async (modulo, type) => {
      await submitTest(modulo, type);
      await refresh();
    },
    [refresh]
  );

  const getModule = useCallback(
    (modulo) => getModuleProgress(progress, modulo),
    [progress]
  );

  const getCourse = useCallback(
    (courseKey) => getCourseProgress(progress, courseKey),
    [progress]
  );

  const monedaMap = buildMonedaMap(progress);

  const monedas = progress.monedas;
  const allMonedas = monedas
    ? [1, 2, 3, 4, 5, 6].every((n) => isMonedaEarned(progress, n))
    : false;

  return {
    /** Raw API response */
    progress,
    loading,
    error,
    /** Re-fetch from the server */
    refresh,
    /** Get progress for a given module number (1-6) */
    getModule,
    /** Get progress for a given course key */
    getCourse,
    /** Map<courseKey, boolean> of moneda completions */
    monedaMap,
    /** Moneda status object { moneda1...moneda6 } */
    monedas,
    /** true if all 6 monedas are earned */
    allMonedas,
    /** Mark a test/calification done for a module, then refreshes */
    markDone,
  };
}
