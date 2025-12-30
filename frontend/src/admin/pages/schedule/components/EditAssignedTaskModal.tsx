import React, { useEffect, useState } from "react";
import { addDays, isEqual, set, startOfDay, startOfWeek, subDays } from "date-fns";
import { Flex } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { AssignedTask } from "../../../../types/models";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import { DayPreference, TimePreference } from "../../../../types/enums";
import { DAYS } from "../../../../constants/days";
import TextInput from "../../../../ui/inputs/TextInput";
import SelectInput from "../../../../ui/inputs/SelectInput";
import TimeInput from "../../../../ui/inputs/TimeInput";
import NumberInput from "../../../../ui/inputs/NumberInput";
import TextAreaInput from "../../../../ui/inputs/TextAreaInput";
import { UPDATE_ASSIGNED_TASK } from "../../../../gql/assignedTaskRequests";
import { now } from "../../../../helpers/formatDateTime";

type EditAssignedTaskModalProps = {
  task: AssignedTask;
  onClose: () => void;
  refetch: () => void;
};

export default function EditAssignedTaskModal({
  task,
  onClose,
  refetch,
}: EditAssignedTaskModalProps) {
  const isAnytimeTask = isEqual(
    new Date(task.end_date),
    startOfDay(new Date(task.end_date))
  );
  const [taskName, setTaskName] = useState(task.name);
  const [timePreference, setTimePreference] = useState<TimePreference | null>(
    isAnytimeTask ? TimePreference.ANYTIME : TimePreference.SPECIFIC
  );
  const [startTime, setStartTime] = useState<Date>(
    new Date(task.start_date)
  );
  const [endTime, setEndTime] = useState<Date>(new Date(task.end_date));
  const [addition, setAddition] = useState(task.value);
  const [deduction, setDeduction] = useState(task.penalty);
  const [comments, setComments] = useState(task.comment ?? "");
  const [error, setError] = useState("");

  const anyTimeStart = startOfDay(task.start_date);
  const anyTimeEnd = addDays(anyTimeStart, 1);

  useEffect(() => {
    if (timePreference !== TimePreference.SPECIFIC) {
      setStartTime(anyTimeStart);
      setEndTime(anyTimeEnd);
    }
  }, [timePreference]);

  const [updateAssignedTask, { loading: updateAssignedTaskLoading }] = useMutation(UPDATE_ASSIGNED_TASK);
  async function handleSubmit() {
    setError("");
    if (taskName === "") {
      setError("Task name is required");
      return;
    }
    if (timePreference === null) {
      setError("Time preference is required");
      return;
    }
    if (timePreference === TimePreference.SPECIFIC) {
      if (startTime === null || endTime === null) {
        setError("Start and end times are required");
        return;
      }
      if (startTime >= endTime) {
        setError("Start time should be earlier than end time");
        return;
      }
    }
    if (addition < 0 || deduction < 0) {
      setError("Marillac bucks require positive values");
      return;
    }

    const startDate = set(task.start_date, {
      hours: startTime.getHours(),
      minutes: startTime.getMinutes(),
      seconds: startTime.getSeconds(),
      milliseconds: startTime.getMilliseconds(),
    });

    let endDate = set(task.end_date, {
      hours: endTime.getHours(),
      minutes: endTime.getMinutes(),
      seconds: endTime.getSeconds(),
      milliseconds: endTime.getMilliseconds(),
    });

    if (timePreference === TimePreference.SPECIFIC) {
      endDate = subDays (endDate, 1);
    }

    try {
      await updateAssignedTask({
        variables: {
          aid: task.aid,
          name: taskName,
          startDate,
          endDate,
          value: addition,
          penalty: deduction,
          comment: comments,
        },
      });
      refetch();
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <PopupContainer
      title="Edit Assigned Task"
      submit_text="Save"
      submit_action={handleSubmit}
      cancel_action={onClose}
      loading={updateAssignedTaskLoading}
      error_message={error}
    >
      <TextInput
        label="Task Name"
        current_value={taskName}
        update_action={setTaskName}
        size="large"
      />

      <SelectInput
        label="Change Time"
        current_value={timePreference}
        update_action={setTimePreference}
        value_options={{
          Anytime: TimePreference.ANYTIME,
          Specific: TimePreference.SPECIFIC,
        }}
      />

      {timePreference === TimePreference.SPECIFIC && (
        <Flex alignItems="center" gap="8px">
          <TimeInput
            size="medium"
            label="Start Time"
            current_value={startTime}
            update_action={setStartTime}
          />
          <TimeInput
            size="medium"
            label="End Time"
            current_value={endTime}
            update_action={setEndTime}
          />
        </Flex>
      )}

      <Flex alignItems="center" gap="8px">
        <NumberInput
          size="small"
          label="Marillac Bucks"
          current_value={addition}
          update_action={setAddition}
        />
        <NumberInput
          size="small"
          label="Marillac Bucks Deduction"
          current_value={deduction}
          update_action={setDeduction}
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
