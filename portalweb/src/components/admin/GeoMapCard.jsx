// src/components/admin/GeoMapCard.jsx
import { useMemo, useState } from "react";
import { exportAdminUsers } from "@/services/adminService";
import mapaImg from "@/assets/admin/mapa.png";

import tag1 from "@/assets/admin/tags/tag1.png";
import tag2 from "@/assets/admin/tags/tag2.png";
import tag3 from "@/assets/admin/tags/tag3.png";

import ExcelJS from "exceljs";

const EXCLUDED_EMAILS = new Set(["admin@test.com"]);

const REPORT_COLUMNS = [
  "Estudiante",
  "Correo",
  "Documento",
  "Municipio",
  "Teléfono",
  "Género",
  "Edad",
  "Enfoque Diferencial",
  "Perfil de Riesgo",
  "% Avance",
];

const TITLE_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1D4789" } };
const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF29375C" } };
const SECTION_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDCE6F5" } };
const TOTAL_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEFEFEF" } };

const TAG_IMAGES = [tag1, tag2, tag3];

// 🔹 Activa esto en true mientras ajustas posiciones
const DEBUG_SHOW_ALL_SUBREGIONS = false;

// Label maps (sync with SummaryTableCard)
const GENERO_MAP = {
  male: "Masculino",
  female: "Femenino",
  "non-binary": "No binario/a",
  "prefer-not-say": "Prefiero no decirlo",
};

const FOCUS_MAP = {
  lgbtiq: "Población LGBTIQ+",
  ethnic: "Población étnica",
  "armed-conflict": "Víctima del conflicto",
  disability: "Persona con discapacidad",
  "female-head": "Mujer cabeza de hogar",
  none: "Ninguno",
  "prefer-not-say": "Prefiero no decirlo",
};

const AGE_MAP = {
  "14-16": "14 – 16",
  "16-25": "16 – 25",
  "16-24": "16 – 24",
  "25-34": "25 – 34",
  "35-59": "35 – 59",
  "60+": "60+",
};

const toLabel = (slug) =>
  slug
    ? slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

const getProgressFromStatus = (rawStatus) => {
  if (typeof rawStatus === "number" && !Number.isNaN(rawStatus)) {
    return Math.min(Math.max(rawStatus, 0), 100);
  }
  if (typeof rawStatus === "string") {
    const parsed = parseInt(rawStatus, 10);
    if (!Number.isNaN(parsed)) {
      return Math.min(Math.max(parsed, 0), 100);
    }
  }
  if (rawStatus === "complete") return 100;
  if (rawStatus === "progress") return 60;
  return 0;
};

const SUBREGION_CONFIG = {
  "Bajo Cauca": { top: "30%", left: "65%" },
  "Magdalena Medio": { top: "68%", left: "80%" },
  Nordeste: { top: "50%", left: "70%" },
  Norte: { top: "53%", left: "50%" },
  Occidente: { top: "55%", left: "30%" },
  Oriente: { top: "80%", left: "65%" },
  Suroeste: { top: "78%", left: "37%" },
  Uraba: { top: "30%", left: "15%" },
  "Valle del Aburra": { top: "75%", left: "48%" },
};

export default function GeoMapCard({ users = [] }) {
  const [isExporting, setIsExporting] = useState(false);

  const { presentSubregions, countsBySubregion } = useMemo(() => {
    const counts = {};

    users.forEach((u) => {
      const raw = u?.subregion;
      if (!raw) return;

      const name = String(raw).trim();
      if (!SUBREGION_CONFIG[name]) return;

      counts[name] = (counts[name] || 0) + 1;
    });

    let present;

    if (DEBUG_SHOW_ALL_SUBREGIONS) {
      // Mostrar todas para ajustar posiciones
      present = Object.keys(SUBREGION_CONFIG);

      // Aseguramos que todas tengan al menos 0
      present.forEach((sr) => {
        if (typeof counts[sr] !== "number") {
          counts[sr] = 0;
        }
      });
    } else {
      // Solo las que realmente aparecen en users
      present = Object.keys(counts);
    }

    return { presentSubregions: present, countsBySubregion: counts };
  }, [users]);

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);

      // Traer todos los usuarios del backend
      const raw = await exportAdminUsers(); // Array<UserWithExperienceStatusRes>

      if (!raw || raw.length === 0) {
        alert("No hay usuarios para exportar");
        return;
      }

      const data = raw.filter(
        (u) => !EXCLUDED_EMAILS.has(String(u.email || "").toLowerCase())
      );

      if (data.length === 0) {
        alert("No hay usuarios para exportar");
        return;
      }

      const rows = data.map((u) => ({
        municipio: toLabel(u.municipality) || "Sin municipio",
        estudiante: u.fullName || u.name || "-",
        correo: u.email || "-",
        documento: (u.documentType || "CC") + " " + (u.dni || "-"),
        telefono: u.phone || "-",
        genero: GENERO_MAP[u.genero] || toLabel(u.genero) || "-",
        edad: AGE_MAP[u.ageRange ?? u.edad] || u.ageRange || u.edad || "-",
        enfoque:
          FOCUS_MAP[u.differentialFocus ?? u.enfoqueDiferencial] ||
          u.differentialFocus ||
          u.enfoqueDiferencial ||
          "-",
        riesgo: u.riskProfile || "-",
        avance: getProgressFromStatus(u.experienceStatus),
      }));

      const byMunicipio = new Map();
      rows.forEach((r) => {
        if (!byMunicipio.has(r.municipio)) byMunicipio.set(r.municipio, []);
        byMunicipio.get(r.municipio).push(r);
      });

      const municipios = [...byMunicipio.keys()].sort((a, b) => a.localeCompare(b, "es"));
      const total = rows.length;
      const generatedAt = new Date().toLocaleString("es-CO");

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Portal de Seguridad Vial";
      workbook.created = new Date();

      // ---------- Hoja 1: Listado por municipio ----------
      const sheet1 = workbook.addWorksheet("Listado por municipio");
      sheet1.columns = [
        { width: 30 },
        { width: 30 },
        { width: 16 },
        { width: 18 },
        { width: 14 },
        { width: 14 },
        { width: 12 },
        { width: 22 },
        { width: 14 },
        { width: 12 },
      ];

      sheet1.mergeCells(1, 1, 1, REPORT_COLUMNS.length);
      const s1Title = sheet1.getCell(1, 1);
      s1Title.value = "Informe de inscritos por municipio – Antioquia";
      s1Title.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
      s1Title.fill = TITLE_FILL;
      s1Title.alignment = { vertical: "middle" };
      sheet1.getRow(1).height = 24;

      sheet1.mergeCells(2, 1, 2, REPORT_COLUMNS.length);
      const s1Subtitle = sheet1.getCell(2, 1);
      s1Subtitle.value = `Fuente: Informe de Progreso de Estudiantes – Antioquia | Generado: ${generatedAt}`;
      s1Subtitle.font = { italic: true, size: 9, color: { argb: "FF555555" } };

      sheet1.mergeCells(3, 1, 3, REPORT_COLUMNS.length);
      const s1Note = sheet1.getCell(3, 1);
      s1Note.value = "Criterio aplicado: se excluyó el registro con correo admin@test.com.";
      s1Note.font = { italic: true, size: 9, color: { argb: "FF999999" } };

      sheet1.getCell(4, 1).value = "Total inscritos";
      sheet1.getCell(4, 1).font = { bold: true };
      sheet1.getCell(4, 2).value = total;
      sheet1.getCell(4, 2).font = { bold: true };

      let rIdx = 6;
      municipios.forEach((mun) => {
        const items = byMunicipio.get(mun);

        for (let c = 1; c <= REPORT_COLUMNS.length; c++) {
          sheet1.getCell(rIdx, c).fill = SECTION_FILL;
        }
        sheet1.mergeCells(rIdx, 1, rIdx, 6);
        const secCell = sheet1.getCell(rIdx, 1);
        secCell.value = `Municipio: ${mun}`;
        secCell.font = { bold: true, color: { argb: "FF1D4789" } };
        sheet1.getCell(rIdx, 9).value = "Total inscritos";
        sheet1.getCell(rIdx, 9).font = { bold: true };
        sheet1.getCell(rIdx, 10).value = items.length;
        sheet1.getCell(rIdx, 10).font = { bold: true };
        rIdx++;

        const headerRow = sheet1.getRow(rIdx);
        REPORT_COLUMNS.forEach((label, i) => {
          const cell = headerRow.getCell(i + 1);
          cell.value = label;
          cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
          cell.fill = HEADER_FILL;
        });
        rIdx++;

        items.forEach((r) => {
          const row = sheet1.getRow(rIdx);
          row.getCell(1).value = r.estudiante;
          row.getCell(2).value = r.correo;
          row.getCell(3).value = r.documento;
          row.getCell(4).value = r.municipio;
          row.getCell(5).value = r.telefono;
          row.getCell(6).value = r.genero;
          row.getCell(7).value = r.edad;
          row.getCell(8).value = r.enfoque;
          row.getCell(9).value = r.riesgo;
          row.getCell(10).value = r.avance / 100;
          row.getCell(10).numFmt = "0%";
          rIdx++;
        });

        for (let c = 1; c <= REPORT_COLUMNS.length; c++) {
          sheet1.getCell(rIdx, c).fill = TOTAL_FILL;
        }
        sheet1.mergeCells(rIdx, 1, rIdx, 8);
        const totCell = sheet1.getCell(rIdx, 1);
        totCell.value = `Total ${mun}`;
        totCell.font = { bold: true };
        sheet1.getCell(rIdx, 9).value = "Inscritos";
        sheet1.getCell(rIdx, 9).font = { bold: true };
        sheet1.getCell(rIdx, 10).value = items.length;
        sheet1.getCell(rIdx, 10).font = { bold: true };
        rIdx += 2;
      });

      // ---------- Hoja 2: Resumen ejecutivo (% de participación por municipio) ----------
      const sheet2 = workbook.addWorksheet("Resumen ejecutivo");
      sheet2.columns = [{ width: 24 }, { width: 14 }, { width: 16 }, { width: 22 }];

      sheet2.mergeCells(1, 1, 1, 4);
      const s2Title = sheet2.getCell(1, 1);
      s2Title.value = "Resumen ejecutivo de inscritos";
      s2Title.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
      s2Title.fill = TITLE_FILL;
      s2Title.alignment = { vertical: "middle" };
      sheet2.getRow(1).height = 24;

      sheet2.mergeCells(2, 1, 2, 4);
      const s2Subtitle = sheet2.getCell(2, 1);
      s2Subtitle.value = `Fuente: Informe de Progreso de Estudiantes – Antioquia | Generado: ${generatedAt}`;
      s2Subtitle.font = { italic: true, size: 9, color: { argb: "FF555555" } };

      sheet2.getCell(3, 1).value = "Total inscritos";
      sheet2.getCell(3, 1).font = { bold: true };
      sheet2.getCell(3, 2).value = total;
      sheet2.getCell(3, 2).font = { bold: true };

      const headerRow2 = sheet2.getRow(5);
      ["Municipio", "Inscritos", "Participación", "Observación"].forEach((label, i) => {
        const cell = headerRow2.getCell(i + 1);
        cell.value = label;
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = HEADER_FILL;
      });

      const summary = municipios
        .map((mun) => ({ mun, count: byMunicipio.get(mun).length }))
        .sort((a, b) => b.count - a.count);
      const maxCount = summary[0]?.count ?? 0;

      let r2 = 6;
      summary.forEach(({ mun, count }) => {
        const pct = total > 0 ? count / total : 0;
        const row = sheet2.getRow(r2);
        row.getCell(1).value = mun;
        row.getCell(2).value = count;
        row.getCell(3).value = pct;
        row.getCell(3).numFmt = "0.0%";
        row.getCell(4).value =
          count === maxCount
            ? "Mayor concentración"
            : pct > 0.05
              ? "Participación media"
              : "Participación baja";
        r2++;
      });

      if (r2 > 6) {
        sheet2.addConditionalFormatting({
          ref: `C6:C${r2 - 1}`,
          rules: [
            {
              type: "dataBar",
              priority: 1,
              cfvo: [{ type: "min" }, { type: "max" }],
              color: { argb: "FF1D4789" },
            },
          ],
        });
      }

      const totalRow = sheet2.getRow(r2);
      totalRow.getCell(1).value = "TOTAL";
      totalRow.getCell(1).font = { bold: true };
      totalRow.getCell(2).value = total;
      totalRow.getCell(2).font = { bold: true };
      totalRow.getCell(3).value = 1;
      totalRow.getCell(3).numFmt = "0.0%";
      totalRow.getCell(3).font = { bold: true };
      for (let c = 1; c <= 4; c++) totalRow.getCell(c).fill = TOTAL_FILL;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const timestamp = new Date().toISOString().split("T")[0];
      a.href = url;
      a.download = `informe-participacion-antioquia_${timestamp}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exportando Excel", err);
      alert("Error al generar el Excel. Intenta de nuevo.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          <img
            src={mapaImg}
            alt="Mapa Antioquia"
            className="
              w-full
              max-w-[520px]
              lg:max-w-[600px]
              xl:max-w-[680px]
              h-auto
              max-h-[420px]
              object-contain
            "
            draggable={false}
          />

          {presentSubregions.map((subregion, index) => {
            const config = SUBREGION_CONFIG[subregion];
            if (!config) return null;

            const tagImg = TAG_IMAGES[index % TAG_IMAGES.length];
            const count = countsBySubregion[subregion] ?? 0;

            return (
              <div
                key={subregion}
                className="
                  absolute
                  -translate-x-1/2
                  -translate-y-1/2
                  group
                "
                style={{
                  top: config.top,
                  left: config.left,
                }}
              >
                {/* Tag en el mapa */}
                <img
                  src={tagImg}
                  alt={`Participación en ${subregion}`}
                  className="
                    cursor-default
                    select-none
                    w-5 h-5
                    sm:w-6 sm:h-6
                    lg:w-7 lg:h-7
                  "
                  draggable={false}
                />

                {/* Tooltip con nombre + conteo */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    left-1/2
                    -top-2
                    -translate-x-1/2
                    -translate-y-full
                    opacity-0
                    group-hover:opacity-100
                    group-hover:-translate-y-[120%]
                    bg-slate-900/95
                    text-white
                    text-[10px]
                    sm:text-xs
                    px-2
                    py-1
                    rounded-full
                    whitespace-nowrap
                    shadow-lg
                    border border-white/10
                    transition-all
                    duration-150
                  "
                >
                  <span className="font-medium">{subregion}</span>
                  <span className="mx-1">·</span>
                  <span className="opacity-80">
                    {count} participante{count === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleExportExcel}
          disabled={isExporting}
          className="
            inline-flex items-center gap-2
            rounded-full
            bg-[#1D4789]
            px-4 py-2
            text-xs sm:text-sm
            text-white
            shadow-[0_4px_16px_rgba(29,71,137,0.3)]
            border border-[#1D4789]
            hover:brightness-110
            disabled:opacity-60
            disabled:cursor-not-allowed
            transition
          "
        >
          {isExporting ? "Generando Excel..." : "Informe Excel"}
        </button>
      </div>
    </div>
  );
}
