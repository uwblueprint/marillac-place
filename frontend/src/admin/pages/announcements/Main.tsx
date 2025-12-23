import { Flex, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState, useContext } from "react";
import { useLazyQuery } from "@apollo/client";
import AnnouncementCard from "./components/AnnouncementCard";
import CreateAnnouncementModal from "./components/CreateAnnouncementModal";
import { GET_ANNOUNCEMENTS_SENT_TO_PARTICIPANTS } from "../../../gql/announcementRequests";
import GreenOutlineButton from "../../../ui/buttons/GreenOutlineButton";
import OrangeButton from "../../../ui/buttons/OrangeButton";
import { AdminContext } from "../../AdminContext";
import LoadingScreen from "../../../ui/screens/LoadingScreen";
import ErrorScreen from "../../../ui/screens/ErrorScreen";
import UnderlineButton from "../../../ui/buttons/UnderlineButton";
import { getRoomString } from "../../../helpers/stringUtils";
import { formatDateTimeString } from "../../../helpers/formatDateTime";

export default function AdminAnnouncementsPage() {
  const [create, setCreate] = useState(false);
  const [selectedButtons, setSelectedButtons] = useState<boolean[]>(
    new Array(10).fill(false)
  );

  const [getAllAnnouncements, { 
    loading: getAllAnnouncementsLoading, 
    error: getAllAnnouncementsError, 
    data: getAllAnnouncementsData,
    refetch: refetchAllAnnouncements
  }] = useLazyQuery(GET_ANNOUNCEMENTS_SENT_TO_PARTICIPANTS);

  const { roomToParticipant } = useContext(AdminContext);

  useEffect(() => {
    const selectedRoomNumbers = selectedButtons
      .map((selected, index) => (selected ? index + 1 : null))
      .filter(Boolean) as number[];

    if (selectedRoomNumbers.length === 0) {
      const allPids = Object.values(roomToParticipant);
      getAllAnnouncements({
        variables: { pids: allPids },
      });
      return;
    }

    const selectedParticipantIds = selectedRoomNumbers
      .map((roomNumber) => roomToParticipant[roomNumber])
      .filter(Boolean) as number[];

    getAllAnnouncements({
      variables: { pids: selectedParticipantIds },
    });
  }, [selectedButtons, roomToParticipant]);

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

  if (getAllAnnouncementsLoading) return <LoadingScreen />;
  if (getAllAnnouncementsError) return <ErrorScreen message={getAllAnnouncementsError.message} />;

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
            Expires in 7 days
          </Text>
        </Flex>

        <OrangeButton
          label="Create Announcement"
          action={() => setCreate(true)}
          is_active={create}
        />
      </Flex>

      <Flex alignItems="center" gap="15px">
        <Text
          textStyle="web.s1"
          color="#000000"
          fontWeight={600}
        >
          Filters:
        </Text>
        <Flex alignItems="center" gap="5px">
          {selectedButtons.map((isSelected: boolean, index: number) => (
            <GreenOutlineButton
              key={index}
              label={"Room " + (index + 1)}
              action={() => handleButtonClick(index)}
              is_active={isSelected}
            />
          ))}
        </Flex>
        <UnderlineButton
          label="Select All"
          action={() => handleSelectAll()}
        />
        <UnderlineButton
          label="Deselect All"
          action={() => handleDeselectAll()}
        />
      </Flex>

      <Text textStyle="web.b3" color="text.light.secondary">
        Most Recent
      </Text>

      <VStack spacing={4} align="stretch" paddingBottom="20px">
        {getAllAnnouncementsData?.getAnnouncementsSentToParticipants.map((announcement: any) => (
          <AnnouncementCard
            key={announcement.aid}
            announcement_id={announcement.aid}
            room={getRoomString(announcement)}
            message={announcement.message}
            timestamp={formatDateTimeString(announcement.date)}
            priority={announcement.priority}
            refetch={refetchAllAnnouncements}
          />
        ))}
      </VStack>

      {create && (
        <CreateAnnouncementModal
          refetch={refetchAllAnnouncements}
          onClose={() => setCreate(false)}
        />
      )}
    </Flex>
  );
}
