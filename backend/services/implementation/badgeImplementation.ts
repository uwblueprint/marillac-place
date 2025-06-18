/* eslint-disable */
import { EarnedBadge, BadgeType } from "@prisma/client";
import prisma from "../../prisma";
import IBadgeService from "../interface/badgeInterface";

class BadgeService implements IBadgeService {
  async editCustomBadge (
    custom_badge_id: number,
    new_custom_badge_name?: string,
    new_custom_badge_description?: string
  ): Promise<boolean> {
    try {
      if (new_custom_badge_name == undefined && new_custom_badge_description == undefined) throw new Error("No edits provided");
      await prisma.badge.update({
        where: { badge_id: custom_badge_id, badge_type: 'CUSTOM' },
        data: {
          ...(new_custom_badge_name !== undefined && { name: new_custom_badge_name }),
          ...(new_custom_badge_description !== undefined && { description: new_custom_badge_description })
        },
      });
      return true;
    } catch (err) {
      // @ts-ignore
      throw new Error(err.message ||"Something went wrong");
    }
  }

  async assignCustomBadge(badge_id: number, participant_id: number): Promise<EarnedBadge> {
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

  async evaluateBadge(
      current_benchmark: number,
      participant_id: number,
      badge_name: string
  ): Promise<boolean> {
    try {
      const badge = await prisma.badge.findUnique({
        where: { name: badge_name },
        include: {
          badge_level: true,
        },
      });
      if (!badge) throw new Error(`Badge "${badge_name}" not found.`);
      const earned = await prisma.earnedBadge.findFirst({
        where: {participant_id: participant_id, name: badge.name},
        orderBy: {level: 'asc'},
      });
      const nextLevel = earned ? earned.level + 1 : 1;
      const nextLevelEntry = badge.badge_level.find(bl => bl.level === nextLevel);
      if (!nextLevelEntry) return false;
      if (current_benchmark >= nextLevelEntry.benchmark) {
        await prisma.earnedBadge.create({
          data: {
            participant_id: participant_id,
            date_received: new Date().toISOString(),
            name: badge.name,
            description: badge.description,
            badge_icon: badge.icon,
            level: nextLevel,
          },
        });
        return true;
      } else return false;
    } catch (err) {
      // @ts-ignore
      throw new Error(err.message ||"Something went wrong");
    }
  }
}

export default BadgeService;