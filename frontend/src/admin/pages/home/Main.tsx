import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import RoomsOverview from "./components/RoomsOverview";
import NoteSection from "./components/NoteSection";
import AnnouncementSection from "./components/AnnouncementSection";
import { formatDateV1 } from "../../../helpers/formatDateTime";

const AdminHomePage = (): React.ReactElement => {
  return (
    <>
      <Flex
        position="absolute"
        top="12px"
        left="0px"
        zIndex="100"
        direction="row"
        justifyContent="space-between"
        alignItems="baseline"
        px="20px"
        width="100%"
      >
        <Text textStyle="h1" color="text.dark">
          Marillac Place Overview
        </Text>
        <Text textStyle="h3" color="text.dark">
          {formatDateV1(new Date())}
        </Text>
      </Flex>

      <Flex w="100%" h="100%" flexDir="row" position="relative" gap="10px">
        <Flex flexDir="column" flex="1" gap="10px">
          <RoomsOverview />
          <AnnouncementSection />
        </Flex>
        <Flex w="275px" flexShrink={0}>
          <NoteSection />
        </Flex>
      </Flex>
    </>
  );
};

export default AdminHomePage;
