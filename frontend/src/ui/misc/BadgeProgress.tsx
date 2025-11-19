import React from "react";
import { Box, color } from "@chakra-ui/react";
import * as BadgeIconSet from "../icons/BadgeIcons";
import * as BadgeLevelFrameSet from "../icons/BadgeLevelFrameIcons";
import { IconProps } from "../../types/component";
import { Icon, Level } from "../../types/enums";

const badgeIconComponents: Record<Icon, React.FC<IconProps>> = {
  [Icon.BABY]: BadgeIconSet.Baby,
  [Icon.DIAMOND]: BadgeIconSet.Diamond,
  [Icon.MONEY]: BadgeIconSet.DollarSign,
  [Icon.FIVE_STAR]: BadgeIconSet.FiveStar,
  [Icon.FLOWER]: BadgeIconSet.Flower,
  [Icon.FOUR_STAR]: BadgeIconSet.FourStar,
  [Icon.GROUP]: BadgeIconSet.Group,
  [Icon.HEART]: BadgeIconSet.Heart,
  [Icon.GEMSTONE]: BadgeIconSet.Hexagon,
  [Icon.HOME]: BadgeIconSet.Home,
  [Icon.PENCIL]: BadgeIconSet.Pencil,
  [Icon.PLANT]: BadgeIconSet.Plant,
  [Icon.TOOL]: BadgeIconSet.Tools,
  [Icon.WINGS]: BadgeIconSet.Wings,
};

const levelConfig: Record<Level, { FrameIcon: React.FC<IconProps>; color: string }> = {
  [Level.NOVICE]: {
    FrameIcon: BadgeLevelFrameSet.Novice,
    color: "#008905",
  },
  [Level.BRONZE]: {
    FrameIcon: BadgeLevelFrameSet.Bronze,
    color: "#BD2306",
  },
  [Level.SILVER]: {
    FrameIcon: BadgeLevelFrameSet.Silver,
    color: "#929197",
  },
  [Level.GOLD]: {
    FrameIcon: BadgeLevelFrameSet.Gold,
    color: "#E48005",
  },
  [Level.DIAMOND]: {
    FrameIcon: BadgeLevelFrameSet.Diamond,
    color: "#0199D1",
  },
};

const normalizePercentage = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

interface BadgeProps {
  icon: Icon;
  level: Level;
  percentageComplete?: number;
}

const Badge: React.FC<BadgeProps> = ({
  icon,
  level,
  percentageComplete = 100,
}) => {
  const IconComponent = badgeIconComponents[icon] ?? BadgeIconSet.FiveStar;
  const { FrameIcon: LevelComponent, color: iconColor } = levelConfig[level] ?? levelConfig[Level.NOVICE];
  const normalizedPercentage = normalizePercentage(percentageComplete) / 100;

  const angle = normalizedPercentage * 360;
  const overlayMask = `conic-gradient(
    transparent 0deg,
    transparent ${angle}deg,
    white ${angle}deg,
    white 360deg
  )`;

  return (
    <Box
      position="relative"
      width="fit-content"
      height="fit-content"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <LevelComponent size={42} />

      <Box
        position="absolute"
        inset="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={1}
      >
        <IconComponent color={iconColor} />
      </Box>

      {normalizedPercentage < 1 && (
        <Box
          position="absolute"
          inset="0"
          borderRadius="full"
          backgroundColor="rgba(255, 255, 255, 0.5)"
          zIndex={10}
          pointerEvents="none"
          style={{
            WebkitMaskImage: overlayMask,
            maskImage: overlayMask,
          }}
        />
      )}
    </Box>
  );
};

export default Badge;