import { LOGIN } from "../constants/systemBadges";
import db from "../prisma";
import { updateBadgeLevelProgress } from "./badgeUtils";
import { getEndOfDay, getStartOfDay } from "./dateUtils";

// Records the first login (or session slide) of each day. Sessions now last
// across days, so slides must count too, or the login streak badge and login
// stats in reports would stop advancing. Rows are keyed on (pid, start of
// day), so the primary key makes concurrent requests count only once. Rows
// written before this keying store the login time, so today's range is
// checked first. The row and its badge rewards commit together, so a failure
// leaves nothing behind and the next request tries again. `now` is the
// caller's clock, so the day recorded is the day the session was issued on.
export async function recordDailyLogin(pid: number, now: Date): Promise<void> {
  const date = getStartOfDay(now);
  await db.$transaction(async (tx) => {
    const loggedInToday = await tx.loginHistory.findFirst({
      where: { pid, date: { gte: date, lte: getEndOfDay(now) } },
    });
    if (loggedInToday) return;
    // ON CONFLICT DO NOTHING: a failed insert would abort the transaction.
    const { count } = await tx.loginHistory.createMany({
      data: [{ pid, date }],
      skipDuplicates: true,
    });
    if (count === 0) return;
    await updateBadgeLevelProgress(tx, LOGIN, pid, 1);
  });
}
