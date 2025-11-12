import prisma from "../../prisma";

// deletes notes that are older than 48 hours ago
async function expireNotes() {
  const limit = new Date(Date.now() - 48 * 60 * 60 * 1000);
  try {
    await prisma.note.deleteMany({
      where: { date: { lt: limit } },
    });
    console.log("successfully expired notes");
  } catch (err) {
    console.error(err);
  }
}

export default expireNotes;
