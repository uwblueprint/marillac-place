import prisma from "../../prisma";

async function expireLoginStreak() {
  try {
    const yesterday = `${
      new Date(Date.now() - 86400000).toISOString().split("T")[0]
    }T00:00:00Z`;
    const today = `${
      new Date(Date.now()).toISOString().split("T")[0]
    }T00:00:00Z`;
    const participants = await prisma.participant.findMany({
      select: { participant_id: true },
    });
    const updates = participants.map(async ({ participant_id }) => {
      const loginToday = await prisma.login.findFirst({
        where: {
          participant_id,
          login_date: {
            in: [yesterday, today],
          },
        },
      });

      if (!loginToday) {
        await prisma.participantProgress.update({
          where: { participant_id },
          data: { days_logged_in: 0 },
        });
        console.log(`Reset login streak for participant ${participant_id}`);
      }
    });
    await Promise.all(updates);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
export default expireLoginStreak;
