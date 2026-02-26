// src/services/testsService.js
import { submitTest } from "@/services/progressService";

/**
 * Marks test-inicial as done for a given module.
 * @param {number} modulo  1–6
 * @param {any}    _payload  Form data (stored/sent elsewhere if needed)
 */
export async function submitInitialTest(modulo, _payload) {
  await submitTest(modulo, "test-inicial");
  return { ok: true };
}

/**
 * Marks test-salida as done for a given module.
 * @param {number} modulo  1–6
 */
export async function submitExitTest(modulo, _payload) {
  await submitTest(modulo, "test-salida");
  return { ok: true };
}

/**
 * Marks calificacion as done for a given module.
 * @param {number} modulo  1–6
 */
export async function submitCalification(modulo, _payload) {
  await submitTest(modulo, "calificacion");
  return { ok: true };
}
