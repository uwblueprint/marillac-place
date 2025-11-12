import { AchievedBadgeLevel } from "@prisma/client";
import db from "../../prisma";

const achievedBadgeLevelResolver = {
  Query: {
    getAchievedBadgeLevels: async (
      _parent: undefined,
      {
        pid,
      }: {
        pid: number;
      }
    ): Promise<AchievedBadgeLevel[]> => {
      return db.achievedBadgeLevel.findMany({
        where: {
          pid,
          badge_level: {
            system_badge: {
              is_active: true,
            },
          },
        },
        include: {
          badge_level: {
            select: {
              system_badge: true,
            },
          },
        },
      });
    },
  },
  Mutation: {
    fetchNewAchievedBadgeLevels: async (
      _parent: undefined,
      { pid }: { 
        pid: number 
      }
    ): Promise<AchievedBadgeLevel[]> => {
      const achievedBadgeLevels = await db.achievedBadgeLevel.findMany({
        where: {
          pid,
          notified: false,
          badge_level: {
            system_badge: {
              is_active: true,
            },
          },
        },
        include: {
          badge_level: {
            select: {
              system_badge: true,
            },
          },
        },
      });

      await Promise.all(
        achievedBadgeLevels.map((achievedBadgeLevel) =>
          db.achievedBadgeLevel.update({
            where: { 
              name_level_pid: { 
                name: achievedBadgeLevel.name,
                level: achievedBadgeLevel.level,
                pid: achievedBadgeLevel.pid
              } 
            },
            data: { notified: true },
          })
        )
      );
      
      return achievedBadgeLevels;
    },
  },
};

export default achievedBadgeLevelResolver;
