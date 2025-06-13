import { $Enums, Badge } from "@prisma/client";

export default interface IBadgeService {
  createBadge(params: {
    name: string;
    description: string;
    icon: $Enums.Icon;
    is_consecutive: boolean;
    badge_type: $Enums.BadgeType;
    is_active?: boolean;  
  }): Promise<boolean>;    
}
