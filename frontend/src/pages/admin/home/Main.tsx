import React, { useState, useEffect } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import NoteSection from "./elements/NoteSection";

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
    <Flex w="100%" h="100%" flexDir="column" minHeight="fit-content" position="relative">

      <NoteSection />
    </Flex>
  );
};

export default AdminHomePage;
