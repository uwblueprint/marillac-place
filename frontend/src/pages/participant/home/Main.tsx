import React from "react";
import { Flex } from "@chakra-ui/react";
import ParticipantPageHeader from "../../../components/participant/PageHeader";
import AnnouncementWidget from "./elements/AnnouncementWidget";

export default function ParticipantsHomePage() {
  return (
    <Flex flexDir="column" alignItems="center">
      <ParticipantPageHeader currentPage="Home" />

      <Flex flexDir="column" alignItems="center" padding="24px" width="100%">
        <AnnouncementWidget />
      </Flex>
    </Flex>
  );
}
