import { subDays, startOfDay } from "date-fns";
import prisma from "../../prisma";

// deletes notes that are older than 48 hours ago
async function expireNotes() {
  const limit = subDays(startOfDay(new Date()), 2);
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
