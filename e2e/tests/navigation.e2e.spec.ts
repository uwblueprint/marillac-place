import { expect, test } from "./fixtures";
import { loginAsAdmin, loginAsParticipant } from "./support/auth";
import { testData } from "./support/testData";

test.describe("navigation coverage", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("participant can navigate all participant pages", async ({ page }) => {
    await loginAsParticipant(page);

    await expect(
      page.getByText("Welcome to Marillac Place", { exact: false })
    ).toBeVisible();

    await page.getByLabel("Open menu").click();
    await page.getByRole("tab", { name: "Schedule" }).click();
    await expect(page).toHaveURL(/\/schedule$/);
    await expect(page.getByText("This Week", { exact: true })).toBeVisible();

    await page.getByLabel("Open menu").click();
    await page.getByRole("tab", { name: "Announcements" }).click();
    await expect(page).toHaveURL(/\/announcements$/);
    await expect(page.getByRole("button", { name: "All" })).toBeVisible();

    await page.getByLabel("Open menu").click();
    await page.getByRole("tab", { name: "Progress" }).click();
    await expect(page).toHaveURL(/\/progress$/);
    await expect(page.getByText("Weekly Earnings", { exact: false })).toBeVisible();
  });

  test("participant invalid password shows error", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("ID #").fill(String(testData.participantPid));
    await page.getByPlaceholder("Password").fill("definitely-wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("incorrect password", { exact: false })).toBeVisible();
  });

  test("admin can navigate key staff pages", async ({ page }) => {
    await loginAsAdmin(page);

    await page.getByRole("tab", { name: "Schedule" }).click();
    await expect(page).toHaveURL(/\/admin\/schedule$/);
    await expect(page.getByRole("button", { name: "Assign Task" })).toBeVisible();

    await page.getByRole("tab", { name: "Announcements" }).click();
    await expect(page).toHaveURL(/\/admin\/announcements$/);
    await expect(
      page.getByRole("button", { name: "Create Announcement" })
    ).toBeVisible();

    await page.getByRole("tab", { name: "Task Library" }).click();
    await expect(page).toHaveURL(/\/admin\/task-library$/);
    await expect(page.getByRole("button", { name: "Add Task" })).toBeVisible();

    await page.getByRole("tab", { name: "Reports" }).click();
    await expect(page).toHaveURL(/\/admin\/reports$/);
    await expect(page.getByRole("button", { name: "Add Email" })).toBeVisible();
  });
});
