import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Text, Spinner, Alert, AlertIcon, Flex } from "@chakra-ui/react";
import { endOfDay, isEqual, startOfDay } from "date-fns";
import { useQuery } from "@apollo/client";
import { ParticipantContext } from "../../../ParticipantContext";
import { GET_ASSIGNED_TASKS_FOR_TODAY } from "../../../../gql/assignedTaskRequests";
import { PARTICIPANTS_SCHEDULE_PAGE } from "../../../../constants/routes";
import { formatDateV2 } from "../../../../helpers/formatDateTime";
import { TaskStatus } from "../../../../types/enums";
import TaskStatusDisplay from "../../../../ui/misc/TaskStatusDisplay";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import { Comment } from "../../../../ui/icons/ActionIcons";
import UnderlineButton from "../../../../ui/buttons/UnderlineButton";
import { ScheduleView } from "../../../../constants/views";
import { AssignedTask } from "../../../../types/models";
import {
  Assigned,
  Excused,
  Complete,
  Incomplete,
} from "../../../../ui/icons/StatusIcons";

type TodoListWidgetProps = {
  pid: number;
};

const TodoListWidget = ({ pid }: TodoListWidgetProps) => {
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_ASSIGNED_TASKS_FOR_TODAY, {
    variables: { pid },
  });

  const tasks = data?.getAssignedTasksForToday ?? [];

  return (
    <WidgetContainer
      width="100%"
      height="fit-content"
      paddingX="16px"
      loading={loading}
      error={error?.message}
    >
      <Flex
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        mb={tasks.length > 0 ? "8px" : "0px"}
      >
        <Text textStyle="s1">Todo List</Text>
        <UnderlineButton
          label="Schedule"
          action={() =>
            navigate(PARTICIPANTS_SCHEDULE_PAGE, {
              state: { view: ScheduleView.CALENDAR },
            })
          }
        />
      </Flex>
      <Flex flexDir="column" gap="8px">
        {tasks.map((task: AssignedTask, index: number) => {
          const noSpecificTime =
            isEqual(
              startOfDay(new Date(task.start_date)),
              new Date(task.start_date)
            ) &&
            isEqual(endOfDay(new Date(task.end_date)), new Date(task.end_date));
          return (
            <Flex
              key={index}
              justifyContent="space-between"
              alignItems="center"
            >
              <Flex alignItems="center" gap="12px">
                {task.status === TaskStatus.ASSIGNED && <Assigned />}
                {task.status === TaskStatus.COMPLETE && <Complete />}
                {task.status === TaskStatus.EXCUSED && <Excused />}
                {task.status === TaskStatus.INCOMPLETE && <Incomplete />}
                <Text textStyle="b1">{task.name}</Text>
                {task.comment && <Comment size={12} />}
              </Flex>
              <Text textStyle="b2" color="text.medium">
                {noSpecificTime
                  ? "Anytime"
                  : formatDateV2(new Date(task.start_date)) +
                    " - " +
                    formatDateV2(new Date(task.end_date))}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </WidgetContainer>
  );
};

export default TodoListWidget;
