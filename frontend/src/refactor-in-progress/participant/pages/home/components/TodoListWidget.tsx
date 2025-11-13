import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Text, Spinner, Alert, AlertIcon, Flex } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { ParticipantContext } from "../../../../../participant/ParticipantContext";
import { GET_ASSIGNED_TASKS_BY_PARTICIPANT_ID_AND_DATE } from "../../../../gql/example";
import { PARTICIPANTS_SCHEDULE_PAGE } from "../../../../constants/routes";
import { formatTimeRange, getToday } from "../../../../helpers/formatDate";
import { TaskStatus } from "../../../../refactor-in-progress/admin/pages/schedule/components/ScheduleTypes";
import Icon from "../../../common/Icon";
import assigned from "../../../icons/status/assigned.svg";
import complete from "../../../icons/status/complete.svg";
import incomplete from "../../../icons/status/incomplete.svg";
import excused from "../../../icons/status/excused.svg";
import comment from "../../../icons/misc/comment.svg";

interface AssignedTask {
  assigned_task_id: number;
  task_name: string;
  task_status: TaskStatus;
  start_date: string;
  end_date: string;
  comment: string;
}

const TodoListWidget = () => {
  const participant = useContext(ParticipantContext) as
    | { id: number }
    | undefined;
  const participantId = participant?.id;

  const navigate = useNavigate();
  const date = getToday();

  const { data, loading, error } = useQuery(
    GET_ASSIGNED_TASKS_BY_PARTICIPANT_ID_AND_DATE,
    {
      variables: { participantId, date },
      skip: !participantId,
    }
  );

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
                  {assigned_task.task_status === TaskStatus.ASSIGNED ? (
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
                  )}
                </Flex>

                <Text color="text.light.secondary" textStyle="mobile.b1">
                  {formatTimeRange(
                    assigned_task.start_date,
                    assigned_task.end_date
                  )}
                </Text>
              </Flex>
            );
          }
        )}
    </>
  );
};

export default TodoListWidget;
