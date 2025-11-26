import { subDays, startOfDay } from "date-fns";
import prisma from "../../prisma";

// deletes announcements that are older than 7 days ago
async function expireAnnouncements() {
  const sevenDaysAgo = subDays(startOfDay(new Date()), 7);
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
