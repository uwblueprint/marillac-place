export enum BadgeType {
  SYSTEM = "SYSTEM",
  CUSTOM = "CUSTOM",
}

export interface Badge {
  badgeId: number;
  badgeType: BadgeType;
  name: string;
  description: string;
  isActive: boolean;
  isConsecutive: boolean;
  badgeLevel: [BadgeLevel];
}

export interface BadgeLevel {
  badgeId: number;
  level: number;
  benchmark: number;
  marillacBucks: number;
}
