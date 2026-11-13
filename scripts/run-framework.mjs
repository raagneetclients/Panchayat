import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { readExecutionProfile } from "./execution-profile.mjs";

try {
  const optimizeFile = new URL("../node_modules/vinext/dist/plugins/optimize-imports.js", import.meta.url);
  let code = readFileSync(optimizeFile, "utf8");
  if (code.includes('"react-server",\n\t\t\t"node",\n\t\t\t"import",')) {
    code = code.replace('"react-server",\n\t\t\t"node",\n\t\t\t"import",', '"react-server",\n\t\t\t"import",\n\t\t\t"node",');
    code = code.replace('] : [\n\t\t\t"node",\n\t\t\t"import",', '] : [\n\t\t\t"import",\n\t\t\t"node",');
    writeFileSync(optimizeFile, code);
  }
} catch {}

const [command, ...args] = process.argv.slice(2);
if (!["dev", "build"].includes(command)) throw new Error("Expected dev or build.");
const managedLinux = readExecutionProfile() === "managed-linux";

if (managedLinux && command === "build") {
  const result = spawnSync("bash", [
    fileURLToPath(new URL("./build-verified.sh", import.meta.url)), ...args,
  ], { stdio: "inherit" });
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}

// Import in this process so the preview owner retains its PID and signals.
const cli = new URL(managedLinux
  ? "../node_modules/vite/bin/vite.js"
  : "../node_modules/vinext/dist/cli.js", import.meta.url);
process.argv = [process.execPath, fileURLToPath(cli), command,
  ...(!managedLinux && command === "dev" ? ["--port", "5173"] : []), ...args];
await import(cli.href);
