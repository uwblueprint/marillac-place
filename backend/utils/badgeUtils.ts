import { Level } from "@prisma/client";
import db from "../prisma";
import { SYSTEM_BADGES, JACK_OF_ALL_TRADES } from "../constants/systemBadges";
import processEarning from "./transactionUtils";
import { endOfDay } from "date-fns";

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

    // TODO (yan): implement pr leader badge logic 
    // (e.g. the idea is, using the NOVICE level as an example, is that we award the PR_LEADER_BADGE for the NOVICE level 
    // when the participant has earned x amount of NOVICE level badges. Here, in the code above,
    // we have just awarded some new badge so we need to execute the logic for the PR_LEADER_BADGE)

    // Flow:
    // 1. query BadgeLevelProgress based on pid for the PR_LEADER_BADGE for that level
    // 2. if the query does not return anything, then you can skip the remaining steps
    // 3. if 1 + the progress attribute on BadgeLevelProgress has reached the benchmark attribute, 
    // 4. then create a new achieved badge level for the PR_LEADER_BADGE for the relevant level and delete the BadgeLevelProgress you just queried
    // 5. if the benchmark has not been achieved, then simply update BadgeLevelProgress to progress + 1

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
      OR: [{ departure: null }, { departure: { gt: endOfDay(new Date()) } }],
    },
  });

  await Promise.all(
    currentParticipants.map(async (participant) => {
      return updateBadgeLevelProgress(name, participant.pid, 0);
    })
  );
}
