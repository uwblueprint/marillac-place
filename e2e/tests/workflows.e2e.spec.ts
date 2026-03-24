import { expect, test } from "./fixtures";
import { loginAsAdmin, loginAsParticipant } from "./support/auth";
import { queryDb } from "./support/db";
import { testData } from "./support/testData";

test.describe("full-stack workflows", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("participant login creates a login history row", async ({ page }) => {
    const before = await queryDb<{ count: string }>(
      "SELECT COUNT(*)::text AS count FROM login_history WHERE pid = $1",
      [testData.participantPid]
    );
    const beforeCount = Number(before.rows[0]?.count ?? "0");

    await loginAsParticipant(page);

    const after = await queryDb<{ count: string }>(
      "SELECT COUNT(*)::text AS count FROM login_history WHERE pid = $1",
      [testData.participantPid]
    );
    const afterCount = Number(after.rows[0]?.count ?? "0");

    expect(afterCount).toBeGreaterThan(beforeCount);
  });

  test("admin can add a participant and persist to database", async ({ page }) => {
    test.skip(
      test.info().project.name === "mobile-chrome",
      "Admin participant-management flow is validated on desktop; mobile has dedicated navigation/menu coverage."
    );

    await queryDb(
      "UPDATE participant SET departure = NOW() - INTERVAL '1 day' WHERE room = 10"
    );

    await loginAsAdmin(page);

    await page.getByRole("tab", { name: "Participants" }).click();
    await expect(page).toHaveURL(/\/admin\/participants$/);

    const participantPid = Number(`9${Date.now().toString().slice(-8)}`);
    const arrivalDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    const addParticipantButton = page
      .getByRole("button", { name: "Add Participant", exact: true })
      .first();
    await expect(addParticipantButton).toBeVisible();
    await addParticipantButton.scrollIntoViewIfNeeded();
    try {
      await addParticipantButton.click();
    } catch {
      // Mobile layout occasionally has transient overlays intercepting pointer events.
      await addParticipantButton.click({ force: true });
    }

    const dialog = page.getByRole("dialog");
    await dialog.locator('input[type="number"]').fill(String(participantPid));
    await dialog.locator('input[type="date"]').fill(arrivalDate);
    await dialog.getByPlaceholder("Password").fill("test123");
    await dialog.getByRole("button", { name: "Save Changes" }).click();

    await expect(dialog).not.toBeVisible();
    await expect(page.getByText(`#${participantPid}`)).toBeVisible();

    const participant = await queryDb<{
      pid: number;
      password: string;
      departure: string | null;
    }>(
      "SELECT pid, password, departure FROM participant WHERE pid = $1 LIMIT 1",
      [participantPid]
    );

    expect(participant.rowCount).toBe(1);
    expect(participant.rows[0].password).toBe("test123");
    expect(participant.rows[0].departure).toBeNull();

    await queryDb("DELETE FROM participant WHERE pid = $1", [participantPid]);
  });
});
