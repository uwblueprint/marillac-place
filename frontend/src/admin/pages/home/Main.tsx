// TODO: Refactor this component
import React from "react";
import { Flex, Stack, Text } from "@chakra-ui/react";
import RoomsOverview from "./components/RoomsOverview";
import NoteSection from "./components/NoteSection";
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
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="primary.100"
        px="20px"
        paddingTop="10px"
        paddingBottom="10px"
        mb="20px"
      >
        <Text
          textStyle="web.h2"
          color="#000000"
          px="20px"
          top="10px"
          left="0px"
        >
          Marillac Place Overview
        </Text>
        <Text
          textStyle="web.h3"
          color="#000000"
          px="20px"
          top="14px"
          right="0px"
        >
          {getDate()}
        </Text>
      </Flex>
      <Flex
        w="100%"
        minH="calc(100vh - 70px)"
        paddingLeft="20px"
        paddingBottom="20px"
        flexDir="row"
        gap="20px"
        position="relative"
      >
        <Flex flexDir="column" flex="1" minW="0">
          <RoomsOverview />
          <AnnouncementSection />
        </Flex>
        <Flex w="300px" flexShrink={0} mr="20px">
          <NoteSection />
        </Flex>
      </Flex>
    </>
  );
};

export default AdminHomePage;
