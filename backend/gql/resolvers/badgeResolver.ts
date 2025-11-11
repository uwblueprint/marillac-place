import {
  EarnedBadge,
  BadgeType,
  Icon,
  Badge,
  // BadgeLevel,
  PrismaClient,
} from "@prisma/client";

// import { getNow } from "../utils/formatDateTime";

const prisma = new PrismaClient();

const badgeResolver = {
  Query: {
    getCustomBadges: async (): Promise<Badge[]> => {
      try {
        return await prisma.badge.findMany({
          where: {
            badge_type: "CUSTOM",
          },
          include: {
            badge_level: true,
          },
          orderBy: {
            name: "asc",
          },
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error getting custom badges";
        throw new Error(message);
      }
    },
    getSystemBadges: async (): Promise<Badge[]> => {
      try {
        return await prisma.badge.findMany({
          where: {
            badge_type: "SYSTEM",
          },
          include: {
            badge_level: {
              orderBy: {
                level: "asc",
              },
            },
          },
          orderBy: {
            name: "asc",
          },
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error getting system badges";
        throw new Error(message);
      }
    },
    getEarnedBadgesByParticipant: async (
      _parent: undefined,
      { participantId }: { participantId: number }
    ): Promise<EarnedBadge[]> => {
      return prisma.earnedBadge.findMany({
        where: { participant_id: participantId },
        orderBy: { date_received: "desc" },
      });
    },
  },

  Mutation: {
    updateBadgeStatus: async (
      _parent: undefined,
      {
        badge_id,
        is_active,
      }: {
        badge_id: number;
        is_active: boolean;
      }
    ): Promise<boolean> => {
      const badge = await prisma.badge.findUnique({
        where: { badge_id },
      });
      if (!badge) {
        throw new Error("Badge not found");
      }
      await prisma.badge.update({
        where: { badge_id },
        data: {
          is_active,
        },
      });
      return true;
    },
    // fix: need to also add marillac bucks for participant here
    assignCustomBadge: async (
      _parent: undefined,
      {
        badge_id,
        marillac_bucks,
        participant_ids,
      }: {
        badge_id: number;
        marillac_bucks: number;
        participant_ids: number[];
      }
    ): Promise<number[]> => {
      const badge = await prisma.badge.findUnique({
        where: { badge_id },
      });
      if (!badge) throw new Error(`Badge with ID ${badge_id} not found`);

      const participants = await prisma.participant.findMany({
        where: {
          participant_id: {
            in: participant_ids,
          },
        },
      });
      if (participants.length !== participant_ids.length)
        throw new Error(`Some IDs were invalid!`);

      const existingBadges = await prisma.earnedBadge.findMany({
        where: {
          participant_id: { in: participant_ids },
          name: badge.name,
        },
        select: { participant_id: true },
      });
      const alreadyEarnedIds = new Set(
        existingBadges.map((b) => b.participant_id)
      );
      const eligibleParticipantIds = participant_ids.filter(
        (id) => !alreadyEarnedIds.has(id)
      );

      if (eligibleParticipantIds.length === 0) {
        throw new Error("Participants have already received this badge");
      }

      await prisma.$transaction(
        eligibleParticipantIds.map((id) =>
          prisma.earnedBadge.create({
            data: {
              badge_id: badge.badge_id,
              participant_id: id,
              date_received: new Date().toISOString(),
              name: badge.name,
              description: badge.description,
              badge_icon: badge.icon,
              level: 1,
            },
          })
        )
      );

      // also add marillac bucks for the earned badge
      await prisma.$transaction(
        eligibleParticipantIds.map((id) =>
          prisma.participant.update({
            where: { participant_id: id },
            data: {
              marillac_bucks: {
                increment: marillac_bucks,
              },
            },
          })
        )
      );

      return eligibleParticipantIds;
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
      if (
        new_custom_badge_name === undefined &&
        new_custom_badge_description === undefined
      ) {
        throw new Error("No edits provided");
      }
      await prisma.badge.update({
        where: { badge_id: custom_badge_id, badge_type: "CUSTOM" },
        data: {
          ...(new_custom_badge_name !== undefined && {
            name: new_custom_badge_name,
          }),
          ...(new_custom_badge_description !== undefined && {
            description: new_custom_badge_description,
          }),
        },
      });
      return true;
    },
    editSystemBadge: async (
      _parent: undefined,
      {
        system_badge_id,
        system_badge_name,
        system_badge_criteria,
      }: {
        system_badge_id: number;
        system_badge_name: string;
        system_badge_criteria?: string;
      }
    ): Promise<boolean> => {
      const badge = await prisma.badge.findUnique({
        where: { badge_id: system_badge_id },
      });
      if (!badge || badge.badge_type !== "SYSTEM") {
        throw new Error("BAdge not found or not a system badge");
      }
      await prisma.badge.update({
        where: { badge_id: system_badge_id },
        data: {
          name: system_badge_name,
          ...(system_badge_criteria !== undefined && {
            description: system_badge_criteria,
          }),
        },
      });
      return true;
    },

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
    ): Promise<boolean> => {
      await prisma.badge.create({
        data: {
          name,
          description,
          icon,
          is_consecutive: false,
          badge_type: "CUSTOM",
        },
      });
      return true;
    },
    deleteCustomBadge: async (
      _parent: undefined,
      {
        badge_id,
      }: {
        badge_id: number;
      }
    ): Promise<boolean> => {
      const badge = await prisma.badge.findUnique({
        where: { badge_id },
      });

      if (!badge) {
        throw new Error(`Badge with ID ${badge_id} does not exist`);
      }

      if (badge.badge_type !== BadgeType.CUSTOM) {
        throw new Error(
          `Badge with ID ${badge_id} is not a custom badge and cannot be deleted`
        );
      }

      await prisma.badge.delete({
        where: { badge_id },
      });

      return true;
    },
    editBadgeLevel: async (
      _parent: undefined,
      {
        badge_id,
        badge_level,
        benchmark,
        marillac_bucks,
      }: {
        badge_id: number;
        badge_level: number;
        benchmark: number;
        marillac_bucks: number;
      }
    ): Promise<boolean> => {
      await prisma.badgeLevel.update({
        where: {
          badge_id_level: {
            badge_id,
            level: badge_level,
          },
        },
        data: {
          benchmark,
          marillac_bucks,
        },
      });
      return true;
    },
  },
};

export default badgeResolver;
