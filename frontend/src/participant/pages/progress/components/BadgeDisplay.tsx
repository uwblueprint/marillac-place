import React, { useState, useContext } from "react";
import { Divider, Flex, HStack, Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import { toTitleCase } from "../../../../helpers/stringUtils";
import { ParticipantContext } from "../../../ParticipantContext";
import ErrorScreen from "../../../../ui/screens/ErrorScreen";
import LoadingScreen from "../../../../ui/screens/LoadingScreen";
import { GET_BADGE_LEVEL_PROGRESS } from "../../../../gql/badgeLevelProgressRequests";
import { GET_ACHIEVED_BADGE_LEVELS } from "../../../../gql/achievedBadgeLevelRequests";
import BadgeLevelRow from "../../../../ui/badge/BadgeLevelRow";
import {
  AchievedBadgeLevel,
  BadgeLevelProgress,
  EarnedCustomBadge,
} from "../../../../types/models";
import { GET_EARNED_CUSTOM_BADGES } from "../../../../gql/earnedCustomBadgeRequests";
import CustomBadgeRow from "../../../../ui/badge/CustomBadgeRow";

const BadgeDisplay = () => {
  const { pid } = useContext(ParticipantContext);
  const [activeTab, setActiveTab] = useState<"badges" | "achieved">("badges");

  const {
    data: progressData,
    loading: loadingProgress,
    error: errorProgress,
  } = useQuery(GET_BADGE_LEVEL_PROGRESS, {
    variables: { pid },
    skip: pid === -1,
  });

  const {
    data: achievedData,
    loading: loadingAchieved,
    error: errorAchieved,
  } = useQuery(GET_ACHIEVED_BADGE_LEVELS, {
    variables: { pid },
    skip: pid === -1,
  });

  const {
    data: earnedCustomBadgeData,
    loading: loadingEarnedCustomBadge,
    error: errorEarnedCustomBadge,
  } = useQuery(GET_EARNED_CUSTOM_BADGES, {
    variables: { pid },
    skip: pid === -1,
  });

  if (pid === -1 || errorProgress || errorAchieved || errorEarnedCustomBadge) {
    return (
      <ErrorScreen message="Failed to load badge data. Please try again later." />
    );
  }

  if (loadingProgress || loadingAchieved || loadingEarnedCustomBadge) {
    return <LoadingScreen />;
  }

  return (
    <WidgetContainer width="100%" height="fit-content" paddingX="16px">
      <Flex mb="12px" gap="12px" alignItems="center">
        {(["badges", "achieved"] as const).map((tab) => (
          <Text
            width="fit-content"
            key={tab}
            textStyle={activeTab === tab ? "s1" : "b1"}
            color={activeTab === tab ? "text.dark" : "text.light"}
            textDecoration="underline"
            _hover={{
              textDecoration: activeTab === tab ? "underline" : "none",
            }}
            cursor="pointer"
            onClick={() => setActiveTab(tab)}
            transition="all 0.2s ease"
          >
            {toTitleCase(tab)}
          </Text>
        ))}
      </Flex>
      {activeTab === "badges" ? (
        progressData?.getBadgeLevelProgress?.map(
          (badge: BadgeLevelProgress, index: number) => (
            <BadgeLevelRow
              key={`${activeTab}-${index}`}
              badge={badge}
              index={index}
            />
          )
        )
      ) : (
        <>
          {achievedData?.getAchievedBadgeLevels?.map(
            (badge: AchievedBadgeLevel, index: number) => (
              <BadgeLevelRow
                key={`${activeTab}-${index}`}
                badge={badge}
                achieved
                index={index}
              />
            )
          )}
          {achievedData?.getAchievedBadgeLevels?.length > 0 &&
            earnedCustomBadgeData?.getEarnedCustomBadges?.length > 0 && (
              <Divider
                orientation="horizontal"
                color="background.border"
                mt="8px"
              />
            )}
          {earnedCustomBadgeData?.getEarnedCustomBadges?.map(
            (badge: EarnedCustomBadge, index: number) => (
              <CustomBadgeRow
                key={`${activeTab}-${index}`}
                badge={badge}
                index={index}
              />
            )
          )}
        </>
      )}
    </WidgetContainer>
  );
};

export default BadgeDisplay;
