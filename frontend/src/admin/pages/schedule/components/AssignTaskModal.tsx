import { Text, Flex, Spinner } from "@chakra-ui/react";
import React, { useState, useEffect, useMemo } from "react";
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
    const { isValid, errorMessage } = isValidTask(
      taskName,
      false,
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
      const startAndEndDates = getStartAndEndDates(
        dayPreference as DayPreference,
        days,
        timePreference as TimePreference,
        startTime,
        endTime
      );
      const operations = startAndEndDates.map(({ startDate, endDate }) =>
        createAssignedTask({
          variables: {
            pid: participantId,
            tid: taskId,
            name: taskName,
            type: taskType,
            value: addition,
            penalty: deduction,
            startDate,
            endDate,
            comment: comments,
          },
        })
      );
      await Promise.all(operations);
      refetchAssignedTasks();
      onClose();
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
          current_value={taskName}
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

  // const [createAssignedTask, { loading: createAssignedTaskLoading }] = useMutation(CREATE_ASSIGNED_TASK);

  // useEffect(() => {
  //   if (!loading && !error && data && selectedTaskId !== null) {
  //     const selectedTask = data.getTasksByType.find(
  //       (t: any) => t.task_id === Number(selectedTaskId)
  //     );
  //     if (selectedTask) {
  //       setTaskName(selectedTask.task_name);
  //       setTaskType(selectedTask.task_type as TaskType);
  //       setComments(selectedTask.comment ?? "");
  //       setRecurrence(
  //         selectedTask.recurrence_preference as RecurrenceFrequency
  //       );
  //       setDays(selectedTask.repeat_days as DayOfWeek[]);
  //       setTime(selectedTask.time_preference as TimeOption);
  //       setStartTime(selectedTask.start_time ?? "");
  //       setEndTime(selectedTask.end_time ?? "");
  //       setAddition(selectedTask.marillac_bucks_addition);
  //       setDeduction(selectedTask.marillac_bucks_deduction);
  //       setInitialState(false);
  //     }
  //   }
  // }, [loading, error, data, selectedTaskId]);

  // function handleSave() {
  //   if (
  //     !taskName ||
  //     recurrence === "" ||
  //     recurrence === RecurrenceFrequency.PARTICIPANT_PREFERENCE ||
  //     days.length === 0 ||
  //     time === "" ||
  //     time === TimeOption.PARTICIPANT_PREFERENCE ||
  //     (time === TimeOption.SPECIFIC && (startTime === "" || endTime === "")) ||
  //     (taskType === TaskType.INDIVIDUAL_GOAL &&
  //       (goalName === "" || goalDescription === ""))
  //   ) {
  //     setError("Missing fields");
  //   } else if (addition < 0 || deduction < 0) {
  //     setError("Invalid values for marillac bucks");
  //   } else if (time === TimeOption.SPECIFIC && startTime >= endTime) {
  //     setError("Start time should be earlier than end time");
  //   } else if (
  //     recurrence === RecurrenceFrequency.ANY_SELECTED_DAYS &&
  //     days.length <= 1
  //   ) {
  //     setError(
  //       "If the task can only be completed on a specific day, please choose 'Every selected day'"
  //     );
  //   } else if (
  //     recurrence === RecurrenceFrequency.ANY_SELECTED_DAYS &&
  //     time !== TimeOption.ANYTIME
  //   ) {
  //     setError("Anyday tasks must also be anytime tasks");
  //   } else {
  //     if (recurrence === RecurrenceFrequency.ANY_SELECTED_DAYS) {
  //       const startDate = formatDateFromString(days[0]);
  //       const endDate = formatDateFromString(days[days.length - 1], "", true);

  //       createAssignedTask({
  //         variables: {
  //           participantId,
  //           taskName,
  //           taskType,
  //           startDate,
  //           endDate,
  //           marillacBucksAddition: Number(addition),
  //           marillacBucksDeduction: Number(deduction),
  //           goalName: goalName ?? undefined,
  //           goalDescription: goalDescription ?? undefined,
  //           comment: comments ?? undefined,
  //         },
  //       });
  //     } else {
  //       for (const day of days) {
  //         let startDate = "";
  //         let endDate = "";
  //         if (time === TimeOption.ANYTIME) {
  //           startDate = formatDateFromString(day as DayOfWeek);
  //           endDate = formatDateFromString(day as DayOfWeek, "", true);
  //         } else {
  //           startDate = formatDateFromString(day as DayOfWeek, startTime);
  //           endDate = formatDateFromString(day as DayOfWeek, endTime);
  //         }

  //         createAssignedTask({
  //           variables: {
  //             participantId,
  //             taskName,
  //             taskType,
  //             startDate,
  //             endDate,
  //             marillacBucksAddition: Number(addition),
  //             marillacBucksDeduction: Number(deduction),
  //             goalName: goalName ?? undefined,
  //             goalDescription: goalDescription ?? undefined,
  //             comment: comments ?? undefined,
  //           },
  //         });
  //       }
  //     }
  //   }
  // }

  // return (
  //   <ModalContainer
  //     title="Assign Task"
  //     submit_text="Assign Task"
  //     submit_action={handleSave}
  //     cancel_action={onClose}
  //     error={error}
  //   >
  //     {loading ? (
  //       <Spinner />
  //     ) : queryError ? (
  //       <Flex>Unable to fetch data.</Flex>
  //     ) : initialState ? (
  //       <SelectionInput
  //         label="Task Name"
  //         current_value={selectedTaskId}
  //         action={(e: any) => setSelectedTaskId(e.target.value)}
  //         mode="dropdown"
  //         value_options={Object.fromEntries(
  //           data?.getTasksByType?.map((task: any) => [
  //             task.task_name,
  //             task.task_id,
  //           ]) ?? []
  //         )}
  //       />
  //     ) : (
  //       <>
  //         <Flex gap="5px" align="flex-end">
  //           <Text textStyle="web.s1" color="text.light.secondary">
  //             Task Name
  //           </Text>
  //           {taskType === TaskType.INDIVIDUAL_GOAL ? (
  //             <Text textStyle="web.b3" color="#000000">
  //               Individual Goal
  //             </Text>
  //           ) : (
  //             <Text textStyle="web.b3" color="#000000">
  //               {taskName}
  //             </Text>
  //           )}
  //         </Flex>

  //         <Flex w="100%" h="1px" bg="neutral.300" mt="3px" />

  //         {taskType === TaskType.INDIVIDUAL_GOAL && (
  //           <>
  //             <CoreInput
  //               label="Goal Name"
  //               current_value={goalName}
  //               action={(e: any) => setGoalName(e.target.value)}
  //               type="text"
  //             />
  //             <CoreInput
  //               label="Goal Description"
  //               current_value={goalDescription}
  //               action={(e: any) => setGoalDescription(e.target.value)}
  //               type="text"
  //             />
  //           </>
  //         )}

  //         <TaskInput
  //           set_recurrence={setRecurrence}
  //           set_days={setDays}
  //           set_time={setTime}
  //           set_start_time={setStartTime}
  //           set_end_time={setEndTime}
  //           set_addition={setAddition}
  //           set_deduction={setDeduction}
  //           set_comments={setComments}
  //           recurrence={recurrence}
  //           days={days}
  //           time={time}
  //           start_time={startTime}
  //           end_time={endTime}
  //           addition={addition}
  //           deduction={deduction}
  //           comments={comments}
  //         />
  //       </>
  //     )}
  //   </ModalContainer>
  // );
}
