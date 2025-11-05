import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import NoteSection from "./components/NoteSection";
import RoomsOverview from "./components/RoomsOverview";
import AnnouncementSection from "./components/AnnouncementSection";

const AdminHomePage = (): React.ReactElement => {
  const getDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

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
        {getDate()}
      </Text>
      <Flex
        w="100%"
        h="100%"
        flexDir="column"
        minHeight="fit-content"
        position="relative"
      >
        <Flex flexDir="column" w="calc(100% - 300px)" height="100%">
          <RoomsOverview />
          <AnnouncementSection />
        </Flex>
        <NoteSection />
      </Flex>
    </>
  );
};

export default AdminHomePage;
