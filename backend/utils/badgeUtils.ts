import { Level } from "@prisma/client";
import db from "../prisma";
import { SYSTEM_BADGES, JACK_OF_ALL_TRADES } from "../constants/systemBadges";
import processEarning from "./transactionUtils";

function getNextBadgeLevel(level: Level) {
  const levels = [
    Level.NOVICE,
    Level.BRONZE,
    Level.SILVER,
    Level.GOLD,
    Level.DIAMOND,
  ];
  const index = levels.indexOf(level);
  if (index === 4) return null;
  return levels[index + 1];
}

export async function initBadgeLevelProgress(pid: number) {
  // TODO: modify this function to separately create badge level progress for the pr leader badge
  // where it is initialized for every level (NOVICE, BRONZE, SILVER, GOLD, DIAMOND)
  await Promise.all(
    SYSTEM_BADGES.map(async (name) => {
      const level = name !== JACK_OF_ALL_TRADES ? Level.NOVICE : Level.SILVER;
      return db.badgeLevelProgress.create({
        data: { name, level, pid, progress: 0 },
      });
    })
  );
}

export async function updateBadgeLevelProgress(
  name: string,
  pid: number,
  inc: number
) {
  const badgeLevelProgress = await db.badgeLevelProgress.findFirst({
    where: { pid, name },
    include: {
      badge_level: true,
    },
  });
  if (!badgeLevelProgress) return;

  const newAmount = badgeLevelProgress.progress + inc;
  const reachedBenchmark =
    newAmount >= badgeLevelProgress.badge_level.benchmark;
  if (reachedBenchmark) {
    await db.achievedBadgeLevel.create({
      data: { name, level: badgeLevelProgress.level, pid },
    });

    // TODO: implement pr leader badge logic
    // query badge level progress for the participant and pr leader badge for that level
    // if the query does not return anything, then continue
    // if progress + 1 has reached the benchmark, then create a new achieved badge level for the pr leader badge and delete the badge level progress
    // if progress + 1 has not reached the benchmark, then update badge level progress with progress + 1

    await db.badgeLevelProgress.delete({
      where: { name_level_pid: { name, level: badgeLevelProgress.level, pid } },
    });

    const reasonForEarning = `${badgeLevelProgress.level} ${name} badge achieved!`;
    await processEarning(
      pid,
      badgeLevelProgress.badge_level.value,
      reasonForEarning
    );

    const nextBadgeLevel = getNextBadgeLevel(badgeLevelProgress.level);
    if (!nextBadgeLevel) return;
    await db.badgeLevelProgress.create({
      data: { name, level: nextBadgeLevel, pid, progress: newAmount },
    });
  } else {
    await db.badgeLevelProgress.update({
      where: { name_level_pid: { name, level: badgeLevelProgress.level, pid } },
      data: { progress: newAmount },
    });
  }
}

export async function validateBadgeLevelProgress(name: string) {
  const currentParticipants = await db.participant.findMany({
    where: {
      OR: [{ departure: null }, { departure: { gt: new Date() } }],
    },
  });

  await Promise.all(
    currentParticipants.map(async (participant) => {
      return updateBadgeLevelProgress(name, participant.pid, 0);
    })
  );
}
