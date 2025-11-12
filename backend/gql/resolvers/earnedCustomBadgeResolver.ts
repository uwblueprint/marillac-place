import { EarnedCustomBadge } from "@prisma/client";
import db from "../../prisma";

const earnedCustomBadgeResolver = {
  Query: {
    getEarnedCustomBadges: async (
      _parent: undefined,
      { pid }: {
        pid: number;
      }
    ): Promise<EarnedCustomBadge[]> => {
      return await db.earnedCustomBadge.findMany({
        where: { pid },
        include: { custom_badge: true }
      });
    },

    getUnnotifiedEarnedCustomBadges: async (
      _parent: undefined,
      { pid }: {
        pid: number;
      }
    ): Promise<EarnedCustomBadge[]> => {
      const earned_badges = await db.earnedCustomBadge.findMany({
        where: { 
          pid,
          notified: false
        },
        include: { custom_badge: true },
      });

      await db.earnedCustomBadge.updateMany({
        where: { 
          pid, 
          notified: false
        },
        data: {
          notified: true,
        },
      })

      return earned_badges
    },
  },
  Mutation: {
    createEarnedCustomBadge: async (
      _parent: undefined,
      { pid, bid }: {
        pid: number;
        bid: number;
      }
    ): Promise<EarnedCustomBadge> => {
      // procees earning here
      return await db.earnedCustomBadge.create({
        data: { pid, bid },
      });
    },
  },
};

export default earnedCustomBadgeResolver;
