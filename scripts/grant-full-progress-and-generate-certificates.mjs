#!/usr/bin/env node

import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const require = createRequire(import.meta.url);

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const pdfLibPath = path.join(repoRoot, "portalweb", "node_modules", "pdf-lib");

let PDFDocument;
let StandardFonts;
let rgb;
try {
  ({ PDFDocument, StandardFonts, rgb } = require(pdfLibPath));
} catch {
  console.error(
    "No pude cargar pdf-lib. Instala dependencias con: cd portalweb && npm install",
  );
  process.exit(1);
}

const DEFAULTS = {
  emailFile: path.join("scripts", "full-progress-emails.txt"),
  outDir: path.join("output", "certificates"),
  template: path.join("portalweb", "public", "certificates", "modulo-7.pdf"),
  container: process.env.MYSQL_CONTAINER || "mysql",
  database: process.env.DB_NAME || "iu_auth",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || "3306",
  mode: process.env.DB_MODE || "docker",
};

function usage() {
  console.log(`Uso:
  node scripts/grant-full-progress-and-generate-certificates.mjs [opciones]

Opciones:
  --email-file <ruta>     Archivo con un correo por linea. Default: ${DEFAULTS.emailFile}
  --out-dir <ruta>        Directorio donde guardar diplomas. Default: ${DEFAULTS.outDir}
  --template <ruta>       Plantilla PDF. Default: ${DEFAULTS.template}
  --mode <docker|direct>  docker usa docker exec; direct usa mysql CLI local. Default: ${DEFAULTS.mode}
  --container <nombre>    Contenedor MySQL para mode=docker. Default: ${DEFAULTS.container}
  --database <nombre>     Base de datos. Default: ${DEFAULTS.database}
  --user <usuario>        Usuario MySQL. Default: ${DEFAULTS.user}
  --password <password>   Password MySQL. Default: ${DEFAULTS.password}
  --host <host>           Host MySQL para mode=direct. Default: ${DEFAULTS.host}
  --port <puerto>         Puerto MySQL para mode=direct. Default: ${DEFAULTS.port}
  --dry-run               Consulta encontrados/no encontrados sin escribir ni generar PDFs
  --help                  Muestra esta ayuda

Ejemplos:
  ./scripts/grant-full-progress-and-generate-certificates.sh --email-file scripts/full-progress-emails.txt --dry-run
  ./scripts/grant-full-progress-and-generate-certificates.sh --email-file scripts/full-progress-emails.txt
  DB_PASSWORD=secret ./scripts/grant-full-progress-and-generate-certificates.sh --mode direct --host 127.0.0.1
`);
}

function parseArgs(argv) {
  const opts = { ...DEFAULTS, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      opts.help = true;
      continue;
    }
    if (arg === "--dry-run") {
      opts.dryRun = true;
      continue;
    }
    const keyMap = {
      "--email-file": "emailFile",
      "--out-dir": "outDir",
      "--template": "template",
      "--mode": "mode",
      "--container": "container",
      "--database": "database",
      "--user": "user",
      "--password": "password",
      "--host": "host",
      "--port": "port",
    };
    if (!keyMap[arg]) throw new Error(`Opcion desconocida: ${arg}`);
    const value = argv[++i];
    if (!value) throw new Error(`Falta valor para ${arg}`);
    opts[keyMap[arg]] = value;
  }
  return opts;
}

function resolveFromRoot(p) {
  return path.isAbsolute(p) ? p : path.join(repoRoot, p);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function readEmails(file) {
  const fullPath = resolveFromRoot(file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`No existe el archivo de correos: ${fullPath}`);
  }
  const emails = fs
    .readFileSync(fullPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map(normalizeEmail);
  return [...new Set(emails)].sort();
}

function sqlString(value) {
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
}

function buildSql(emails, dryRun) {
  const values = emails.map((email) => `(${sqlString(email)})`).join(",\n  ");
  const setupSql = `
SET NAMES utf8mb4;
DROP TEMPORARY TABLE IF EXISTS tmp_target_emails;
CREATE TEMPORARY TABLE tmp_target_emails (
  email VARCHAR(190) PRIMARY KEY
) ENGINE=Memory;

INSERT INTO tmp_target_emails (email) VALUES
  ${values};

SELECT 'INFO', 'correos_en_lista', COUNT(*) FROM tmp_target_emails;
SELECT 'INFO', 'correos_encontrados', COUNT(*)
FROM users u
JOIN tmp_target_emails t ON LOWER(u.email) = t.email;

SELECT 'NO_ENCONTRADO', t.email, '', ''
FROM tmp_target_emails t
LEFT JOIN users u ON LOWER(u.email) = t.email
WHERE u.id IS NULL
ORDER BY t.email;

SELECT 'ENCONTRADO', u.email, u.full_name, u.dni
FROM users u
JOIN tmp_target_emails t ON LOWER(u.email) = t.email
ORDER BY u.email;
`;

  if (dryRun) {
    return `${setupSql}\nSELECT 'INFO', 'dry_run', 'No se hizo ningun cambio';\n`;
  }

  const writeSql = `
START TRANSACTION;

UPDATE users u
JOIN tmp_target_emails t ON LOWER(u.email) = t.email
SET
  u.initial_test_done = TRUE,
  u.exit_test_done = TRUE,
  u.updated_at = NOW();

INSERT INTO user_progress (
  user_id,
  email,
  medalla1,
  medalla2,
  medalla3,
  medalla4,
  medalla5,
  medalla6,
  test_initial_done,
  test_exit_done,
  updated_at
)
SELECT
  u.id,
  LOWER(u.email),
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  NOW()
FROM users u
JOIN tmp_target_emails t ON LOWER(u.email) = t.email
ON DUPLICATE KEY UPDATE
  user_id = VALUES(user_id),
  email = VALUES(email),
  medalla1 = TRUE,
  medalla2 = TRUE,
  medalla3 = TRUE,
  medalla4 = TRUE,
  medalla5 = TRUE,
  medalla6 = TRUE,
  test_initial_done = TRUE,
  test_exit_done = TRUE,
  updated_at = NOW();

INSERT INTO module_progress (
  user_id,
  email,
  modulo,
  test_initial_done,
  test_exit_done,
  calification_done,
  introduccion_done,
  pdf1_done,
  pdf2_done,
  pdf3_done,
  pdf4_done,
  quiz1_done,
  quiz2_done,
  quiz3_done,
  quiz4_done,
  avatar_done,
  updated_at
)
SELECT
  u.id,
  LOWER(u.email),
  m.modulo,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  NOW()
FROM users u
JOIN tmp_target_emails t ON LOWER(u.email) = t.email
CROSS JOIN (
  SELECT 0 AS modulo
  UNION ALL SELECT 1
  UNION ALL SELECT 2
  UNION ALL SELECT 3
  UNION ALL SELECT 4
  UNION ALL SELECT 5
  UNION ALL SELECT 6
) m
ON DUPLICATE KEY UPDATE
  user_id = VALUES(user_id),
  email = VALUES(email),
  test_initial_done = TRUE,
  test_exit_done = TRUE,
  calification_done = TRUE,
  introduccion_done = TRUE,
  pdf1_done = TRUE,
  pdf2_done = TRUE,
  pdf3_done = TRUE,
  pdf4_done = TRUE,
  quiz1_done = TRUE,
  quiz2_done = TRUE,
  quiz3_done = TRUE,
  quiz4_done = TRUE,
  avatar_done = TRUE,
  updated_at = NOW();

COMMIT;

SELECT 'INFO', 'actualizados', COUNT(*)
FROM users u
JOIN tmp_target_emails t ON LOWER(u.email) = t.email;

SELECT
  'CERT_USER',
  LOWER(u.email),
  REPLACE(REPLACE(u.full_name, '\\t', ' '), '\\n', ' '),
  u.dni
FROM users u
JOIN tmp_target_emails t ON LOWER(u.email) = t.email
ORDER BY u.email;
`;

  return `${setupSql}\n${writeSql}`;
}

function mysqlArgs(opts) {
  const common = [
    `-u${opts.user}`,
    `-p${opts.password}`,
    `--database=${opts.database}`,
    "--batch",
    "--raw",
    "--skip-column-names",
  ];
  if (opts.mode === "docker") {
    return {
      cmd: "docker",
      args: ["exec", "-i", opts.container, "mysql", ...common],
    };
  }
  if (opts.mode === "direct") {
    return {
      cmd: "mysql",
      args: [`--host=${opts.host}`, `--port=${opts.port}`, ...common],
    };
  }
  throw new Error("--mode debe ser docker o direct");
}

function runMysql(sql, opts) {
  const { cmd, args } = mysqlArgs(opts);
  const result = spawnSync(cmd, args, {
    input: sql,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 20,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr || `${cmd} termino con codigo ${result.status}`);
  }
  return result.stdout;
}

function slugify(value) {
  return normalizeEmail(value)
    .replace(/[^a-z0-9@._-]+/g, "-")
    .replace(/@/g, "_at_")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function fechaHoy() {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Bogota",
  }).format(new Date());
}

async function generateCertificate({ templatePath, outPath, nombre, numDoc }) {
  const existingBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(existingBytes);
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const certNavy = rgb(0.04, 0.16, 0.38);

  const nameText = String(nombre || "").trim().toUpperCase();
  const nameFontSize =
    nameText.length > 35
      ? 18
      : nameText.length > 28
        ? 21
        : nameText.length > 20
          ? 23
          : 25.8;
  const nameW = fontBold.widthOfTextAtSize(nameText, nameFontSize);
  page.drawText(nameText, {
    x: (width - nameW) / 2,
    y: height - 295,
    size: nameFontSize,
    font: fontBold,
    color: certNavy,
  });

  const docText = String(numDoc || "").trim();
  page.drawText(docText, {
    x: width / 2 - 20,
    y: height - 313,
    size: 16,
    font: fontNormal,
    color: certNavy,
  });

  page.drawText(fechaHoy(), {
    x: 400,
    y: height - 433,
    size: 13,
    font: fontNormal,
    color: certNavy,
  });

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, await pdfDoc.save());
}

function parseUsers(stdout) {
  const users = [];
  const lines = stdout.split(/\r?\n/).filter(Boolean);
  for (const line of lines) {
    const cols = line.split("\t");
    if (cols[0] === "INFO") {
      console.log(`${cols[1]}: ${cols.slice(2).join(" ")}`);
    } else if (cols[0] === "NO_ENCONTRADO") {
      console.warn(`No encontrado: ${cols[1]}`);
    } else if (cols[0] === "ENCONTRADO") {
      console.log(`Encontrado: ${cols[1]} - ${cols[2]} - ${cols[3]}`);
    } else if (cols[0] === "CERT_USER") {
      users.push({ email: cols[1], fullName: cols[2], dni: cols[3] });
    } else {
      console.log(line);
    }
  }
  return users;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    usage();
    return;
  }

  const emails = readEmails(opts.emailFile);
  if (emails.length === 0) {
    throw new Error("No hay correos para procesar.");
  }

  const templatePath = resolveFromRoot(opts.template);
  const outDir = resolveFromRoot(opts.outDir);
  if (!opts.dryRun && !fs.existsSync(templatePath)) {
    throw new Error(`No existe la plantilla del certificado: ${templatePath}`);
  }

  console.log(`Procesando ${emails.length} correo(s) en modo ${opts.mode}...`);
  if (opts.dryRun) console.log("Dry run: no se escriben cambios ni PDFs.");

  const stdout = runMysql(buildSql(emails, opts.dryRun), opts);
  const certUsers = parseUsers(stdout);

  if (opts.dryRun) return;

  console.log(`Generando ${certUsers.length} certificado(s) en ${outDir}...`);
  for (const user of certUsers) {
    const filename = `certificado-general-${slugify(user.email)}.pdf`;
    const outPath = path.join(outDir, filename);
    await generateCertificate({
      templatePath,
      outPath,
      nombre: user.fullName,
      numDoc: user.dni,
    });
    console.log(`PDF creado: ${path.relative(repoRoot, outPath)}`);
  }

  console.log("Listo. La BD queda en 100% y los diplomas quedan escritos en el directorio indicado.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
