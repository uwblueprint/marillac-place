import { Icon, BadgeType, Badge } from "@prisma/client";

export default interface IBadgeService {
  createCustomBadge(
    name: string,
    description: string,
    icon: Icon,
    is_consecutive?: boolean,
    badge_type?: BadgeType,
    is_active?: boolean  
  ): Promise<boolean>    
}
