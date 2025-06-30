import {
  Badge,
  EarnedBadge,
  BadgeType,
  Icon,
  BadgeLevel,
} from "@prisma/client";

export default interface IBadgeService {
  getCustomBadges(): Promise<Badge[]>;
  createCustomBadge(
    name: string,
    description: string,
    icon: Icon
  ): Promise<boolean>;
  editCustomBadge(
    custom_badge_id: number,
    new_custom_badge_name?: string,
    new_custom_badge_description?: string
  ): Promise<boolean>;
  assignCustomBadge(
    badge_id: number,
    participant_id: number
  ): Promise<EarnedBadge>;
  deleteCustomBadge(badge_id: number): Promise<boolean>;
  editBadgeLevel(
    badge_id: number,
    badge_level: number,
    benchmark: number,
    marillac_bucks: number
  ): Promise<boolean>;
}
