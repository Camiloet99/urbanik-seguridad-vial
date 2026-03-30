/**
 * CertificateModal.jsx
 *
 * Estrategia: en lugar de tapar con rectángulos sólidos,
 * dibuja múltiples franjas delgadas que simulan el degradado
 * del fondo original, luego escribe el texto nuevo encima.
 *
 * Colores del degradado medidos del PDF original:
 *   x=150 → RGB(0,20,66)    → rgb(0, 0.078, 0.259)
 *   x=300 → RGB(0,20,66)    → rgb(0, 0.078, 0.259)
 *   x=420 → RGB(21,53,104)  → rgb(0.082, 0.208, 0.408)
 *   x=550 → RGB(34,69,122)  → rgb(0.133, 0.271, 0.478)
 *   x=650 → RGB(44,85,144)  → rgb(0.173, 0.333, 0.565)
 *   x=692 → RGB(51,93,152)
 */

import { useEffect, useState, useCallback } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { http } from "@/services/http";

async function getMe() {
  return http.get("/users/me");
}
async function putMe(body) {
  return http.put("/users/me", body);
}
/* ── Tipos de documento ──────────────────────────────────────────────────── */
const DOC_TYPES = [
  { value: "CC",  label: "Cédula de Ciudadanía",            display: "C.C."  },
  { value: "CE",  label: "Cédula de Extranjería",           display: "C.E."  },
  { value: "TI",  label: "Tarjeta de Identidad",           display: "T.I."  },
  { value: "PP",  label: "Pasaporte",                      display: "PASAPORTE" },
  
  
];
function displayDoc(v) { return DOC_TYPES.find((d) => d.value === v)?.display ?? v ?? "C.C."; }
function labelDoc(v)   { return DOC_TYPES.find((d) => d.value === v)?.label   ?? v ?? ""; }
function normalizeDocType(raw) {
  return DOC_TYPES.find((d) => d.value === raw || d.display === raw)?.value ?? "CC";
}
function fechaHoy() {
  return new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function pdfPath(certConfig) {
  return certConfig?.type === "general"
    ? "/certificates/modulo-7.pdf"
    : `/certificates/modulo-${certConfig?.n ?? 1}.pdf`;
}

/* ── Interpolación del degradado ────────────────────────────────────────── */
// Puntos de control medidos del PDF: [x_pdf, r, g, b]  (valores 0-255)
const GRAD_STOPS = [
  [0,   0,  20, 66],
  [150, 0,  20, 66],
  [300, 0,  20, 66],
  [420, 21, 53, 104],
  [550, 34, 69, 122],
  [650, 44, 85, 144],
  [842, 60, 100, 160],
];

function gradColorAt(x) {
  // Find two stops to interpolate between
  for (let i = 0; i < GRAD_STOPS.length - 1; i++) {
    const [x0, r0, g0, b0] = GRAD_STOPS[i];
    const [x1, r1, g1, b1] = GRAD_STOPS[i + 1];
    if (x >= x0 && x <= x1) {
      const t = (x - x0) / (x1 - x0);
      return [
        (r0 + (r1 - r0) * t) / 255,
        (g0 + (g1 - g0) * t) / 255,
        (b0 + (b1 - b0) * t) / 255,
      ];
    }
  }
  return [0, 0.078, 0.259];
}

/* ── Tapa el texto original con franjas del degradado ───────────────────── */
function coverWithGradient(page, x, y_pdflib, width, height) {
  const STRIPS = 40; // número de franjas para suavizar
  const stripW = width / STRIPS;
  for (let i = 0; i < STRIPS; i++) {
    const sx = x + i * stripW;
    const [r, g, b] = gradColorAt(sx + stripW / 2);
    page.drawRectangle({
      x: sx, y: y_pdflib,
      width: stripW + 0.5, // +0.5 para evitar gaps
      height,
      color: rgb(r, g, b),
      opacity: 1,
    });
  }
}

/* ── Genera el PDF ───────────────────────────────────────────────────────── */
async function generatePdf({ certConfig, nombre, tipoDoc, numDoc }) {
  const existingBytes = await fetch(pdfPath(certConfig)).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingBytes);
  const page   = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();

  const fontBold   = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const cyan     = rgb(0.361, 0.882, 0.902);
  const white    = rgb(1, 1, 1);
  const darkBlue = rgb(0, 0.078, 0.259);

  /* Nombre — centrado, tamaño 25.8 como el original */
  const nameText = nombre.toUpperCase();
  const nameFontSize = nameText.length > 35 ? 18
    : nameText.length > 28 ? 21
    : nameText.length > 20 ? 23
    : 25.8;
  const nameW = fontBold.widthOfTextAtSize(nameText, nameFontSize);
  page.drawText(nameText, {
    x: (width - nameW) / 2,
    y: height - 243,
    size: nameFontSize,
    font: fontBold,
    color: cyan,
  });

  /* Documento — centrado, tamaño 16 */
  const docText = `${displayDoc(tipoDoc)} ${numDoc}`;
  const docW = fontNormal.widthOfTextAtSize(docText, 16);
  page.drawText(docText, {
    x: (width - docW) / 2,
    y: height - 277,
    size: 16,
    font: fontNormal,
    color: white,
  });

  /* Fecha — abajo izquierda, tamaño 9 */
  page.drawText(fechaHoy(), {
    x: 220,
    y: height - 517,
    size: 13,
    font: fontNormal,
    color: white,
  });

  return pdfDoc.save();
}
/* ══════════════════════════════════════════════════════════════════════════
   COMPONENTE
   ══════════════════════════════════════════════════════════════════════════ */
export default function CertificateModal({ certConfig, onClose }) {
  const [step,    setStep]    = useState("loading");
  const [nombre,  setNombre]  = useState("");
  const [tipoDoc, setTipoDoc] = useState("CC");
  const [numDoc,  setNumDoc]  = useState("");
  const [editing, setEditing] = useState(false);
  const [errors,  setErrors]  = useState({});
  const [saveErr, setSaveErr] = useState("");
  const [genErr,  setGenErr]  = useState("");

  const isOpen    = !!certConfig;
  const isGeneral = certConfig?.type === "general";
  const badgeLabel = isGeneral ? "Certificado General · 120h" : `Módulo ${certConfig?.n}`;
  const badgeCls   = isGeneral
    ? "bg-amber-400/15 ring-amber-400/40 text-amber-300"
    : "bg-cyan-400/15 ring-cyan-400/40 text-cyan-300";

  const loadUser = useCallback(async () => {
    setStep("loading"); setEditing(false); setGenErr("");
    try {
      const user = await getMe();
      setNombre(user.fullName ?? "");
      setNumDoc(user.dni ?? "");
      setTipoDoc(normalizeDocType(user.documentType));
    } catch { /* campos vacíos */ }
    setStep("confirm");
  }, []);

  useEffect(() => {
    if (isOpen) { setErrors({}); setSaveErr(""); loadUser(); }
  }, [isOpen, loadUser]);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen]); // eslint-disable-line

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = "Ingresa tu nombre completo";
    if (!numDoc.trim()) e.numDoc = "Ingresa el número de documento";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveEdit = async () => {
  if (!validate()) return;
  setStep("saving");
  try { 
    const result = await putMe({ name: nombre.trim() })
    console.log("PUT exitoso:", result);
  } catch(e) { 
    console.log("PUT falló:", e);
    setSaveErr("No se pudieron guardar los cambios."); 
  }
  setEditing(false);
  setStep("confirm");
};

  const handleDownload = async () => {
    if (!validate()) return;
    setStep("generating");
    setGenErr("");
    try {
      try { await putMe({ fullName: nombre.trim(), documentType: tipoDoc, dni: numDoc.trim() }); } catch { /**/ }
      const pdfBytes = await generatePdf({ certConfig, nombre: nombre.trim(), tipoDoc, numDoc: numDoc.trim() });
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      const safeName = nombre.trim().replace(/\s+/g, "-").toLowerCase();
      link.download = `certificado-${isGeneral ? "general" : `modulo-${certConfig?.n}`}-${safeName}.pdf`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (e) {
      console.error(e);
      setGenErr("No se pudo generar el certificado. Verifica que los PDFs estén en public/certificates/");
    }
    setStep("confirm");
  };

  const handleClose = () => { setStep("loading"); setEditing(false); onClose(); };
  const clearErr = (k) => setErrors((p) => { const n = { ...p }; delete n[k]; return n; });
  const isLoading = ["loading", "saving", "generating"].includes(step);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}
     
    >
      <div className="relative w-full rounded-2xl bg-[#0b1320] ring-1 ring-white/10 shadow-2xl overflow-hidden"
        style={{ maxWidth: "440px" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div className="flex items-center gap-3 min-w-0">
            <span className="shrink-0 h-8 w-8 rounded-xl bg-blue-600/20 ring-1 ring-blue-400/30 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="#00E5FF" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" stroke="#00E5FF" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-white font-semibold text-[14px] leading-none mb-1 truncate">Tu certificado</p>
              <span className={`inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full ring-1 ${badgeCls}`}>
                {badgeLabel}
              </span>
            </div>
          </div>
          <button onClick={handleClose} disabled={isLoading}
            className="shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-white/35 hover:text-white hover:bg-white/8 transition-all focus:outline-none disabled:opacity-40">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5">

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Spinner />
              <p className="text-white/40 text-sm">
                {step === "generating" ? "Generando tu certificado…"
                 : step === "saving"   ? "Guardando cambios…"
                 :                       "Cargando tus datos…"}
              </p>
            </div>
          )}

          {/* Solo lectura */}
          {step === "confirm" && !editing && (
            <div className="space-y-4">
              <p className="text-white/45 text-[13px]">
                Estos son los datos que aparecerán en tu certificado.
              </p>
              {saveErr && <Warn>{saveErr}</Warn>}
              {genErr  && <Warn>{genErr}</Warn>}

              <div className="rounded-xl ring-1 ring-white/10 bg-white/4 divide-y divide-white/8">
                {/* Nombre */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mb-0.5">Nombre completo</p>
                    <p className="text-white text-[14px] font-medium truncate">
                      {nombre || <span className="text-white/25 italic">Sin nombre</span>}
                    </p>
                  </div>
                  <button onClick={() => setEditing(true)} title="Editar"
                    className="shrink-0 ml-3 h-7 w-7 rounded-full flex items-center justify-center text-white/35 hover:text-white hover:bg-white/10 ring-1 ring-white/10 transition focus:outline-none">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                {/* Documento */}
                <div className="px-4 py-3">
                  <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mb-0.5">Documento</p>
                  <p className="text-white text-[14px] font-medium">
                    {displayDoc(tipoDoc)} {numDoc || <span className="text-white/25 italic">Sin número</span>}
                  </p>
                  <p className="text-[11px] text-white/25 mt-0.5">{labelDoc(tipoDoc)}</p>
                </div>
                {/* Fecha */}
                <div className="px-4 py-3">
                  <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mb-0.5">Fecha de expedición</p>
                  <p className="text-white/70 text-[13px]">{fechaHoy()}</p>
                </div>
              </div>

              <button onClick={handleDownload}
                className="w-full rounded-xl py-2.5 bg-gradient-to-r from-blue-700 to-sky-500 text-white font-semibold text-[13.5px] hover:opacity-90 active:scale-[.98] transition-all focus:outline-none shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
                Descargar certificado PDF
              </button>
            </div>
          )}

          {/* Edición */}
          {step === "confirm" && editing && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <button onClick={() => { setEditing(false); setErrors({}); }}
                  className="text-white/40 hover:text-white transition text-[12px] flex items-center gap-1 focus:outline-none">
                  ← Cancelar
                </button>
                <p className="text-white/45 text-[13px]">Edita tus datos</p>
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-white/45 mb-1.5 uppercase tracking-widest">Nombre completo</label>
                <input type="text" value={nombre}
                  onChange={(e) => { setNombre(e.target.value); clearErr("nombre"); }}
                  placeholder="Ej: Juan Darío García Rojas"
                  className={ic(errors.nombre)} />
                {errors.nombre
                  ? <p className="mt-1 text-[11px] text-red-400">{errors.nombre}</p>
                  : <p className="mt-1 text-[11px] text-white/25">Tal como aparece en tu documento</p>}
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-white/45 mb-2 uppercase tracking-widest">Tipo de documento</label>
                <div className="grid grid-cols-3 gap-2">
                  {DOC_TYPES.map((d) => (
                    <button key={d.value} onClick={() => setTipoDoc(d.value)} title={d.label}
                      className={[
                        "rounded-xl py-2 text-[12px] font-semibold transition-all focus:outline-none",
                        tipoDoc === d.value
                          ? "bg-blue-600/50 text-white ring-2 ring-blue-400/60"
                          : "bg-white/5 text-white/45 ring-1 ring-white/10 hover:bg-white/10 hover:text-white/75",
                      ].join(" ")}>
                      {d.display}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-white/30 mt-1.5">{labelDoc(tipoDoc)}</p>
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-white/45 mb-1.5 uppercase tracking-widest">Número de documento</label>
                <input type="text" value={numDoc}
                  onChange={(e) => { setNumDoc(e.target.value.replace(/[^A-Za-z0-9\-]/g, "")); clearErr("numDoc"); }}
                  placeholder="Ej: 1152469822" maxLength={20}
                  className={ic(errors.numDoc)} />
                {errors.numDoc && <p className="mt-1 text-[11px] text-red-400">{errors.numDoc}</p>}
              </div>

              <button onClick={handleSaveEdit}
                className="w-full rounded-xl py-2.5 bg-gradient-to-r from-blue-700 to-sky-500 text-white font-semibold text-[13.5px] hover:opacity-90 active:scale-[.98] transition-all focus:outline-none shadow-lg shadow-blue-900/40">
                Guardar cambios
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return <span className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin inline-block" />;
}
function Warn({ children }) {
  return (
    <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 bg-amber-400/8 ring-1 ring-amber-400/30 text-amber-300 text-[12px]">
      <svg className="shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      {children}
    </div>
  );
}
function ic(error) {
  return [
    "w-full rounded-xl px-4 py-2.5 bg-white/5 text-white text-[13.5px]",
    "placeholder:text-white/20 focus:outline-none transition-all",
    error ? "ring-2 ring-red-400/60" : "ring-1 ring-white/10 focus:ring-blue-500/60",
  ].join(" ");
}