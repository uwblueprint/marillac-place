import { EarnedBadge } from "@prisma/client";

export default interface IBadgeService {
  assignCustomBadge(badge_id: number, participant_id: number): Promise<EarnedBadge>;
} 