import { expect, test } from "./fixtures";
import { loginAsParticipant } from "./support/auth";

test.describe("mobile behavior", () => {
  test("participant menu opens and closes on mobile-sized layout", async ({ page }) => {
    await loginAsParticipant(page);

    const openMenu = page.getByLabel("Open menu");
    await expect(openMenu).toBeVisible();
    await openMenu.click();

    await expect(page.getByLabel("Close menu")).toBeVisible();
    await expect(page.getByText("Sign Out", { exact: true })).toBeVisible();

    await page.getByLabel("Close menu").click();
    await expect(page.getByLabel("Open menu")).toBeVisible();
  });
});
