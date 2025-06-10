/* eslint-disable */
import BadgeService from "../services/implementation/badgeImplementation";
import IBadgeService from "../services/interface/badgeInterface";

const badgeService: IBadgeService = new BadgeService();

const badgeResolver = {
  Mutation: {
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
