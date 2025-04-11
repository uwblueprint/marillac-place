import prisma from "../../prisma";

async function expireAdminNotes(): Promise<boolean> {
  const limit = new Date(Date.now() - 48 * 60 * 60 * 1000);
  try {
    await prisma.note.deleteMany({
      where: {
        date: {
          lt: limit.toISOString(),
        },
      },
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export default expireAdminNotes;
