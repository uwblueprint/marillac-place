import { EarnedCustomBadge, Icon } from "@prisma/client";
import db from "../../prisma";
import processEarning from "../../utils/transactionUtils";

const earnedCustomBadgeResolver = {
  Query: {
    getEarnedCustomBadges: async (
      _parent: undefined,
      {
        pid,
      }: {
        pid: number;
      }
    ): Promise<EarnedCustomBadge[]> => {
      return db.earnedCustomBadge.findMany({
        where: { pid },
      });
    },
  },
  Mutation: {
    fetchNewEarnedCustomBadges: async (
      _parent: undefined,
      {
        pid,
      }: {
        pid: number;
      }
    ): Promise<EarnedCustomBadge[]> => {
      const earnedCustomBadges = await db.earnedCustomBadge.findMany({
        where: {
          pid,
          notified: false,
        },
      });

      await db.earnedCustomBadge.updateMany({
        where: { pid, notified: false },
        data: { notified: true },
      });

      return earnedCustomBadges;
    },
    createEarnedCustomBadge: async (
      _parent: undefined,
      {
        pid,
        name,
        icon,
        description,
        value,
      }: {
        pid: number;
        name: string;
        icon: Icon;
        description: string;
        value: number;
      }
    ): Promise<EarnedCustomBadge> => {
      const reasonForEarning = `${name} custom badge earned!`;
      await processEarning(pid, value, reasonForEarning);
      return db.earnedCustomBadge.create({
        data: { pid, name, icon, description },
      });
    },
  },
};

export default earnedCustomBadgeResolver;
