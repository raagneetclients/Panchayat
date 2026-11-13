import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
process.chdir(projectRoot);

// 1. Ensure build exists
const wranglerConfig = path.join(projectRoot, "dist/server/wrangler.json");
if (!fs.existsSync(wranglerConfig)) {
  console.log("[start] No build output found. Running build...");
  const buildResult = spawnSync("npm", ["run", "build"], {
    stdio: "inherit",
    cwd: projectRoot,
  });
  if (buildResult.status !== 0) {
    process.exit(buildResult.status ?? 1);
  }
}

// 2. Ensure D1 schema/tables exist
const migrationFile = path.join(projectRoot, "drizzle/0000_hard_lord_tyger.sql");
if (fs.existsSync(migrationFile)) {
  console.log("[start] Applying local D1 database migrations...");
  const migrationResult = spawnSync(
    process.execPath,
    [
      "--import",
      "./scripts/sites-env.mjs",
      "./node_modules/wrangler/bin/wrangler.js",
      "d1",
      "execute",
      "DB",
      "--local",
      "--config",
      "dist/server/wrangler.json",
      "--persist-to",
      ".wrangler/state",
      "--file",
      "drizzle/0000_hard_lord_tyger.sql",
    ],
    { stdio: "inherit", cwd: projectRoot }
  );
  if (migrationResult.status !== 0) {
    console.warn("[start] Warning: D1 migration exited with code", migrationResult.status);
  }
}

// 3. Resolve host and port (Railway provides PORT, default to 0.0.0.0 for container hosting)
const port = String(process.env.PORT || "8787");
const ip = process.env.HOST || process.env.IP || "0.0.0.0";

console.log(`[start] Starting production server on ${ip}:${port}...`);

const wranglerBin = path.join(projectRoot, "node_modules/wrangler/bin/wrangler.js");
const sitesEnv = path.join(projectRoot, "scripts/sites-env.mjs");

const child = spawn(
  process.execPath,
  [
    "--import",
    sitesEnv,
    wranglerBin,
    "dev",
    "--config",
    "dist/server/wrangler.json",
    "--local",
    "--persist-to",
    ".wrangler/state",
    "--ip",
    ip,
    "--port",
    port,
    "--inspector-port",
    "0",
  ],
  {
    stdio: "inherit",
    cwd: projectRoot,
    env: {
      ...process.env,
      PORT: port,
      HOST: ip,
    },
  }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});

for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(sig, () => {
    child.kill(sig);
  });
}
