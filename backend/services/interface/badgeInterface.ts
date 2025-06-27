import { Badge, EarnedBadge, BadgeType, Icon } from "@prisma/client";

export default interface IBadgeService {
  getCustomBadges(): Promise<Badge[]>;
  createCustomBadge(
    name: string,
    description: string,
    icon: Icon
  ): Promise<boolean>
  editCustomBadge(
    custom_badge_id: number,
    new_custom_badge_name?: string,
    new_custom_badge_description?: string
  ): Promise<boolean>;
  assignCustomBadge(badge_id: number, participant_id: number): Promise<EarnedBadge>;
  deleteCustomBadge(badge_id: number): Promise<boolean>;
  evaluateBadge(
      current_benchmark: number,
      participant_id: number,
      badge_name: string
  ): Promise<boolean>;
}

