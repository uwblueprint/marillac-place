import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Divider, Flex, Text } from "@chakra-ui/react";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import { FETCH_NEW_ACHIEVED_BADGE_LEVELS } from "../../../../gql/achievedBadgeLevelRequests";
import {
  AchievedBadgeLevel,
  EarnedCustomBadge,
} from "../../../../types/models";
import BadgeLevelRow from "../../../../ui/badge/BadgeLevelRow";
import { PARTICIPANTS_PROGRESS_PAGE } from "../../../../constants/routes";
import UnderlineButton from "../../../../ui/buttons/UnderlineButton";
import { FETCH_NEW_EARNED_CUSTOM_BADGES } from "../../../../gql/earnedCustomBadgeRequests";
import CustomBadgeRow from "../../../../ui/badge/CustomBadgeRow";

type NewAchievedBadgesWidgetProps = {
  pid: number;
};

export default function NewAchievedBadgesWidget({
  pid,
}: NewAchievedBadgesWidgetProps) {
  const navigate = useNavigate();

  const [
    fetchNewEarnedCustomBadges,
    {
      data: earnedCustomBadgeData,
      loading: earnedCustomBadgeLoading,
      error: earnedCustomBadgeError,
    },
  ] = useMutation(FETCH_NEW_EARNED_CUSTOM_BADGES);
  const [
    fetchNewAchievedBadgeLevels,
    {
      data: achievedBadgeData,
      loading: achievedBadgeLoading,
      error: achievedBadgeError,
    },
  ] = useMutation(FETCH_NEW_ACHIEVED_BADGE_LEVELS);
  useEffect(() => {
    fetchNewEarnedCustomBadges({ variables: { pid } });
    fetchNewAchievedBadgeLevels({ variables: { pid } });
  }, [pid]);

  const newEarnedCustomBadges =
    earnedCustomBadgeData?.fetchNewEarnedCustomBadges || [];
  const newAchievedBadges =
    achievedBadgeData?.fetchNewAchievedBadgeLevels || [];
  if (newAchievedBadges.length + newEarnedCustomBadges.length === 0)
    return null;

  return (
    <WidgetContainer
      width="100%"
      height="fit-content"
      paddingX="16px"
      loading={achievedBadgeLoading}
      error={achievedBadgeError?.message}
    >
      <Flex
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        mb="8px"
      >
        <Text textStyle="s1">New Badges Achieved!</Text>
        <UnderlineButton
          label="Progress"
          action={() => navigate(PARTICIPANTS_PROGRESS_PAGE)}
        />
      </Flex>
      {newEarnedCustomBadges.map((badge: EarnedCustomBadge, index: number) => (
        <CustomBadgeRow key={index} badge={badge} index={index} />
      ))}
      {newEarnedCustomBadges.length > 0 && newAchievedBadges.length > 0 && (
        <Divider orientation="horizontal" color="background.border" mt="8px" />
      )}
      {newAchievedBadges.map((badge: AchievedBadgeLevel, index: number) => (
        <BadgeLevelRow key={index} badge={badge} achieved index={index} />
      ))}
    </WidgetContainer>
  );
}
