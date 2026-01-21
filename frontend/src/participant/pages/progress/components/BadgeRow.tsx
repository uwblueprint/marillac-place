import React from "react";
import { Flex, Text, Divider } from "@chakra-ui/react";
import { Icon } from "../../../../types/enums";
import { AchievedBadgeLevel, BadgeLevelProgress } from "../../../../types/models";
import BadgeProgress from "../../../../ui/misc/BadgeProgress";
import { MarillacCoin } from "../../../../ui/icons/MiscIcons";
import { toTitleCase } from "../../../../helpers/stringUtils";

interface BadgeRowProps {
  badge: AchievedBadgeLevel | BadgeLevelProgress;
  isAchieved: boolean;
  index: number;
}

const BadgeRow: React.FC<BadgeRowProps> = ({ badge, isAchieved, index }) => {
  const icon = badge.badge_level?.system_badge?.icon ?? Icon.FIVE_STAR;
  const description = badge.badge_level?.system_badge?.description ?? "Error loading badge description";
  const value = badge.badge_level?.value ?? 0;

  function getPercentageComplete(bl: any): number {
    const benchmark = bl.badge_level?.benchmark ?? 0;
    if (benchmark === 0) {
      return 0;
    }
    return Math.round((bl.progress / benchmark) * 100);
  }

  return (
    <>
      {index !== 0 && (
        <Divider orientation="horizontal" color='neutral.300' mt="8px" />
      )}
      <Flex width="100%" alignItems="center" justifyContent="space-between" mt="8px">
        <Flex alignItems="center" gap="12px">
          {isAchieved ? (
            <BadgeProgress icon={icon} level={badge.level} percentageComplete={100} />
          ) : (
            <BadgeProgress icon={icon} level={badge.level} percentageComplete={getPercentageComplete(badge)} />
          )}

          <Flex flexDir="column">
            <Text textStyle="mobile.b0" color="primary.700">
              {toTitleCase(badge.level) + " " + badge.name + " Badge"}
            </Text>
            <Text textStyle="mobile.b2" color="text.light.secondary">
              {description}
            </Text>
          </Flex>
        </Flex>
        {!isAchieved && (
          <Flex alignItems="center" gap="8px">
            <Text textStyle="mobile.b1">
              {value}
            </Text>
            <MarillacCoin size={16} />
          </Flex>
        )}
        
      </Flex>
    </>
  );
};

export default BadgeRow;
