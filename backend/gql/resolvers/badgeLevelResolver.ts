import { BadgeLevel, Level } from "@prisma/client";
import db from "../../prisma";
import { validateBadgeLevelProgress } from "../../utils/badgeUtils";

const badgeLevelResolver = {
  Mutation: {
    updateBadgeLevel: async (
      _parent: undefined,
      { name, level, value, benchmark }: {
        name: string;
        level: Level;
        value?: number;
        benchmark?: number;
      }
    ): Promise<BadgeLevel> => {
      const updates: any = {};
      if (value !== undefined) updates.value = value;
      if (benchmark !== undefined) updates.benchmark = benchmark;

      const isEmpty = Object.keys(updates).length === 0;
      if (isEmpty) throw new Error("no updates received");

      await validateBadgeLevelProgress(name);

      return await db.badgeLevel.update({
        where: { name_level: { name, level } },
        data: updates,
      });
    }
  },
};

export default badgeLevelResolver;