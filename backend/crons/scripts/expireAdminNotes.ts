import prisma from "../../prisma";

async function expireAdminNotes(): Promise<boolean> {
  const limit = new Date(Date.now() - 48 * 60 * 60 * 1000).toLocaleDateString(
    "en-ca"
  );
  try {
    await prisma.note.deleteMany({
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

export default expireAdminNotes;
