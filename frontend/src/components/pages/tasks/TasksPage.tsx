export {};
// import React, { useEffect, useState } from "react";
// import {
//   Flex,
//   Input,
//   Button,
//   InputGroup,
//   InputLeftElement,
//   Tabs,
//   TabList,
//   Tab,
//   Icon,
// } from "@chakra-ui/react";
// import { Add, Search } from "@mui/icons-material";
// import { useMutation, useQuery } from "@apollo/client";

// import {
//   CREATE_TASK,
//   UPDATE_TASK,
//   DELETE_TASK,
//   ASSIGN_TASK,
//   CHANGE_TASK_STATUS,
// } from "../../../APIClients/Mutations/TaskMutations";

// import {
//   GET_TASK_BY_ID,
//   GET_TASKS_BY_TYPE,
//   GET_TASKS_BY_ASSIGNEE_ID,
//   GET_TASKS_BY_ASSIGNER_ID,
//   GET_TASKS_BY_START_DATE,
//   GET_TASKS_BY_STATUS,
// } from "../../../APIClients/Queries/TaskQueries";

// import {
//   Status,
//   RecurrenceFrequency,
//   DaysOfWeek,
//   TaskTypeEnum,
//   TaskResponse,
//   TaskRequest,
//   TaskAssignedRequest,
//   TaskAssignedResponse,
// } from "../../../APIClients/Types/TaskType";
// import TaskModal from "./TaskModal";
// import {
//   TaskType,
//   Task,
//   CustomTask,
//   ChoreTask,
// } from "../../../types/TaskTypes";
// import CommonTable, {
//   ColumnInfoTypes,
//   TableData,
// } from "../../common/CommonTable";
// import {
//   tasksColumnTypes,
//   customTasksColumnTypes,
//   choreTasksColumnTypes,
// } from "./columnKeys";
// import {
//   requiredTasksMockData,
//   optionalTasksMockData,
//   customTasksMockData,
//   choreTasksMockData,
// } from "../../../mocks/tasks"; // TODO: Replace mock data

// const TasksPage = (): React.ReactElement => {
//   const [requiredTasks, setRequiredTasks] = useState<Task[]>([]);
//   const [optionalTasks, setOptionalTasks] = useState<Task[]>([]);
//   const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
//   const [choreTasks, setChoreTasks] = useState<ChoreTask[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [tabIndex, setTabIndex] = useState(0);

//   const [taskType, setTaskType] = useState<TaskType>("REQUIRED");
//   const [taskData, setTaskData] = useState<TableData[]>([]);
//   const [storedTaskData, setStoredTaskData] = useState<TableData[]>([]);
//   const [taskDataColumns, setTaskDataColumns] = useState<ColumnInfoTypes[]>([]);

//   const [taskFilter, setTaskFilter] = useState<string>("");
//   const [modalTask, setModalTask] = useState<Task | null>(null);

//   const { loading, error, data, refetch } = useQuery(GET_TASKS_BY_TYPE, {
//     variables: { type: taskType === "CUSTOM" ? "OPTIONAL" : taskType },
//   });

//   const [createTask] = useMutation<{ createTask: TaskResponse }>(CREATE_TASK);

//   const [updateTask] = useMutation<{
//     taskID: number;
//     taskId: TaskResponse;
//   }>(UPDATE_TASK);

//   const [deleteTask] = useMutation<{ taskID: number }>(DELETE_TASK);

//   // const [assignTask] = useMutation<{ assignTask: TaskAssignedResponse }>(
//   //   ASSIGN_TASK,
//   // );

//   // const [changeTaskStatus] = useMutation<{
//   //   taskAssignedID: number;
//   //   status: Status;
//   // }>(CHANGE_TASK_STATUS);

//   // const {
//   //   loading: taskByIdLoading,
//   //   error: taskByIdError,
//   //   data: taskByIdData,
//   // } = useQuery<{ taskId: number }>(GET_TASK_BY_ID, {
//   //   variables: { taskId: 1 },
//   // });
//   // const taskById = React.useMemo(() => {
//   //   return taskByIdData;
//   // }, [taskByIdData]);

//   // const {
//   //   loading: tasksbyTypeLoading,
//   //   error: tasksByTypeError,
//   //   data: tassByTypeData,
//   // } = useQuery<{ type: TaskTypeEnum }>(GET_TASKS_BY_TYPE, {
//   //   variables: {type: TaskTypeEnum.REQUIRED},
//   // });
//   // const tasksByType = React.useMemo(() => {
//   //   return tassByTypeData;
//   // }, [tassByTypeData]);

//   // const {
//   //   loading: tasksByAssigneeIdLoading,
//   //   error: tasksByAssigneeIdError,
//   //   data: tasksByAssigneeIdData,
//   // } = useQuery<{ assigneeId: number }>(GET_TASKS_BY_ASSIGNEE_ID, {
//   //   variables: { assigneeId: 4 },
//   // });
//   // const tasksByAssigneeId = React.useMemo(() => {
//   //   return tasksByAssigneeIdData;
//   // }, [tasksByAssigneeIdData]);

//   // const {
//   //   loading: tasksByAssignerIdLoading,
//   //   error: tasksByAssignerIdError,
//   //   data: tasksByAssignerIdData,
//   // } = useQuery<{ assignerId: number }>(GET_TASKS_BY_ASSIGNER_ID, {
//   //   variables: { assignerId: 6 },
//   // });
//   // const tasksByAssignerId = React.useMemo(() => {
//   //   return tasksByAssignerIdData;
//   // }, [tasksByAssignerIdData]);

//   // const startDateVar = new Date("2011-10-05T14:48:00.000Z");
//   // const {
//   //   loading: tasksByStartDateLoading,
//   //   error: tasksByStartDateError,
//   //   data: taskByStartDateData,
//   // } = useQuery<{ startDate: Date }>(GET_TASKS_BY_START_DATE, {
//   //   variables: { startDate: startDateVar },
//   // });
//   // const tasksByStartDate = React.useMemo(() => {
//   //   return taskByStartDateData;
//   // }, [taskByStartDateData]);

//   // const {
//   //   loading: tasksByStatusLoading,
//   //   error: tasksByStatusError,
//   //   data: tasksByStatusData,
//   // } = useQuery<{ status: Status }>(GET_TASKS_BY_STATUS, {
//   //   variables: { status: Status.ASSIGNED },
//   // });
//   // const tasksByStatus = React.useMemo(() => {
//   //   return tasksByStatusData;
//   // }, [tasksByStatusData]);

//   // const printTasks = () => {
//   //   console.log(taskById);
//   //   console.log(tasksByType);
//   //   console.log(tasksByAssigneeId);
//   //   console.log(tasksByAssignerId);
//   //   console.log(tasksByStartDate);
//   //   console.log(tasksByStatus);
//   // };

//   const handleAddTask = async (task: TaskRequest) => {
//     try {
//       await createTask({ variables: { task } });
//       await refetch();
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const handleUpdateTask = async (taskId: string, task: TaskRequest) => {
//     try {
//       await updateTask({ variables: { taskId: parseInt(taskId, 10), task } });
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const handleSaveClick = async (taskId: string, task: TaskRequest) => {
//     if (taskId === "") {
//       await handleAddTask(task);
//     } else {
//       await handleUpdateTask(taskId, task);
//     }
//   };

//   const handleDeleteTask = async (taskId: string) => {
//     try {
//       await deleteTask({ variables: { taskId } });
//       await refetch();
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   // const handleAssignTask = async () => {
//   //   try {
//   //     const task: TaskAssignedRequest = {
//   //       taskId: 1,
//   //       assigneeId: 4,
//   //       assignerId: 6,
//   //       status: Status.PENDING_APPROVAL,
//   //       startDate: new Date(),
//   //       comments: "asdlkasd",
//   //     };

//   //     await assignTask({ variables: { taskAssigned: task } });
//   //   } catch (e) {
//   //     console.log(e);
//   //   }
//   // };

//   // const handleChangeTaskStatus = async () => {
//   //   try {
//   //     const taskAssignedId = 1;
//   //     const status = Status.ASSIGNED;
//   //     await changeTaskStatus({ variables: { taskAssignedId, status } });
//   //   } catch (e) {
//   //     console.log(e);
//   //   }
//   // };

//   useEffect(() => {
//     setRequiredTasks(requiredTasks);
//     setOptionalTasks(optionalTasks);
//     setCustomTasks(customTasks);
//     setChoreTasks(choreTasks);
//   }, []);

//   useEffect(() => {
//     if (tabIndex === 0) {
//       setTaskType("REQUIRED");
//     } else if (tabIndex === 1) {
//       setTaskType("OPTIONAL");
//     } else if (tabIndex === 2) {
//       setTaskType("CUSTOM");
//     } else {
//       setTaskType("CHORE");
//     }
//   }, [tabIndex]);

//   useEffect(() => {
//     if (taskFilter === "") {
//       setTaskData(storedTaskData);
//     } else {
//       setTaskData(
//         storedTaskData.filter(
//           (task) =>
//             typeof task.title === "string" &&
//             task.title.toLowerCase().includes(taskFilter.toLowerCase()),
//         ),
//       );
//     }
//   }, [taskFilter, storedTaskData, taskData]);

//   useEffect(() => {
//     if (data) {
//       if (taskType === "REQUIRED") {
//         setRequiredTasks(data.getTasksByType);
//         setTaskDataColumns(tasksColumnTypes);
//       } else if (taskType === "OPTIONAL") {
//         setOptionalTasks(data.getTasksByType);
//         setTaskDataColumns(tasksColumnTypes);
//       } else if (taskType === "CUSTOM") {
//         setCustomTasks(data.getTasksByType);
//         setTaskDataColumns(customTasksColumnTypes);
//       } else if (taskType === "CHORE") {
//         setChoreTasks(data.getTasksByType);
//         setTaskDataColumns(choreTasksColumnTypes);
//       }

//       setStoredTaskData(
//         data.getTasksByType.map((task: any) => {
//           return {
//             ...task,
//             endDate: new Date(task.endDate).toDateString(),
//           };
//         }),
//       );
//     }
//   }, [data, taskType]);

//   return (
//     <Flex flexDir="column" flexGrow={1}>
//       <Tabs
//         variant="horizontal"
//         h="30px"
//         mb={6}
//         onChange={(value) => setTabIndex(value)}
//       >
//         <TabList pl={6}>
//           <Tab>Required</Tab>
//           <Tab>Optional</Tab>
//           <Tab>Custom</Tab>
//           <Tab>Chores</Tab>
//         </TabList>
//       </Tabs>

//       <Flex flexDir="column" flexGrow={1} p="20px">
//         <Flex justifyContent="space-between" p="10px">
//           <InputGroup w="30%">
//             <InputLeftElement pointerEvents="none">
//               <Icon as={Search} color="gray.300" />
//             </InputLeftElement>
//             .
//             <Input
//               placeholder="Search"
//               onChange={(e) => setTaskFilter(e.target.value)}
//             />
//           </InputGroup>
//           <Button
//             variant="primary"
//             leftIcon={<Icon as={Add} color="white" />}
//             size="sm"
//             onClick={() => {
//               setModalTask(null);
//               setIsModalOpen(true);
//             }}
//           >
//             {taskType === "CHORE" ? "Add Chore" : "Add Task"}
//           </Button>
//         </Flex>

//         {loading || error ? (
//           <p>Loading...</p>
//         ) : (
//           <CommonTable
//             data={taskData}
//             columnInfo={taskDataColumns}
//             maxResults={8}
//             onEdit={(row: any) => {
//               setModalTask(row);
//               setIsModalOpen(true);
//             }}
//           />
//         )}
//         <TaskModal
//           isOpen={isModalOpen}
//           setIsOpen={setIsModalOpen}
//           task={modalTask}
//           handleSaveClick={handleSaveClick}
//           handleDeleteTask={modalTask ? handleDeleteTask : undefined}
//         />
//       </Flex>
//     </Flex>
//   );
// };

// export default TasksPage;
