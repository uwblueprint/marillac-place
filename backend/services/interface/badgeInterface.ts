import { Badge } from "@prisma/client";

interface IBadgeService {
  editCustomBadge(
    custom_badge_id: number,
    new_custom_badge_name?: string,
    new_custom_badge_description?: string
  ): Promise<boolean>;
}

export default IBadgeService;
