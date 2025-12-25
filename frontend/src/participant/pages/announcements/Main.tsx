import React, { useContext, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import ParticipantAnnouncementCard from "./components/ParticipantAnnouncementCard";
import AnnouncementsExpandedView from "./components/AnnouncementsExpandedView";
import { GET_RECEIVED_ANNOUNCEMENTS
} from "../../../gql/receivedAnnouncementRequests";
import { ParticipantContext } from "../../ParticipantContext";
import { Priority } from "../../../types/enums";
import GreenOutlineButton from "../../../ui/buttons/GreenOutlineButton";


const FILTER_LABELS = ["ALL", "UNREAD", "PINNED", "IMPORTANT"] as const;

export default function ParticipantsAnnouncementsPage() {
  const participant = useContext(ParticipantContext);
  const participantId = participant?.pid;

  const [expandedView, setExpandedView] = useState(false);
  const [selected, setSelected] = useState({
    uaid: -1,
    allRooms: false,
    message: "",
    importance: -1,
    read: false,
    pinned: false,
    date: "",
  });

  const [filter, setFilter] = useState(0);
  
  // helper function to get variable based on filter
  const getFilterVariables = () => {
    switch(filter){
      case 0: // ALL
        return { pid: participantId};
      case 1: // UNREAD
        return { pid: participantId, unread: true};
      case 2: // PINNED
        return { pid: participantId, pinned: true};
      case 3: // IMPORTANT
        return { pid: participantId, important: true}
      default:
        return { pid: participantId} 
    }
  };

  const { data, loading, error } = useQuery(GET_RECEIVED_ANNOUNCEMENTS, {
    variables : getFilterVariables(),
    skip: !participantId,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });
  
  const announcements = data?.getReceivedAnnouncements ?? [];

  if (loading) return <Text>Loading announcements…</Text>;
  if (error) return <Text color="red.500">Error loading announcements.</Text>;

  if (expandedView && selected) {
    return <AnnouncementsExpandedView announcement={selected}
    onBack={ () => setExpandedView(false)}
    />;
  }

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


      {!data || data.length === 0 ? (
        <Flex>No announcements.</Flex>
      ) : (
        <>
          <Text textStyle="mobile.s1" color="text.light.secondary">
            Most Recent
          </Text>
          {announcements.map((a: any, i: number) => {
            const {
              aid: uaid,
              read,
              pinned,
              announcement: { message, priority, date },
            } = a;

            const allRooms = false;
            const importance = Object.values(Priority).indexOf(priority);

            return (
              <Flex
                key={uaid}
                cursor="pointer"
                onClick={() => {
                  setSelected({
                    uaid,
                    allRooms,
                    message,
                    importance,
                    read,
                    pinned,
                    date,
                  });
                  setExpandedView(true);
                }}
              >
                <ParticipantAnnouncementCard
                  userAnnouncementId={uaid}
                  allRooms={allRooms}
                  message={message}
                  importance={importance}
                  hasRead={read}
                  isPinned={pinned}
                  time={date}
                />
              </Flex>
            );
          })}
        </>
      )}
    </>
  );
}
