import { Prisma } from "@prisma/client";
import { LOGIN } from "../constants/systemBadges";
import db from "../prisma";
import { updateBadgeLevelProgress } from "./badgeUtils";
import { getEndOfDay, getStartOfDay } from "./dateUtils";

// Records the first login (or session slide) of each day. Sessions now last
// across days, so slides must count too, or the login streak badge and login
// stats in reports would stop advancing. Rows are keyed on (pid, start of
// day), so the primary key makes concurrent requests count only once. Rows
// written before this keying store the login time, so today's range is
// checked first. If the badge update fails, the row is removed so the next
// request tries again.
export async function recordDailyLogin(pid: number): Promise<void> {
  const now = new Date();
  const date = getStartOfDay(now);
  const loggedInToday = await db.loginHistory.findFirst({
    where: { pid, date: { gte: date, lte: getEndOfDay(now) } },
  });
  if (loggedInToday) return;
  try {
    await db.loginHistory.create({ data: { pid, date } });
  } catch (err) {
    const alreadyLoggedInToday =
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002";
    if (alreadyLoggedInToday) return;
    throw err;
  }
  try {
    await updateBadgeLevelProgress(LOGIN, pid, 1);
  } catch (err) {
    await db.loginHistory.delete({ where: { pid_date: { pid, date } } });
    throw err;
  }
}
