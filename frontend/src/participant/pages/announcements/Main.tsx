import React, { useState } from "react";
import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import ParticipantPageHeader from "../../../common/participant/PageHeader";
import ParticipantAnnouncementCard from "./elements/ParticipantAnnouncementCard";

export default function ParticipantsAnnouncementsPage() {
  const [filter, setFilter] = useState(0);
  return (
    <>
      <ParticipantPageHeader currentPage="Announcements" />
      <Flex w="100%" padding="20px" flexDir="column" gap="15px">
        <Flex w="100%" alignItems="center" justifyContent="center" gap="5px">
          <Button
            variant="secondaryOutlineMobile"
            isActive={filter === 0}
            onClick={() => setFilter(0)}
          >
            All
          </Button>
          <Button
            variant="secondaryOutlineMobile"
            isActive={filter === 1}
            onClick={() => setFilter(1)}
          >
            Unread
          </Button>
          <Button
            variant="secondaryOutlineMobile"
            isActive={filter === 2}
            onClick={() => setFilter(2)}
          >
            Pinned
          </Button>
          <Button
            variant="secondaryOutlineMobile"
            isActive={filter === 3}
            onClick={() => setFilter(3)}
          >
            Important
          </Button>
        </Flex>
        <Text textStyle="mobile.c1" color="text.light.secondary">
          Most Recent
        </Text>
        <ParticipantAnnouncementCard
          allRooms
          message="Reminding you about your social this Monday, remember to bring everything you need for this activity! Things to bring include sunscreen, water, bug repellent, running shoes, hair ties and anything else you deem necessary."
          importance={1}
          hasRead={false}
          isPinned
          time="7:00pm, June 1"
        />
      </Flex>
    </>
  );
}
