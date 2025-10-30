import React from "react";
import { Circle } from "@chakra-ui/react";
import { TaskStatus } from "../../admin/pages/schedule/components/ScheduleTypes";
import { getTaskStatusBgColor } from "../../utils/scheduleUtils";
import {
  AssignedIcon,
  CompletedIcon,
  ExcusedIcon,
  IncompleteIcon,
} from "./StatusIcons";

interface TaskStatusBadgeProps {
  status: TaskStatus;
  size?: string | number;
}

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  size = "26px",
}) => {
  return (
    <Circle size={size} bg={getTaskStatusBgColor(status)}>
      {status === TaskStatus.COMPLETE && (
        <CompletedIcon width={16} height={16} />
      )}
      {status === TaskStatus.ASSIGNED && (
        <AssignedIcon width={16} height={16} />
      )}
      {status === TaskStatus.EXCUSED && <ExcusedIcon width={16} height={16} />}
      {status === TaskStatus.INCOMPLETE && (
        <IncompleteIcon width={16} height={16} />
      )}
    </Circle>
  );
};

export default TaskStatusBadge;
