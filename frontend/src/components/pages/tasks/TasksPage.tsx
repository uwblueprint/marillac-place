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
  Text,
  Icon,
} from "@chakra-ui/react";
import { Add, Search, FileDownloadOutlined } from "@mui/icons-material";
import SideBar from "../../common/SideBar";
import TaskModal from "./TaskModal";
import {
  TaskType,
  Task,
  ChoreTask,
  TaskTypeEnum,
  TaskResponse,
  TaskRequest,
} from "../../../types/TaskTypes";
import CommonTable, {
  ColumnInfoTypes,
  TableData,
} from "../../common/CommonTable";
import { tasksColumnTypes } from "./columnKeys";
import { CREATE_TASK, UPDATE_TASK, DELETE_TASK } from "../../../gql/mutations";
import { GET_TASKS_BY_TYPE } from "../../../gql/queries";
import CheckmarkSvg from "../../../assets/svg/CheckmarkSvg";

const TasksPage = (): React.ReactElement => {
  const [requiredTasks, setRequiredTasks] = useState<Task[]>([]);
  const [optionalTasks, setOptionalTasks] = useState<Task[]>([]);
  const [customTasks, setCustomTasks] = useState<Task[]>([]);
  const [choreTasks, setChoreTasks] = useState<ChoreTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [taskType, setTaskType] = useState<TaskType>(TaskTypeEnum.REQUIRED);
  const [taskData, setTaskData] = useState<TableData[]>([]);
  const [storedTaskData, setStoredTaskData] = useState<TableData[]>([]);
  const [taskDataColumns, setTaskDataColumns] = useState<ColumnInfoTypes[]>([]);

  const [taskFilter, setTaskFilter] = useState<string>("");
  const [modalTask, setModalTask] = useState<TaskResponse | null>(null);

  const daysLongToShort = [
    { long: "MONDAY", short: "M" },
    { long: "TUESDAY", short: "Tu" },
    { long: "WEDNESDAY", short: "W" },
    { long: "THURSDAY", short: "Th" },
    { long: "FRIDAY", short: "F" },
    { long: "SATURDAY", short: "Sa" },
    { long: "SUNDAY", short: "Su" },
  ];
  const { loading, error, data, refetch } = useQuery(GET_TASKS_BY_TYPE, {
    variables: { type: taskType },
  });

  const { data: optionalTasksData, refetch: refetchOptional } = useQuery(
    GET_TASKS_BY_TYPE,
    {
      variables: { type: TaskTypeEnum.OPTIONAL },
      skip: taskType !== TaskTypeEnum.OPTIONAL,
    },
  );

  const { data: customTasksData, refetch: refetchCustom } = useQuery(
    GET_TASKS_BY_TYPE,
    {
      variables: { type: TaskTypeEnum.CUSTOM },
    },
  );

  const [createTask] = useMutation<{ createTask: TaskResponse }>(CREATE_TASK);

  const [updateTask] = useMutation<{
    updateTask: TaskResponse;
  }>(UPDATE_TASK);

  const [deleteTask] = useMutation<{ taskId: number }>(DELETE_TASK);

  const [notification, setNotification] = useState(
    localStorage.getItem("notification"),
  );
  if (notification) {
    setTimeout(() => {
      localStorage.setItem("notification", "");
      setNotification("");
    }, 3000);
  }

  const handleAddTask = async (task: TaskRequest) => {
    try {
      await createTask({
        variables: {
          type: task.type,
          name: task.name,
          recurrencePreference: task.recurrencePreference,
          repeatDays: task.repeatDays,
          timePreference: task.timePreference,
          start: task.start || null,
          end: task.end || null,
          credit: task.credit,
          deduction: task.deduction,
          comment: task.comment || null,
        },
      });
    } catch (e) {
      console.log(e);
    }
    await refetch();
    await refetchOptional();
    await refetchCustom();
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
    if (taskId === "") {
      await handleAddTask(task);
      localStorage.setItem("notification", `Success: "${task.name}" added.`);
    } else {
      await handleUpdateTask(taskId, task);
      localStorage.setItem("notification", `Success: "${task.name}" updated.`);
    }
    window.location.reload();
    await refetch();
    await refetchOptional();
    await refetchCustom();
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask({ variables: { taskId } });
      localStorage.setItem("notification", "Deleted task.");
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
    await refetch();
    await refetchOptional();
    await refetchCustom();
  };

  const formatTaskData = (tasks: Task[]): TableData[] => {
    return tasks.map((task: any) => {
      let assignedDaysText = "";
      const repeatedDayShort = daysLongToShort
        .filter((day) => task.repeatDays.includes(day.long))
        .map((day) => day.short);

      if (task.type === "CUSTOM") assignedDaysText = "Participant Preference";
      else if (task.recurrencePreference === "DAILY")
        assignedDaysText = "Daily";
      else if (task.recurrencePreference === "EVERY_SELECTED_DAYS")
        assignedDaysText = `${repeatedDayShort.join(", ")}.`;
      else if (task.recurrencePreference === "ANY_SELECTED_DAYS")
        assignedDaysText = `Weekly on ${repeatedDayShort.join(", ")}.`;

      return {
        ...task,
        name: task.name,
        repeatDaysString: assignedDaysText,
        end:
          task.type === "CUSTOM"
            ? "Participant Preference"
            : task.end
              ? task.end
              : "Anytime",
        creditString: `$${task.credit}`,
        start:
          task.type === "CUSTOM"
            ? "Participant Preference"
            : task.start
              ? task.start
              : "Anytime",
      };
    });
  };

  useEffect(() => {
    setRequiredTasks(requiredTasks);
    setOptionalTasks([...optionalTasks, ...customTasks]);
    setChoreTasks(choreTasks);
  }, []);

  useEffect(() => {
    if (tabIndex === 0) setTaskType(TaskTypeEnum.REQUIRED);
    else setTaskType(TaskTypeEnum.OPTIONAL);
    refetch();
    refetchOptional();
    refetchCustom();
  }, [tabIndex]);

  useEffect(() => {
    if (taskFilter === "") {
      setTaskData(storedTaskData);
    } else {
      setTaskData(
        storedTaskData.filter(
          (task) =>
            typeof task.name === "string" &&
            task.name.toLowerCase().includes(taskFilter.toLowerCase()),
        ),
      );
    }
  }, [taskFilter, storedTaskData, taskData]);

  useEffect(() => {
    if (taskType === TaskTypeEnum.REQUIRED && data) {
      setRequiredTasks(data.getTasksByType);
      setTaskDataColumns(tasksColumnTypes);
      setStoredTaskData(formatTaskData(data.getTasksByType));
    } else if (
      taskType === TaskTypeEnum.OPTIONAL &&
      optionalTasksData &&
      customTasksData
    ) {
      const optional = optionalTasksData.getTasksByType;
      const custom = customTasksData.getTasksByType;

      const merged = [...optional, ...custom];
      setOptionalTasks(optional);
      setCustomTasks(custom);
      setTaskDataColumns(tasksColumnTypes);
      setStoredTaskData(formatTaskData(merged));
    }
  }, [taskType, data, optionalTasksData, customTasksData]);

  const exportCSV = () => {
    const headers = ["Task Name", "Recurrence", "End Date", "Marillac Bucks"];
    const csvContent = [
      headers.join(","),
      ...taskData.map((task) => {
        return [
          task.name,
          task.repeatDaysString,
          task.end ? task.end : "Never",
          task.credit,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);

    link.setAttribute("download", `tasks.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Flex>
      {notification && notification !== "Deleted task." && (
        <Flex
          position="fixed"
          top="30px"
          left="50%"
          transform="translateX(-50%)"
          border="solid"
          borderColor="#259E29"
          zIndex="1000"
          paddingY="5px"
          paddingX="15px"
          justifyContent="center"
          alignItems="center"
          gap="10px"
          boxShadow="lg"
          bg="#EAFFEB"
          borderRadius="6px"
        >
          <CheckmarkSvg />
          <Text
            color="
          #259E29"
            fontSize="xl"
            fontWeight="500"
            mb="0px"
          >
            {notification}
          </Text>
        </Flex>
      )}
      {notification && notification === "Deleted task." && (
        <Flex
          position="fixed"
          top="30px"
          left="50%"
          transform="translateX(-50%)"
          border="solid"
          borderColor="#B21D2F"
          zIndex="1000"
          paddingY="5px"
          paddingX="15px"
          justifyContent="center"
          alignItems="center"
          gap="10px"
          boxShadow="lg"
          bg="#FEF1F2"
          borderRadius="6px"
        >
          <Text
            color="
          #B21D2F"
            fontSize="xl"
            fontWeight="500"
            mb="0px"
          >
            {notification}
          </Text>
        </Flex>
      )}
      <SideBar />
      <Flex flexDir="column" flexGrow={1}>
        <Tabs
          variant="horizontal"
          h="30px"
          mb={6}
          onChange={(value: any) => {
            setTabIndex(value);
          }}
        >
          <TabList pl={6}>
            <Tab>Required</Tab>
            <Tab>Optional</Tab>
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
                onClick={exportCSV}
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
                Add Task
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
              onDelete={(row: any) => {
                handleDeleteTask(row.taskId);
              }}
              previewModal={false}
            />
          )}
          <TaskModal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            task={modalTask}
            handleSaveClick={handleSaveClick}
            type={taskType}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TasksPage;
