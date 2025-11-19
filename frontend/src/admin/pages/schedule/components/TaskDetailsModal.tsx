export {};
// TODO: Refactor this component
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   Text,
//   Flex,
// } from "@chakra-ui/react";
// import React, { useState } from "react";
// import { useMutation } from "@apollo/client";
// import { CalendarEvent, TaskStatus } from "./ScheduleTypes";
// import OrangeButton from "../../../common/buttons/OrangeButton";
// import SimpleButton from "../../../common/buttons/SimpleButton";
// import TextInput from "../../../common/form/TextInput";
// import { toTitleCase } from "../../../../utils/string_helpers";
// import { sendNotification } from "../../../../utils/sendNotification";
// import {
//   DELETE_ASSIGNED_TASK,
//   UPDATE_ASSIGNED_TASK,
// } from "../../../../gql/mutations";
// import { DayOfWeek, TaskType, TimeOption } from "../../../../types/task";
// import {
//   convertToDaysListGivenRange,
//   displayDate,
//   formatDateFromString,
//   formatTimeString,
//   isAnytime,
// } from "../../../../utils/formatDateTime";
// import { weekdays } from "../../../../constants/misc";
// import GreenButton from "../../../common/buttons/GreenButton";
// import SelectionInput from "../../../common/form/SelectionInput";
// import CoreInput from "../../../common/form/CoreInput";
// 
// interface TaskDetailsModalProps {
//   task: CalendarEvent;
//   onClose: () => void;
// }
// 
// export default function TaskDetailsModal({
//   task,
//   onClose,
// }: TaskDetailsModalProps) {
//   const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(
//     task.task_status
//   );
//   const [days, setDays] = useState<DayOfWeek[]>(
//     convertToDaysListGivenRange(task.start, task.end)
//   );
//   const [time, setTime] = useState<TimeOption>(
//     isAnytime(task.start, task.end) ? TimeOption.ANYTIME : TimeOption.SPECIFIC
//   );
//   const [startTime, setStartTime] = useState(formatTimeString(task.start));
//   const [endTime, setEndTime] = useState(formatTimeString(task.end));
//   const [addition, setAddition] = useState(task.marillacBucksAddition);
//   const [deduction, setDeduction] = useState(task.marillac_bucks_deduction);
//   const [comments, setComments] = useState<string>(task.comment ?? "");
// 
//   const [editDetails, setEditDetails] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
// 
//   const [deleteAssignedTask] = useMutation(DELETE_ASSIGNED_TASK, {
//     onCompleted: () => {
//       sendNotification(`Task ${task.title} deleted.`);
//     },
//     onError: (err: any) => {
//       setError(err.message);
//     },
//   });
// 
//   const [updateAssignedTask] = useMutation(UPDATE_ASSIGNED_TASK, {
//     onCompleted: () => {
//       sendNotification(`Task ${task.title} edited.`);
//     },
//     onError: (err: any) => {
//       setError(err.message);
//     },
//   });
// 
//   const handleDelete = () => {
//     deleteAssignedTask({
//       variables: {
//         assigned_task_id: task.id,
//       },
//     });
//   };
// 
//   const handleSave = () => {
//     setError("");
//     if (
//       days.length === 0 ||
//       (time === TimeOption.SPECIFIC && (startTime === "" || endTime === ""))
//     ) {
//       setError("Missing fields");
//     } else if (addition < 0 || deduction < 0) {
//       setError("Invalid values for marillac bucks");
//     } else if (time === TimeOption.SPECIFIC && startTime >= endTime) {
//       setError("Start time should be earlier than end time");
//     } else if (days.length > 1 && time !== TimeOption.ANYTIME) {
//       setError("Tasks spanning over multiple days must be anytime tasks");
//     } else {
//       let startDate = "";
//       let endDate = "";
//       if (days.length > 1) {
//         startDate = formatDateFromString(days[0]);
//         endDate = formatDateFromString(days[days.length - 1], "", true);
//       } else {
//         startDate = formatDateFromString(days[0] as DayOfWeek, startTime);
//         endDate = formatDateFromString(days[0] as DayOfWeek, endTime);
//       }
// 
//       updateAssignedTask({
//         variables: {
//           id: task.id,
//           taskStatus: selectedStatus,
//           startDate,
//           endDate,
//           marillacBucksAddition: Number(addition),
//           marillacBucksDeduction: Number(deduction),
//           comment: comments,
//         },
//       });
//     }
//   };
// 
//   function handleSelectDay(day: DayOfWeek) {
//     if (days.length === 0) {
//       setDays([day]);
//     } else if (!days.includes(day)) {
//       const a = weekdays.indexOf(day as string);
//       const b = weekdays.indexOf(days[0] as string);
//       const c = weekdays.indexOf(days[days.length - 1] as string);
//       if (a < b) {
//         setDays([...weekdays.slice(a, b), ...days] as DayOfWeek[]);
//       } else {
//         setDays([...days, ...weekdays.slice(c + 1, a + 1)] as DayOfWeek[]);
//       }
//     } else if (days.length === 1) {
//       setDays([]);
//     } else {
//       setDays([day]);
//     }
//   }
// 
//   return (
//     <Modal isOpen isCentered onClose={onClose} closeOnOverlayClick={false}>
//       <ModalOverlay />
//       <ModalContent
//         width="fit-content"
//         minWidth="350px"
//         maxWidth="550px"
//         height="fit-content"
//         boxShadow="xl"
//         borderRadius="16px"
//         paddingX="35px"
//         paddingY="25px"
//       >
//         <Flex justify="space-between" align="center" mb="10px">
//           {!editDetails ? (
//             <Text textStyle="web.h3">
//               {task.task_type === TaskType.INDIVIDUAL_GOAL
//                 ? task.goalName
//                 : task.title}
//             </Text>
//           ) : (
//             <Text textStyle="web.h3">Edit Assigned Task</Text>
//           )}
//           <Flex alignItems="center" justifyContent="flex-end" gap="12px">
//             {!editDetails && (
//               <SimpleButton
//                 text="Edit"
//                 action={() => {
//                   setSelectedStatus(task.task_status);
//                   setComments(task.comment ?? "");
//                   setEditDetails(true);
//                 }}
//                 is_active={false}
//                 text_color="#0C727E"
//               />
//             )}
//             <SimpleButton
//               text="Delete"
//               action={handleDelete}
//               is_active={false}
//               text_color="#D34C5C"
//             />
//           </Flex>
//         </Flex>
// 
//         {editDetails ? (
//           <Flex flexDir="column" gap="8px">
//             <Flex gap="5px" align="flex-end">
//               <Text textStyle="web.s1" color="text.light.secondary">
//                 Task Name
//               </Text>
//               <Text textStyle="web.b3" color="#000000">
//                 {task.task_type === TaskType.INDIVIDUAL_GOAL
//                   ? task.goalName
//                   : task.title}
//               </Text>
//             </Flex>
//
//             <Flex w="100%" h="1px" bg="background.border" mt="3px" />
//
//             <Text textStyle="web.s1" color="text.light.secondary">
//               Select Days
//             </Text>
//             <Flex gap="5px">
//               {weekdays.map((day: string, index) => (
//                 <GreenButton
//                   key={index}
//                   text={toTitleCase(day).slice(0, 3)}
//                   action={() => handleSelectDay(day as DayOfWeek)}
//                   is_active={days.includes(day as DayOfWeek)}
//                 />
//               ))}
//             </Flex>
// 
//             <SelectionInput
//               label="Time"
//               current_value={time}
//               action={(opt: TimeOption) => {
//                 if (opt === TimeOption.ANYTIME) {
//                   setStartTime("00:00");
//                   setEndTime("23:59");
//                 }
//                 setTime(opt);
//               }}
//               mode="radio"
//               value_options={{
//                 Anytime: TimeOption.ANYTIME,
//                 "Select Time": TimeOption.SPECIFIC,
//               }}
//             />
// 
//             {time === TimeOption.SPECIFIC && (
//               <Flex
//                 width="100%"
//                 alignItems="center"
//                 justifyContent="space-between"
//               >
//                 <CoreInput
//                   label="Start Time"
//                   current_value={startTime}
//                   action={(e: any) => setStartTime(e.target.value)}
//                   type="time"
//                   width="90%"
//                 />
//                 <CoreInput
//                   label="End Time"
//                   current_value={endTime}
//                   action={(e: any) => setEndTime(e.target.value)}
//                   type="time"
//                   width="90%"
//                 />
//               </Flex>
//             )}
// 
//             <Flex
//               width="100%"
//               alignItems="center"
//               justifyContent="space-between"
//             >
//               <CoreInput
//                 label="Marillac Bucks"
//                 current_value={String(addition)}
//                 action={(e: any) => setAddition(e.target.value as number)}
//                 type="number"
//                 width="50%"
//               />
//               <CoreInput
//                 label="Marillac Bucks Deduction"
//                 current_value={String(deduction)}
//                 action={(e: any) => setDeduction(e.target.value as number)}
//                 type="number"
//                 width="50%"
//               />
//             </Flex>
// 
//             <TextInput
//               label="Comments"
//               current_value={comments}
//               action={(e: any) => setComments(e.target.value)}
//             />
//           </Flex>
//         ) : (
//           <Flex flexDir="column" gap="8px">
//             <Flex gap="5px" align="flex-end">
//               <Text textStyle="web.s1" color="text.light.secondary">
//                 Task Type
//               </Text>
//               <Text textStyle="web.b3" color="#000000">
//                 {toTitleCase(task.task_type)}
//               </Text>
//             </Flex>
//             <Flex gap="5px" align="flex-end">
//               <Text textStyle="web.s1" color="text.light.secondary">
//                 Date
//               </Text>
//               <Text textStyle="web.b3" color="#000000">
//                 {(() => {
//                   const startDate = displayDate(task.start);
//                   const endDate = displayDate(task.end);
//                   if (startDate === endDate) {
//                     return startDate;
//                   }
//                   return `${startDate} to ${endDate}`;
//                 })()}
//               </Text>
//             </Flex>
//             <Flex gap="5px" align="flex-end">
//               <Text textStyle="web.s1" color="text.light.secondary">
//                 Marillac Bucks
//               </Text>
//               <Text textStyle="web.b3" color="#000000">
//                 ${task.marillacBucksAddition}
//               </Text>
//             </Flex>
//             <Flex gap="5px" align="flex-end">
//               <Text textStyle="web.s1" color="text.light.secondary">
//                 Marillac Bucks Deduction
//               </Text>
//               <Text textStyle="web.b3" color="#000000">
//                 ${task.marillac_bucks_deduction}
//               </Text>
//             </Flex>
// 
//             <Flex flexDir="column">
//               <Text textStyle="web.s1" color="text.light.secondary">
//                 Status
//               </Text>
//               <Flex flexDir="row" gap="8px">
//                 <SimpleButton
//                   text="Assigned"
//                   action={() => setSelectedStatus(TaskStatus.ASSIGNED)}
//                   is_active={selectedStatus === TaskStatus.ASSIGNED}
//                   text_color="#000000"
//                   icon={
//                     <svg
//                       width="19"
//                       height="19"
//                       viewBox="0 0 19 19"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <circle cx="9.5" cy="9.5" r="9.5" fill="#A8C3E2" />
//                     </svg>
//                   }
//                 />
//                 <SimpleButton
//                   text="Completed"
//                   action={() => setSelectedStatus(TaskStatus.COMPLETE)}
//                   is_active={selectedStatus === TaskStatus.COMPLETE}
//                   text_color="#000000"
//                   icon={
//                     <svg
//                       width="19"
//                       height="19"
//                       viewBox="0 0 19 19"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <circle cx="9.5" cy="9.5" r="9.5" fill="#CDEECE" />
//                     </svg>
//                   }
//                 />
//                 <SimpleButton
//                   text="Excused"
//                   action={() => setSelectedStatus(TaskStatus.EXCUSED)}
//                   is_active={selectedStatus === TaskStatus.EXCUSED}
//                   text_color="#000000"
//                   icon={
//                     <svg
//                       width="19"
//                       height="19"
//                       viewBox="0 0 19 19"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <circle cx="9.5" cy="9.5" r="9.5" fill="#FFE5B2" />
//                     </svg>
//                   }
//                 />
//                 <SimpleButton
//                   text="Incomplete"
//                   action={() => setSelectedStatus(TaskStatus.INCOMPLETE)}
//                   is_active={selectedStatus === TaskStatus.INCOMPLETE}
//                   text_color="#000000"
//                   icon={
//                     <svg
//                       width="19"
//                       height="19"
//                       viewBox="0 0 19 19"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <circle cx="9.5" cy="9.5" r="9.5" fill="#F8D7DB" />
//                     </svg>
//                   }
//                 />
//               </Flex>
//             </Flex>
// 
//             <TextInput
//               label="Comments"
//               current_value={comments}
//               action={(e: any) => setComments(e.target.value)}
//             />
//           </Flex>
//         )}
// 
//         {error && (
//           <Text textStyle="web.s1" color="#E30000" mt="8px">
//             {error}
//           </Text>
//         )}
// 
//         <Flex
//           alignItems="center"
//           justifyContent="flex-end"
//           gap="12px"
//           mt="15px"
//         >
//           <SimpleButton
//             text="Cancel"
//             action={onClose}
//             is_active={false}
//             text_color="#000000"
//           />
//           <OrangeButton
//             text="Save Changes"
//             action={handleSave}
//             is_active={false}
//           />
//         </Flex>
//       </ModalContent>
//     </Modal>
//   );
// }
