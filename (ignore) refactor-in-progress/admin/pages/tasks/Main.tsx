// Refactor in progress - ignore for now
// import {
//   Flex,
//   Input,
//   InputGroup,
//   InputLeftElement,
//   Text,
// } from "@chakra-ui/react";
// import SearchIcon from "@mui/icons-material/Search";
// import { useQuery } from "@apollo/client";
// import React, { useEffect, useState } from "react";
// import AddTaskModal from "./components/AddTaskModal";
// import TasksTable from "./components/TasksTable";
// import { GET_TASKS_BY_TYPE } from "../../../gql/example";
// import OrangeButton from "../../common/buttons/OrangeButton";
// import { TaskType } from "../../../types/task";
//
// export default function AdminTasksPage() {
//   const [addTask, setAddTask] = useState(false);
//   const [selectedTaskType, setSelectedTaskType] = useState(() => {
//     const type = localStorage.getItem("tasksSelectedType");
//     if (!type || type === "required") return TaskType.REQUIRED;
//     return TaskType.OPTIONAL;
//   });
//   const [taskFilter, setTaskFilter] = useState("");
//   const [tasks, setTasks] = useState([]);
//
//   const { loading, error, data } = useQuery(GET_TASKS_BY_TYPE, {
//     variables: { type: selectedTaskType.toUpperCase() },
//   });
//
//   useEffect(() => {
//     if (!loading && !error && data) {
//       setTasks(
//         data.getTasksByType.filter(
//           (task: any) =>
//             typeof task.task_name === "string" &&
//             task.task_name.toLowerCase().includes(taskFilter.toLowerCase())
//         )
//       );
//     }
//   }, [taskFilter, loading, error, data]);
//
//   useEffect(() => {
//     localStorage.setItem("tasksSelectedType", selectedTaskType);
//   }, [selectedTaskType]);
//
//   return (
//     <>
//       <Flex
//         w="100%"
//         justifyContent="flex-start"
//         alignItems="center"
//         position="absolute"
//         top="17px"
//         left="0px"
//         zIndex={10}
//         paddingX="20px"
//         gap="10px"
//       >
//         <Text
//           textStyle="web.b1"
//           fontWeight="700"
//           color={
//             selectedTaskType === TaskType.REQUIRED ? "primary.700" : "#000000"
//           }
//           cursor="pointer"
//           onClick={() => setSelectedTaskType(TaskType.REQUIRED)}
//           borderBottom={
//             selectedTaskType === TaskType.REQUIRED ? "3px solid" : "0"
//           }
//           borderColor="primary.700"
//           px="12px"
//           pb="12px"
//         >
//           Required
//         </Text>
//         <Text
//           textStyle="web.b1"
//           fontWeight="700"
//           color={
//             selectedTaskType === TaskType.OPTIONAL ? "primary.700" : "#000000"
//           }
//           cursor="pointer"
//           onClick={() => setSelectedTaskType(TaskType.OPTIONAL)}
//           borderBottom={
//             selectedTaskType === TaskType.OPTIONAL ? "3px solid" : "0"
//           }
//           borderColor="primary.700"
//           px="12px"
//           pb="12px"
//         >
//           Optional
//         </Text>
//       </Flex>
//       <Flex flexDir="column" w="100%" gap="15px">
//         <Flex w="100%" justifyContent="space-between">
//           <InputGroup w="25%">
//             <InputLeftElement>
//               <SearchIcon
//                 style={{
//                   color: "inherit",
//                   fontSize: 16,
//                   transform: "translateY(-2px)",
//                 }}
//               />
//             </InputLeftElement>
//             <Input
//               pl="35px"
//               height="fit-content"
//               variant="primary"
//               placeholder="Search"
//               onChange={(e: any) => setTaskFilter(e.target.value)}
//             />
//           </InputGroup>
//
//           <OrangeButton
//             text="Add Task"
//             action={() => setAddTask(true)}
//             is_active={addTask}
//           />
//         </Flex>
//         <TasksTable loading={loading} error={error} tasks={tasks} />
//       </Flex>
//       {addTask && (
//         <AddTaskModal
//           taskType={selectedTaskType}
//           close={() => setAddTask(false)}
//         />
//       )}
//     </>
//   );
// }
