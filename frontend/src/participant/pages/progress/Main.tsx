import React from "react";
import { Flex } from "@chakra-ui/react";
import WeeklyEarningsChart from "./components/WeeklyEarningsChart";
import BucksGoalCard from "./components/BucksGoalCard";
import BadgeDisplay from "./components/BadgeDisplay";

// type BadgeToDisplay = {
//   title: string;
//   subtitle: string;
//   bucks: number;
//   badge: {
//     icon: string;
//     level: Level;
//     percentComplete: number;
//   };
// };

export default function ParticipantsProgressPage() {
  // Fetch badge progress
  // const {
  //   data: progressData,
  //   loading: loadingProgress,
  // } = useQuery(GET_BADGE_LEVEL_PROGRESS, {
  //   variables: { pid },
  //   skip: !pid,
  // });

  // Fetch achieved badges
  // const {
  //   data: achievedData,
  //   loading: loadingAchieved,
  // } = useQuery(GET_ACHIEVED_BADGE_LEVELS, {
  //   variables: { pid },
  //   skip: !pid,
  // });

  // Transform badge progress data to display format
  // const badgesInProgress = useMemo((): BadgeToDisplay[] => {
  //   if (!progressData?.getBadgeLevelProgress) return [];

    // const progress: BadgeLevelProgress[] = progressData.getBadgeLevelProgress;

  //   return progress
  //     .filter((p) => p.badge_level?.system_badge?.is_active)
  //     .map((p) => {
  //       const benchmark = p.badge_level?.benchmark ?? 1;
  //       const progressValue = p.progress ?? 0;
  //       const percentComplete = Math.min(
  //         100,
  //         Math.round((progressValue / benchmark) * 100)
  //       );
  //       const levelName =
  //         p.level === Level.NOVICE
  //           ? "Beginner"
  //           : p.level === Level.BRONZE
  //           ? "Bronze"
  //           : p.level === Level.SILVER
  //           ? "Silver"
  //           : p.level === Level.GOLD
  //           ? "Gold"
  //           : "Diamond";

  //       return {
  //         title: `${levelName} ${p.badge_level?.system_badge?.name ?? p.name}`,
  //         subtitle: p.badge_level?.system_badge?.description ?? "",
  //         bucks: p.badge_level?.value ?? 0,
  //         badge: {
  //           icon: p.badge_level?.system_badge?.icon ?? "FIVE_STAR",
  //           level: p.level,
  //           percentComplete,
  //         },
  //       };
  //     })
  //     .sort((a, b) => {
  //       // Sort by level priority (Diamond > Gold > Silver > Bronze > Novice)
  //       const levelOrder: Record<Level, number> = {
  //         [Level.NOVICE]: 0,
  //         [Level.BRONZE]: 1,
  //         [Level.SILVER]: 2,
  //         [Level.GOLD]: 3,
  //         [Level.DIAMOND]: 4,
  //       };
  //       return levelOrder[b.badge.level] - levelOrder[a.badge.level];
  //     });
  // }, [progressData]);

  // // Transform achieved badges data to display format
  // const achievedBadges = useMemo((): BadgeToDisplay[] => {
  //   if (!achievedData?.getAchievedBadgeLevels) return [];

  //   const achieved: AchievedBadgeLevel[] = achievedData.getAchievedBadgeLevels;

  //   return achieved
  //     .filter((a) => a.badge_level?.system_badge?.is_active)
  //     .map((a) => {
  //       const levelName =
  //         a.level === Level.NOVICE
  //           ? "Beginner"
  //           : a.level === Level.BRONZE
  //           ? "Bronze"
  //           : a.level === Level.SILVER
  //           ? "Silver"
  //           : a.level === Level.GOLD
  //           ? "Gold"
  //           : "Diamond";

  //       return {
  //         title: `${levelName} ${a.badge_level?.system_badge?.name ?? a.name}`,
  //         subtitle: a.badge_level?.system_badge?.description ?? "",
  //         bucks: a.badge_level?.value ?? 0,
  //         badge: {
  //           icon: a.badge_level?.system_badge?.icon ?? "FIVE_STAR",
  //           level: a.level,
  //           percentComplete: 100,
  //         },
  //       };
  //     })
  //     .sort((a, b) => {
  //       // Sort by level priority (Diamond > Gold > Silver > Bronze > Novice)
  //       const levelOrder: Record<Level, number> = {
  //         [Level.NOVICE]: 0,
  //         [Level.BRONZE]: 1,
  //         [Level.SILVER]: 2,
  //         [Level.GOLD]: 3,
  //         [Level.DIAMOND]: 4,
  //       };
  //       return levelOrder[b.badge.level] - levelOrder[a.badge.level];
  //     });
  // }, [achievedData]);

  return (
    <Flex direction="column" gap="16px">
      <BucksGoalCard />
      <WeeklyEarningsChart />
      <BadgeDisplay />
    </Flex>
  );
}
