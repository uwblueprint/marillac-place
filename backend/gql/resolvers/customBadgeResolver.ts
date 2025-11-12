import { CustomBadge, Icon } from "@prisma/client";
import db from "../../prisma";

const customBadgeResolver = {
  Query: {
    getCustomBadges: async (): Promise<CustomBadge[]> => {
      return await db.customBadge.findMany({ orderBy: { name: "asc" } });
    }
  },
  Mutation: {
    createCustomBadge: async (
      _parent: undefined,
      { name, description, icon }: {
        name: string;
        description: string;
        icon: Icon;
      }
    ): Promise<CustomBadge> => {
      return await db.customBadge.create({
        data: { name, description, icon },
      });
    },
    updateCustomBadge: async (
      _parent: undefined,
      { bid, name, icon, description }: {
        bid: number;
        name?: string;
        icon?: Icon;
        description?: string;
      }
    ): Promise<CustomBadge> => {
      const updates: any = {};
      if (icon !== undefined) updates.icon = icon;
      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;

      const isEmpty = Object.keys(updates).length === 0;
      if (isEmpty) throw new Error("no updates received");

      return await db.customBadge.update({
        where: { bid },
        data: updates,
      });
    },
    deleteCustomBadge: async (
      _parent: undefined,
      { bid }: {
        bid: number;
      }
    ): Promise<CustomBadge> => {
      return await db.customBadge.delete({
        where: { bid }
      });
    },
  },
};

export default customBadgeResolver;
