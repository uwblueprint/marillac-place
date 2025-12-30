import { Text, Flex, Checkbox } from "@chakra-ui/react";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TASK } from "../../../../gql/taskRequests";
import {
  DayOfWeek,
  DayPreference,
  TaskType,
  TimePreference,
} from "../../../../types/enums";
import { toTitleCase } from "../../../../helpers/stringUtils";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import FixedInput from "../../../../ui/inputs/FixedInput";
import NumberInput from "../../../../ui/inputs/NumberInput";
import TextInput from "../../../../ui/inputs/TextInput";
import TextAreaInput from "../../../../ui/inputs/TextAreaInput";
import DateOptions from "../../../../ui/misc/DateOptions";
import { isValidTask } from "../../../../helpers/taskHelpers";

type AddTaskModalProps = {
  taskType: TaskType;
  close: () => void;
  refetch: () => void;
};

export default function AddTaskModal({
  taskType,
  close,
  refetch,
}: AddTaskModalProps) {
  const [taskName, setTaskName] = useState<string>("");
  const [participantPreference, setParticipantPreference] = useState(false);
  const [dayPreference, setDayPreference] = useState<DayPreference | null>(
    null
  );
  const [days, setDays] = useState<DayOfWeek[]>([]);
  const [timePreference, setTimePreference] = useState<TimePreference | null>(
    null
  );
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [addition, setAddition] = useState<number>(0);
  const [deduction, setDeduction] = useState<number>(0);
  const [comments, setComments] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [createTask, { loading: createTaskLoading }] = useMutation(CREATE_TASK);
  async function handleSubmit() {
    const { isValid, errorMessage } = isValidTask(
      taskName,
      participantPreference,
      dayPreference,
      days,
      timePreference,
      startTime,
      endTime,
      addition,
      deduction
    );
    if (!isValid) {
      setError(errorMessage);
      return;
    }

    try {
      const storedDays =
        dayPreference === DayPreference.DAY_RANGE
          ? [days[0], days[days.length - 1]]
          : dayPreference === DayPreference.EVERY_SELECTED_DAYS
          ? [...days]
          : [];

      createTask({
        variables: {
          type: taskType,
          name: taskName,
          dayPreference,
          days: storedDays,
          timePreference,
          value: addition,
          penalty: deduction,
          startTime: startTime ?? undefined,
          endTime: endTime ?? undefined,
          comment: comments ?? undefined,
        },
      });
      refetch();
      close();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <PopupContainer
      title="Add Task"
      submit_text="Save"
      submit_action={handleSubmit}
      cancel_action={close}
      error_message={error}
      loading={createTaskLoading}
    >
      <FixedInput
        label="Task Type"
        current_value={toTitleCase(String(taskType))}
        orientation="horizontal"
      />

      <TextInput
        label="Task Name"
        current_value={taskName}
        update_action={setTaskName}
        size="large"
      />

      <DateOptions
        taskType={taskType}
        participantPreference={participantPreference}
        setParticipantPreference={setParticipantPreference}
        setDayPreference={setDayPreference}
        setDays={setDays}
        setTimePreference={setTimePreference}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
        dayPreference={dayPreference}
        days={days}
        timePreference={timePreference}
        startTime={startTime}
        endTime={endTime}
      />

      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <NumberInput
          label="Marillac Bucks"
          current_value={addition}
          update_action={setAddition}
          size="small"
        />
        <NumberInput
          label="Marillac Bucks Deduction"
          current_value={deduction}
          update_action={setDeduction}
          size="small"
        />
      </Flex>

      <TextAreaInput
        label="Comments"
        current_value={comments}
        update_action={setComments}
        size="large"
      />
    </PopupContainer>
  );
}
