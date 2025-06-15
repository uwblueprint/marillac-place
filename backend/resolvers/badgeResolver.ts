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
    editCustomBadge: async (
      _parent: undefined,
      {
        custom_badge_id,
        new_custom_badge_name,
        new_custom_badge_description
      }: {
        custom_badge_id: number;
        new_custom_badge_name?: string;
        new_custom_badge_description?: string;
      }
    ): Promise<boolean> => {
      return badgeService.editCustomBadge(custom_badge_id, new_custom_badge_name, new_custom_badge_description);
    },
  },
};

export default badgeResolver;