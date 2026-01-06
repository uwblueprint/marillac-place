import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TasksTable from "./components/TasksTable";
import { GET_TASKS_BY_TYPE } from "../../../gql/taskRequests";
import OrangeButton from "../../../ui/buttons/OrangeButton";
import { TaskType } from "../../../types/enums";
import { Task } from "../../../types/models";
import { toTitleCase } from "../../../helpers/stringUtils";
import { MagnifyingGlass } from "../../../ui/icons/ActionIcons";
import AddTaskModal from "./components/AddTaskModal";

export default function AdminTasksPage() {
  const location = useLocation();
  const { taskType } = location.state || { taskType: TaskType.REQUIRED };
  const [selectedTaskType, setSelectedTaskType] = useState(taskType);
  const [taskFilter, setTaskFilter] = useState("");
  const [addTask, setAddTask] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { loading, error, data, refetch } = useQuery(GET_TASKS_BY_TYPE, {
    variables: { type: selectedTaskType },
  });

  useEffect(() => {
    refetch();
  }, [selectedTaskType]);

  useEffect(() => {
    const filteredTasks = data?.getTasksByType?.filter((task: Task) =>
      task.name.toLowerCase().includes(taskFilter.toLowerCase())
    );
    setTasks(filteredTasks ?? []);
  }, [data, taskFilter]);

  return (
    <>
      <Flex
        w="100%"
        justifyContent="flex-start"
        alignItems="center"
        position="absolute"
        top="18px"
        left="0px"
        zIndex={10}
        paddingX="20px"
        gap="10px"
      >
        {[TaskType.REQUIRED, TaskType.OPTIONAL].map((type: TaskType) => (
          <Text
            key={type}
            textStyle="web.b1"
            fontWeight="700"
            color={selectedTaskType === type ? "primary.700" : "#000000"}
            cursor="pointer"
            onClick={() => setSelectedTaskType(type)}
            borderBottom="3px solid"
            borderColor={
              selectedTaskType === type ? "primary.700" : "transparent"
            }
            px="12px"
            pb="10px"
          >
            {toTitleCase(type)}
          </Text>
        ))}
      </Flex>

      <Flex w="100%" h="fit-content" flexDir="column" gap="10px">
        <Flex w="100%" justifyContent="space-between" gap="10px">
          <InputGroup>
            <InputLeftElement pb="7px" pl="3px">
              <MagnifyingGlass color="text.light.secondary" size={14} />
            </InputLeftElement>
            <Input
              placeholder="Search"
              type="text"
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value)}
              width="250px"
              height="fit-content"
              paddingX="12px"
              paddingY="6px"
              border="1px"
              borderColor="neutral.300"
              borderRadius="8px"
              fontFamily="Nunito"
              fontWeight="400"
              fontSize="12px"
              color="text.light.primary"
              _focus={{
                borderColor: "neutral.300",
                boxShadow: "none",
              }}
            />
          </InputGroup>

          <OrangeButton
            label="Add Task"
            action={() => setAddTask(true)}
            is_active={addTask}
          />
        </Flex>

        <TasksTable
          taskType={selectedTaskType}
          loading={loading}
          error={error}
          tasks={tasks}
          refetch={refetch}
        />
      </Flex>

      {addTask && (
        <AddTaskModal
          taskType={selectedTaskType}
          close={() => setAddTask(false)}
          refetch={refetch}
        />
      )}
    </>
  );
}
