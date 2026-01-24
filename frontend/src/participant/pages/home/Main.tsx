import React, { useContext } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { formatDateV8 } from "../../../helpers/formatDateTime";
import { ParticipantContext } from "../../ParticipantContext";
import ErrorScreen from "../../../ui/screens/ErrorScreen";
import TasksCompletedWidget from "./components/TasksCompletedWidget";
import NewAchievedBadgesWidget from "./components/NewAchievedBadgesWidget";
import TodoListWidget from "./components/TodoListWidget";
import AnnouncementWidget from "./components/AnnouncementWidget";

export default function ParticipantsHomePage() {
  const { pid } = useContext(ParticipantContext);
  if (pid === -1)
    return (
      <ErrorScreen message="Something is wrong. Please try again later." />
    );

  return (
    <>
      <Flex w="100%" flexDir="column" mb="12px" gap="4px">
        <Text color="brand.primaryDark" textStyle="h2">
          Welcome to Marillac Place
        </Text>
        <Text color="text.medium" textStyle="h4">
          {formatDateV8(new Date())}
        </Text>
      </Flex>

      <Flex w="100%" flexDir="column" gap="8px">
        <TasksCompletedWidget pid={pid} />
        <NewAchievedBadgesWidget pid={pid} />
        <TodoListWidget pid={pid} />
        <AnnouncementWidget pid={pid} />
      </Flex>
    </>
  );
}
