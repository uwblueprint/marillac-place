import React from "react";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BadgeRarity } from "../../../common/Badge";
import BadgeRow from "./BadgeRow";

export type BadgeRowType = "congratulations" | "lostStreak" | "progress";

export interface BadgeToDisplay {
  title: string;
  subtitle: string;
  badge: {
    icon: string;
    rarity: BadgeRarity;
    percentComplete?: number;
  };
}

interface BadgeWidgetProps {
  badgesToDisplayInWidget: BadgeToDisplay[];
}

const BadgeWidget: React.FC<BadgeWidgetProps> = ({
  badgesToDisplayInWidget,
}) => {

  // fallback if no badges are provided
  if (!badgesToDisplayInWidget || badgesToDisplayInWidget.length === 0) {
    return (
      <Box
        bg="white"
        borderTop="1px solid"
        borderColor="black"
        borderRadius="12px"
        p="20px"
        mb="16px"
      >
        <BadgeRow
          title="Add some badges!"
          subtitle="Pass badgesToDisplayInWidget prop with badge data."
          badge={{
            icon: "five_star",
            rarity: "silver",
            percentComplete: 0,
          }}
          isLast
        />
      </Box>
    );
  }

  return (
    <Box
      bg="white"
      borderRadius="12px"
      p="20px"
      mb="16px"
      position="relative"
    >
      {badgesToDisplayInWidget.map((badgeData, index) => {
        const key = `badge-${index}`;
        const isLast = index === badgesToDisplayInWidget.length - 1;
        const isFirst = index === 0;

        const {
          title,
          subtitle = "",
          badge = {
            icon: "diamond",
            rarity: "bronze",
            percentComplete: 0,
          },
        } = badgeData;

        return (
          <BadgeRow
            key={key}
            title={title}
            subtitle={subtitle}
            badge={badge}
            isLast={isLast}
            isFirst={isFirst}
            showButton={isFirst}
            />
        );
      })}
    </Box>
  );
};

export default BadgeWidget;
