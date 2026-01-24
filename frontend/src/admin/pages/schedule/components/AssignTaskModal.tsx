import { Text, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_TASKS_BY_TYPE } from "../../../../gql/taskRequests";
import { CREATE_ASSIGNED_TASK } from "../../../../gql/assignedTaskRequests";
import {
  DayOfWeek,
  DayPreference,
  TaskType,
  TimePreference,
} from "../../../../types/enums";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import DropdownInput from "../../../../ui/inputs/DropdownInput";
import { Task } from "../../../../types/models";
import FixedInput from "../../../../ui/inputs/FixedInput";
import DateOptions from "../../../../ui/misc/DateOptions";
import TextAreaInput from "../../../../ui/inputs/TextAreaInput";
import NumberInput from "../../../../ui/inputs/NumberInput";
import { DAYS } from "../../../../constants/days";
import TextInput from "../../../../ui/inputs/TextInput";
import {
  getStartAndEndDates,
  isValidTask,
} from "../../../../helpers/taskHelpers";
import { toTitleCase } from "../../../../helpers/stringUtils";
import useNotification from "../../../../hooks/useNotification";

type InitialAssignTaskModalProps = {
  onNext: (task: Task) => void;
  onCancel: () => void;
};

function InitialAssignTaskModal({
  onNext,
  onCancel,
}: InitialAssignTaskModalProps) {
  const [selectedTaskName, setSelectedTaskName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const {
    loading: optionalTasksLoading,
    error: optionalTasksError,
    data: optionalTasksData,
  } = useQuery(GET_TASKS_BY_TYPE, {
    variables: { type: TaskType.OPTIONAL },
  });

  const {
    loading: individualGoalTasksLoading,
    error: individualGoalTasksError,
    data: individualGoalTasksData,
  } = useQuery(GET_TASKS_BY_TYPE, {
    variables: { type: TaskType.INDIVIDUAL_GOAL },
  });

  const taskOptions = [
    ...(optionalTasksData?.getTasksByType ?? []),
    ...(individualGoalTasksData?.getTasksByType ?? []),
  ];

  return (
    <PopupContainer
      title="Assign Task"
      submit_text="Next"
      submit_action={() => {
        const selectedTask = taskOptions.find(
          (task: Task) => task.name === selectedTaskName
        );
        if (!selectedTask) {
          setError("Task not selected");
          return;
        }
        onNext(selectedTask);
      }}
      cancel_action={onCancel}
      loading={optionalTasksLoading || individualGoalTasksLoading}
      error_message={
        optionalTasksError?.message ||
        individualGoalTasksError?.message ||
        error
      }
    >
      <DropdownInput
        label="Task Name"
        current_value={selectedTaskName}
        update_action={(taskName: string) => setSelectedTaskName(taskName)}
        size="large"
        value_options={Object.fromEntries(
          taskOptions.map((task: Task) => [task.name, task.name])
        )}
      />
    </PopupContainer>
  );
}

type AssignTaskModalProps = {
  participantId: number;
  onClose: () => void;
  refetchAssignedTasks: () => void;
};

export default function AssignTaskModal({
  participantId,
  onClose,
  refetchAssignedTasks,
}: AssignTaskModalProps) {
  const [initialState, setInitialState] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { sendNotification } = useNotification();
  const [taskId, setTaskId] = useState<number | null>(null);
  const [taskName, setTaskName] = useState<string>("");
  const [taskType, setTaskType] = useState<TaskType>(TaskType.OPTIONAL);
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

  const [createAssignedTask, { loading: createAssignedTaskLoading }] =
    useMutation(CREATE_ASSIGNED_TASK);
  async function handleSubmit() {
    const task: Task = {
      tid: taskId ?? 0,
      name: taskName,
      type: taskType,
      day_preference: dayPreference ?? DayPreference.PARTICIPANT_PREFERENCE,
      days,
      time_preference: timePreference ?? TimePreference.PARTICIPANT_PREFERENCE,
      start_time: startTime ? startTime.toISOString() : undefined,
      end_time: endTime ? endTime.toISOString() : undefined,
      value: addition,
      penalty: deduction,
      comment: comments,
    };
    const { isValid, errorMessage } = isValidTask(task);
    if (!isValid) {
      setError(errorMessage);
      return;
    }

    try {
      const startAndEndDates = getStartAndEndDates(task);
      const operations = startAndEndDates.map(({ startDate, endDate }) =>
        createAssignedTask({
          variables: {
            pid: participantId,
            tid: taskId,
            name: taskName,
            type: taskType,
            value: addition,
            penalty: deduction,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            comment: comments,
          },
        })
      );
      await Promise.all(operations);
      refetchAssignedTasks();
      onClose();
      sendNotification("Task assigned successfully");
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (initialState) {
    return (
      <InitialAssignTaskModal
        onNext={(task: Task) => {
          setTaskId(task.tid);
          setTaskName(task.name);
          setTaskType(task.type);
          setDayPreference(task.day_preference);
          setDays(() => {
            if (task.day_preference === DayPreference.DAILY) {
              return DAYS;
            }
            if (task.day_preference === DayPreference.DAY_RANGE) {
              const earliestDay = task.days[0];
              const latestDay = task.days[task.days.length - 1];
              const earliestDayIndex = DAYS.indexOf(earliestDay);
              const latestDayIndex = DAYS.indexOf(latestDay);
              return DAYS.slice(earliestDayIndex, latestDayIndex + 1);
            }
            if (task.day_preference === DayPreference.EVERY_SELECTED_DAYS) {
              return task.days;
            }
            return [];
          });
          setTimePreference(task.time_preference);
          setStartTime(task.start_time ? new Date(task.start_time) : null);
          setEndTime(task.end_time ? new Date(task.end_time) : null);
          setAddition(task.value);
          setDeduction(task.penalty);
          setComments(task.comment ?? "");
          setInitialState(false);
        }}
        onCancel={onClose}
      />
    );
  }

  return (
    <PopupContainer
      title="Assign Task"
      submit_text="Assign"
      submit_action={handleSubmit}
      cancel_action={onClose}
      loading={createAssignedTaskLoading}
      error_message={error}
    >
      {taskType === TaskType.INDIVIDUAL_GOAL ? (
        <TextInput
          label="Task Name"
          current_value={taskName}
          update_action={setTaskName}
          size="large"
        />
      ) : (
        <FixedInput
          label="Task Name"
          current_value={toTitleCase(taskName)}
          orientation="horizontal"
        />
      )}

      <DateOptions
        showParticipantPreference={false}
        taskType={taskType}
        participantPreference={false}
        setParticipantPreference={() => {}}
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
