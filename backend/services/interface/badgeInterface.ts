import { Badge, EarnedBadge } from "@prisma/client";

interface IBadgeService {
  editCustomBadge(
    custom_badge_id: number,
    new_custom_badge_name?: string,
    new_custom_badge_description?: string
  ): Promise<boolean>;
  assignCustomBadge(badge_id: number, participant_id: number): Promise<EarnedBadge>;

  evaluateBadge(
      current_benchmark: number,
      participant_id: number,
      badge_name: string
  ): Promise<boolean>;
}

export default IBadgeService;
