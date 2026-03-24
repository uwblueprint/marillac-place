import { expect, type Page } from "@playwright/test";
import { testData } from "./testData";

export async function loginAsParticipant(page: Page) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    await page.goto("/login");
    await page.getByPlaceholder("ID #").fill(String(testData.participantPid));
    await page.getByPlaceholder("Password").fill(testData.participantPassword);
    await page.getByRole("button", { name: "Sign in" }).click();

    try {
      await expect(page).toHaveURL("/", { timeout: 15_000 });
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      await page.waitForTimeout(1000);
    }
  }
}

export async function loginAsAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.locator("select").selectOption("admin");
  await page.getByPlaceholder("Password").fill(testData.adminPassword);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}
