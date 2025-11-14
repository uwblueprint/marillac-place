// Refactor in progress - ignore for now
// import { Text, Flex, Spinner } from "@chakra-ui/react";
// import React, { useState, useEffect } from "react";
// import { useMutation, useQuery } from "@apollo/client";
// import { GET_TASKS_BY_TYPE } from "../../../../gql/example";
// import ModalContainer from "../../../common/form/ModalContainer";
// import SelectionInput from "../../../common/form/SelectionInput";
// import CoreInput from "../../../common/form/CoreInput";
// import {
//   DayOfWeek,
//   RecurrenceFrequency,
//   TaskType,
//   TimeOption,
// } from "../../../../types/task";
// import TaskInput from "../../../common/form/TaskInput";
// import { sendNotification } from "../../../../../helpers/sendNotification";
// import { CREATE_ASSIGNED_TASK } from "../../../../gql/mutations";
// import { formatDateFromString } from "../../../../../helpers/formatDate";
//
// type AssignTaskModalProps = {
//   participantId: number;
//   isOpen: boolean;
//   onClose: () => void;
// };
//
// export default function AssignTaskModal({
//   participantId,
//   isOpen,
//   onClose,
// }: AssignTaskModalProps) {
//   const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
//   const [initialState, setInitialState] = useState<boolean>(true);
//   const [goalName, setGoalName] = useState<string>("");
//   const [goalDescription, setGoalDescription] = useState<string>("");
//   const [taskName, setTaskName] = useState<string>("");
//   const [taskType, setTaskType] = useState<TaskType | "">("");
//   const [recurrence, setRecurrence] = useState<RecurrenceFrequency | "">("");
//   const [days, setDays] = useState<DayOfWeek[]>([]);
//   const [time, setTime] = useState<TimeOption | "">("");
//   const [startTime, setStartTime] = useState<string>("");
//   const [endTime, setEndTime] = useState<string>("");
//   const [addition, setAddition] = useState<number>(0);
//   const [deduction, setDeduction] = useState<number>(0);
//   const [comments, setComments] = useState<string>("");
//   const [error, setError] = useState("");
//
//   const {
//     loading,
//     error: queryError,
//     data,
//   } = useQuery(GET_TASKS_BY_TYPE, {
//     variables: { type: [TaskType.OPTIONAL, TaskType.INDIVIDUAL_GOAL] },
//   });
//
//   const [createAssignedTask] = useMutation(CREATE_ASSIGNED_TASK, {
//     onCompleted: () => {
//       sendNotification(`Task ${taskName} assigned.`);
//     },
//     onError: (err: any) => {
//       setError(err.message);
//     },
//   });
//
//   useEffect(() => {
//     if (!loading && !error && data && selectedTaskId !== null) {
//       const selectedTask = data.getTasksByType.find(
//         (t: any) => t.task_id === Number(selectedTaskId)
//       );
//       if (selectedTask) {
//         setTaskName(selectedTask.task_name);
//         setTaskType(selectedTask.task_type as TaskType);
//         setComments(selectedTask.comment ?? "");
//         setRecurrence(
//           selectedTask.recurrence_preference as RecurrenceFrequency
//         );
//         setDays(selectedTask.repeat_days as DayOfWeek[]);
//         setTime(selectedTask.time_preference as TimeOption);
//         setStartTime(selectedTask.start_time ?? "");
//         setEndTime(selectedTask.end_time ?? "");
//         setAddition(selectedTask.marillac_bucks_addition);
//         setDeduction(selectedTask.marillac_bucks_deduction);
//         setInitialState(false);
//       }
//     }
//   }, [loading, error, data, selectedTaskId]);
//
//   function handleSave() {
//     if (
//       !taskName ||
//       recurrence === "" ||
//       recurrence === RecurrenceFrequency.PARTICIPANT_PREFERENCE ||
//       days.length === 0 ||
//       time === "" ||
//       time === TimeOption.PARTICIPANT_PREFERENCE ||
//       (time === TimeOption.SPECIFIC && (startTime === "" || endTime === "")) ||
//       (taskType === TaskType.INDIVIDUAL_GOAL &&
//         (goalName === "" || goalDescription === ""))
//     ) {
//       setError("Missing fields");
//     } else if (addition < 0 || deduction < 0) {
//       setError("Invalid values for marillac bucks");
//     } else if (time === TimeOption.SPECIFIC && startTime >= endTime) {
//       setError("Start time should be earlier than end time");
//     } else if (
//       recurrence === RecurrenceFrequency.ANY_SELECTED_DAYS &&
//       days.length <= 1
//     ) {
//       setError(
//         "If the task can only be completed on a specific day, please choose 'Every selected day'"
//       );
//     } else if (
//       recurrence === RecurrenceFrequency.ANY_SELECTED_DAYS &&
//       time !== TimeOption.ANYTIME
//     ) {
//       setError("Anyday tasks must also be anytime tasks");
//     } else {
//       if (recurrence === RecurrenceFrequency.ANY_SELECTED_DAYS) {
//         const startDate = formatDateFromString(days[0]);
//         const endDate = formatDateFromString(days[days.length - 1], "", true);
//
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
//       } else {
//         for (const day of days) {
//           let startDate = "";
//           let endDate = "";
//           if (time === TimeOption.ANYTIME) {
//             startDate = formatDateFromString(day as DayOfWeek);
//             endDate = formatDateFromString(day as DayOfWeek, "", true);
//           } else {
//             startDate = formatDateFromString(day as DayOfWeek, startTime);
//             endDate = formatDateFromString(day as DayOfWeek, endTime);
//           }
//
//           createAssignedTask({
//             variables: {
//               participantId,
//               taskName,
//               taskType,
//               startDate,
//               endDate,
//               marillacBucksAddition: Number(addition),
//               marillacBucksDeduction: Number(deduction),
//               goalName: goalName ?? undefined,
//               goalDescription: goalDescription ?? undefined,
//               comment: comments ?? undefined,
//             },
//           });
//         }
//       }
//     }
//   }
//
//   return (
//     <ModalContainer
//       title="Assign Task"
//       submit_text="Assign Task"
//       submit_action={handleSave}
//       cancel_action={onClose}
//       error={error}
//     >
//       {loading ? (
//         <Spinner />
//       ) : queryError ? (
//         <Flex>Unable to fetch data.</Flex>
//       ) : initialState ? (
//         <SelectionInput
//           label="Task Name"
//           current_value={selectedTaskId}
//           action={(e: any) => setSelectedTaskId(e.target.value)}
//           mode="dropdown"
//           value_options={Object.fromEntries(
//             data?.getTasksByType?.map((task: any) => [
//               task.task_name,
//               task.task_id,
//             ]) ?? []
//           )}
//         />
//       ) : (
//         <>
//           <Flex gap="5px" align="flex-end">
//             <Text textStyle="web.s1" color="text.light.secondary">
//               Task Name
//             </Text>
//             {taskType === TaskType.INDIVIDUAL_GOAL ? (
//               <Text textStyle="web.b3" color="#000000">
//                 Individual Goal
//               </Text>
//             ) : (
//               <Text textStyle="web.b3" color="#000000">
//                 {taskName}
//               </Text>
//             )}
//           </Flex>
//
//           <Flex w="100%" h="1px" bg="background.border" mt="3px" />
//
//           {taskType === TaskType.INDIVIDUAL_GOAL && (
//             <>
//               <CoreInput
//                 label="Goal Name"
//                 current_value={goalName}
//                 action={(e: any) => setGoalName(e.target.value)}
//                 type="text"
//               />
//               <CoreInput
//                 label="Goal Description"
//                 current_value={goalDescription}
//                 action={(e: any) => setGoalDescription(e.target.value)}
//                 type="text"
//               />
//             </>
//           )}
//
//           <TaskInput
//             set_recurrence={setRecurrence}
//             set_days={setDays}
//             set_time={setTime}
//             set_start_time={setStartTime}
//             set_end_time={setEndTime}
//             set_addition={setAddition}
//             set_deduction={setDeduction}
//             set_comments={setComments}
//             recurrence={recurrence}
//             days={days}
//             time={time}
//             start_time={startTime}
//             end_time={endTime}
//             addition={addition}
//             deduction={deduction}
//             comments={comments}
//           />
//         </>
//       )}
//     </ModalContainer>
//   );
// }
