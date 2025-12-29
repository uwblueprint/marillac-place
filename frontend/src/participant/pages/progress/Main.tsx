import React, { useContext, useState, useMemo } from "react";
import { Flex, Text, HStack } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import WidgetContainer from "../../../ui/containers/WidgetContainer";
import { ParticipantContext } from "../../ParticipantContext";
import { EditGoal } from "./components/EditGoal";
import { SetGoal } from "./components/SetGoal";
import { GET_PARTICIPANT_BY_PID } from "../../../gql/participantRequests";
import { GET_WEEKLY_EARNINGS } from "../../../gql/transactionRequests";
import { GET_EARNING_GOAL } from "../../../gql/earningGoalRequests";
import { GET_BADGE_LEVEL_PROGRESS } from "../../../gql/badgeLevelProgressRequests";
import { GET_ACHIEVED_BADGE_LEVELS } from "../../../gql/achievedBadgeLevelRequests";
import WeeklyEarningsChart from "./components/EarningsWidget";
import BucksGoalCard from "./elements/BucksGoalCard";
import BadgeWidget from "./components/BadgeWidget";
import { BadgeLevelProgress, AchievedBadgeLevel } from "../../../types/models";
import { Level } from "../../../types/enums";
import { DAYS } from "../../../constants/days";
import LoadingScreen from "../../../ui/screens/LoadingScreen";
import { toTitleCase } from "../../../helpers/stringUtils";

type BadgeToDisplay = {
  title: string;
  subtitle: string;
  bucks: number;
  badge: {
    icon: string;
    level: Level;
    percentComplete: number;
  };
};

export default function ParticipantsProgressPage() {
  const [editGoal, setEditGoal] = useState(false);
  const [setGoal, setSetGoal] = useState(false);
  const [activeTab, setActiveTab] = useState<"badges" | "achieved">("badges");
  const participantContext = useContext(ParticipantContext);

  const pid = participantContext?.pid;
  const balance = participantContext?.balance ?? 0;

  // Fetch participant data (for total_earnings if needed)
  const { loading: loadingParticipant } = useQuery(GET_PARTICIPANT_BY_PID, {
    variables: { pid },
    skip: !pid,
  });

  // Fetch earnings data
  const {
    data: earningsData,
    loading: loadingEarnings,
  } = useQuery(GET_WEEKLY_EARNINGS, {
    variables: { pid },
    skip: !pid,
  });

  // Fetch earning goal
  const {
    data: goalData,
    loading: loadingGoal,
    refetch: refetchGoal,
  } = useQuery(GET_EARNING_GOAL, {
    variables: { pid },
    skip: !pid,
  });

  // Fetch badge progress
  const {
    data: progressData,
    loading: loadingProgress,
  } = useQuery(GET_BADGE_LEVEL_PROGRESS, {
    variables: { pid },
    skip: !pid,
  });

  // Fetch achieved badges
  const {
    data: achievedData,
    loading: loadingAchieved,
  } = useQuery(GET_ACHIEVED_BADGE_LEVELS, {
    variables: { pid },
    skip: !pid,
  });

  const loading =
    loadingParticipant ||
    loadingEarnings ||
    loadingGoal ||
    loadingProgress ||
    loadingAchieved;

  // Transform weekly earnings to array format
  const weeklyEarnings = useMemo(() => {
    if (!earningsData?.getWeeklyEarnings) {
      return [0, 0, 0, 0, 0, 0, 0];
    }
    const earnings = earningsData.getWeeklyEarnings;
    // Convert from object with day keys to array (Sunday=0, Monday=1, etc.)
    return DAYS.map((day) => earnings[day] ?? 0);
  }, [earningsData]);

  const currentGoal = goalData?.getEarningGoal?.value ?? null;

  // Transform badge progress data to display format
  const badgesInProgress = useMemo((): BadgeToDisplay[] => {
    if (!progressData?.getBadgeLevelProgress) return [];

    const progress: BadgeLevelProgress[] = progressData.getBadgeLevelProgress;

    return progress
      .filter((p) => p.badge_level?.system_badge?.is_active)
      .map((p) => {
        const benchmark = p.badge_level?.benchmark ?? 1;
        const progressValue = p.progress ?? 0;
        const percentComplete = Math.min(
          100,
          Math.round((progressValue / benchmark) * 100)
        );
        const levelName =
          p.level === Level.NOVICE
            ? "Beginner"
            : p.level === Level.BRONZE
            ? "Bronze"
            : p.level === Level.SILVER
            ? "Silver"
            : p.level === Level.GOLD
            ? "Gold"
            : "Diamond";

        return {
          title: `${levelName} ${p.badge_level?.system_badge?.name ?? p.name}`,
          subtitle: p.badge_level?.system_badge?.description ?? "",
          bucks: p.badge_level?.value ?? 0,
          badge: {
            icon: p.badge_level?.system_badge?.icon ?? "FIVE_STAR",
            level: p.level,
            percentComplete,
          },
        };
      })
      .sort((a, b) => {
        // Sort by level priority (Diamond > Gold > Silver > Bronze > Novice)
        const levelOrder: Record<Level, number> = {
          [Level.NOVICE]: 0,
          [Level.BRONZE]: 1,
          [Level.SILVER]: 2,
          [Level.GOLD]: 3,
          [Level.DIAMOND]: 4,
        };
        return levelOrder[b.badge.level] - levelOrder[a.badge.level];
      });
  }, [progressData]);

  // Transform achieved badges data to display format
  const achievedBadges = useMemo((): BadgeToDisplay[] => {
    if (!achievedData?.getAchievedBadgeLevels) return [];

    const achieved: AchievedBadgeLevel[] = achievedData.getAchievedBadgeLevels;

    return achieved
      .filter((a) => a.badge_level?.system_badge?.is_active)
      .map((a) => {
        const levelName =
          a.level === Level.NOVICE
            ? "Beginner"
            : a.level === Level.BRONZE
            ? "Bronze"
            : a.level === Level.SILVER
            ? "Silver"
            : a.level === Level.GOLD
            ? "Gold"
            : "Diamond";

        return {
          title: `${levelName} ${a.badge_level?.system_badge?.name ?? a.name}`,
          subtitle: a.badge_level?.system_badge?.description ?? "",
          bucks: a.badge_level?.value ?? 0,
          badge: {
            icon: a.badge_level?.system_badge?.icon ?? "FIVE_STAR",
            level: a.level,
            percentComplete: 100,
          },
        };
      })
      .sort((a, b) => {
        // Sort by level priority (Diamond > Gold > Silver > Bronze > Novice)
        const levelOrder: Record<Level, number> = {
          [Level.NOVICE]: 0,
          [Level.BRONZE]: 1,
          [Level.SILVER]: 2,
          [Level.GOLD]: 3,
          [Level.DIAMOND]: 4,
        };
        return levelOrder[b.badge.level] - levelOrder[a.badge.level];
      });
  }, [achievedData]);

  const handleClose = () => {
    setSetGoal(false);
    setEditGoal(false);
  };

  const handleGoalSet = async () => {
    await refetchGoal();
    handleClose();
  };

  const handleGoalUpdated = async () => {
    await refetchGoal();
    handleClose();
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!pid) {
    return <Text>Error: Participant not found</Text>;
  }

  const handleGoalClick = () => {
    if (currentGoal) {
      setEditGoal(true);
    } else {
      setSetGoal(true);
    }
  };

  return (
    <>
      <BucksGoalCard
        value={balance}
        goal={currentGoal}
        onEditGoalClick={handleGoalClick}
      />
      {setGoal && (
        <SetGoal handleClose={handleClose} onGoalSet={handleGoalSet} />
      )}
      {editGoal && currentGoal && (
        <EditGoal
          handleClose={handleClose}
          onGoalUpdated={handleGoalUpdated}
          currentGoal={currentGoal}
          currentBalance={balance}
        />
      )}
      <WeeklyEarningsChart weeklyEarnings={weeklyEarnings} />

      <WidgetContainer width="100%">
        <>
          <HStack spacing={6} mb={4}>
            {(["badges", "achieved"] as const).map((tab) => (
              <Text
                key={tab}
                fontWeight={activeTab === tab ? "bold" : "medium"}
                color={activeTab === tab ? "black" : "grey"}
                textDecoration={activeTab === tab ? "underline" : "none"}
                cursor="pointer"
                _hover={{ color: "gray.700" }}
                onClick={() => setActiveTab(tab)}
                transition="all 0.2s ease"
              >
                {toTitleCase(tab)}
              </Text>
            ))}
          </HStack>

          {activeTab === "badges" ? (
            <BadgeWidget allBadges={badgesInProgress} achieved={false} />
          ) : (
            <BadgeWidget allBadges={achievedBadges} achieved />
          )}
        </>
      </WidgetContainer>
    </>
  );
}
