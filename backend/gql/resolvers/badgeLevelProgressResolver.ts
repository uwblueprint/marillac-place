import { BadgeLevelProgress } from "@prisma/client";
import db from "../../prisma";

const badgeLevelProgressResolver = {
  Query: {
    getBadgeLevelProgress: async (
      _parent: undefined,
      {
        pid,
      }: {
        pid: number;
      }
    ): Promise<BadgeLevelProgress[]> => {
      return db.badgeLevelProgress.findMany({
        where: { pid, badge_level: { system_badge: { is_active: true } } },
        include: {
          badge_level: {
            include: {
              system_badge: true,
            },
          },
        },
        orderBy: [
          { name: "asc" },
          { badge_level: { value: "asc" } },
        ],
      });
    },
  },
};

export default badgeLevelProgressResolver;
