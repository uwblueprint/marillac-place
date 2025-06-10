/* eslint-disable */
import { BadgeType } from "@prisma/client";
import prisma from "../../prisma";
import IBadgeService from "../interface/badgeInterface";

class BadgeService implements IBadgeService {
  async editCustomBadge (
    custom_badge_id: number,
    new_custom_badge_name?: string,
    new_custom_badge_description?: string
  ): Promise<boolean> {
    try {
      if (new_custom_badge_name == undefined && new_custom_badge_description == undefined) return false;
      await prisma.badge.update({
        where: { badge_id: custom_badge_id, badge_type: 'CUSTOM' },
        data: {
          ...(new_custom_badge_name !== undefined && { name: new_custom_badge_name }),
          ...(new_custom_badge_description !== undefined && { description: new_custom_badge_description })
        },
      });
      return true;
    } catch (err) {
      // @ts-ignore
      throw new Error(err.message ||"Something went wrong");
    }
  }
}

export default BadgeService;
