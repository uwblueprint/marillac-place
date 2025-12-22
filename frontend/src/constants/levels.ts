import { Level } from "../types/enums";

export const LEVEL_ORDER: Level[] = [
  Level.NOVICE,
  Level.BRONZE,
  Level.SILVER,
  Level.GOLD,
  Level.DIAMOND,
];

export const LEVEL_ABBREVIATION: Record<Level, string> = {
  [Level.NOVICE]: "N",
  [Level.BRONZE]: "B",
  [Level.SILVER]: "S",
  [Level.GOLD]: "G",
  [Level.DIAMOND]: "D",
};
