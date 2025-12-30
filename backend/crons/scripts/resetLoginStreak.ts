import { startOfDay, endOfDay } from "date-fns";
import { LOGIN } from "../../constants/systemBadges";
import db from "../../prisma";
import { current } from "../../utils/dateUtils";

// checks whether or not a participant has logged in today and resets their progress for the login badge if not
async function resetLoginStreak() {
  try {
    const participants = await db.participant.findMany({
      where: {
        OR: [{ departure: null }, { departure: { gt: endOfDay(current()).toISOString() } }],
      },
      select: { pid: true },
    });

    const resets = participants.map(async ({ pid }) => {
      const login = await db.loginHistory.findFirst({
        where: {
          pid,
          date: {
            gte: startOfDay(current()).toISOString(),
            lte: endOfDay(current()).toISOString(),
          },
        },
      });

      if (!login) {
        await db.badgeLevelProgress.updateMany({
          where: { pid, name: LOGIN },
          data: { progress: 0 },
        });
      }
    });

    await Promise.all(resets);
    console.log("successfully validated login streaks");
  } catch (err) {
    console.error(err);
  }
}
export default resetLoginStreak;
