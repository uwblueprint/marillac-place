import { $Enums } from "@prisma/client";
import prisma from "../../prisma";
import IBadgeService from "../interface/badgeInterface";


class BadgeService implements IBadgeService {
  async createBadge({
    name,
    description,
    icon,
    is_consecutive,
    badge_type,
    is_active = true,
  }): Promise<boolean> {
    try {
      console.log("Creating badge with:", {
        name,
        description,
        icon,
        is_consecutive,
        badge_type,
        is_active,
      });

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
      console.log("Badge created");
      return true;
    } catch (err) {
      console.error("Error creating badge:", err); 
      throw new Error("Something went wrong");
    }
  }
}


export default BadgeService;
