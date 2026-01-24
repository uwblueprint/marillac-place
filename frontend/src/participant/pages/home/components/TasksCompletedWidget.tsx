import React from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import { PARTICIPANTS_SCHEDULE_PAGE } from "../../../../constants/routes";
import { Trophy } from "../../../../ui/icons/MiscIcons";
import UnderlineButton from "../../../../ui/buttons/UnderlineButton";
import { HAS_COMPLETED_ALL_REQUIRED_TASKS } from "../../../../gql/assignedTaskRequests";

type TasksCompletedWidgetProps = {
  pid: number;
};

export default function TasksCompletedWidget({
  pid,
}: TasksCompletedWidgetProps) {
  const navigate = useNavigate();
  const {
    data: completedAllTasksData,
    loading: completedAllTasksLoading,
    error: completedAllTasksError,
  } = useQuery(HAS_COMPLETED_ALL_REQUIRED_TASKS, {
    variables: { pid },
  });
  const hasCompletedAllTasks =
    completedAllTasksData?.hasCompletedAllRequiredTasks || false;
  if (!hasCompletedAllTasks) return null;

  return (
    <WidgetContainer
      width="100%"
      height="fit-content"
      paddingX="16px"
      loading={completedAllTasksLoading}
      error={completedAllTasksError?.message}
    >
      <Flex
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        mb="8px"
      >
        <Text textStyle="s1">Mandatory Tasks Completed!</Text>
        <UnderlineButton
          label="Tasks"
          action={() => navigate(PARTICIPANTS_SCHEDULE_PAGE)}
        />
      </Flex>

      <Flex w="100%" alignItems="center" gap="12px">
        <Trophy size={24} />
        <Text textStyle="b1" flex="1">
          You&apos;ve completed all your mandatory tasks for the week.
        </Text>
      </Flex>
    </WidgetContainer>
  );
}
