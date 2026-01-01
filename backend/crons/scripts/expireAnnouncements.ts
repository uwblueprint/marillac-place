import { subDays, startOfDay } from "date-fns";
import prisma from "../../prisma";
import { getStartOfDay } from "../../utils/dateUtils";

// deletes announcements that are older than 7 days ago
async function expireAnnouncements() {
  const sevenDaysAgo = subDays(getStartOfDay(new Date()), 7).toISOString();
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
