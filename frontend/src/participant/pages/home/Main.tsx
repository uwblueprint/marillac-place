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
  if (pid === -1) return <ErrorScreen message="Something is wrong. Please try again later." />;

  return (
    <>
      <Flex w="100%" flexDir="column" mb="16px" gap="4px">
        <Text color="primary.700" textStyle="mobile.h1">
          Welcome to Marillac Place
        </Text>
        <Text color="text.light.secondary" textStyle="mobile.h3">
          {formatDateV8(new Date())}
        </Text>
      </Flex>
      
      <Flex w="100%" flexDir="column" gap="16px">
        <TasksCompletedWidget pid={pid} />
        <NewAchievedBadgesWidget pid={pid} />
        <TodoListWidget pid={pid} />
        <AnnouncementWidget pid={pid} />
      </Flex>
    </>
  );
}
