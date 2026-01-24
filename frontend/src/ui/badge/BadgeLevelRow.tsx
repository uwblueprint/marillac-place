import React from "react";
import { Flex, Text, Divider } from "@chakra-ui/react";
import { Icon } from "../../types/enums";
import { AchievedBadgeLevel, BadgeLevelProgress } from "../../types/models";
import BadgeProgress from "./BadgeProgress";
import { MarillacCoin } from "../icons/MiscIcons";
import { toTitleCase } from "../../helpers/stringUtils";

interface BadgeLevelRowProps {
  badge: AchievedBadgeLevel | BadgeLevelProgress;
  index: number;
  achieved?: boolean;
}

const BadgeLevelRow: React.FC<BadgeLevelRowProps> = ({ badge, index, achieved = false }) => {
  const icon = badge.badge_level?.system_badge?.icon ?? Icon.FIVE_STAR;
  const description = badge.badge_level?.system_badge?.description ?? "Error loading badge description";
  const value = badge.badge_level?.value ?? 0;

  function getPercentageComplete(bl: any): number {
    if (achieved) {
      return 100;
    }
    const benchmark = bl.badge_level?.benchmark ?? 0;
    if (benchmark === 0) {
      return 0;
    }
    return Math.round((bl.progress / benchmark) * 100);
  }

  return (
    <>
      {index !== 0 && (
        <Divider orientation="horizontal" color='background.border' mt="8px" />
      )}
      <Flex width="100%" alignItems="center" justifyContent="space-between" mt="8px">
        <Flex alignItems="center" gap="12px">
          <BadgeProgress icon={icon} level={badge.level} percentageComplete={getPercentageComplete(badge)} />

          <Flex flexDir="column">
            <Text textStyle="s1" color="brand.primaryDark">
              {toTitleCase(badge.level) + " " + badge.name + " Badge"}
            </Text>
            <Text textStyle="b2" color="text.medium">
              {description}
            </Text>
          </Flex>
        </Flex>
        {!achieved && (
          <Flex alignItems="center" gap="8px">
            <Text textStyle="b1">
              {value}
            </Text>
            <MarillacCoin size={16} />
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default BadgeLevelRow;
