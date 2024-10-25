import React, { useEffect, useState } from "react";
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
import { Add, Search } from "@mui/icons-material";

import TaskModal from "./TaskModal";
import {
  TaskType,
  Task,
  CustomTask,
  ChoreTask,
} from "../../../types/TaskTypes";
import CommonTable, {
  ColumnInfoTypes,
  TableData,
} from "../../common/CommonTable";
import {
  tasksColumnTypes,
  customTasksColumnTypes,
  choreTasksColumnTypes,
} from "./columnKeys";
import {
  requiredTasksMockData,
  optionalTasksMockData,
  customTasksMockData,
  choreTasksMockData,
} from "../../../mocks/tasks"; // TODO: Replace mock data

const TasksPage = (): React.ReactElement => {
  const [requiredTasks, setRequiredTasks] = useState<Task[]>([]);
  const [optionalTasks, setOptionalTasks] = useState<Task[]>([]);
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  const [choreTasks, setChoreTasks] = useState<ChoreTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [taskType, setTaskType] = useState<TaskType>("REQUIRED");
  const [taskData, setTaskData] = useState<TableData[]>([]);
  const [storedTaskData, setStoredTaskData] = useState<TableData[]>([]);
  const [taskDataColumns, setTaskDataColumns] = useState<ColumnInfoTypes[]>([]);

  const [taskFilter, setTaskFilter] = useState<string>("");

  useEffect(() => {
    // TODO: Fetch the task data from the API instead of using mock data
    setRequiredTasks(requiredTasks);
    setOptionalTasks(optionalTasks);
    setCustomTasks(customTasks);
    setChoreTasks(choreTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (taskType === "REQUIRED") {
      setStoredTaskData(requiredTasksMockData);
      setTaskDataColumns(tasksColumnTypes);
    } else if (taskType === "OPTIONAL") {
      setStoredTaskData(optionalTasksMockData);
      setTaskDataColumns(tasksColumnTypes);
    } else if (taskType === "CUSTOM") {
      setStoredTaskData(customTasksMockData);
      setTaskDataColumns(customTasksColumnTypes);
    } else if (taskType === "CHORE") {
      setStoredTaskData(choreTasksMockData);
      setTaskDataColumns(choreTasksColumnTypes);
    }
  }, [taskType]);

  return (
    <Flex flexDir="column" flexGrow={1}>
      <Tabs variant="horizontal" h="30px" mb={6}>
        <TabList pl={6}>
          <Tab
            onClick={() => {
              setTaskType("REQUIRED");
            }}
          >
            Required
          </Tab>
          <Tab
            onClick={() => {
              setTaskType("OPTIONAL");
            }}
          >
            Optional
          </Tab>
          <Tab
            onClick={() => {
              setTaskType("CUSTOM");
            }}
          >
            Custom
          </Tab>
          <Tab
            onClick={() => {
              setTaskType("CHORE");
            }}
          >
            Chores
          </Tab>
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
          <Button
            variant="primary"
            leftIcon={<Icon as={Add} color="white" />}
            size="sm"
            onClick={() => {}}
          >
            {taskType === "CHORE" ? "Add Chore" : "Add Task"}
          </Button>
        </Flex>

        <CommonTable
          data={taskData}
          columnInfo={taskDataColumns}
          maxResults={8}
          onEdit={() => {
            setIsModalOpen(true);
          }}
        />
        <TaskModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      </Flex>
    </Flex>
  );
};

export default TasksPage;
