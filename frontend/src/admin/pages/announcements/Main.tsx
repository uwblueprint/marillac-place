import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { ROOM_NUMBERS } from "../../../constants/rooms";
import {
  GET_ANNOUNCEMENTS_FROM_TODAY,
  GET_ANNOUNCEMENTS_SENT_TO_PARTICIPANTS,
} from "../../../gql/announcementRequests";
import { GET_CURRENT_PARTICIPANTS } from "../../../gql/participantRequests";
import AnnouncementCard, {
  AnnouncementDisplay,
} from "./components/AnnouncementCard";
import CreateAnnouncementModal from "./components/CreateAnnouncementModal";
import WidgetContainer from "../../../ui/containers/WidgetContainer";
import GreenOutlineButton from "../../../ui/buttons/GreenOutlineButton";
import OrangeButton from "../../../ui/buttons/OrangeButton";
import UnderlineButton from "../../../ui/buttons/UnderlineButton";
import { Announcement, Participant, ReceivedAnnouncement } from "../../../types/models";
import { Priority } from "../../../types/enums";

const getRoomLabel = (rooms: number[]) => {
  if (rooms.length === 0) return "All Rooms";
  if (rooms.length === 1) return `Room ${rooms[0]}`;
  if (rooms.length === ROOM_NUMBERS.length) return "All Rooms";
  return `Rooms ${rooms.join(", ")}`;
};

const AdminAnnouncementsPage = (): React.ReactElement => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [lastFilterPids, setLastFilterPids] = useState<number[] | null>(null);

  const {
    data: participantsData,
    loading: participantsLoading,
    error: participantsError,
  } = useQuery<{ getCurrentParticipants: Participant[] }>(GET_CURRENT_PARTICIPANTS);

  const {
    data: baseAnnouncementsData,
    loading: baseAnnouncementsLoading,
    error: baseAnnouncementsError,
    refetch: refetchBaseAnnouncements,
  } = useQuery<{ getAnnouncementsFromToday: Announcement[] }>(GET_ANNOUNCEMENTS_FROM_TODAY, {
    fetchPolicy: "cache-and-network",
  });

  const [
    fetchAnnouncementsForParticipants,
    {
      data: filteredAnnouncementsData,
      loading: filteredAnnouncementsLoading,
      error: filteredAnnouncementsError,
      refetch: refetchFilteredAnnouncements,
    },
  ] = useLazyQuery<{ getAnnouncementsSentToParticipants: Announcement[] }>(
    GET_ANNOUNCEMENTS_SENT_TO_PARTICIPANTS,
    {
      fetchPolicy: "network-only",
    },
  );

  const participants: Participant[] = participantsData?.getCurrentParticipants ?? [];

  const participantsByPid = useMemo(() => {
    const mapping: Record<number, Participant> = {};
    participants.forEach((participant) => {
      mapping[participant.pid] = participant;
    });
    return mapping;
  }, [participants]);

  const participantsByRoom = useMemo(() => {
    const mapping: Record<number, Participant> = {};
    participants.forEach((participant) => {
      if (participant.room !== undefined && participant.room !== null) {
        mapping[participant.room] = participant;
      }
    });
    return mapping;
  }, [participants]);

  const isAllSelected = selectedRooms.length === ROOM_NUMBERS.length;
  const isFiltering = selectedRooms.length > 0 && !isAllSelected;

  const selectedRoomPids = useMemo(() => {
    if (!isFiltering) {
      return [];
    }
    return selectedRooms
      .map((room) => participantsByRoom[room]?.pid)
      .filter((pid): pid is number => typeof pid === "number");
  }, [isFiltering, selectedRooms, participantsByRoom]);

  const roomsWithoutParticipants = useMemo(() => {
    if (!isFiltering) {
      return [];
    }
    return selectedRooms.filter((room) => !participantsByRoom[room]);
  }, [isFiltering, selectedRooms, participantsByRoom]);

  useEffect(() => {
    if (!isFiltering) {
      setLastFilterPids(null);
      return;
    }
    if (participantsLoading) {
      return;
    }
    if (selectedRoomPids.length === 0) {
      setLastFilterPids([]);
      return;
    }
    setLastFilterPids(selectedRoomPids);
    fetchAnnouncementsForParticipants({
      variables: { pids: selectedRoomPids },
    });
  }, [
    isFiltering,
    selectedRoomPids,
    fetchAnnouncementsForParticipants,
    participantsLoading,
  ]);

  const announcementsRaw: Announcement[] = useMemo(() => {
    if (isFiltering) {
      if (selectedRoomPids.length === 0) {
        return [];
      }
      return filteredAnnouncementsData?.getAnnouncementsSentToParticipants ?? [];
    }
    return baseAnnouncementsData?.getAnnouncementsFromToday ?? [];
  }, [
    isFiltering,
    selectedRoomPids.length,
    filteredAnnouncementsData,
    baseAnnouncementsData,
  ]);

  const announcements: AnnouncementDisplay[] = useMemo(() => {
    return announcementsRaw.map((announcement) => {
      const received: ReceivedAnnouncement[] = announcement.ReceivedAnnouncement ?? [];
      const rooms = new Set<number>();

      received.forEach((entry: ReceivedAnnouncement) => {
        if (entry?.participant?.room !== undefined && entry?.participant?.room !== null) {
          rooms.add(entry.participant.room);
          return;
        }
        const participant = entry?.pid ? participantsByPid[entry.pid] : undefined;
        if (participant?.room !== undefined && participant?.room !== null) {
          rooms.add(participant.room);
        }
      });

      const roomList = Array.from(rooms).sort((a, b) => a - b);

      return {
        aid: announcement.aid,
        roomLabel: getRoomLabel(roomList),
        message: announcement.message,
        date: announcement.date,
        priority: announcement.priority ?? Priority.NORMAL,
      };
    });
  }, [announcementsRaw, participantsByPid]);

  const isLoading =
    participantsLoading ||
    baseAnnouncementsLoading ||
    (isFiltering && selectedRoomPids.length > 0 && filteredAnnouncementsLoading);

  const errorMessage =
    participantsError?.message ??
    (!isFiltering ? baseAnnouncementsError?.message : undefined) ??
    (isFiltering && selectedRoomPids.length > 0
      ? filteredAnnouncementsError?.message
      : undefined);

  const refreshAnnouncements = useCallback(async () => {
    await refetchBaseAnnouncements();
    if (isFiltering && lastFilterPids && lastFilterPids.length > 0 && refetchFilteredAnnouncements) {
      await refetchFilteredAnnouncements({ pids: lastFilterPids });
    }
  }, [refetchBaseAnnouncements, isFiltering, lastFilterPids, refetchFilteredAnnouncements]);

  const handleToggleRoom = (room: number) => {
    setSelectedRooms((prev) => {
      if (prev.includes(room)) {
        return prev.filter((r) => r !== room);
      }
      return [...prev, room].sort((a, b) => a - b);
    });
  };

  const handleSelectAll = () => {
    setSelectedRooms([...ROOM_NUMBERS]);
  };

  const handleClearFilters = () => {
    setSelectedRooms([]);
  };

  return (
    <Flex width="100%" flexDir="column" gap="20px">
      <Flex
        width="100%"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center" gap="15px">
          <Text textStyle="web.h2" color="primary.700">
            Announcements
          </Text>
          <Text textStyle="web.b3" color="text.light.secondary" marginTop="5px">
            Expires in 48h
          </Text>
        </Flex>

        <OrangeButton
          label="Create Announcement"
          action={() => setIsCreateOpen(true)}
          is_active={isCreateOpen}
        />
      </Flex>

      <Flex alignItems="center" gap="10px" flexWrap="wrap">
        <Text textStyle="web.s1" color="#000000" fontWeight={600}>
          Filters:
        </Text>
        {ROOM_NUMBERS.map((room: number) => (
          <GreenOutlineButton
            key={room}
            label={`Room ${room}`}
            action={() => handleToggleRoom(room)}
            is_active={selectedRooms.includes(room)}
          />
        ))}
        <UnderlineButton label="Select All" action={handleSelectAll} />
        <UnderlineButton label="Clear Filters" action={handleClearFilters} />
      </Flex>

      <WidgetContainer
        width="100%"
        paddingX="16px"
        paddingY="16px"
        loading={isLoading}
        error={errorMessage}
      >
        <Flex width="100%" flexDir="column" gap="12px">
          {roomsWithoutParticipants.length > 0 && (
            <Text textStyle="web.b3" color="#E30000">
              Rooms {roomsWithoutParticipants.join(", ")} currently have no participants.
            </Text>
          )}

          {announcements.length === 0 ? (
            <Text textStyle="web.b2" color="text.light.secondary">
              No announcements found.
            </Text>
          ) : (
            announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.aid}
                announcement={announcement}
                onAnnouncementUpdated={refreshAnnouncements}
              />
            ))
          )}
        </Flex>
      </WidgetContainer>

      <CreateAnnouncementModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        participants={participants}
        onAnnouncementCreated={refreshAnnouncements}
      />
    </Flex>
  );
};

export default AdminAnnouncementsPage;
