import React, { useState, useEffect } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import NoteSection from "./elements/NoteSection";
import AnnouncementSection from "./elements/AnnouncementSection";

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
      <Flex w="100%" h="100%" flexDir="column" minHeight="fit-content" position="relative">
        <AnnouncementSection />
        <NoteSection />
      </Flex>
    </>
  );
};

export default AdminHomePage;
