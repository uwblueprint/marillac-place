import prisma from "../prisma";
import { getToday } from "./formatDateTime";

export async function addLogin(participant_id: number): Promise<boolean> {
  try {
    await prisma.login.create({
      data: {
        participant_id,
        login_date: getToday(),
      },
    });
    return true;
  } catch (err) {
    return false;
  }
}

export async function updateLoginStreak(
  participant_id: number
): Promise<number> {
  const mostRecentLogin = await prisma.login.findFirst({
    where: { participant_id },
    orderBy: { login_date: "desc" },
    select: { login_date: true },
  });
  if (mostRecentLogin?.login_date) {
    const today = new Date().toISOString().split(",")[0];
    const lastLoginDate = new Date(mostRecentLogin.login_date)
      .toISOString()
      .split(",")[0];
    if (today === lastLoginDate) {
      const progress = await prisma.participantProgress.findUnique({
        where: { participant_id },
      });
      return progress!.days_logged_in;
    }
  }
  const updated = await prisma.participantProgress.update({
    where: { participant_id },
    data: {
      days_logged_in: { increment: 1 },
    },
  });
  await addLogin(participant_id);
  return updated!.days_logged_in;
}
