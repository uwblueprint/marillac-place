export {};
// TODO: Refactor this component
// import { Text, Flex, Checkbox } from "@chakra-ui/react";
// import React, { useState } from "react";
// import { useMutation } from "@apollo/client";
// import { CREATE_TASK } from "../../../../gql/mutations";
// import ModalContainer from "../../../common/form/ModalContainer";
// import CoreInput from "../../../common/form/CoreInput";
// import TextInput from "../../../common/form/TextInput";
// import TaskInput from "../../../common/form/TaskInput";
// import {
//   DayOfWeek,
//   RecurrenceFrequency,
//   TaskType,
//   TimeOption,
// } from "../../../../types/task";
// import { toTitleCase } from "../../../../utils/string_helpers";
// import { sendNotification } from "../../../../utils/sendNotification";
//
// type AddTaskModalProps = {
//   taskType: TaskType;
//   close: () => void;
// };
//
// export default function AddTaskModal({ taskType, close }: AddTaskModalProps) {
//   const [taskName, setTaskName] = useState<string>("");
//   const [participantPreference, setParticipantPreference] = useState(false);
//   const [recurrence, setRecurrence] = useState<RecurrenceFrequency | "">("");
//   const [days, setDays] = useState<DayOfWeek[]>([]);
//   const [time, setTime] = useState<TimeOption | "">("");
//   const [startTime, setStartTime] = useState<string>("");
//   const [endTime, setEndTime] = useState<string>("");
//   const [addition, setAddition] = useState<number>(0);
//   const [deduction, setDeduction] = useState<number>(0);
//   const [comments, setComments] = useState<string>("");
//   const [error, setError] = useState<string>("");
//
//   const [createTask] = useMutation(CREATE_TASK, {
//     onCompleted: () => {
//       sendNotification(`Task ${taskName} added.`);
//     },
//     onError: (err) => {
//       setError(err.message);
//     },
//   });
//
//   function handleSubmit() {
//     if (
//       !taskName ||
//       (!participantPreference &&
//         (recurrence === "" ||
//           days.length === 0 ||
//           time === "" ||
//           (time === TimeOption.SPECIFIC &&
//             (startTime === "" || endTime === ""))))
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
//       createTask({
//         variables: {
//           type: taskType.toUpperCase(),
//           name: taskName,
//           recurrencePreference: recurrence,
//           repeatDays: days,
//           timePreference: time,
//           marillacBucks: Number(addition),
//           deduction: Number(deduction),
//           startTime: startTime !== "" ? startTime : undefined,
//           endTime: endTime !== "" ? endTime : undefined,
//           comment: comments !== "" ? comments : undefined,
//         },
//       });
//     }
//   }
//
//   return (
//     <ModalContainer
//       title="Add Task"
//       submit_text="Save Task"
//       submit_action={handleSubmit}
//       cancel_action={close}
//       error={error}
//     >
//       <Flex gap="5px" alignItems="flex-end">
//         <Text textStyle="web.s1" color="text.light.secondary">
//           Task Type
//         </Text>
//         <Text textStyle="web.b3" color="text.light.secondary">
//           {toTitleCase(taskType as string)}
//         </Text>
//       </Flex>
//
//       <CoreInput
//         label="Task Name"
//         current_value={taskName}
//         action={(e: any) => setTaskName(e.target.value)}
//         type="text"
//       />
//
//       {taskType !== TaskType.REQUIRED && (
//         <Checkbox
//           isChecked={participantPreference}
//           onChange={(e: any) => {
//             setRecurrence(RecurrenceFrequency.PARTICIPANT_PREFERENCE);
//             setDays([]);
//             setTime(TimeOption.PARTICIPANT_PREFERENCE);
//             setStartTime("");
//             setEndTime("");
//             setParticipantPreference(e.target.checked);
//           }}
//         >
//           <Text textStyle="web.b3" color="#000000">
//             Participant Preference?
//           </Text>
//         </Checkbox>
//       )}
//
//       {participantPreference ? (
//         <>
//           <Flex width="100%" alignItems="center" justifyContent="space-between">
//             <CoreInput
//               label="Marillac Bucks"
//               current_value={String(addition)}
//               action={(e: any) => setAddition(e.target.value as number)}
//               type="number"
//               width="50%"
//             />
//             <CoreInput
//               label="Marillac Bucks Deduction"
//               current_value={String(deduction)}
//               action={(e: any) => setDeduction(e.target.value as number)}
//               type="number"
//               width="50%"
//             />
//           </Flex>
//
//           <TextInput
//             label="Comments"
//             current_value={comments}
//             action={(e: any) => setComments(e.target.value)}
//           />
//         </>
//       ) : (
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
//       )}
//     </ModalContainer>
//   );
// }
