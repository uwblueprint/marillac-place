export {};
// import React, { useEffect, useState } from "react";
// import { Flex, Tabs, TabList, Tab, Text } from "@chakra-ui/react";

// import { tasksColumnTypes } from "./columnKeys";

// import {
//   scheduleTasksMockData,
//   sundayScheduleTasksMockData,
//   mondayScheduleTasksMockData,
//   tuesdayScheduleTasksMockData,
//   wednesdayScheduleTasksMockData,
//   thursdayScheduleTasksMockData,
//   fridayScheduleTasksMockData,
//   saturdayScheduleTasksMockData,
// } from "../../../../mocks/scheduletasks";

// import ScheduleTable, { ColumnInfoTypes, TableData } from "./ScheduleTable";

// const ScheduleListView = (): React.ReactElement => {
//   const enum Dates {
//     SUNDAY = "SUNDAY",
//     MONDAY = "MONDAY",
//     TUESDAY = "TUESDAY",
//     WEDNESDAY = "WEDNESDAY",
//     THURSDAY = "THURSDAY",
//     FRIDAY = "FRIDAY",
//     SATURDAY = "SATURDAY",
//   }

//   const [taskData, setTaskData] = useState<TableData[]>([]);
//   const [taskDataColumns, setTaskDataColumns] = useState<ColumnInfoTypes[]>([]);
//   const [taskDate, setTaskDate] = useState(Dates.SUNDAY);
//   const [dailyTaskData, setDailyTaskData] = useState<TableData[]>([]);

//   useEffect(() => {
//     setTaskDataColumns(tasksColumnTypes);
//     setTaskData(scheduleTasksMockData);
//     if (taskDate === Dates.SUNDAY) {
//       setDailyTaskData(sundayScheduleTasksMockData);
//     } else if (taskDate === Dates.MONDAY) {
//       setDailyTaskData(mondayScheduleTasksMockData);
//     } else if (taskDate === Dates.TUESDAY) {
//       setDailyTaskData(tuesdayScheduleTasksMockData);
//     } else if (taskDate === Dates.WEDNESDAY) {
//       setDailyTaskData(wednesdayScheduleTasksMockData);
//     } else if (taskDate === Dates.THURSDAY) {
//       setDailyTaskData(thursdayScheduleTasksMockData);
//     } else if (taskDate === Dates.FRIDAY) {
//       setDailyTaskData(fridayScheduleTasksMockData);
//     } else if (taskDate === Dates.SATURDAY) {
//       setDailyTaskData(saturdayScheduleTasksMockData);
//     } else {
//       setDailyTaskData(sundayScheduleTasksMockData);
//     }
//   }, [taskDate]);

//   return (
//     <>
//       <Flex flexDir="column" flexGrow={1}>
//         <Text as="b" display="block" textAlign="left" mb="10px">
//           Weekly Tasks
//         </Text>
//         <ScheduleTable
//           data={taskData}
//           columnInfo={taskDataColumns}
//           maxResults={8}
//           onEdit={() => {}}
//           isSelectable
//         />
//       </Flex>
//       <Flex flexDir="column" flexGrow={1}>
//         <Text as="b" display="block" textAlign="left" mb="10px">
//           Daily Tasks
//         </Text>
//         <Tabs variant="enclosed-colored" h="30px" mb="10px" isFitted>
//           <TabList>
//             <Tab
//               _selected={{ color: "white", bg: "purple.main" }}
//               borderRadius="8px 8px 0 0"
//               onClick={() => {
//                 setTaskDate(Dates.SUNDAY);
//               }}
//             >
//               Sunday
//             </Tab>
//             <Tab
//               _selected={{ color: "white", bg: "purple.main" }}
//               borderRadius="8px 8px 0 0"
//               onClick={() => {
//                 setTaskDate(Dates.MONDAY);
//               }}
//             >
//               Monday
//             </Tab>
//             <Tab
//               _selected={{ color: "white", bg: "purple.main" }}
//               borderRadius="8px 8px 0 0"
//               onClick={() => {
//                 setTaskDate(Dates.TUESDAY);
//               }}
//             >
//               Tuesday
//             </Tab>
//             <Tab
//               _selected={{ color: "white", bg: "purple.main" }}
//               borderRadius="8px 8px 0 0"
//               onClick={() => {
//                 setTaskDate(Dates.WEDNESDAY);
//               }}
//             >
//               Wednesday
//             </Tab>
//             <Tab
//               _selected={{ color: "white", bg: "purple.main" }}
//               borderRadius="8px 8px 0 0"
//               onClick={() => {
//                 setTaskDate(Dates.THURSDAY);
//               }}
//             >
//               Thursday
//             </Tab>
//             <Tab
//               _selected={{ color: "white", bg: "purple.main" }}
//               borderRadius="8px 8px 0 0"
//               onClick={() => {
//                 setTaskDate(Dates.FRIDAY);
//               }}
//             >
//               Friday
//             </Tab>
//             <Tab
//               _selected={{ color: "white", bg: "purple.main" }}
//               borderRadius="8px 8px 0 0"
//               onClick={() => {
//                 setTaskDate(Dates.SATURDAY);
//               }}
//             >
//               Saturday
//             </Tab>
//           </TabList>
//         </Tabs>
//         <ScheduleTable
//           data={dailyTaskData}
//           columnInfo={taskDataColumns}
//           maxResults={8}
//           onEdit={() => {}}
//           isSelectable
//         />
//       </Flex>
//     </>
//   );
// };

// export default ScheduleListView;
