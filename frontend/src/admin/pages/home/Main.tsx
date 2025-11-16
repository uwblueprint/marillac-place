import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import NoteSection from "./components/NoteSection";
import RoomsOverview from "./components/RoomsOverview";
import AnnouncementSection from "./components/AnnouncementSection";
import { getTodayDateString } from "../../../helpers/formatDateTime";

const AdminHomePage = (): React.ReactElement => {
  return (
    <>
      <Text
        textStyle="web.h2"
        color="#000000"
        zIndex="10"
        position="absolute"
        px="20px"
        top="10px"
        left="0px"
      >
        Marillac Place Overview
      </Text>
      <Text
        textStyle="web.h3"
        color="#000000"
        zIndex="10"
        position="absolute"
        px="20px"
        top="14px"
        right="0px"
      >
        {getTodayDateString()}
      </Text>

      <Flex
        w="100%"
        h="100%"
        flexDir="row"
      >
        <Flex flexDir="column" marginRight="12px" gap="12px" width="calc(100% - 300px)">
          <RoomsOverview />
          <AnnouncementSection />
        </Flex>
        <NoteSection />
      </Flex>
    </>
  );
};

export default AdminHomePage;
