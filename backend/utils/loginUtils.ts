import { Prisma } from "@prisma/client";
import { LOGIN } from "../constants/systemBadges";
import db from "../prisma";
import { updateBadgeLevelProgress } from "./badgeUtils";
import { getStartOfDay } from "./dateUtils";

// Records the first login (or session slide) of each day. Sessions now last
// across days, so slides must count too, or the login streak badge and login
// stats in reports would stop advancing. Rows are keyed on (pid, start of
// day), so the primary key makes concurrent requests count only once.
export async function recordDailyLogin(pid: number): Promise<void> {
  try {
    await db.loginHistory.create({
      data: { pid, date: getStartOfDay(new Date()) },
    });
  } catch (err) {
    const alreadyLoggedInToday =
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002";
    if (alreadyLoggedInToday) return;
    throw err;
  }
  await updateBadgeLevelProgress(LOGIN, pid, 1);
}
