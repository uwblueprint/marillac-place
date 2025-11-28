// export {};
// TODO: Refactor in progress
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Text, Spinner, Alert, AlertIcon, Flex } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { ParticipantContext } from "../../../ParticipantContext";
import { GET_ASSIGNED_TASKS_FOR_TODAY } from "../../../../gql/assignedTaskRequests";
import { PARTICIPANTS_SCHEDULE_PAGE } from "../../../../constants/routes";
import { formatTimeString, getTodayDateString } from "../../../../helpers/formatDateTime";
import { TaskStatus, Icon } from "../../../../types/enums";
import assigned from "../../../icons/status/assigned.svg";
import complete from "../../../icons/status/complete.svg";
import incomplete from "../../../icons/status/incomplete.svg";
import excused from "../../../icons/status/excused.svg";
import comment from "../../../icons/misc/comment.svg";
import TaskStatusDisplay from "../../../../ui/misc/TaskStatusDisplay";

interface AssignedTask {
  assigned_task_id: number;
  task_name: string;
  task_status: TaskStatus;
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
      variables: { pid : pid},
      skip: !pid,
    })


  return (
    <>
      <Flex direction="row" justify="space-between" align="center">
        <Text textStyle="mobile.h2">To-Do List</Text>
        <Text
          color="text.light.primary"
          textStyle="mobile.h3"
          textDecoration="underline"
          cursor="pointer"
          _hover={{
            textDecoration: "none",
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
        data.getAssignedTasksByParticipantIdAndDate.length !== 0 &&
        data.getAssignedTasksByParticipantIdAndDate.map(
          (assigned_task: AssignedTask) => {
            return (
              <Flex
                key={assigned_task.assigned_task_id}
                justify="space-between"
                align="center"
              >
                <Flex gap="8px">
                    <TaskStatusDisplay status={assigned_task.task_status}/>
                  {/* {assigned_task.task_status === TaskStatus.ASSIGNED ? (
                    <Icon icon={assigned} width="20px" height="20px" />
                  ) : assigned_task.task_status === TaskStatus.COMPLETE ? (
                    <Icon icon={complete} width="20px" height="20px" />
                  ) : assigned_task.task_status === TaskStatus.INCOMPLETE ? (
                    <Icon icon={incomplete} width="20px" height="20px" />
                  ) : (
                    <Icon icon={excused} width="20px" height="20px" />
                  )}
                  <Text textStyle="mobile.b1">{assigned_task.task_name}</Text>
                  {assigned_task.comment && (
                    <Icon icon={comment} width="12px" height="12px" />
                  )} */}
                </Flex>

                <Text color="text.light.secondary" textStyle="mobile.b1">
                  {formatTimeString(
                assigned_task.start_date)}-{formatTimeString(assigned_task.end_date)
                  }
                </Text>
              </Flex>
            );
          }
        )}
    </>
  );
};

export default TodoListWidget;
