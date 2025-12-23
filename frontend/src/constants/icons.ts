import { ComponentType } from "react";
import { Icon } from "../types/enums";
import { IconProps } from "../types/component";
import {
  Baby,
  Diamond,
  DollarSign,
  FiveStar,
  Flower,
  FourStar,
  Group,
  Heart,
  Hexagon,
  Home,
  Pencil,
  Plant,
  Tools,
  Wings,
} from "../ui/icons/BadgeIcons";

export const ICON_MAP: Record<Icon, ComponentType<IconProps>> = {
  [Icon.BABY]: Baby,
  [Icon.DIAMOND]: Diamond,
  [Icon.FIVE_STAR]: FiveStar,
  [Icon.FLOWER]: Flower,
  [Icon.FOUR_STAR]: FourStar,
  [Icon.GEMSTONE]: Hexagon,
  [Icon.GROUP]: Group,
  [Icon.HEART]: Heart,
  [Icon.HOME]: Home,
  [Icon.MONEY]: DollarSign,
  [Icon.PENCIL]: Pencil,
  [Icon.TOOL]: Tools,
  [Icon.WINGS]: Wings,
  [Icon.PLANT]: Plant,
};
