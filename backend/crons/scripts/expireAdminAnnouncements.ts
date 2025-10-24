import prisma from "../../prisma";

async function expireAdminAnnouncements(): Promise<boolean> {
  const limit = new Date(Date.now() - 48 * 60 * 60 * 1000).toLocaleString("en-ca")
  try {
    await prisma.announcement.deleteMany({
      where: {
        creation_date: {
          lt: limit,
        },
      },
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export default expireAdminAnnouncements;
