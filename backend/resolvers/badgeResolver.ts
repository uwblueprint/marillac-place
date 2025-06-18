import { Badge, EarnedBadge } from "@prisma/client";
import prisma from "../prisma";
import BadgeService from "../services/implementation/badgeImplementation";
import IBadgeService from "../services/interface/badgeInterface";

const badgeService: IBadgeService = new BadgeService();

const levelMap: Record<number, string> = {
  1: "N",
  2: "B",
  3: "S",
  4: "G",
  5: "D",
};

const badgeResolver = {
  Query: {
    getSystemBadges: async (): Promise<Badge[]> => {
      return prisma.badge.findMany({
        where: {
          badge_type: "SYSTEM",
        },
      });
    },
  },

  Mutation: {
    assignCustomBadge: async (
      _parent: undefined,
      {
        badge_id,
        participant_id,
      }: {
        badge_id: number;
        participant_id: number;
      }
    ): Promise<EarnedBadge> => {
      return badgeService.assignCustomBadge(badge_id, participant_id);
    },

    editCustomBadge: async (
      _parent: undefined,
      {
        custom_badge_id,
        new_custom_badge_name,
        new_custom_badge_description,
      }: {
        custom_badge_id: number;
        new_custom_badge_name?: string;
        new_custom_badge_description?: string;
      }
    ): Promise<boolean> => {
      return badgeService.editCustomBadge(
        custom_badge_id,
        new_custom_badge_name,
        new_custom_badge_description
      );
    },
  },

  Badge: {
    offered_levels: async (parent: Badge): Promise<string[]> => {
      const levels = await prisma.badgeLevel.findMany({
        where: { badge_id: parent.badge_id },
        select: { level: true },
        orderBy: { level: "asc" },
      });

      return levels
        .map((lvl) => levelMap[lvl.level])
        .filter(Boolean);
    },
  },
};

export default badgeResolver;
