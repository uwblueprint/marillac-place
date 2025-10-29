import React from "react";
import { Box, Flex, Text, Divider, Button } from "@chakra-ui/react";
import Badge, { BadgeRarity } from "../../../common/Badge";

interface BadgeRowProps {
  title: string;
  subtitle: string;
  badge: {
    icon: string;
    rarity: BadgeRarity;
    percentComplete?: number;
  };
  isLast?: boolean;
  isFirst?: boolean;
  showButton?: boolean;
  onProgressClick?: () => void;
}

const BadgeRow: React.FC<BadgeRowProps> = ({
  title,
  subtitle,
  badge,
  isLast = false,
  isFirst= false,
  showButton = false,
  onProgressClick,
}) => {
  return (
    <Box>
      {/* Message text with button */}
      <Flex justify="space-between" align="center" mb="8px">
        {showButton && onProgressClick && (
          <Button
            variant="link"
            color="primary.700"
            textStyle="mobile.h3"
            textDecoration="underline"
            onClick={onProgressClick}
            _hover={{
              color: "primary.700",
              opacity: 0.8,
            }}
          >
            Progress
          </Button>
        )}
      </Flex>

      {/* Badge and content row */}
      <Flex align="center" gap="12px" 
            borderTop={isFirst ? "0" : "1px solid"}
            borderColor="neutral.300" 
            pt={isFirst ? "0" : "16px"}
            mb={isLast ? "0" : "16px"}>
        <Badge
          icon={badge.icon}
          rarity={badge.rarity}
          size="medium"
          percentComplete={badge.percentComplete ?? 100}
        />
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
      </Flex>
    </Box>
  );
};

export default BadgeRow;
