import { sub, subHours } from "date-fns";
import prisma from "../../prisma";

// deletes notes that are older than 48 hours ago
async function expireNotes() {
  const limit = subHours(new Date(), 48);
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
