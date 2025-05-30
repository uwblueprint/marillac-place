import {Button, Flex, Text } from "@chakra-ui/react";
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from "react";
import AddTaskModal from "./elements/AddTaskModal";

export default function AdminTasksPage() {
  const [addTask, setAddTask] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState(() => {
    const type = localStorage.getItem("tasksSelectedType");
    if (!type) return "required";
    return type;
  });

  useEffect(() => {
    localStorage.setItem("tasksSelectedType", selectedTaskType);
    // get required v. optional tasks
  }, [selectedTaskType]);

  return (
    <>
      <Flex
        w="100%"
        justifyContent="flex-start"
        alignItems="center"
        position="absolute"
        top="17px"
        left="0px"
        zIndex={10}
        paddingX="20px"
        gap="10px"
      >
        <Text
          textStyle="web.b1"
          fontWeight="700"
          color={selectedTaskType === "required" ? "primary.700" : "#000000"}
          cursor="pointer"
          onClick={() => setSelectedTaskType("required")}
          borderBottom={selectedTaskType === "required" ? "3px solid" : "0"}
          borderColor="primary.700"
          px="12px"
          pb="12px"
        >
          Required
        </Text>
        <Text
          textStyle="web.b1"
          fontWeight="700"
          color={selectedTaskType === "optional" ? "primary.700" : "#000000"}
          cursor="pointer"
          onClick={() => setSelectedTaskType("optional")}
          borderBottom={selectedTaskType === "optional" ? "3px solid" : "0"}
          borderColor="primary.700"
          px="12px"
          pb="12px"
        >
          Optional
        </Text>
      </Flex>
      <Flex>
        <Button
          variant="primaryFilled"
          fontWeight={700}
          fontSize="12px"
          gap="7px"
          onClick={() => setAddTask(true)}
        >
          <AddIcon style={{
            width: "15px",
            height: "15px",
          }} />
          Add Task
        </Button>
      </Flex>
      { addTask && <AddTaskModal type={selectedTaskType} close={() => setAddTask(false)} /> }
    </>
  )
}