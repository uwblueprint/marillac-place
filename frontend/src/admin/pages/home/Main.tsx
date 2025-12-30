import React from "react";
import { Flex, Stack, Text } from "@chakra-ui/react";
import RoomsOverview from "./components/RoomsOverview";
import NoteSection from "./components/NoteSection";
import AnnouncementSection from "./components/AnnouncementSection";
import { formatDateStringEST } from "../../../helpers/formatDateTime";

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
        alignItems="center"
        px="20px"
        width="100%"
      >
        <Text textStyle="web.h2" color="#000000">
          Marillac Place Overview
        </Text>
        <Text textStyle="web.h3" color="#000000">
          {formatDateStringEST(new Date())}
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
