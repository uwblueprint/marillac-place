import { Icon, BadgeType } from "@prisma/client";
import prisma from "../../prisma";
import IBadgeService from "../interface/badgeInterface";


class BadgeService implements IBadgeService {
  async createCustomBadge(
    name: string,
    description: string,
    icon: Icon,
    is_consecutive: boolean = false,
    badge_type: BadgeType = "CUSTOM",
    is_active: boolean = true
  ): Promise<boolean> {
    try {

      await prisma.badge.create({
        data: {
          name,
          description,
          icon,
          is_consecutive,
          badge_type,
          is_active,
        },
      });
      return true;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }
}


export default BadgeService;
