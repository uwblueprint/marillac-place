// export {};
// TODO: Refactor in progress
import React from "react";
import { Flex, Text } from "@chakra-ui/react";
// import HomeContent from "./components/HomeContent";
// import ParticipantPageHeader from "../../common/PageHeader";
// import BadgeRow from "./components/BadgeRow";
// import { BadgeRarity } from "../../common/Badge";
import TodoListWidget from "./components/TodoListWidget";
import { getTodayDateString } from "../../../helpers/formatDateTime";
import AnnouncementWidget from "./components/AnnouncementWidget";

export default function ParticipantsHomePage() {
  return (
    <>
      <Flex w="100%" flexDir="column" mb="12px">
        <Text color="primary.700" textStyle="mobile.h1">
          Welcome to Marillac Place
        </Text>
        <Text color="text.light.secondary" textStyle="mobile.h3">
          {getTodayDateString()}
        </Text>
      </Flex>

      <TodoListWidget />
      <AnnouncementWidget />
    </>
  );
}
