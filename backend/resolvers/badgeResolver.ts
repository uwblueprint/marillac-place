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
      return badgeService.createCustomBadge(
        name,
        description,
        icon
      );
    },
  },
};

export default badgeResolver;
