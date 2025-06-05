import { Flex, Text, Button, VStack } from "@chakra-ui/react";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import AnnouncementCard from "./elements/AnnouncementCard";
import CreateAnnouncementModal from "./elements/CreateAnnouncementModal";

export default function AdminAnnouncementsPage() {
  const [create, setCreate] = useState(false);
  const [selectedButtons, setSelectedButtons] = useState<boolean[]>(
    new Array(10).fill(false)
  ); // Keeping track of buttons on and off

  const handleButtonClick = (id: number) => {
    setSelectedButtons((prevSelected) => {
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

  const sampleAnnouncementCardData = [
    {
      room: "Room 3",
      message:
        "Reminding you about your meeting this Saturday! Please be on time, we will be beginning promptly at 10:30am. If you are unable to attend, please let us know as soon as possible. Have a great rest of the week everyone!",
      timestamp: "1:00 PM, Jan. 7",
      importance: 1 as const,
    },
    {
      room: "Room 2",
      message:
        "Reminding you about your meeting this Saturday! Please be on time, we will be beginning promptly at 10:30am. If you are unable to attend, please let us know as soon as possible. Have a great rest of the week everyone!",
      timestamp: "1:00 PM, Jan. 7",
      importance: 1 as const,
    },
    {
      room: "All Rooms",
      message:
        "Reminding you about your meeting this Saturday. Please be on time, we will be beginning promptly at 9:00 am next to the meeting room.",
      timestamp: "1:00 PM, Jan. 7",
      importance: 2 as const,
    },
    {
      room: "Room 7, Room 8, Room 9",
      message:
        "Reminding you about your meeting this Saturday! Please be on time, we will be beginning promptly at 10:30am. If you are unable to attend, please let us know as soon as possible. Have a great rest of the week everyone!",
      timestamp: "1:00 PM, Jan. 7",
      importance: 0 as const,
    },
    {
      room: "All Rooms",
      message:
        "Reminding you about your meeting this Saturday. Please be on time, we will be beginning promptly at 9:00 am next to the meeting room.",
      timestamp: "1:00 PM, Jan. 7",
      importance: 0 as const,
    },
    {
      room: "All Rooms",
      message:
        "Reminding you about your meeting this Saturday. Please be on time, we will be beginning promptly at 9:00 am next to the meeting room.",
      timestamp: "1:00 PM, Jan. 7",
      importance: 0 as const,
    },
  ];

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
        <Text
          textStyle="web.s1"
          color="#000000"
          marginRight="5px"
          fontWeight={600}
        >
          Filters:
        </Text>
        {selectedButtons.map((isSelected, index) => (
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
        {sampleAnnouncementCardData.map((item, index) => (
          <AnnouncementCard
            key={index}
            room={item.room}
            message={item.message}
            timestamp={item.timestamp}
            importance={item.importance}
          />
        ))}
      </VStack>
      { create && <CreateAnnouncementModal isOpen={create} onClose={() => setCreate(false)} /> }
    </Flex>
  );
}
