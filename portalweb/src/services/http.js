import { getAuthToken } from "@/services/session";

// 👉 En dev usas VITE_API_URL; en prod, misma origin (cadena vacía)
const BASE_URL = import.meta.env.VITE_API_URL ?? "";
const TIMEOUT_MS = 15_000;

// Reintentos automáticos SOLO ante fallos de red/timeout (nunca ante respuestas
// HTTP: un 409 "ya existe" o un 400 no se reintentan, sería inútil). Backoff corto.
const DEFAULT_RETRIES = 2; // 3 intentos en total
const RETRY_BASE_MS = 400; // 1er reintento ~400ms, 2do ~800ms (+ jitter)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isRetriable = (err) => err?.code === "NETWORK" || err?.code === "TIMEOUT";

function emitUnauthorized() {
  try {
    window.dispatchEvent(new CustomEvent("app:unauthorized"));
  } catch {}
}

// Construye un Error con contexto útil para diagnosticar desde un pantallazo.
// Mantiene .status y .data para no romper el manejo de errores existente.
function buildError(message, { code, status, data, method, path } = {}) {
  const err = new Error(message);
  err.code = code;
  if (status != null) err.status = status;
  if (data != null) err.data = data;
  err.endpoint = `${method} ${path}`;
  return err;
}

// Envuelve la petición con reintentos + backoff exponencial corto.
async function request(method, path, body, opts = {}) {
  const retries = opts.retries ?? DEFAULT_RETRIES;
  let attempt = 0;

  while (true) {
    try {
      return await doRequest(method, path, body, opts);
    } catch (err) {
      if (isRetriable(err) && attempt < retries) {
        const wait = RETRY_BASE_MS * 2 ** attempt + Math.random() * 150;
        attempt += 1;
        await sleep(wait);
        continue;
      }
      throw err;
    }
  }
}

async function doRequest(method, path, body, { token } = {}) {
  const headers = { "Content-Type": "application/json" };
  const authToken = token ?? getAuthToken();
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const controller = new AbortController();
  // Marcamos explícitamente cuándo el abort lo provocó NUESTRO timeout, para no
  // depender de e.name === "AbortError" (frágil entre navegadores) y para poder
  // distinguirlo con certeza.
  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);

  let res;
  let text;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    // La lectura del body también puede abortarse si el timeout dispara mientras
    // el servidor envía la respuesta: por eso va DENTRO del try (antes quedaba
    // fuera y el "signal is aborted without reason" se filtraba crudo a la UI).
    text = await res.text();
  } catch (e) {
    // La petición no se completó (fallo de red o abort por timeout), no es una
    // respuesta HTTP. Aquí es donde antes aparecía "Failed to fetch" o el
    // críptico "signal is aborted without reason".
    if (timedOut || e?.name === "AbortError") {
      throw buildError(
        `El servidor tardó más de ${
          TIMEOUT_MS / 1000
        }s en responder y se canceló la solicitud. Puede estar saturado por muchas peticiones a la vez; espera unos segundos e inténtalo de nuevo.`,
        { code: "TIMEOUT", method, path }
      );
    }
    throw buildError(
      "No pudimos conectar con el servidor. Puede estar caído o saturado, o falló tu conexión a internet. Espera unos segundos e inténtalo de nuevo.",
      { code: "NETWORK", method, path }
    );
  } finally {
    clearTimeout(timeoutId);
  }

  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {}
  }

  if (!res.ok) {
    if (res.status === 401) emitUnauthorized();
    const serverMsg = data?.detail || data?.message;
    const message =
      serverMsg ||
      `El servidor respondió con un error (HTTP ${res.status}). Inténtalo de nuevo en unos segundos.`;
    throw buildError(message, {
      code: data?.code || `HTTP_${res.status}`,
      status: res.status,
      data,
      method,
      path,
    });
  }
  return data;
}

export const http = {
  get: (p, opts) => request("GET", p, null, opts),
  post: (p, b, opts) => request("POST", p, b, opts),
  put: (p, b, opts) => request("PUT", p, b, opts),
  patch: (p, b, opts) => request("PATCH", p, b, opts),
  del: (p, opts) => request("DELETE", p, null, opts),
};
