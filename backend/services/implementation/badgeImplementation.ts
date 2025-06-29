import { EarnedBadge, BadgeType, Icon, Badge } from "@prisma/client";
import IBadgeService from "../interface/badgeInterface";
import prisma from "../../prisma";

class BadgeService implements IBadgeService {
  async getCustomBadges(): Promise<Badge[]> {
    try {
      const customBadges = await prisma.badge.findMany({
        where: {
          badge_type: "CUSTOM",
        },
        include: {
          badge_level: true,
        },
      });
      return customBadges;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message || "Failed to get custom badges.");
      }
      throw new Error("Failed to get custom badges.");
    }
  }

  async editCustomBadge(
    custom_badge_id: number,
    new_custom_badge_name?: string,
    new_custom_badge_description?: string
  ): Promise<boolean> {
    try {
      if (
        new_custom_badge_name === undefined &&
        new_custom_badge_description === undefined
      )
        throw new Error("No edits provided");
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
    } catch (err) {
      // @ts-ignore
      throw new Error(err.message || "Something went wrong");
    }
  }

  async assignCustomBadge(
    badge_id: number,
    participant_ids: number[]
  ): Promise<number[]> {
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
    return eligibleParticipantIds;
  }

  async createCustomBadge(
    name: string,
    description: string,
    icon: Icon
  ): Promise<boolean> {
    try {
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
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  async deleteCustomBadge(badge_id: number): Promise<boolean> {
    try {
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
    } catch (err) {
      console.error(`Failed to delete badge ${badge_id}:`, err);
      return false;
    }
  }
}

export default BadgeService;
