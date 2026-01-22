import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  Card,
  CardHeader,
  CardBody,
  Progress,
  Image,
  Flex,
  Button,
  Box,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@apollo/client";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import UnderlineButton from "../../../../ui/buttons/UnderlineButton";
import { ParticipantContext } from "../../../ParticipantContext";
import { CREATE_EARNING_GOAL, GET_EARNING_GOAL } from "../../../../gql/earningGoalRequests";
import ErrorScreen from "../../../../ui/screens/ErrorScreen";
import LoadingScreen from "../../../../ui/screens/LoadingScreen";
import { GoalAction } from "../../../../types/enums";
import { EarningGoal } from "../../../../types/models";
import { Triangle, Trophy } from "../../../../ui/icons/MiscIcons";
import { EditGoal } from "./EditGoal";
import { SetGoal } from "./SetGoal";

export default function BucksGoalCard() {
  const { pid, totalEarnings } = useContext(ParticipantContext);

  const [createGoal, { loading: createGoalLoading, error: createGoalError }] = useMutation(CREATE_EARNING_GOAL);
  const { data, loading, error, refetch } = useQuery(GET_EARNING_GOAL, {
    variables: { pid },
  });

  useEffect(() => {
    const goal = data?.getEarningGoal;
    if (!loading && !error && goal && pid !== -1) {
      if (goal.action === GoalAction.SET && totalEarnings >= goal.value) {
        createGoal({
          variables: {
            pid,
            action: GoalAction.REACHED,
            value: goal.value,
          },
        });
        refetch();
      }
    }
  }, [data, loading, error, pid, totalEarnings]);

  const [editGoal, setEditGoal] = useState<EarningGoal | null>(null);
  const [setGoal, setSetGoal] = useState(false);
  
  const goal = data?.getEarningGoal ?? null;
  const metGoal = goal?.action === GoalAction.REACHED;
  const percentComplete = (totalEarnings / goal?.value) * 100;

  const editGoalText = () => {
    if (!goal) return "Set Goal";
    if (!metGoal) return "Change Goal";
    return "Set Another Goal";
  };

  const editGoalAction = () => {
    if (!goal || metGoal) {
      setSetGoal(true);
    } else {
      setEditGoal(goal);
    }
  };

  if (pid === -1 || error || createGoalError) {
    return <ErrorScreen message="Failed to load marillac bucks goal. Please try again later." />;
  }

  if (loading || createGoalLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {editGoal && <EditGoal handleClose={() => setEditGoal(null)} refetchGoal={refetch} currentGoal={editGoal} />}
      {setGoal && <SetGoal handleClose={() => setSetGoal(false)} refetchGoal={refetch} prevGoal={goal?.value ?? 0} />}
      <WidgetContainer
        width="100%"
        height="fit-content"
        paddingX="18px"
        paddingY="14px"
        loading={false}
        error=""
      >
        <Flex direction="row" justifyContent="space-between" alignItems="center" mb="8px">
          <Text textStyle="mobile.b0">Marillac Bucks Goal</Text>
          <UnderlineButton
            label={editGoalText()}
            action={() => editGoalAction()}
          />
        </Flex>
        {!goal ? (
          <Text textStyle="mobile.b1">Set a new goal to track your progress!</Text>
        ) : !metGoal ? (
          <Flex direction="column" gap={2} mt="8px" mb={percentComplete >= 15 && percentComplete <= 85 ? "8px" : "0px"}>
            <Progress
              colorScheme="primary.700"
              value={percentComplete}
              borderRadius="full"
              height="15px"
            />
            <Flex
              width="100%"
              direction="row"
              justifyContent="space-between"
              alignItems="start"
              position="relative"
            >
              <Text textStyle="mobile.b0" color="text.light.secondary">
                $0
              </Text>
              {(percentComplete >= 15 && percentComplete <= 85) && (
                <Flex
                  direction="column"
                  position="absolute"
                  left={`${Math.floor(percentComplete)}%`}
                  transform="translateX(-50%)"
                  align="center"
                  pb="10px"
                >
                  <Triangle />
                  <Text textStyle="mobile.b0">${totalEarnings}</Text>
                </Flex>
              )}
              <Text textStyle="mobile.b0" color="text.light.secondary">
                ${goal.value}
              </Text>
            </Flex>
          </Flex>
        ) : (
          <Flex direction="row" gap={4} alignItems="center">
            <Trophy size={48} />
            <Text textStyle="mobile.b1">
              Congratulations on completing your goal! Make sure to tell
              Marillac staff about your achievement.
            </Text>
          </Flex>
        )}
      </WidgetContainer>
    </>
  );
}
