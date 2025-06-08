import { EarnedBadge } from "@prisma/client";
import IBadgeService from "../interface/badgeInterface";
import prisma from "../../prisma";

class BadgeService implements IBadgeService {
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
        badge_id,
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
}

export default BadgeService; 