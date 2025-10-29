import React, { useContext, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import ParticipantAnnouncementCard from "./components/ParticipantAnnouncementCard";
import {
  GET_ANNOUNCEMENTS_BY_PARTICIPANT_ID,
  GET_PARTICIPANT_FILTERED_ANNOUNCEMENTS,
} from "../../../gql/queries";
import { ParticipantContext } from "../../common/ParticipantContext";
import { Priority } from "../../../types/AnnouncementTypes";
import GreenButton from "../../common/GreenButton";
import AnnouncementsExpandedView from "./components/AnnouncementsExpandedView";

// Keep labels stable
const FILTER_LABELS = ["ALL", "UNREAD", "PINNED", "IMPORTANT"] as const;

export default function ParticipantsAnnouncementsPage() {
  const participant = useContext(ParticipantContext);
  const participantId = participant?.id;

  const [expandedView, setExpandedView] = useState(false);
  const [selected, setSelected] = useState({
    uaid: -1,
    allRooms: false,
    message: "",
    importance: -1,
    read: false, 
    pinned: false, 
    date: ""
  })

  const [filter, setFilter] = useState(0);
  const isAll = filter === 0;

  const {
    data: allData,
    loading: allLoading,
    error: allError,
  } = useQuery(GET_ANNOUNCEMENTS_BY_PARTICIPANT_ID, {
    variables: { participant_id: participantId },
    skip: !participantId || !isAll,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: filteredData,
    loading: filteredLoading,
    error: filteredError,
  } = useQuery(GET_PARTICIPANT_FILTERED_ANNOUNCEMENTS, {
    variables: {
      participantId,
      filter: FILTER_LABELS[filter],
    },
    skip: !participantId || isAll,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const loading = isAll ? allLoading : filteredLoading;
  const error = isAll ? allError : filteredError;
  const data = isAll
    ? allData?.getAnnouncementsByParticipantId ?? []
    : filteredData?.getParticipantAnnouncements ?? [];

  if (loading) return <Text>Loading announcements…</Text>;
  if (error) return <Text color="red.500">Error loading announcements.</Text>;

  if (expandedView && selected) {
    return (
      <AnnouncementsExpandedView announcement={selected} />
    )
  }

  return (
    <>
      <Flex w="100%" alignItems="center" justifyContent="center" gap="8px">
        <GreenButton text="All"       action={() => setFilter(0)} is_active={filter === 0} />
        <GreenButton text="Unread"    action={() => setFilter(1)} is_active={filter === 1} />
        <GreenButton text="Pinned"    action={() => setFilter(2)} is_active={filter === 2} />
        <GreenButton text="Important" action={() => setFilter(3)} is_active={filter === 3} />
      </Flex>

      {!data || data.length === 0 ? (
        <Flex>No announcements.</Flex>
      ) : (
        <>
          <Text textStyle="mobile.s1" color="text.light.secondary">
            Most Recent
          </Text>
          {data.map((a: any, i: number) => {
            const uaid = a.announcement_id;
            const allRooms = false;
            const message = isAll ? a.message : a.announcement.message
            const importance = Object.values(Priority).indexOf(isAll ? a.priority : a.announcement.priority)
            const read = isAll ? a.user_announcements.read : a.read
            const pinned = isAll ? a.user_announcements.pinned : a.pinned
            const date = isAll ? a.creation_date : a.announcement.creation_date

            return (
              <Flex key={i} cursor="pointer" onClick={() => {
                setSelected({
                  uaid,
                  allRooms,
                  message, 
                  importance, 
                  read, 
                  pinned, 
                  date
                })
                setExpandedView(true)
              }}>
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
