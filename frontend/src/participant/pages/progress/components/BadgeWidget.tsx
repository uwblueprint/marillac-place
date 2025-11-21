import React from "react";
import { Box } from "@chakra-ui/react";
import { Level } from "../../../../types/enums";
import BadgeRow from "./BadgeRow";

export type BadgeRowType = "congratulations" | "lostStreak" | "progress";

export interface BadgeToDisplay {
  title: string;
  subtitle: string;
  bucks: number;
  badge: {
    icon: string;
    level: Level;
    percentComplete?: number;
  };
}

interface BadgeWidgetProps {
  allBadges: BadgeToDisplay[];
  achieved: boolean;
}

const BadgeWidget: React.FC<BadgeWidgetProps> = ({ allBadges, achieved }) => {
  const filteredBadges = (
    badgesToDisplayInWidget: BadgeToDisplay[],
    complete: boolean
  ) => {
    return badgesToDisplayInWidget.filter((badge) => {
      if (complete) {
        return badge.badge.percentComplete === 100;
      }
      return badge.badge.percentComplete !== 100;
    });
  };
  const badgesToDisplayInWidget = filteredBadges(allBadges, achieved);

  // fallback if no badges are provided
  if (!badgesToDisplayInWidget || badgesToDisplayInWidget.length === 0) {
    return (
      <Box bg="white" p="20px" mb="16px">
        <BadgeRow
          title="No badges yet!"
          subtitle="Complete tasks to earn badges and track your progress."
          bucks={0}
          badge={{
            icon: "FIVE_STAR",
            level: Level.SILVER,
            percentComplete: 0,
          }}
          isLast
        />
      </Box>
    );
  }

  return (
    <Box>
      {badgesToDisplayInWidget.map((badgeData, index) => {
        const key = `badge-${index}`;
        const isLast = index === badgesToDisplayInWidget.length - 1;
        const isFirst = index === 0;

        const {
          title,
          subtitle = "",
          bucks = 0,
          badge = {
            icon: "DIAMOND",
            level: Level.BRONZE,
            percentComplete: 0,
          },
        } = badgeData;

        return (
          <BadgeRow
            key={key}
            title={title}
            subtitle={subtitle}
            badge={badge}
            bucks={bucks}
            isLast={isLast}
            isFirst={isFirst}
            showButton={isFirst}
            achieved={achieved}
          />
        );
      })}
    </Box>
  );
};

export default BadgeWidget;
