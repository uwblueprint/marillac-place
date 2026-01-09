import React, { useContext, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import ParticipantAnnouncementCard from "./components/ParticipantAnnouncementCard";
import AnnouncementsExpandedView from "./components/AnnouncementsExpandedView";
import { GET_RECEIVED_ANNOUNCEMENTS } from "../../../gql/receivedAnnouncementRequests";
import { ParticipantContext } from "../../ParticipantContext";
import { Priority } from "../../../types/enums";
import GreenOutlineButton from "../../../ui/buttons/GreenOutlineButton";
import { ReceivedAnnouncement } from "../../../types/models";

export default function ParticipantsAnnouncementsPage() {
  const participant = useContext(ParticipantContext);
  const participantId = participant.pid;

  const [expandedView, setExpandedView] = useState(false);
  const [selected, setSelected] = useState<ReceivedAnnouncement | null>(null);

  const [filter, setFilter] = useState(0);
  const getFilterVariables = () => {
    switch(filter){
      case 0: // ALL
        return { pid: participantId };
      case 1: // UNREAD
        return { pid: participantId, unread: true };
      case 2: // PINNED
        return { pid: participantId, pinned: true };
      case 3: // IMPORTANT
        return { pid: participantId, important: true };
      default:
        return { pid: participantId };
    }
  };

  const { data, loading, error } = useQuery(GET_RECEIVED_ANNOUNCEMENTS, {
    variables : getFilterVariables(),
    skip: !participantId,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  if (loading) return <Text>Loading announcements…</Text>;
  if (error) return <Text color="red.500">Error loading announcements.</Text>;

  return (
    <>
      <Flex w="100%" alignItems="center" justifyContent="center" gap="8px">
        <GreenOutlineButton
          label="All"
          action={() => setFilter(0)}
          is_active={filter === 0}
        />
        <GreenOutlineButton
          label="Unread"
          action={() => setFilter(1)}
          is_active={filter === 1}
        />
        <GreenOutlineButton
          label="Pinned"
          action={() => setFilter(2)}
          is_active={filter === 2}
        />
        <GreenOutlineButton
          label="Important"
          action={() => setFilter(3)}
          is_active={filter === 3}
        />
      </Flex>

      <Text textStyle="mobile.s1" color="text.light.secondary">
        Most Recent
      </Text>
      
      {data?.getReceivedAnnouncements.map((announcement: ReceivedAnnouncement, index: number) => {
        return (
          <Flex
            key={index}
            cursor="pointer"
            onClick={() => {
              setSelected(announcement);
              setExpandedView(true);
            }}
          >
            <ParticipantAnnouncementCard announcement={announcement} />
          </Flex>
        );
      })}
    </>
  );
}
