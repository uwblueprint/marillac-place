import { EarnedBadge } from "@prisma/client";
import BadgeService from "../services/implementation/badgeImplementation";
import IBadgeService from "../services/interface/badgeInterface";

const badgeService: IBadgeService = new BadgeService();

const badgeResolver = {
  Mutation: {
    assignCustomBadge: async (
      _parent: undefined,
      {
        badge_id,
        participant_id,
      }: {
        badge_id: number;
        participant_id: number;
      }
    ): Promise<EarnedBadge> => {
      return badgeService.assignCustomBadge(badge_id, participant_id);
    },
  },
};

export default badgeResolver; 