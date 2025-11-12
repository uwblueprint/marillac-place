import { AchievedBadgeLevel } from "@prisma/client";
import db from "../../prisma";

const achievedBadgeLevelResolver = {
  Query: {
    getAchievedBadgeLevels: async (
      _parent: undefined,
      { pid }: { 
        pid: number 
      }
    ): Promise<AchievedBadgeLevel[]> => {
      return await db.achievedBadgeLevel.findMany({
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
  },
};

export default achievedBadgeLevelResolver;
