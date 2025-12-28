import { Text, Flex, Checkbox } from "@chakra-ui/react";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_TASK } from "../../../../gql/taskRequests";
import {
  DayPreference,
  TimePreference,
  DayOfWeek,
} from "../../../../types/enums";
import { Task } from "../../../../types/models";
import { DAYS } from "../../../../constants/days";
import { isValidTask } from "../../../../helpers/validateTask";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import { toTitleCase } from "../../../../helpers/stringUtils";
import FixedInput from "../../../../ui/inputs/FixedInput";
import TextInput from "../../../../ui/inputs/TextInput";
import DateOptions from "../../../../ui/misc/DateOptions";
import NumberInput from "../../../../ui/inputs/NumberInput";
import TextAreaInput from "../../../../ui/inputs/TextAreaInput";

type EditTaskModalProps = {
  selected: Task;
  close: () => void;
  refetch: () => void;
};

export default function EditTaskModal({
  selected,
  close,
  refetch,
}: EditTaskModalProps) {
  const [taskName, setTaskName] = useState(selected.name);
  const [participantPreference, setParticipantPreference] = useState(
    selected.day_preference === DayPreference.PARTICIPANT_PREFERENCE
  );
  const [dayPreference, setDayPreference] = useState<DayPreference | null>(
    selected.day_preference
  );
  const [days, setDays] = useState<DayOfWeek[]>(() => {
    if (selected.day_preference === DayPreference.DAILY) {
      return DAYS;
    }
    if (selected.day_preference === DayPreference.DAY_RANGE) {
      const earliestDay = selected.days[0];
      const latestDay = selected.days[selected.days.length - 1];
      const earliestDayIndex = DAYS.indexOf(earliestDay);
      const latestDayIndex = DAYS.indexOf(latestDay);
      return DAYS.slice(earliestDayIndex, latestDayIndex + 1);
    }
    if (selected.day_preference === DayPreference.EVERY_SELECTED_DAYS) {
      return selected.days;
    }
    return [];
  });
  const [timePreference, setTimePreference] = useState<TimePreference | null>(
    selected.time_preference
  );
  const [startTime, setStartTime] = useState<Date | null>(
    selected.start_time ? new Date(selected.start_time) : null
  );
  const [endTime, setEndTime] = useState<Date | null>(
    selected.end_time ? new Date(selected.end_time) : null
  );
  const [addition, setAddition] = useState(selected.value);
  const [deduction, setDeduction] = useState(selected.penalty);
  const [comments, setComments] = useState(selected.comment ?? "");
  const [error, setError] = useState("");

  const [updateTask] = useMutation(UPDATE_TASK);

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
      updateTask({
        variables: {
          id: selected.tid,
          type: selected.type,
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
      title="Edit Task"
      submit_text="Save Changes"
      submit_action={handleSubmit}
      cancel_action={close}
      error_message={error}
    >
      <FixedInput
        label="Task Type"
        current_value={toTitleCase(selected.type as string)}
        orientation="horizontal"
      />

      <TextInput
        label="Task Name"
        current_value={taskName}
        update_action={setTaskName}
        size="large"
      />

      <DateOptions
        taskType={selected.type}
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
