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

  const [taskType, setTaskType] = useState<TaskType>("REQUIRED");
  const [taskData, setTaskData] = useState<TableData[]>([]);
  const [taskDataColumns, setTaskDataColumns] = useState<ColumnInfoTypes[]>([]);

  useEffect(() => {
    // TODO: Fetch the task data from the API instead of using mock data
    setRequiredTasks(requiredTasks);
    setOptionalTasks(optionalTasks);
    setCustomTasks(customTasks);
    setChoreTasks(choreTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (taskType === "REQUIRED") {
      setTaskData(requiredTasksMockData);
      setTaskDataColumns(tasksColumnTypes);
    } else if (taskType === "OPTIONAL") {
      setTaskData(optionalTasksMockData);
      setTaskDataColumns(tasksColumnTypes);
    } else if (taskType === "CUSTOM") {
      setTaskData(customTasksMockData);
      setTaskDataColumns(customTasksColumnTypes);
    } else if (taskType === "CHORE") {
      setTaskData(choreTasksMockData);
      setTaskDataColumns(choreTasksColumnTypes);
    }
  }, [taskType]);

  return (
    <Flex display="flex" flexDirection="column" width="100%">
      <Tabs variant="horizontal" width="100%" height="20px" mb={6}>
        <TabList>
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

      <Flex flexDirection="column" flexGrow={1} padding="20px">
        <Flex justifyContent="space-between" padding="10px">
          <InputGroup width="30%">
            <InputLeftElement pointerEvents="none">
              <Icon as={Search} color="gray.300" />
            </InputLeftElement>
            <Input placeholder="Search" />
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
          onEdit={() => {}}
        />
      </Flex>
    </Flex>
  );
};

export default TasksPage;
