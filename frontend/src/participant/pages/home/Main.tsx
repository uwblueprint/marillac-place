import React from "react";
import { Flex } from "@chakra-ui/react";
import HomeContent from "./elements/HomeContent";
import ParticipantPageHeader from "../../common/PageHeader";
import BadgeRow from "./elements/BadgeRow";
import { BadgeRarity } from "../../common/Badge";

export default function ParticipantsHomePage() {
  return (
    <>
      <ParticipantPageHeader currentPage="Home" />
      <HomeContent />
    </>
  );
}
