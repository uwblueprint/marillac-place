import React from "react";
import { Box, Flex, Text, Image } from "@chakra-ui/react";
import Badge from "../../../../ui/misc/BadgeProgress";
import { Level, Icon } from "../../../../types/enums";

interface BadgeRowProps {
  title: string;
  subtitle: string;
  bucks: number;
  badge: {
    icon: string;
    level: Level;
    percentComplete?: number;
  };
  isLast?: boolean;
  isFirst?: boolean;
  showButton?: boolean;
  achieved?: boolean;
  onProgressClick?: () => void;
}

const BadgeRow: React.FC<BadgeRowProps> = ({
  title,
  subtitle,
  bucks,
  badge,
  isLast = false,
  isFirst = false,
  showButton = false,
  achieved = false,
  onProgressClick,
}) => {
  // Convert icon string to Icon enum
  const iconEnum =
    Object.values(Icon).find((i) => i === badge.icon) ?? Icon.FIVE_STAR;

  return (
    <Box>
      {/* Badge and content row */}
      <Flex
        align="center"
        gap="14px"
        borderTop={isFirst ? "0" : "1px solid"}
        borderColor="neutral.300"
        pt={isFirst ? "0" : "16px"}
        mb={isLast ? "0" : "16px"}
      >
        <Flex direction="column" gap={1} alignItems="center">
          <Badge
            icon={iconEnum}
            level={achieved ? badge.level : Level.SILVER}
            percentageComplete={badge.percentComplete ?? 100}
          />
          {!achieved && (
            <Text
              textStyle="mobile.b1"
              color="text.light.secondary"
              lineHeight="1.3"
            >
              {badge.percentComplete ?? 0}%
            </Text>
          )}
        </Flex>
        <Box flex="1">
          <Text
            textStyle="mobile.h3"
            color="text.light.primary"
            fontWeight="600"
            mb="2px"
          >
            {title}
          </Text>
          <Text
            textStyle="mobile.b1"
            color="text.light.secondary"
            lineHeight="1.3"
          >
            {subtitle}
          </Text>
        </Box>
        {!achieved && (
          <Flex justifyContent="center" alignItems="center" gap="5px">
            {bucks}
            <Image src="/assets/marillac_bucks.png" alt="coin" />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default BadgeRow;
