import { CustomBadge, Icon } from "@prisma/client";
import db from "../../prisma";

const customBadgeResolver = {
  Query: {
    getCustomBadges: async (): Promise<CustomBadge[]> => {
      return db.customBadge.findMany({ orderBy: { name: "asc" } });
    },
  },
  Mutation: {
    createCustomBadge: async (
      _parent: undefined,
      {
        name,
        description,
        icon,
      }: {
        name: string;
        description: string;
        icon: Icon;
      }
    ): Promise<CustomBadge> => {
      return db.customBadge.create({
        data: { name, description, icon },
      });
    },
    updateCustomBadge: async (
      _parent: undefined,
      {
        cid,
        name,
        icon,
        description,
      }: {
        cid: number;
        name?: string;
        icon?: Icon;
        description?: string;
      }
    ): Promise<CustomBadge> => {
      const updates: Partial<CustomBadge> = {};
      if (icon !== undefined) updates.icon = icon;
      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;

      const isEmpty = Object.keys(updates).length === 0;
      if (isEmpty) throw new Error("no updates received");

      return db.customBadge.update({
        where: { cid },
        data: updates,
      });
    },
    deleteCustomBadge: async (
      _parent: undefined,
      {
        cid,
      }: {
        cid: number;
      }
    ): Promise<CustomBadge> => {
      return db.customBadge.delete({
        where: { cid },
      });
    },
  },
};

export default customBadgeResolver;
