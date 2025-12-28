import { subDays, startOfDay } from "date-fns";
import prisma from "../../prisma";
import { now } from "../../utils/dateUtils";

// deletes announcements that are older than 7 days ago
async function expireAnnouncements() {
  const sevenDaysAgo = subDays(startOfDay(now()), 7);
  try {
    await prisma.announcement.deleteMany({
      where: { date: { lt: sevenDaysAgo } },
    });
    console.log("successfully expired announcements");
  } catch (err) {
    console.error(err);
  }
}

export default expireAnnouncements;
