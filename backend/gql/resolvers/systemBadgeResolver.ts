import { SystemBadge } from "@prisma/client";
import db from "../../prisma";

const systemBadgeResolver = {
  Query: {
    getSystemBadges: async(): Promise<SystemBadge[]> => {
      return await db.systemBadge.findMany({
        include: { BadgeLevel: true }
      })
    }
  },
  Mutation: {
    updateSystemBadge: async (
      _parent: undefined,
      { name, description, is_active }: {
        name: string;
        description?: string;
        is_active?: boolean;
      }
    ): Promise<SystemBadge> => {
      const updates: any = {};
      if (description !== undefined) updates.description = description;
      if (is_active !== undefined) updates.is_active = is_active;

      const isEmpty = Object.keys(updates).length === 0;
      if (isEmpty) throw new Error("no updates received");

      return await db.systemBadge.update({
        where: { name },
        data: updates,
      });
    },
  },
};

export default systemBadgeResolver;
