import prisma from "../../prisma";

async function expireParticipantOptionalTasks(): Promise<boolean> {
  try {
    await prisma.participantProgress.updateMany({
      data: {
        optional_tasks_completed: 0,
      },
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export default expireParticipantOptionalTasks;
