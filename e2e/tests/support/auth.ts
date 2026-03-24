import { expect, type Page } from "@playwright/test";
import { testData } from "./testData";

export async function loginAsParticipant(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("ID #").fill(String(testData.participantPid));
  await page.getByPlaceholder("Password").fill(testData.participantPassword);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL("/");
}

export async function loginAsAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.locator("select").selectOption("admin");
  await page.getByPlaceholder("Password").fill(testData.adminPassword);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}
