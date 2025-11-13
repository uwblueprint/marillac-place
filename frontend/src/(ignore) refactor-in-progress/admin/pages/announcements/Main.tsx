// TODO: Refactor in progress - ignore for now
import { Flex, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import AnnouncementCard from "./components/AnnouncementCard";
import CreateAnnouncementModal from "./components/CreateAnnouncementModal";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import {
  GET_ALL_ANNOUNCEMENTS,
  GET_ANNOUNCEMENTS_BY_PARTICIPANTS,
  GET_CURRENT_PARTICIPANTS,
} from "../../../gql/example";
import GreenButton from "../../common/buttons/GreenButton";
import OrangeButton from "../../common/buttons/OrangeButton";

export default function AdminAnnouncementsPage() {
  const [create, setCreate] = useState(false);
  const [selectedButtons, setSelectedButtons] = useState<boolean[]>(
    new Array(10).fill(false)
  );
  const [filter, setFilter] = useState(false);

  const {
    data: participantData,
    loading: participantLoading,
    error: participantError,
  } = useQuery(GET_CURRENT_PARTICIPANTS);

  const [getAnnouncementsByParticipants, announcementsByParticipantsResult] =
    useLazyQuery(GET_ANNOUNCEMENTS_BY_PARTICIPANTS);

  const [getAllAnnouncements, allAnnouncementsResult] = useLazyQuery(
    GET_ALL_ANNOUNCEMENTS
  );

  const participantToRoomMap: Record<number, number> = {};
  const roomToParticipantMap: Record<number, number> = {};
  if (participantData?.getCurrentParticipants) {
    for (const participant of participantData.getCurrentParticipants) {
      roomToParticipantMap[participant.room_number] =
        participant.participant_id;
      participantToRoomMap[participant.participant_id] =
        participant.room_number;
    }
  }

  useEffect(() => {
    const trueCount = selectedButtons.filter(Boolean).length;
    if (participantLoading || trueCount === 0 || trueCount === 10) {
      setFilter(false);
      getAllAnnouncements();
      return;
    }

    setFilter(true);
    const selectedRoomNumbers = selectedButtons
      .map((selected, index) => (selected ? index + 1 : null))
      .filter(Boolean) as number[];
    const selectedParticipantIds = selectedRoomNumbers
      .map((roomNumber) => roomToParticipantMap[roomNumber])
      .filter(Boolean);

    console.log(selectedParticipantIds);

    getAnnouncementsByParticipants({
      variables: { participant_ids: selectedParticipantIds },
    });
  }, [selectedButtons, participantLoading]);

  const handleButtonClick = (id: number) => {
    setSelectedButtons((prevSelected: any) => {
      const newSelected = [...prevSelected];
      newSelected[id] = !newSelected[id];
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    setSelectedButtons(new Array(10).fill(true));
  };

  const handleDeselectAll = () => {
    setSelectedButtons(new Array(10).fill(false));
  };

  const announcementLoading =
    (!filter && allAnnouncementsResult.loading) ||
    (filter && announcementsByParticipantsResult.loading);
  const announcementError =
    (!filter && allAnnouncementsResult.error) ||
    (filter && announcementsByParticipantsResult.error);
  const announcementData = filter
    ? announcementsByParticipantsResult.data?.getAnnouncementsByParticipants
    : allAnnouncementsResult.data?.getAllAnnouncements ?? [];

  if (announcementLoading || participantLoading)
    return <Text>Loading announcements...</Text>;
  if (announcementError || participantError)
    return <Text color="red.500">Error loading announcements</Text>;

  return (
    <Flex width="100%" flexDir="column" gap="15px">
      <Flex
        width="100%"
        height="fit-content"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center" gap="15px">
          <Text textStyle="web.h2" color="primary.700">
            Announcements
          </Text>
          <Text textStyle="web.b3" color="text.light.secondary" marginTop="7px">
            Expires in 48h
          </Text>
        </Flex>

        <OrangeButton
          text="Create Announcement"
          action={() => setCreate(true)}
          is_active={create}
        />
      </Flex>

      <Flex alignItems="center" gap="10px">
        <Text
          textStyle="web.s1"
          color="#000000"
          marginRight="5px"
          fontWeight={600}
        >
          Filters:
        </Text>
        {selectedButtons.map((isSelected: any, index: number) => (
          <GreenButton
            key={index}
            text={"Room " + (index + 1)}
            action={() => handleButtonClick(index)}
            is_active={selectedButtons[index]}
          />
        ))}
        <Text
          textStyle="web.s1"
          color="#000000"
          marginLeft="5px"
          fontWeight={600}
          cursor="pointer"
          textDecoration="underline"
          _hover={{ textDecoration: "none" }}
          onClick={() => handleSelectAll()}
        >
          Select All
        </Text>
        <Text
          textStyle="web.s1"
          color="#000000"
          fontWeight={600}
          cursor="pointer"
          textDecoration="underline"
          _hover={{ textDecoration: "none" }}
          onClick={() => handleDeselectAll()}
        >
          Deselect All
        </Text>
      </Flex>

      <Text textStyle="web.b3" color="text.light.secondary">
        Most Recent
      </Text>

      <VStack spacing={4} align="stretch" paddingBottom="20px">
        {announcementData.length === 0 && <Text>No announcements found.</Text>}
        {announcementData.map((announcement: any) => (
          <AnnouncementCard
            key={announcement.announcement_id}
            announcement_id={announcement.announcement_id}
            room={
              announcement.user_announcements.length === 1
                ? `Room ${
                    participantToRoomMap[
                      announcement.user_announcements[0].participant_id
                    ]
                  }`
                : announcement.user_announcements.length === ROOM_NUMBERS.length
                ? "All Rooms"
                : `Rooms ${announcement.user_announcements
                    .map((ua: any) => participantToRoomMap[ua.participant_id])
                    .join(", ")}`
            }
            message={announcement.message}
            timestamp={announcement.creation_date}
            importance={
              announcement.priority === "CRITICAL"
                ? 2
                : announcement.priority === "HIGH"
                ? 1
                : 0
            }
          />
        ))}
      </VStack>

      {create && (
        <CreateAnnouncementModal
          isOpen={create}
          onClose={() => setCreate(false)}
        />
      )}
    </Flex>
  );
}
