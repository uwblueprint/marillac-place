import { BadgeType, Icon } from "@prisma/client";
import BadgeService from "../services/implementation/badgeImplementation";
import IBadgeService from "../services/interface/badgeInterface";

const badgeService: IBadgeService = new BadgeService();

const badgeResolver = {
  Mutation: {
    createBadge: async (
      _parent: undefined,
      { 
        name,
        description,
        icon,
      }: {
        name: string;
        description: string;
        icon: Icon;
      },
    ): Promise<boolean> => {
      return badgeService.createBadge({
        name,
        description,
        icon,
        is_consecutive: false,
        badge_type: BadgeType.SYSTEM,
      });
    },
  },
};

export default badgeResolver;
