import { expect, test } from "@playwright/test";
import { loginAsAdmin, loginAsParticipant } from "./support/auth";

test.describe("authentication and route guards", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("redirects unauthenticated user from admin route to admin login", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });

  test("redirects unauthenticated user from participant route to participant login", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("participant can sign in and sign out", async ({ page }) => {
    await loginAsParticipant(page);

    await page.getByLabel("Open menu").click();
    await page.getByText("Sign Out", { exact: true }).click();

    await expect(page).toHaveURL(/\/login$/);
  });

  test("admin can sign in and sign out", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.getByRole("tab", { name: "Home" })).toBeVisible();

    await page.getByRole("button", { name: "Sign Out" }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Sign Out" })
      .click();

    await expect(page).toHaveURL(/\/admin\/login$/);
  });
});
