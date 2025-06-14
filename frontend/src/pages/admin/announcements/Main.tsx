import { Flex, Text, Button, VStack } from "@chakra-ui/react";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import AnnouncementCard from "./elements/AnnouncementCard";
import CreateAnnouncementModal from "./elements/CreateAnnouncementModal";
import EditAnnouncementModal from "./elements/EditAnnouncementModal";

const GET_ALL_ANNOUNCEMENTS = gql`
  query GetAllAnnouncements {
    getAllAnnouncements {
      announcement_id
      priority
      creation_date
      message
      user_announcements {
        participant_id
        read
        pinned
      }
    }
  }
`;

export default function AdminAnnouncementsPage() {
  const [create, setCreate] = useState(false);
  const [selectedButtons, setSelectedButtons] = useState<boolean[]>(
    new Array(10).fill(false)
  );

  const [currentAnnouncement, setCurrentAnnouncement] = useState({
    id: 3,
    priority: "NORMAL",
    message: "another test successful",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, loading, error } = useQuery(GET_ALL_ANNOUNCEMENTS);

  const onEdit = (announcement: { id: number; priority: string; message: string }) => {
    setCurrentAnnouncement(announcement);
    setIsModalOpen(true);
  };

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

  if (loading) return <Text>Loading announcements...</Text>;
  if (error) return <Text color="red.500">Error loading announcements</Text>;

  // Map announcements to your UI data shape
  // Here I’m guessing the room as "All Rooms" for simplicity; adapt as needed
  const announcements = data?.getAllAnnouncements ?? [];

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
        <Button
          variant="primaryFilled"
          fontWeight={700}
          fontSize="12px"
          gap="7px"
          onClick={() => setCreate(true)}
        >
          <AddIcon
            style={{
              width: "15px",
              height: "15px",
            }}
          />
          Create Announcement
        </Button>
      </Flex>

      <Flex alignItems="center" gap="10px">
        <Text textStyle="web.s1" color="#000000" marginRight="5px" fontWeight={600}>
          Filters:
        </Text>
        {selectedButtons.map((isSelected: any, index: number) => (
          <Button
            key={index}
            onClick={() => handleButtonClick(index)}
            isActive={selectedButtons[index]}
            borderRadius="8px"
            border="1px"
            borderColor="#0C727E"
            bg="#FFFFFF"
            color="#0C727E"
            cursor="pointer"
            height="fit-content"
            paddingX="10px"
            paddingY="6px"
            _hover={{
              color: "#FFFFFF",
              bg: "#0C727E",
            }}
            _active={{
              color: "#FFFFFF",
              bg: "#0C727E",
            }}
          >
            <Text textStyle="web.s1" color="inherit">
              Room {index + 1}
            </Text>
          </Button>
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
        {announcements.length === 0 && (
          <Text>No announcements found.</Text>
        )}
        {announcements.map((announcement: any) => (
          <AnnouncementCard
            key={announcement.announcement_id}
            announcement_id={announcement.announcement_id}
            room="Room 1"
            message={announcement.message}
            timestamp={new Date(announcement.creation_date).toLocaleString()}
            importance={
              announcement.priority === "HIGH" ? 2 : announcement.priority === "NORMAL" ? 1 : 0
            }
            // onEdit={() => onEdit(announcement)}
          />
        ))}
      </VStack>

      {create && <CreateAnnouncementModal isOpen={create} onClose={() => setCreate(false)} />}
      <EditAnnouncementModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        announcementId={currentAnnouncement.id}
        initialMessage={currentAnnouncement.message}
        initialPriority={currentAnnouncement.priority}
      />
    </Flex>
  );
}
