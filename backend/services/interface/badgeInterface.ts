import { Badge, EarnedBadge } from "@prisma/client";

interface IBadgeService {
  editCustomBadge(
    custom_badge_id: number,
    new_custom_badge_name?: string,
    new_custom_badge_description?: string
  ): Promise<boolean>;
  assignCustomBadge(badge_id: number, participant_id: number): Promise<EarnedBadge>;
}

export default IBadgeService;
