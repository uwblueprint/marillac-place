import { EarnedCustomBadge, Icon } from "@prisma/client";
import db from "../../prisma";

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
      }: {
        pid: number;
        name: string;
        icon: Icon;
        description: string;
      }
    ): Promise<EarnedCustomBadge> => {
      // TODO:
      // modify this endpoint to receive a value input field and process it as an earning (helper function exists in transactionUtils.ts)
      // make sure to update the resolver types as well to include the value input field
      return db.earnedCustomBadge.create({
        data: { pid, name, icon, description },
      });
    },
  },
};

export default earnedCustomBadgeResolver;
