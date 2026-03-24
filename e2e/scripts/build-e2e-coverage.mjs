import fs from "node:fs/promises";
import path from "node:path";

const e2eRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const rawDir = path.join(e2eRoot, ".coverage", "raw");
const outputDir = path.join(e2eRoot, "coverage", "e2e");

async function main() {
  let MCR;
  try {
    ({ default: MCR } = await import("monocart-coverage-reports"));
  } catch {
    console.warn(
      "[coverage] Optional dependency 'monocart-coverage-reports' is not installed; skipping E2E coverage export."
    );
    return;
  }

  let entries = [];
  try {
    entries = await fs.readdir(rawDir);
  } catch {
    console.warn("[coverage] No raw coverage directory found.");
    return;
  }

  const rawCoverage = [];
  for (const file of entries) {
    if (!file.endsWith(".json")) continue;
    const fullPath = path.join(rawDir, file);
    try {
      const text = await fs.readFile(fullPath, "utf8");
      const payload = JSON.parse(text);
      if (Array.isArray(payload)) {
        rawCoverage.push(...payload);
      } else {
        console.warn(`[coverage] Skipping non-array payload: ${file}`);
      }
    } catch (err) {
      console.warn(`[coverage] Skipping invalid raw payload: ${file}`);
      console.warn(err instanceof Error ? err.message : String(err));
    }
  }

  if (rawCoverage.length === 0) {
    console.warn("[coverage] No Playwright raw coverage payloads found.");
    return;
  }

  const report = MCR({
    name: "Marillac Place E2E Browser Coverage",
    outputDir,
    reports: [["lcovonly", { file: "lcov.info" }], "console-summary", "html"],
    entryFilter: {
      "**/static/js/*.js": true,
      "http://localhost:3000/static/js/*.js": true,
      "http://127.0.0.1:3000/static/js/*.js": true,
      "**/backend/**": false,
      "**/node_modules/**": false,
    },
    sourceFilter: {
      "**/src/**": true,
      "./src/**": true,
      "webpack:///**/src/**": true,
      "**/backend/**": false,
      "**/node_modules/**": false,
    },
  });

  await report.add(rawCoverage);
  await report.generate();
  console.info(`[coverage] Wrote E2E coverage report to ${outputDir}`);
}

main().catch((err) => {
  console.error("[coverage] Failed generating E2E coverage", err);
  process.exit(1);
});
