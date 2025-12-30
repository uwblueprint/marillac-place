import { Level } from "@prisma/client";
import { endOfDay } from "date-fns";
import db from "../prisma";
import {
  SYSTEM_BADGES,
  JACK_OF_ALL_TRADES,
  PR_LEADER,
} from "../constants/systemBadges";
import processEarning from "./transactionUtils";
import { current } from "./dateUtils";

async function getNextBadgeLevel(name: string, level: Level) {
  const levels = [
    Level.NOVICE,
    Level.BRONZE,
    Level.SILVER,
    Level.GOLD,
    Level.DIAMOND,
  ];
  const index = levels.indexOf(level);
  if (index === levels.length - 1) return null;
  const nextLevel = levels[index + 1];
  const nextBadgeLevel = await db.badgeLevel.findUnique({
    where: { name_level: { name, level: nextLevel } },
  });
  return nextBadgeLevel?.level;
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
      data: { name, level: badgeLevelProgress.level, pid, date: current() },
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
      const reachedPrLeaderBenchmark =
        newPrLeaderAmount >= prLeaderProgress.badge_level.benchmark;
      if (reachedPrLeaderBenchmark) {
        await db.achievedBadgeLevel.create({
          data: {
            name: PR_LEADER,
            level: prLeaderProgress.level,
            pid,
            date: current(),
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

    const reasonForEarning = `${badgeLevelProgress.level} ${name} badge achieved!`;
    await processEarning(
      pid,
      badgeLevelProgress.badge_level.value,
      reasonForEarning
    );

    const nextBadgeLevel = await getNextBadgeLevel(
      name,
      badgeLevelProgress.level
    );
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
      OR: [{ departure: null }, { departure: { gt: endOfDay(current()).toISOString() } }],
    },
  });

  await Promise.all(
    currentParticipants.map(async (participant) => {
      return updateBadgeLevelProgress(name, participant.pid, 0);
    })
  );
}
