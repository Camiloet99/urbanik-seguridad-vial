/**
 * CertificateModal.jsx
 *
 * ─── Integración backend ────────────────────────────────────────────────────
 *  GET  /users/me          → precarga fullName, dni, documentType del usuario
 *  PUT  /users/me          → guarda los cambios si el usuario edita sus datos
 *
 * ─── 7 certificados ─────────────────────────────────────────────────────────
 *  { type: "modulo", n: 1-6 }  → certificado de módulo  (desde CourseDetail.jsx)
 *  { type: "general" }          → certificado 120h       (desde Courses.jsx)
 *
 * ─── Uso ────────────────────────────────────────────────────────────────────
 *  import CertificateModal from "@/components/courses/CertificateModal";
 *
 *  const [certModal, setCertModal] = useState(null);
 *
 *  // Abrir certificado de módulo (en CourseDetail.jsx):
 *  <button onClick={() => setCertModal({ type: "modulo", n: modulo })}>...</button>
 *
 *  // Abrir certificado general (en Courses.jsx):
 *  <button onClick={() => setCertModal({ type: "general" })}>...</button>
 *
 *  // JSX en ambos sitios:
 *  <CertificateModal certConfig={certModal} onClose={() => setCertModal(null)} />
 */

import { useEffect, useRef, useState, useCallback } from "react";

/* ── API base (ajusta si usas una variable de entorno) ───────────────────── */
const API = import.meta.env.VITE_API_URL ?? "";

/* ── Helpers de fetch autenticado ────────────────────────────────────────── */
function authHeaders() {
  const token = localStorage.getItem("token") ?? sessionStorage.getItem("token") ?? "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function getMe() {
  const res = await fetch(`${API}/users/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error("No se pudo obtener el perfil del usuario");
  return res.json(); // { fullName, dni, documentType, ... }
}

async function putMe(body) {
  const res = await fetch(`${API}/users/me`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("No se pudo actualizar el perfil");
  return res.json();
}

/* ── Catálogo de módulos ─────────────────────────────────────────────────── */
const MODULE_INFO = {
  1: { title: "FUNDAMENTOS DE SEGURIDAD VIAL",        horas: "20 horas" },
  2: { title: "MOVILIDAD Y SEGURIDAD PEATONAL",        horas: "20 horas" },
  3: { title: "MOVILIDAD SOSTENIBLE Y ACTIVA",         horas: "20 horas" },
  4: { title: "SEGURIDAD VIAL PARA MOTOCICLISTAS",     horas: "20 horas" },
  5: { title: "CONDUCCIÓN SEGURA EN AUTOMÓVILES",      horas: "20 horas" },
  6: { title: "VEHÍCULOS DE CARGA Y OPERACIÓN SEGURA", horas: "20 horas" },
};
const GENERAL_INFO = { title: "PROGRAMA COMPLETO DE SEGURIDAD VIAL", horas: "120 horas" };

/* ── Tipos de documento (mapeo backend → label display) ─────────────────── */
const DOC_TYPES = [
  { value: "CC",  label: "Cédula de Ciudadanía",          display: "C.C."  },
  { value: "CE",  label: "Cédula de Extranjería",         display: "C.E."  },
  { value: "TI",  label: "Tarjeta de Identidad",          display: "T.I."  },
  { value: "PP",  label: "Pasaporte",                     display: "PP"    },
  { value: "NIT", label: "NIT",                           display: "NIT"   },
  { value: "PEP", label: "Permiso Especial de Permanencia", display: "PEP" },
];

function displayDoc(backendValue) {
  return DOC_TYPES.find((d) => d.value === backendValue)?.display ?? backendValue ?? "C.C.";
}

/* ── Fecha formateada ────────────────────────────────────────────────────── */
function fechaHoy() {
  return new Date().toLocaleDateString("es-CO", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

/* ── Canvas helpers ──────────────────────────────────────────────────────── */
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  const lines = [];
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
  return lines.length;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ── drawCertificate ────────────────────────────────────────────────────── */
function drawCertificate(canvas, { nombre, tipoDocDisplay, numDoc, courseTitle, horas, fecha }) {
  const W = 1122, H = 794;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  /* Fondo azul degradado */
  const bg = ctx.createLinearGradient(0, 0, W * 0.65, H);
  bg.addColorStop(0,    "#1565a8");
  bg.addColorStop(0.45, "#1a80c8");
  bg.addColorStop(1,    "#0d5a93");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* Brillo diagonal derecha */
  const shine = ctx.createLinearGradient(W * 0.5, 0, W, H);
  shine.addColorStop(0, "rgba(255,255,255,0)");
  shine.addColorStop(1, "rgba(255,255,255,0.07)");
  ctx.fillStyle = shine;
  ctx.fillRect(0, 0, W, H);

  /* Franja blanca inferior */
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, H - 100, W, 100);

  /* Borde interior */
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, W - 40, H - 40);

  /* Escudo ANSV */
  const shieldX = W / 2, shieldY = 68;
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath(); ctx.arc(shieldX, shieldY, 34, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(shieldX, shieldY, 34, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px Georgia, serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("ANSV", shieldX, shieldY);

  /* Nombre institución */
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 15px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("Agencia Nacional", W / 2, 124);
  ctx.fillText("de Seguridad Vial", W / 2, 143);

  /* Línea amarilla */
  ctx.fillStyle = "#F5C518";
  ctx.fillRect(W / 2 - 28, 152, 56, 4);

  /* Título */
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("CERTIFICADO DE PARTICIPACIÓN", W / 2, 214);

  /* Subtítulo */
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = "italic 15.5px Georgia, serif";
  ctx.fillText("La Agencia de Seguridad Vial, en uso de sus facultades legales", W / 2, 250);
  ctx.fillText("Certifica que:", W / 2, 272);

  /* Nombre usuario */
  const nameY = 342;
  const nameText = nombre.toUpperCase();
  const fontSize = nameText.length > 34 ? 28 : nameText.length > 24 ? 33 : 38;
  ctx.font = `bold ${fontSize}px Georgia, serif`;
  const nameWidth = Math.min(ctx.measureText(nameText).width + 72, W - 100);
  const nameBoxX = W / 2 - nameWidth / 2;

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  roundRect(ctx, nameBoxX, nameY - 38, nameWidth, 52, 9); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, nameBoxX, nameY - 38, nameWidth, 52, 9); ctx.stroke();

  ctx.fillStyle = "#00E5FF";
  ctx.font = `bold ${fontSize}px Georgia, serif`;
  ctx.textAlign = "center";
  ctx.fillText(nameText, W / 2, nameY);

  /* Documento */
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 16px Georgia, serif";
  ctx.fillText(`${tipoDocDisplay} ${numDoc}`, W / 2, nameY + 34);

  /* Descripción */
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.font = "15.5px Georgia, serif";
  ctx.fillText("Asistió y participó satisfactoriamente en el curso de formación online", W / 2, nameY + 74);

  /* Nombre del curso */
  ctx.fillStyle = "#ffffff";
  const titleFontSize = courseTitle.length > 40 ? 20 : courseTitle.length > 30 ? 23 : 26;
  ctx.font = `bold ${titleFontSize}px Georgia, serif`;
  const titleLines = wrapText(ctx, courseTitle, W / 2, nameY + 110, W - 180, 33);

  /* Ícono corazón */
  const iconCY = nameY + 110 + titleLines * 33 + 38;
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.beginPath(); ctx.arc(W / 2, iconCY, 30, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "rgba(0,229,255,0.5)"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(W / 2, iconCY, 30, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = "#00E5FF";
  ctx.font = "24px serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("♥", W / 2, iconCY + 1);
  ctx.textBaseline = "alphabetic";

  /* ── Franja blanca inferior ── */
  const baseY = H - 100;

  ctx.fillStyle = "#1a5fa0";
  ctx.font = "bold 14px Georgia, serif";
  ctx.textAlign = "left";
  ctx.fillText(`Intensidad horaria : ${horas}`, 58, baseY + 28);

  const fechaTxt = `Fecha de expedición: ${fecha}`;
  ctx.font = "13px Georgia, serif";
  const fW = ctx.measureText(fechaTxt).width + 18;
  ctx.strokeStyle = "#1a5fa0"; ctx.lineWidth = 1;
  ctx.strokeRect(56, baseY + 34, fW, 22);
  ctx.fillStyle = "#1a5fa0";
  ctx.fillText(fechaTxt, 65, baseY + 50);

  ctx.fillStyle = "#1a5fa0";
  ctx.font = "bold 12px Georgia, serif";
  ctx.textAlign = "right";
  ctx.fillText("FIRMA AUTORIZADA - DIRECTOR DE FORMACIÓN", W - 58, baseY + 28);
  ctx.fillText("ANSV - COLOMBIA", W - 58, baseY + 46);
  ctx.strokeStyle = "rgba(26,95,160,0.35)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W - 330, baseY + 14); ctx.lineTo(W - 58, baseY + 14); ctx.stroke();

  ctx.fillStyle = "rgba(26,95,160,0.75)";
  ctx.font = "9.5px Georgia, serif";
  ctx.textAlign = "center";
  wrapText(
    ctx,
    "Nota Legal y de Verificación: El presente certificado se expide de conformidad con lo establecido en el Decreto 1075 de 2015. " +
    "La autenticidad de este documento y la identidad del portador pueden ser verificadas ingresando el ID en el portal institucional www.ansv.gov.co/verificacion.",
    W / 2, baseY + 64, W - 110, 13
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════════════════════════════════════════════════ */
export default function CertificateModal({ certConfig, onClose }) {
  /*
   * step:
   *  "loading"  → cargando datos del backend
   *  "edit"     → formulario con datos precargados (editables)
   *  "saving"   → enviando PUT /users/me
   *  "preview"  → canvas renderizado
   *  "error"    → error al cargar
   */
  const [step,     setStep]     = useState("loading");
  const [nombre,   setNombre]   = useState("");
  const [tipoDoc,  setTipoDoc]  = useState("CC");   // valor backend (CC, CE, TI…)
  const [numDoc,   setNumDoc]   = useState("");
  const [errors,   setErrors]   = useState({});
  const [saveErr,  setSaveErr]  = useState("");
  const [loadErr,  setLoadErr]  = useState("");
  const canvasRef = useRef(null);

  const isOpen   = !!certConfig;
  const certInfo = certConfig?.type === "modulo"
    ? (MODULE_INFO[certConfig.n] ?? MODULE_INFO[1])
    : GENERAL_INFO;

  /* ── Cargar datos del usuario al abrir ── */
  const loadUser = useCallback(async () => {
    setStep("loading");
    setLoadErr("");
    try {
      const user = await getMe();
      setNombre(user.fullName   ?? "");
      setNumDoc(user.dni        ?? "");
      // documentType del backend puede venir como "CC", "C.C.", etc. Normalizamos.
      const normalized = DOC_TYPES.find(
        (d) => d.value === user.documentType || d.display === user.documentType
      )?.value ?? "CC";
      setTipoDoc(normalized);
      setStep("edit");
    } catch (e) {
      setLoadErr("No se pudieron cargar tus datos. Puedes ingresarlos manualmente.");
      setStep("edit"); // igual dejamos editar
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setSaveErr("");
      loadUser();
    }
  }, [isOpen, loadUser]);

  /* ── Esc para cerrar ── */
  useEffect(() => {
    if (!isOpen) return;
    const h = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen]); // eslint-disable-line

  /* ── Renderizar canvas al entrar a preview ── */
  useEffect(() => {
    if (step !== "preview" || !canvasRef.current) return;
    drawCertificate(canvasRef.current, {
      nombre,
      tipoDocDisplay : displayDoc(tipoDoc),
      numDoc,
      courseTitle    : certInfo.title,
      horas          : certInfo.horas,
      fecha          : fechaHoy(),
    });
  }, [step]); // eslint-disable-line

  if (!isOpen) return null;

  /* ── Validación ── */
  const validate = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = "Ingresa tu nombre completo";
    if (!numDoc.trim()) e.numDoc = "Ingresa el número de documento";
    else if (!/^[A-Za-z0-9\-]{4,20}$/.test(numDoc.trim()))
      e.numDoc = "Solo letras y números (4–20 caracteres)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Guardar en backend y pasar a preview ── */
  const handleGenerate = async () => {
    if (!validate()) return;
    setSaveErr("");
    setStep("saving");
    try {
      // Solo enviamos los campos que este modal modifica
      await putMe({
        fullName     : nombre.trim(),
        documentType : tipoDoc,
        dni          : numDoc.trim(),
      });
    } catch {
      // Si falla el PUT no bloqueamos: mostramos advertencia y seguimos
      setSaveErr("No se pudieron guardar los cambios en tu perfil, pero el certificado se generó correctamente.");
    }
    setStep("preview");
  };

  /* ── Descargar PNG ── */
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    const safeName = nombre.trim().replace(/\s+/g, "-").toLowerCase();
    const tipo = certConfig?.type === "modulo" ? `modulo-${certConfig.n}` : "general";
    link.download = `certificado-${tipo}-${safeName}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  const handleClose = () => { setStep("loading"); onClose(); };
  const clearErr = (k) => setErrors((p) => { const n = { ...p }; delete n[k]; return n; });

  const isGeneral  = certConfig?.type === "general";
  const badgeLabel = isGeneral ? "Certificado General · 120h" : `Módulo ${certConfig?.n}`;
  const badgeCls   = isGeneral
    ? "bg-amber-400/15 ring-amber-400/40 text-amber-300"
    : "bg-cyan-400/15 ring-cyan-400/40 text-cyan-300";

  const isLoading = step === "loading" || step === "saving";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="relative w-full rounded-2xl bg-[#0b1320] ring-1 ring-white/10 shadow-2xl overflow-hidden transition-all duration-300"
        style={{ maxWidth: step === "preview" ? "min(96vw, 940px)" : "440px" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div className="flex items-center gap-3 min-w-0">
            <span className="shrink-0 h-8 w-8 rounded-xl bg-blue-600/20 ring-1 ring-blue-400/30 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="#00E5FF" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" stroke="#00E5FF" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-white font-semibold text-[14px] leading-none mb-1 truncate">
                {step === "preview" ? "Vista previa del certificado" : "Datos para el certificado"}
              </p>
              <span className={`inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full ring-1 ${badgeCls}`}>
                {badgeLabel}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-white/35 hover:text-white hover:bg-white/8 transition-all focus:outline-none disabled:opacity-40"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-5">

          {/* Estado de carga */}
          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Spinner />
              <p className="text-white/40 text-sm">Cargando tus datos…</p>
            </div>
          )}

          {/* Formulario */}
          {(step === "edit" || step === "saving") && (
            <div className="space-y-4">

              {/* Aviso si no se cargaron datos */}
              {loadErr && (
                <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 bg-amber-400/8 ring-1 ring-amber-400/30 text-amber-300 text-[12px]">
                  <svg className="shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {loadErr}
                </div>
              )}

              <p className="text-white/45 text-[13px] leading-relaxed">
                Verifica tus datos antes de generar el certificado. Si los editas, se actualizarán en tu perfil.
              </p>

              {/* Nombre */}
              <div>
                <label className="block text-[10.5px] font-semibold text-white/45 mb-1.5 uppercase tracking-widest">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={nombre}
                  disabled={step === "saving"}
                  onChange={(e) => { setNombre(e.target.value); clearErr("nombre"); }}
                  placeholder="Ej: Juan Darío García Rojas"
                  className={ic(errors.nombre, step === "saving")}
                />
                {errors.nombre
                  ? <p className="mt-1 text-[11px] text-red-400">{errors.nombre}</p>
                  : <p className="mt-1 text-[11px] text-white/25">Tal como aparece en tu documento</p>
                }
              </div>

              {/* Tipo de documento */}
              <div>
                <label className="block text-[10.5px] font-semibold text-white/45 mb-2 uppercase tracking-widest">
                  Tipo de documento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DOC_TYPES.map((d) => (
                    <button
                      key={d.value}
                      disabled={step === "saving"}
                      onClick={() => setTipoDoc(d.value)}
                      title={d.label}
                      className={[
                        "rounded-xl py-2 text-[12px] font-semibold transition-all focus:outline-none",
                        tipoDoc === d.value
                          ? "bg-blue-600/50 text-white ring-2 ring-blue-400/60"
                          : "bg-white/5 text-white/45 ring-1 ring-white/10 hover:bg-white/10 hover:text-white/75",
                        step === "saving" ? "opacity-50 cursor-not-allowed" : "",
                      ].join(" ")}
                    >
                      {d.display}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-white/30 mt-1.5">
                  {DOC_TYPES.find((d) => d.value === tipoDoc)?.label}
                </p>
              </div>

              {/* Número de documento */}
              <div>
                <label className="block text-[10.5px] font-semibold text-white/45 mb-1.5 uppercase tracking-widest">
                  Número de documento
                </label>
                <input
                  type="text"
                  value={numDoc}
                  disabled={step === "saving"}
                  onChange={(e) => { setNumDoc(e.target.value.replace(/[^A-Za-z0-9\-]/g, "")); clearErr("numDoc"); }}
                  placeholder="Ej: 1152469822"
                  maxLength={20}
                  className={ic(errors.numDoc, step === "saving")}
                />
                {errors.numDoc && <p className="mt-1 text-[11px] text-red-400">{errors.numDoc}</p>}
              </div>

              <button
                onClick={handleGenerate}
                disabled={step === "saving"}
                className="w-full mt-1 rounded-xl py-2.5 bg-gradient-to-r from-blue-700 to-sky-500 text-white font-semibold text-[13.5px] hover:opacity-90 active:scale-[.98] transition-all focus:outline-none shadow-lg shadow-blue-900/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {step === "saving" ? (
                  <><Spinner small /> Guardando…</>
                ) : (
                  "Ver certificado →"
                )}
              </button>
            </div>
          )}

          {/* Preview */}
          {step === "preview" && (
            <div className="space-y-4">
              {/* Advertencia de guardado si falló el PUT */}
              {saveErr && (
                <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 bg-amber-400/8 ring-1 ring-amber-400/30 text-amber-300 text-[12px]">
                  <svg className="shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {saveErr}
                </div>
              )}

              <div className="rounded-xl overflow-hidden ring-1 ring-white/10">
                <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setSaveErr(""); setStep("edit"); }}
                  className="flex-[0.38] rounded-xl py-2.5 ring-1 ring-white/12 bg-white/5 text-white/55 text-[13px] font-medium hover:bg-white/10 transition-all focus:outline-none"
                >
                  ← Editar
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 rounded-xl py-2.5 bg-gradient-to-r from-blue-700 to-sky-500 text-white font-semibold text-[13.5px] hover:opacity-90 active:scale-[.98] transition-all focus:outline-none flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                  </svg>
                  Descargar certificado
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Spinner inline ─────────────────────────────────────────────────────── */
function Spinner({ small = false }) {
  const s = small ? "h-4 w-4 border-2" : "h-8 w-8 border-2";
  return (
    <span
      className={`${s} rounded-full border-white/20 border-t-white/80 animate-spin inline-block`}
    />
  );
}

/* ── Clase de input ─────────────────────────────────────────────────────── */
function ic(error, disabled = false) {
  return [
    "w-full rounded-xl px-4 py-2.5 bg-white/5 text-white text-[13.5px]",
    "placeholder:text-white/20 focus:outline-none transition-all",
    disabled ? "opacity-50 cursor-not-allowed" : "",
    error
      ? "ring-2 ring-red-400/60"
      : "ring-1 ring-white/10 focus:ring-blue-500/60",
  ].join(" ");
}
