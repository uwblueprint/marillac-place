import React from "react";
import { useNavigate } from "react-router-dom";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import { PARTICIPANTS_PROGRESS_PAGE } from "../../../../constants/routes";
import { Level, Icon } from "../../../../types/enums";
import BadgeRow from "./BadgeRow";

export type BadgeRowType = "congratulations" | "lostStreak" | "progress";

export interface BadgeToDisplay {
  messageText: string;
  title: string;
  subtitle: string;
  badge: {
    icon: Icon;
    level: Level;
    percentageComplete?: number;
  };
}

interface BadgeWidgetProps {
  badgesToDisplayInWidget: BadgeToDisplay[];
}

const BadgeWidget: React.FC<BadgeWidgetProps> = ({
  badgesToDisplayInWidget,
}) => {
  const navigate = useNavigate();

  const handleProgressClick = () => {
    navigate(PARTICIPANTS_PROGRESS_PAGE);
  };

  // fallback if no badges are provided
  if (!badgesToDisplayInWidget || badgesToDisplayInWidget.length === 0) {
    return (
      <WidgetContainer width="100%">
        <BadgeRow
          messageText="No badges to display"
          title="Add some badges!"
          subtitle="Pass badgesToDisplayInWidget prop with badge data."
          badge={{
            icon: Icon.FIVE_STAR,
            level: Level.SILVER,
            percentageComplete: 0,
          }}
          isLast
        />
      </WidgetContainer>
    );
  }

  return (
    <WidgetContainer width="100%">
      <>
        {badgesToDisplayInWidget.map((badgeData, index) => {
          const key = `badge-${index}`;
          const isLast = index === badgesToDisplayInWidget.length - 1;
          const isFirst = index === 0;

          const {
            messageText = "Badge Progress",
            title,
            subtitle = "",
            badge = {
              icon: Icon.DIAMOND,
              level: Level.BRONZE,
              percentageComplete: 0,
            },
          } = badgeData;

          return (
            <BadgeRow
              key={key}
              messageText={messageText}
              title={title}
              subtitle={subtitle}
              badge={badge}
              isLast={isLast}
              showButton={isFirst}
              onProgressClick={handleProgressClick}
            />
          );
        })}
      </>
    </WidgetContainer>
  );
};

export default BadgeWidget;
