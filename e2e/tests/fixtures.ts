import fs from "node:fs/promises";
import path from "node:path";
import { expect, test as base } from "@playwright/test";

const rawCoverageDir = path.join(__dirname, "..", ".coverage", "raw");

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await page.coverage.startJSCoverage({
      resetOnNavigation: false,
    });

    await use(page);

    let coverage = [];
    try {
      coverage = await page.coverage.stopJSCoverage();
    } catch {
      return;
    }

    const safeTitle = testInfo.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const safeFile = path.basename(testInfo.file).replace(/[^a-z0-9]+/gi, "-");
    const fileName = `${safeFile}-${safeTitle}-${Date.now()}.json`;

    await fs.mkdir(rawCoverageDir, { recursive: true });
    await fs.writeFile(
      path.join(rawCoverageDir, fileName),
      JSON.stringify(coverage),
      "utf8"
    );
  },
});

export { expect };
