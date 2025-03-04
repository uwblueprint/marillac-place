import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  Flex,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  Tab,
  Icon,
} from "@chakra-ui/react";
import { Add, Search, FileDownloadOutlined } from "@mui/icons-material";
import SideBar from "../../common/SideBar";
import TaskModal from "./TaskModal";
import {
  TaskType,
  Task,
  ChoreTask,
  DaysOfWeek,
  TaskTypeEnum,
  TaskResponse,
  TaskRequest,
} from "../../../types/TaskTypes";
import CommonTable, {
  ColumnInfoTypes,
  TableData,
} from "../../common/CommonTable";
import { tasksColumnTypes, choreTasksColumnTypes } from "./columnKeys";
import { CREATE_TASK, UPDATE_TASK, DELETE_TASK } from "../../../gql/mutations";
import {
  GET_TASKS_BY_TYPE,
  GET_TASKS_BY_START_DATE,
  GET_TASK_BY_ID,
} from "../../../gql/queries";

const TasksPage = (): React.ReactElement => {
  const [requiredTasks, setRequiredTasks] = useState<Task[]>([]);
  const [optionalTasks, setOptionalTasks] = useState<Task[]>([]);
  const [choreTasks, setChoreTasks] = useState<ChoreTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [taskType, setTaskType] = useState<TaskType>("REQUIRED");
  const [taskData, setTaskData] = useState<TableData[]>([]);
  const [storedTaskData, setStoredTaskData] = useState<TableData[]>([]);
  const [taskDataColumns, setTaskDataColumns] = useState<ColumnInfoTypes[]>([
  ]);

  const [taskFilter, setTaskFilter] = useState<string>("");
  const [modalTask, setModalTask] = useState<TaskResponse | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_TASKS_BY_TYPE, {
    variables: { type: taskType },
  });

  const [createTask] = useMutation<{ createTask: TaskResponse }>(CREATE_TASK);

  const [updateTask] = useMutation<{
    updateTask: TaskResponse;
  }>(UPDATE_TASK);

  const [deleteTask] = useMutation<{ taskId: number }>(DELETE_TASK);

  const {
    loading: taskByIdLoading,
    error: taskByIdError,
    data: taskByIdData,
  } = useQuery<{ taskId: number }>(GET_TASK_BY_ID, {
    variables: { taskId: 1 },
  });
  const taskById = React.useMemo(() => {
    return taskByIdData;
  }, [taskByIdData]);

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

  const startDateVar = new Date("2025-02-24T15:30:00Z");
  const {
    loading: tasksByStartDateLoading,
    error: tasksByStartDateError,
    data: taskByStartDateData,
  } = useQuery<{ startDate: Date }>(GET_TASKS_BY_START_DATE, {
    variables: { startDate: startDateVar },
  });
  const tasksByStartDate = React.useMemo(() => {
    return taskByStartDateData;
  }, [taskByStartDateData]);

  const handleAddTask = async (task: TaskRequest) => {
    try {
      await createTask({
        variables: {
          type: task.type,
          name: task.name,
          credit: task.credit,
          start: task.start,
          end: task.end || null,
          isRecurring: task.isRecurring,
          repeatDays: task.repeatDays,
        },
      });
      await refetch();
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateTask = async (taskId: string, task: TaskRequest) => {
    try {
      await updateTask({
        variables: { taskId: parseInt(taskId, 10), ...task },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveClick = async (taskId: string, task: TaskRequest) => {
    // if (taskId === "") {
    //   await handleAddTask(task);
    // } else {
    //   await handleUpdateTask(taskId, task);
    // }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask({ variables: { taskId: parseInt(taskId, 10) } });
      await refetch();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setRequiredTasks(requiredTasks);
    setOptionalTasks(optionalTasks);
    setChoreTasks(choreTasks);
  }, []);

  useEffect(() => {
    if (tabIndex === 0) {
      setTaskType("REQUIRED");
    } else if (tabIndex === 1) {
      setTaskType("OPTIONAL");
    } else {
      setTaskType("CHORE");
    }
  }, [tabIndex]);

  useEffect(() => {
    if (taskFilter === "") {
      setTaskData(storedTaskData);
    } else {
      setTaskData(
        storedTaskData.filter(
          (task) =>
            typeof task.title === "string" &&
            task.title.toLowerCase().includes(taskFilter.toLowerCase()),
        ),
      );
    }
  }, [taskFilter, storedTaskData, taskData]);

  useEffect(() => {
    console.log("taskType Changed.")
    if (data) {
      if (taskType === "REQUIRED") {
        setRequiredTasks(data.getTasksByType);
        setTaskDataColumns(tasksColumnTypes);
      } else if (taskType === "OPTIONAL") {
        console.log("Setting optional tasks to: ", data.getTasksByType);
        setOptionalTasks(data.getTasksByType);
        setTaskDataColumns(tasksColumnTypes);
      } else if (taskType === "CHORE") {
        setChoreTasks(data.getTasksByType);
        setTaskDataColumns(choreTasksColumnTypes);
      }

      setStoredTaskData(
        data.getTasksByType.map((task: any) => {
          return {
            ...task,
            endDate: new Date(task.endDate).toDateString(),
          };
        }),
      );
    }
  }, [taskType]);

  const date = new Date("2025-02-24T15:30:00Z");

  const taskToUpdate: TaskRequest = {
    type: TaskTypeEnum.OPTIONAL,
    name: "Test Front End Update",
    credit: 5,
    start: date,
    end: date,
    isRecurring: true,
    repeatDays: [DaysOfWeek.MONDAY],
  };

  return (
    <Flex>
      {/* <Button onClick={() => tasksByStartDate()}>Click</Button> */}
      <SideBar />
      <Flex flexDir="column" flexGrow={1}>
        <Tabs
          variant="horizontal"
          h="30px"
          mb={6}
          onChange={(value: any) => {
            setTabIndex(value)
          }}
        >
          <TabList pl={6}>
            <Tab>Required</Tab>
            <Tab>Optional</Tab>
            <Tab>Chores</Tab>
          </TabList>
        </Tabs>

        <Flex flexDir="column" flexGrow={1} p="20px">
          <Flex justifyContent="space-between" p="10px">
            <InputGroup w="30%">
              <InputLeftElement pointerEvents="none">
                <Icon as={Search} color="gray.300" />
              </InputLeftElement>
              .
              <Input
                placeholder="Search"
                onChange={(e) => setTaskFilter(e.target.value)}
              />
            </InputGroup>
            <Flex flexDir="row" gap="5px">
              <Button
                variant="secondary"
                leftIcon={<Icon as={FileDownloadOutlined} />}
                size="sm"
                onClick={() => {
                  setModalTask(null);
                  setIsModalOpen(true);
                }}
              >
                Export
              </Button>
              <Button
                variant="primary"
                leftIcon={<Icon as={Add} color="white" />}
                size="sm"
                onClick={() => {
                  setModalTask(null);
                  setIsModalOpen(true);
                }}
              >
                {taskType === "CHORE" ? "Add Chore" : "Add Task"}
              </Button>
            </Flex>
          </Flex>
    
          {loading || error ? (
           <p>Loading...</p>
         ) : ( 
          <CommonTable
            data={taskData}
            columnInfo={taskDataColumns}
            maxResults={8}
            onEdit={(row: any) => {
              setModalTask(row);
              setIsModalOpen(true);
            }}
          />
          )}
          <TaskModal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            task={modalTask}
            handleSaveClick={handleSaveClick}
            handleDeleteTask={modalTask ? handleDeleteTask : undefined}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TasksPage;
