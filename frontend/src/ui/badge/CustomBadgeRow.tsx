import React from "react";
import { Flex, Text, Divider } from "@chakra-ui/react";
import { EarnedCustomBadge } from "../../types/models";
import BadgeProgress from "./BadgeProgress";

interface CustomBadgeRowProps {
  badge: EarnedCustomBadge;
  index: number;
}

const CustomBadgeRow: React.FC<CustomBadgeRowProps> = ({ badge, index }) => {
  return (
    <>
      {index !== 0 && (
        <Divider orientation="horizontal" color="background.border" mt="8px" />
      )}
      <Flex
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        mt="8px"
      >
        <Flex alignItems="center" gap="12px">
          <BadgeProgress
            icon={badge.icon}
            level="CUSTOM"
            percentageComplete={100}
          />

          <Flex flexDir="column">
            <Text textStyle="s1" color="brand.primaryDark">
              {"Custom " + badge.name + " Badge"}
            </Text>
            <Text textStyle="b2" color="text.medium">
              {badge.description}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default CustomBadgeRow;
