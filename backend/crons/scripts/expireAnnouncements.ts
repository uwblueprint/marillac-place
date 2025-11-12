import prisma from "../../prisma";

// deletes announcements that are older than 7 days ago
async function expireAnnouncements() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);
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
