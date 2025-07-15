import {
  EarnedBadge,
  BadgeType,
  Icon,
  Badge,
  BadgeLevel,
} from "@prisma/client";
import BadgeService from "../services/implementation/badgeImplementation";
import IBadgeService from "../services/interface/badgeInterface";

const badgeService: IBadgeService = new BadgeService();

const levelMap: Record<number, string> = {
  1: "N",
  2: "B",
  3: "S",
  4: "G",
  5: "D",
};

const badgeResolver = {
  Query: {
    getCustomBadges: async (): Promise<Badge[]> => {
      return badgeService.getCustomBadges();
    },
    getSystemBadges: async (): Promise<Badge[]> => {
      return badgeService.getSystemBadges();
    },
  },
  Mutation: {
    updateBadgeStatus: async (
      _parent: undefined,
      {
        badge_id,
        is_active
      }: {
        badge_id: number,
        is_active: boolean,
      }
    ): Promise<boolean> => {
      return badgeService.updateBadgeStatus(badge_id, is_active)
    },
    assignCustomBadge: async (
      _parent: undefined,
      {
        badge_id,
        marillac_bucks,
        participant_ids,
      }: {
        badge_id: number;
        marillac_bucks: number;
        participant_ids: number[];
      }
    ): Promise<number[]> => {
      return badgeService.assignCustomBadge(
        badge_id,
        marillac_bucks,
        participant_ids
      );
    },
    editCustomBadge: async (
      _parent: undefined,
      {
        custom_badge_id,
        new_custom_badge_name,
        new_custom_badge_description,
      }: {
        custom_badge_id: number;
        new_custom_badge_name?: string;
        new_custom_badge_description?: string;
      }
    ): Promise<boolean> => {
      return badgeService.editCustomBadge(
        custom_badge_id,
        new_custom_badge_name,
        new_custom_badge_description
      );
    },
    editSystemBadge: async (
      _parent: undefined,
      {
        system_badge_id,
        system_badge_name,
        system_badge_criteria,
      }: {
        system_badge_id: number;
        system_badge_name: string;
        system_badge_criteria?: string;
      }
    ): Promise<boolean> => {
      return badgeService.editSystemBadge(
        system_badge_id,
        system_badge_name,
        system_badge_criteria
      );
    },
    createCustomBadge: async (
      _parent: undefined,
      {
        name,
        description,
        icon,
      }: {
        name: string;
        description: string;
        icon: Icon;
      }
    ): Promise<boolean> => {
      return badgeService.createCustomBadge(
        name,
        description,
        icon
      );
    },
    deleteCustomBadge: async (
      _parent: undefined,
      {
        badge_id,
      }: {
        badge_id: number;
      }
    ): Promise<boolean> => {
      return badgeService.deleteCustomBadge(badge_id);
    },
    editBadgeLevel: async (
      _parent: undefined,
      {
        badge_id,
        badge_level,
        benchmark,
        marillac_bucks,
      }: {
        badge_id: number;
        badge_level: number;
        benchmark: number;
        marillac_bucks: number;
      }
    ): Promise<boolean> => {
      return badgeService.editBadgeLevel(
        badge_id,
        badge_level,
        benchmark,
        marillac_bucks
      );
    },
  },
};

export default badgeResolver;
