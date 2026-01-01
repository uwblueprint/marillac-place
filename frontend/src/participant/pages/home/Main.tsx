import React, { useContext } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import TodoListWidget from "./components/TodoListWidget";
import { formatDateV1 } from "../../../helpers/formatDateTime";
import AnnouncementWidget from "./components/AnnouncementWidget";
import BadgeWidget, { BadgeToDisplay } from "./components/badgeWidget";
import TasksCompletedWidget from "./components/TasksCompletedWidget";
import { ParticipantContext } from "../../ParticipantContext";
import { GET_BADGE_LEVEL_PROGRESS } from "../../../gql/badgeLevelProgressRequests";
import { GET_ACHIEVED_BADGE_LEVELS } from "../../../gql/achievedBadgeLevelRequests";
import { HAS_COMPLETED_ALL_REQUIRED_TASKS } from "../../../gql/assignedTaskRequests";

export default function ParticipantsHomePage() {
  const participant = useContext(ParticipantContext);
  const pid = participant?.pid;

  // Fetch badge progress
  const { data: badgeProgressData } = useQuery(GET_BADGE_LEVEL_PROGRESS, {
    variables: { pid },
    skip: !pid,
  });

  // Fetch achieved badges
  const { data: achievedBadgesData } = useQuery(GET_ACHIEVED_BADGE_LEVELS, {
    variables: { pid },
    skip: !pid,
  });

  // Check if all required tasks are completed
  const { data: tasksData, loading: tasksLoading } = useQuery(
    HAS_COMPLETED_ALL_REQUIRED_TASKS,
    {
      variables: { pid },
      skip: !pid,
    }
  );

  const hasCompletedAllTasks = tasksData?.hasCompletedAllRequiredTasks || false;

  // Transform badge data for display
  const badgesToDisplay: BadgeToDisplay[] = [];

  // Add in-progress badges (show top 3 with most progress)
  if (badgeProgressData?.getBadgeLevelProgress) {
    const progressBadges = badgeProgressData.getBadgeLevelProgress
      .filter((badge: any) => badge.progress > 0 && badge.progress < badge.badge_level.benchmark)
      .map((badge: any) => ({
        messageText: "Badge Progress",
        title: `${badge.name} - ${badge.level}`,
        subtitle: `${badge.progress}/${badge.badge_level.benchmark} - ${badge.badge_level.system_badge.description}`,
        badge: {
          icon: badge.badge_level.system_badge.icon,
          level: badge.level,
          percentageComplete: Math.round((badge.progress / badge.badge_level.benchmark) * 100),
        },
      }))
      .sort((a: any, b: any) => b.badge.percentageComplete - a.badge.percentageComplete)
      .slice(0, 3);

    badgesToDisplay.push(...progressBadges);
  }

  // Add recently achieved badges (show most recent)
  if (achievedBadgesData?.getAchievedBadgeLevels) {
    const recentAchieved = achievedBadgesData.getAchievedBadgeLevels
      .slice(0, 1)
      .map((badge: any) => ({
        messageText: "Congratulations!",
        title: `${badge.name} - ${badge.level}`,
        subtitle: `You earned this badge! ${badge.badge_level.system_badge.description}`,
        badge: {
          icon: badge.badge_level.system_badge.icon,
          level: badge.level,
          percentageComplete: 100,
        },
      }));

    badgesToDisplay.unshift(...recentAchieved);
  }

  return (
    <>
      <Flex w="100%" flexDir="column" mb="12px">
        <Text color="primary.700" textStyle="mobile.h1">
          Welcome to Marillac Place
        </Text>
        <Text color="text.light.secondary" textStyle="mobile.h3">
          {formatDateV1(new Date())}
        </Text>
      </Flex>

      {!tasksLoading && hasCompletedAllTasks && <TasksCompletedWidget />}
      <BadgeWidget badgesToDisplayInWidget={badgesToDisplay} />
      <TodoListWidget />
      <AnnouncementWidget />
    </>
  );
}
