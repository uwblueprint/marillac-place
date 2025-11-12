import { BadgeLevelProgress, Level } from "@prisma/client";
import db from "../prisma";
import { SYSTEM_BADGES, JACK_OF_ALL_TRADES } from "../constants/systemBadges";
import { getToday } from "./dateUtils";
import processEarning from "./transactionUtils";

function getNextBadgeLevel(level: Level) {
  const levels = [Level.NOVICE, Level.BRONZE, Level.SILVER, Level.GOLD, Level.DIAMOND];
  const index = levels.indexOf(level);
  if (index === 4) return null;
  return levels[index + 1];
}

export async function initBadgeLevelProgress(pid: number) {
  await Promise.all(
    SYSTEM_BADGES.map(async (name: any) => {
      const level = name !== JACK_OF_ALL_TRADES ? Level.NOVICE : Level.SILVER;
      return db.badgeLevelProgress.create({
        data: { name, level, pid, progress: 0 }
      });
    })
  );
}

export async function updateBadgeLevelProgress(
  name: string,
  pid: number,
  inc: number,
) {
  const badgeLevelProgress = await db.badgeLevelProgress.findFirst({
    where: { pid, name },
    include: {
      badge_level: true,
    }
  });
  if (!badgeLevelProgress) return;

  const newAmount = badgeLevelProgress.progress + inc;
  const reachedBenchmark = newAmount >= badgeLevelProgress.badge_level.benchmark;
  if (reachedBenchmark) {
    await db.achievedBadgeLevel.create({
      data: { name, level: badgeLevelProgress.level, pid }
    });

    // pr leader badge logic goes here

    await db.badgeLevelProgress.delete({
      where: { name_level_pid: { name, level: badgeLevelProgress.level, pid } }
    })

    const reasonForEarning = `${badgeLevelProgress.level} ${name} badge achieved!`;
    await processEarning(pid, badgeLevelProgress.badge_level.value, reasonForEarning);

    const nextBadgeLevel = getNextBadgeLevel(badgeLevelProgress.level)
    if (!nextBadgeLevel) return;
    await db.badgeLevelProgress.create({
      data: { name, level: nextBadgeLevel, pid, progress: newAmount }
    })
  } else {
    await db.badgeLevelProgress.update({
      where: { name_level_pid: { name, level: badgeLevelProgress.level, pid } },
      data: { progress: newAmount }
    })
  }
}

export async function validateBadgeLevelProgress(name: string) {
  const today = getToday();
  const currentParticipants = await db.participant.findMany({
    where: {
      OR: [
        { departure: null },
        { departure: { gt: today } },
      ],
    }
  });

  await Promise.all(
    currentParticipants.map(async (participant: any) => {
      return updateBadgeLevelProgress(name, participant.pid, 0)
    })
  );
}
