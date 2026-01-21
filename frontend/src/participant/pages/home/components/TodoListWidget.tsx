import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Text, Spinner, Alert, AlertIcon, Flex } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { ParticipantContext } from "../../../ParticipantContext";
import { GET_ASSIGNED_TASKS_FOR_TODAY } from "../../../../gql/assignedTaskRequests";
import { PARTICIPANTS_SCHEDULE_PAGE } from "../../../../constants/routes";
import { formatDateV2 } from "../../../../helpers/formatDateTime";
import { TaskStatus } from "../../../../types/enums";
import TaskStatusDisplay from "../../../../ui/misc/TaskStatusDisplay";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import { Comment } from "../../../../ui/icons/ActionIcons";

interface AssignedTask {
  aid: number;
  name: string;
  status: TaskStatus;
  start_date: string;
  end_date: string;
  comment: string;
}

const TodoListWidget = () => {
  const participant = useContext(ParticipantContext) 
  const pid = participant?.pid;

  const navigate = useNavigate();

  const { data, loading, error } = useQuery(
    GET_ASSIGNED_TASKS_FOR_TODAY,
    {
      variables: { pid },
      skip: !pid,
    }
  );

  return (
    <WidgetContainer width="100%">
      <>
        <Flex direction="row" justify="space-between" alignItems="center">
          <Text textStyle="mobile.h2">Today&apos;s To-Do List</Text>
          <Text
            textStyle="mobile.h3"
            color="primary.700"
            fontWeight="600"
            textDecoration="underline"
            cursor="pointer"
            _hover={{
              color: "primary.700",
              opacity: 0.8,
            }}
            onClick={() => navigate(PARTICIPANTS_SCHEDULE_PAGE)}
          >
            Schedule
          </Text>
        </Flex>

        {loading && <Spinner />}

        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            Error loading tasks.
          </Alert>
        )}

        {!loading &&
          !error &&
          data &&
          data.getAssignedTasksForToday.length !== 0 &&
          data.getAssignedTasksForToday.map(
            (assigned_task: AssignedTask, index: number) => {
              const isLast = index === data.getAssignedTasksForToday.length - 1;
              return (
                <Flex
                  key={assigned_task.aid}
                  justify="space-between"
                  align="center"
                  mb={isLast ? "0" : "12px"}
                >
                  <Flex gap="8px" align="center">
                    <TaskStatusDisplay status={assigned_task.status}/>
                    <Text textStyle="mobile.b1">{assigned_task.name}</Text>
                    {assigned_task.comment && (
                      <Comment size={20} color="text.light.secondary" />
                    )}
                  </Flex>

                  <Text color="text.light.secondary" textStyle="mobile.b1">
                    {formatDateV2(new Date(assigned_task.start_date))}-{formatDateV2(new Date(assigned_task.end_date))}
                  </Text>
                </Flex>
              );
            }
          )}
      </>
    </WidgetContainer>
  );
};

export default TodoListWidget;
