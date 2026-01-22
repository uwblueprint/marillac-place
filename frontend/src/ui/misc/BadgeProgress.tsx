import React from "react";
import { Box, color } from "@chakra-ui/react";
import * as BadgeLevelFrameSet from "../icons/BadgeLevelFrameIcons";
import { IconProps } from "../../types/component";
import { Icon, Level } from "../../types/enums";
import { ICON_MAP } from "../../constants/icons";

const levelConfig: Record<
  Level | "CUSTOM",
  { FrameIcon: React.FC<IconProps>; color: string }
> = {
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
  CUSTOM: {
    FrameIcon: BadgeLevelFrameSet.Custom,
    color: "#0C727E",
  },
};

const normalizePercentage = (value: number) =>
  Math.max(0, Math.min(100, Math.round(value)));

interface BadgeProps {
  icon: Icon;
  level: Level | "CUSTOM";
  percentageComplete?: number;
}

const Badge: React.FC<BadgeProps> = ({
  icon,
  level,
  percentageComplete = 100,
}) => {
  const IconComponent = ICON_MAP[icon] ?? ICON_MAP[Icon.FIVE_STAR];
  const { FrameIcon: LevelComponent, color: iconColor } =
    levelConfig[level] ?? levelConfig[Level.NOVICE];
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
