import React from "react";
import { Box, Image } from "@chakra-ui/react";

export type BadgeRarity = "green" | "bronze" | "silver" | "gold" | "diamond";
export type BadgeSize = "small" | "medium" | "large";

interface BadgeProps {
  icon: string; // icon name (e.g., "diamond", "five_star", "tool")
  rarity: BadgeRarity;
  size?: BadgeSize | number | string; // this takes a preset, number (px), or CSS string
  percentComplete?: number; // 0-100
  customColors?: {
    fill?: string;
    shadow?: string;
    strokeColor?: string;
  };
}

const Badge: React.FC<BadgeProps> = ({
  icon,
  rarity,
  size = "medium",
  percentComplete = 100,
  customColors,
}) => {
  // Preset sizes
  const presetSizes = {
    small: {
      container: "40px",
      icon: "24px",
      shadowBlur: "8px",
      shadowOffset: "2px",
    },
    medium: {
      container: "60px",
      icon: "36px",
      shadowBlur: "12px",
      shadowOffset: "3px",
    },
    large: {
      container: "80px",
      icon: "48px",
      shadowBlur: "16px",
      shadowOffset: "4px",
    },
  };

  // Function to get size configuration based on input
  const getSizeConfig = (sizeInput: BadgeSize | number | string) => {
    if (
      typeof sizeInput === "string" &&
      ["small", "medium", "large"].includes(sizeInput)
    ) {
      return presetSizes[sizeInput as BadgeSize];
    }

    if (typeof sizeInput === "number") {
      return {
        container: `${sizeInput}px`,
        icon: `${Math.round(sizeInput * 0.6)}px`,
        shadowBlur: `${Math.round(sizeInput * 0.2)}px`,
        shadowOffset: `${Math.round(sizeInput * 0.05)}px`,
      };
    }

    // If it's a CSS string
    if (typeof sizeInput === "string") {
      return {
        container: sizeInput,
        icon: `calc(${sizeInput} * 0.6)`,
        shadowBlur: `calc(${sizeInput} * 0.2)`,
        shadowOffset: `calc(${sizeInput} * 0.05)`,
      };
    }

    return presetSizes.medium;
  };

  // Rarity color configurations based on image
  const rarityConfig = {
    green: {
      fill: "linear-gradient(135deg, #20C125 0%, #008905 100%)",
      shadow: "#BAFFBD",
      strokeColor: "#008905",
    },
    bronze: {
      fill: "linear-gradient(135deg, #E54E29 0%, #BB2406 100%)",
      shadow: "#FFD5C6",
      strokeColor: "#BB2406",
    },
    silver: {
      fill: "linear-gradient(135deg, #BDBEC2 0%, #95969B 100%)",
      shadow: "#F4F4FC",
      strokeColor: "#95969B",
    },
    gold: {
      fill: "linear-gradient(135deg, #EEA80A 0%, #E88108 100%)",
      shadow: "#FFFADA",
      strokeColor: "#E88108",
    },
    diamond: {
      fill: "linear-gradient(135deg, #52C2E0 0%, #048BC3 100%)",
      shadow: "#C9F2FF",
      strokeColor: "#048BC3",
    },
  };

  const config = getSizeConfig(size);
  const colors = customColors || rarityConfig[rarity];

  const overlayOpacity = Math.max(
    0,
    Math.min(1, (100 - percentComplete) / 100)
  );

  return (
    <Box
      position="relative"
      width={config.container}
      height={config.container}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        width="100%"
        height="100%"
        borderRadius="50%"
        background={colors.fill}
        boxShadow={`0 ${config.shadowOffset} ${config.shadowBlur} ${colors.shadow}`}
        border="2px solid"
        borderColor={colors.strokeColor}
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        overflow="hidden"
      >
        <Image
          src={`/badges/${icon}.svg`}
          alt={`${rarity} badge`}
          width={config.icon}
          height={config.icon}
          filter="brightness(0) invert(1)"
          zIndex={2}
        />

        {percentComplete < 100 && (
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            background="rgba(255, 255, 255, 0.7)"
            opacity={overlayOpacity}
            borderRadius="50%"
            zIndex={3}
          />
        )}

        {percentComplete > 0 && percentComplete < 100 && (
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            borderRadius="50%"
            background={`conic-gradient(${colors.fill} 0%, ${colors.fill} ${percentComplete}%, rgba(255, 255, 255, 0.3) ${percentComplete}%, rgba(255, 255, 255, 0.3) 100%)`}
            zIndex={1}
          />
        )}
      </Box>

      {/* Optional progress ring for partial completion */}
      {percentComplete >= 0 && percentComplete < 100 && (
        <Box
          position="absolute"
          top="-2px"
          left="-2px"
          right="-2px"
          bottom="-2px"
          borderRadius="50%"
          background={`conic-gradient(${colors.strokeColor} 0%, ${colors.strokeColor} ${percentComplete}%, transparent ${percentComplete}%, transparent 100%)`}
          zIndex={0}
        />
      )}
    </Box>
  );
};

export default Badge;
