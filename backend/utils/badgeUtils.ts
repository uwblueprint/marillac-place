import { Level } from "@prisma/client";
import { endOfDay } from "date-fns";
import db from "../prisma";
import { SYSTEM_BADGES, JACK_OF_ALL_TRADES, PR_LEADER } from "../constants/systemBadges";
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
  const allLevels = [
    Level.NOVICE,
    Level.BRONZE,
    Level.SILVER,
    Level.GOLD,
    Level.DIAMOND,
  ];

  const promises = SYSTEM_BADGES.flatMap((name) => {
    if (name === PR_LEADER) {
      return allLevels.map((level) =>
        db.badgeLevelProgress.create({
          data: { name, level, pid, progress: 0 },
        })
      );
    }

    const level = name !== JACK_OF_ALL_TRADES ? Level.NOVICE : Level.SILVER;
    return db.badgeLevelProgress.create({
      data: { name, level, pid, progress: 0 },
    });
  });

  await Promise.all(promises);
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

    const prLeaderProgress = await db.badgeLevelProgress.findFirst({
      where: {
        pid,
        name: PR_LEADER,
        level: badgeLevelProgress.level,
      },
      include: {
        badge_level: true,
      },
    });

    if (prLeaderProgress) {
      const newPrLeaderAmount = prLeaderProgress.progress + 1;
      const reachedPrLeaderBenchmark = newPrLeaderAmount >= prLeaderProgress.badge_level.benchmark;
      if (reachedPrLeaderBenchmark) {
        await db.achievedBadgeLevel.create({
          data: {
            name: PR_LEADER, 
            level: prLeaderProgress.level,
            pid,
          },
        });

        await db.badgeLevelProgress.delete({
          where: {
            name_level_pid: { 
              name: PR_LEADER,
              level: prLeaderProgress.level,
              pid,
            },
          },
        });
      } else {
        await db.badgeLevelProgress.update({ 
          where: {
            name_level_pid: {
              name: PR_LEADER,
              level: prLeaderProgress.level,
              pid,
            },
          },
          data: { progress: newPrLeaderAmount },
        });
      }
    }
    
    await db.badgeLevelProgress.delete({
      where: { name_level_pid: { name, level: badgeLevelProgress.level, pid } },
    });

    // TODO: Process the earning only upon notifying the participant
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
