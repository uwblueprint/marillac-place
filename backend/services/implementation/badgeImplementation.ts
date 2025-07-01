import {
  EarnedBadge,
  BadgeType,
  Icon,
  Badge,
  BadgeLevel,
} from "@prisma/client";
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
    badge_description?: string
  ): Promise<boolean> {
    try {
      if (new_custom_badge_name == undefined && badge_description == undefined)
        throw new Error("No edits provided");
      await prisma.badge.update({
        where: { badge_id: custom_badge_id, badge_type: "CUSTOM" },
        data: {
          ...(new_custom_badge_name !== undefined && {
            name: new_custom_badge_name,
          }),
          ...(badge_description !== undefined && {
            description: badge_description,
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
    participant_id: number
  ): Promise<EarnedBadge> {
    // First get the badge details to copy information
    const badge = await prisma.badge.findUnique({
      where: { badge_id },
    });

    if (!badge) {
      throw new Error(`Badge with ID ${badge_id} not found`);
    }

    // Check if participant exists
    const participant = await prisma.participant.findUnique({
      where: { participant_id },
    });

    if (!participant) {
      throw new Error(`Participant with ID ${participant_id} not found`);
    }

    // Create new earned badge entry
    const earnedBadge = await prisma.earnedBadge.create({
      data: {
        participant_id,
        date_received: new Date().toISOString(),
        name: badge.name,
        description: badge.description,
        badge_icon: badge.icon,
        level: 1, // Level doesn't matter for custom badges, so default to 1
      },
    });

    return earnedBadge;
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

  async editBadgeLevel(
    badge_id: number,
    badge_level: number,
    benchmark: number,
    marillac_bucks: number
  ): Promise<boolean> {
    try {
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
    } catch (err) {
      // @ts-ignore
      throw new Error(err.message || "Something went wrong");
    }
  }
  async editSystemBadge(
  system_badge_id: number,
  system_badge_name: string,
  system_badge_criteria?: string,
): Promise<boolean> {
  const badge = await prisma.badge.findUnique({
    where: {badge_id:system_badge_id},
  });
  if (!badge || badge.badge_type !== "SYSTEM"){
    throw new Error("BAdge not found or not a system badge");
  }
  try {
    await prisma.badge.update({
      where: { badge_id: system_badge_id},
      data: {
        name: system_badge_name,
        ...(system_badge_criteria !== undefined && { description: system_badge_criteria }),
      },
    });
    return true;
  } catch (err) {
    // @ts-ignore
    throw new Error(err.message || "Failed to update system badge");
  }
}

}

export default BadgeService;
