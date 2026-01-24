import React from "react";
import { Flex } from "@chakra-ui/react";
import { startOfDay, endOfDay, isEqual, isSameDay } from "date-fns";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import { AssignedTask } from "../../../../types/models";
import FixedInput from "../../../../ui/inputs/FixedInput";
import { formatDateV2, formatDateV6 } from "../../../../helpers/formatDateTime";
import { formatCurrency } from "../../../../helpers/formatCurrency";
import TaskStatusDisplay from "../../../../ui/misc/TaskStatusDisplay";

type TaskDetailsModalProps = {
  task: AssignedTask;
  onClose: () => void;
};

export default function TaskDetailsModal({ task, onClose }: TaskDetailsModalProps) {
  const noSpecificTime = (
    isEqual(startOfDay(new Date(task.start_date)), new Date(task.start_date)) &&
    isEqual(endOfDay(new Date(task.end_date)), new Date(task.end_date))
  );
  const spansMultipleDays = !isSameDay(new Date(task.start_date), new Date(task.end_date));

  return (
    <PopupContainer
      title={task.name}
      cancel_action={onClose}
    >
      <FixedInput
        label="Time"
        current_value={noSpecificTime ? "Anytime" : formatDateV2(new Date(task.start_date)) + " to " + formatDateV2(new Date(task.end_date))}
        orientation="horizontal"
      />

      <FixedInput
        label="Date"
        current_value={spansMultipleDays ? formatDateV6(new Date(task.start_date)) + " to " + formatDateV6(new Date(task.end_date)) : formatDateV6(new Date(task.start_date))}
        orientation="horizontal"
      />

      <FixedInput
        label="Marillac Bucks"
        current_value={formatCurrency(task.value)}
        orientation="horizontal"
      />

      <FixedInput
        label="Marillac Bucks Deduction"
        current_value={`-${formatCurrency(task.penalty)}`}
        orientation="horizontal"
      />

      {task.comment && (
        <Flex overflow="flex-wrap" maxWidth="250px">
          <FixedInput
            label="Comments"
            current_value={task.comment}
            orientation="vertical"
          />
        </Flex>
      )}

      <Flex mt="12px">
        <TaskStatusDisplay status={task.status} size="250px" />
      </Flex>
    </PopupContainer>
  );
}