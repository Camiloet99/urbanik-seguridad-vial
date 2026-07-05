#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");

const DEFAULTS = {
  buckets: "1:30,2:20,3:15,4:10,6:5",
  outFile: path.join("output", "module-progress-assignments.tsv"),
  seed: String(Date.now()),
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
  node scripts/assign-random-module-progress.mjs [opciones]

Selecciona usuarios aleatoriamente desde la tabla users, asigna hasta que modulo
llego cada uno y deja un reporte copiable en TSV.

Opciones:
  --apply                Escribe los cambios en la base de datos. Sin esto solo genera reporte.
  --buckets <lista>      Distribucion modulo:cantidad. Default: ${DEFAULTS.buckets}
                         Ejemplo: 1:30,2:20,3:15,4:10,6:5
  --out-file <ruta>      Archivo de reporte. Default: ${DEFAULTS.outFile}
  --seed <valor>         Semilla para repetir el mismo aleatorio. Default: timestamp actual
  --only-enabled         Solo toma usuarios con enabled = TRUE
  --mode <docker|direct> docker usa docker exec; direct usa mysql CLI local. Default: ${DEFAULTS.mode}
  --container <nombre>   Contenedor MySQL para mode=docker. Default: ${DEFAULTS.container}
  --database <nombre>    Base de datos. Default: ${DEFAULTS.database}
  --user <usuario>       Usuario MySQL. Default: ${DEFAULTS.user}
  --password <password>  Password MySQL. Default: ${DEFAULTS.password}
  --host <host>          Host MySQL para mode=direct. Default: ${DEFAULTS.host}
  --port <puerto>        Puerto MySQL para mode=direct. Default: ${DEFAULTS.port}
  --help                 Muestra esta ayuda

Ejemplos:
  node scripts/assign-random-module-progress.mjs --seed demo-1
  node scripts/assign-random-module-progress.mjs --seed demo-1 --apply
  node scripts/assign-random-module-progress.mjs --buckets 1:30,2:20,3:15,4:10,6:5 --apply
`);
}

function parseArgs(argv) {
  const opts = { ...DEFAULTS, apply: false, onlyEnabled: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      opts.help = true;
      continue;
    }
    if (arg === "--apply") {
      opts.apply = true;
      continue;
    }
    if (arg === "--only-enabled") {
      opts.onlyEnabled = true;
      continue;
    }
    const keyMap = {
      "--buckets": "buckets",
      "--out-file": "outFile",
      "--seed": "seed",
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

function sqlString(value) {
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
}

function parseBuckets(value) {
  const buckets = String(value)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [moduleRaw, countRaw] = part.split(":").map((v) => v?.trim());
      const maxModule = Number(moduleRaw);
      const count = Number(countRaw);
      if (![1, 2, 3, 4, 5, 6].includes(maxModule)) {
        throw new Error(`Modulo invalido en bucket "${part}". Usa 1 a 6.`);
      }
      if (!Number.isInteger(count) || count < 0) {
        throw new Error(`Cantidad invalida en bucket "${part}".`);
      }
      return { maxModule, count };
    });
  if (buckets.length === 0) throw new Error("Debes definir al menos un bucket.");
  const seen = new Set();
  for (const bucket of buckets) {
    if (seen.has(bucket.maxModule)) {
      throw new Error(`Modulo repetido en buckets: ${bucket.maxModule}`);
    }
    seen.add(bucket.maxModule);
  }
  return buckets;
}

function makeRandom(seedValue) {
  let h = 2166136261;
  for (const ch of String(seedValue)) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0;
  return () => {
    state = Math.imul(state + 0x6d2b79f5, 1);
    let t = state;
    t ^= t >>> 15;
    t = Math.imul(t, t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items, seed) {
  const random = makeRandom(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
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
    return { cmd: "docker", args: ["exec", "-i", opts.container, "mysql", ...common] };
  }
  if (opts.mode === "direct") {
    return { cmd: "mysql", args: [`--host=${opts.host}`, `--port=${opts.port}`, ...common] };
  }
  throw new Error("--mode debe ser docker o direct");
}

function runMysql(sql, opts) {
  const { cmd, args } = mysqlArgs(opts);
  const result = spawnSync(cmd, args, {
    input: sql,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 50,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr || `${cmd} termino con codigo ${result.status}`);
  }
  return result.stdout;
}

function readUsers(opts) {
  const where = opts.onlyEnabled ? "WHERE enabled = TRUE" : "";
  const sql = `
SET NAMES utf8mb4;
SELECT
  LOWER(email),
  REPLACE(REPLACE(COALESCE(full_name, ''), '\\t', ' '), '\\n', ' '),
  COALESCE(dni, '')
FROM users
${where}
ORDER BY id;
`;
  return runMysql(sql, opts)
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [email, fullName, dni] = line.split("\t");
      return { email, fullName, dni };
    })
    .filter((u) => u.email);
}

function buildAssignments(users, buckets, seed) {
  const assignments = new Map(users.map((user) => [user.email, 0]));
  const shuffled = shuffle(users, seed);
  let cursor = 0;
  for (const bucket of buckets) {
    for (let i = 0; i < bucket.count && cursor < shuffled.length; i++, cursor++) {
      assignments.set(shuffled[cursor].email, bucket.maxModule);
    }
  }
  return users.map((user) => ({
    ...user,
    maxModule: assignments.get(user.email) ?? 0,
  }));
}

function writeReport(assignments, opts) {
  const outPath = resolveFromRoot(opts.outFile);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const rows = [
    ["email", "nombre", "documento", "hasta_modulo", "descripcion"].join("\t"),
    ...assignments.map((item) => {
      const description =
        item.maxModule === 0
          ? "sin modulos asignados"
          : item.maxModule === 6
            ? "completo todos los modulos"
            : `completo modulos 1-${item.maxModule}`;
      return [
        item.email,
        item.fullName,
        item.dni,
        item.maxModule,
        description,
      ].join("\t");
    }),
  ];
  fs.writeFileSync(outPath, `${rows.join("\n")}\n`, "utf8");
  return outPath;
}

function valuesSql(assignments) {
  return assignments
    .map((item) => `(${sqlString(item.email)}, ${Number(item.maxModule)})`)
    .join(",\n  ");
}

function buildApplySql(assignments) {
  const values = valuesSql(assignments);
  return `
SET NAMES utf8mb4;
DROP TEMPORARY TABLE IF EXISTS tmp_module_assignment;
CREATE TEMPORARY TABLE tmp_module_assignment (
  email VARCHAR(190) PRIMARY KEY,
  max_module TINYINT UNSIGNED NOT NULL
) ENGINE=Memory;

INSERT INTO tmp_module_assignment (email, max_module) VALUES
  ${values};

START TRANSACTION;

UPDATE users u
JOIN tmp_module_assignment a ON LOWER(u.email) = a.email
SET
  u.initial_test_done = (a.max_module >= 6),
  u.exit_test_done = (a.max_module >= 6),
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
  a.max_module >= 1,
  a.max_module >= 2,
  a.max_module >= 3,
  a.max_module >= 4,
  a.max_module >= 5,
  a.max_module >= 6,
  a.max_module >= 6,
  a.max_module >= 6,
  NOW()
FROM users u
JOIN tmp_module_assignment a ON LOWER(u.email) = a.email
ON DUPLICATE KEY UPDATE
  user_id = VALUES(user_id),
  email = VALUES(email),
  medalla1 = VALUES(medalla1),
  medalla2 = VALUES(medalla2),
  medalla3 = VALUES(medalla3),
  medalla4 = VALUES(medalla4),
  medalla5 = VALUES(medalla5),
  medalla6 = VALUES(medalla6),
  test_initial_done = VALUES(test_initial_done),
  test_exit_done = VALUES(test_exit_done),
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
  IF(m.modulo = 0, a.max_module >= 6, m.modulo <= a.max_module),
  IF(m.modulo = 0, a.max_module >= 6, m.modulo <= a.max_module),
  IF(m.modulo = 0, a.max_module >= 6, m.modulo <= a.max_module),
  IF(m.modulo = 0, a.max_module >= 6, m.modulo <= a.max_module),
  IF(m.modulo = 0, a.max_module >= 6, m.modulo <= a.max_module),
  IF(m.modulo = 0, a.max_module >= 6, m.modulo <= a.max_module),
  IF(m.modulo = 0, a.max_module >= 6, m.modulo <= a.max_module),
  IF(m.modulo = 0, a.max_module >= 6, m.modulo <= a.max_module),
  IF(m.modulo = 0, a.max_module >= 6, m.modulo <= a.max_module),
  IF(m.modulo = 0, a.max_module >= 6, m.modulo <= a.max_module),
  IF(m.modulo = 0, a.max_module >= 6, m.modulo <= a.max_module),
  IF(m.modulo = 0, a.max_module >= 6, m.modulo <= a.max_module),
  IF(m.modulo = 0, a.max_module >= 6, m.modulo <= a.max_module),
  NOW()
FROM users u
JOIN tmp_module_assignment a ON LOWER(u.email) = a.email
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
  test_initial_done = VALUES(test_initial_done),
  test_exit_done = VALUES(test_exit_done),
  calification_done = VALUES(calification_done),
  introduccion_done = VALUES(introduccion_done),
  pdf1_done = VALUES(pdf1_done),
  pdf2_done = VALUES(pdf2_done),
  pdf3_done = VALUES(pdf3_done),
  pdf4_done = VALUES(pdf4_done),
  quiz1_done = VALUES(quiz1_done),
  quiz2_done = VALUES(quiz2_done),
  quiz3_done = VALUES(quiz3_done),
  quiz4_done = VALUES(quiz4_done),
  avatar_done = VALUES(avatar_done),
  updated_at = NOW();

COMMIT;

SELECT 'INFO', 'usuarios_actualizados', COUNT(*) FROM tmp_module_assignment;
SELECT 'INFO', 'modulo_0', SUM(max_module = 0) FROM tmp_module_assignment;
SELECT 'INFO', 'modulo_1', SUM(max_module = 1) FROM tmp_module_assignment;
SELECT 'INFO', 'modulo_2', SUM(max_module = 2) FROM tmp_module_assignment;
SELECT 'INFO', 'modulo_3', SUM(max_module = 3) FROM tmp_module_assignment;
SELECT 'INFO', 'modulo_4', SUM(max_module = 4) FROM tmp_module_assignment;
SELECT 'INFO', 'modulo_5', SUM(max_module = 5) FROM tmp_module_assignment;
SELECT 'INFO', 'modulo_6', SUM(max_module = 6) FROM tmp_module_assignment;
`;
}

function summarize(assignments) {
  const counts = new Map();
  for (let i = 0; i <= 6; i++) counts.set(i, 0);
  for (const item of assignments) {
    counts.set(item.maxModule, (counts.get(item.maxModule) ?? 0) + 1);
  }
  return [...counts.entries()].map(([module, count]) => ({ module, count }));
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    usage();
    return;
  }

  const buckets = parseBuckets(opts.buckets);
  const requested = buckets.reduce((sum, bucket) => sum + bucket.count, 0);
  const users = readUsers(opts);
  if (users.length === 0) throw new Error("No encontre usuarios en la base de datos.");
  if (requested > users.length) {
    throw new Error(`Los buckets piden ${requested} usuarios, pero solo hay ${users.length}.`);
  }

  const assignments = buildAssignments(users, buckets, opts.seed);
  const reportPath = writeReport(assignments, opts);

  console.log(`Usuarios leidos: ${users.length}`);
  console.log(`Semilla: ${opts.seed}`);
  console.log(`Reporte: ${reportPath}`);
  console.log("Distribucion:");
  for (const row of summarize(assignments)) {
    console.log(`  hasta modulo ${row.module}: ${row.count}`);
  }

  if (!opts.apply) {
    console.log("No se escribio en la base de datos. Agrega --apply para aplicar esta misma distribucion.");
    return;
  }

  const stdout = runMysql(buildApplySql(assignments), opts);
  if (stdout.trim()) console.log(stdout.trim());
  console.log("Cambios aplicados en la base de datos.");
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
