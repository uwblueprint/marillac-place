import React, { useState } from "react";
import {
  Button,
  Flex,
  Text,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalOverlay,
  FormControl,
  FormLabel,
  RadioGroup,
  Stack,
  Radio,
  Wrap,
  WrapItem,
  Grid,
  Box,
} from "@chakra-ui/react";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReportIcon from '@mui/icons-material/PriorityHigh';

const ROOMS = Array.from({ length: 10 }, (_, i) => `Room ${i + 1}`);

const CreateAnnouncementModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [priority, setPriority] = useState("Normal");
  const [message, setMessage] = useState("");

  const toggleRoom = (room: string) => {
    if (room === "All Rooms") {
        if (selectedRooms.length === ROOMS.length) {
            setSelectedRooms([]);
        } else {
            setSelectedRooms([...ROOMS]);
        }
        return;
    }
  
    setSelectedRooms(prev => {
      const isAll = prev.includes("All Rooms");
      const filtered = isAll ? [] : [...prev];
      if (filtered.includes(room)) {
        return filtered.filter(r => r !== room);
      }
      return [...filtered, room];
    });
  };
  

  const handleSend = () => {
    // Hook up to backend here
    console.log({ selectedRooms, priority, message });
    onClose();
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent boxShadow="xl" borderRadius="16px" width="600px" padding="20px">
        <ModalHeader>Create Announcement</ModalHeader>
        <ModalBody>
        <Flex gap="5px" mb={10} wrap="wrap" alignItems="center">
            <Text fontWeight="semibold" mr={2}>
                Send To:
            </Text>

            {[["All Rooms"], ...ROOMS.slice(0, 4)].flat().map((room) => {
                const isSelected =
                room === "All Rooms"
                    ? selectedRooms.length === ROOMS.length
                    : selectedRooms.includes(room);

                return (
                <WrapItem key={room}>
                    <Button
                    onClick={() => toggleRoom(room)}
                    border="1px"
                    borderColor="#0C727E"
                    borderRadius="8px"
                    height="fit-content"
                    paddingX="8px"
                    paddingY="4px"
                    bg={isSelected ? "#0C727E" : "white"}
                    color={isSelected ? "white" : "#0C727E"}
                    _hover={{
                        bg: "#0C727E",
                        color: "white",
                    }}
                    _active={{
                        bg: "#0C727E",
                        color: "white",
                    }}
                    >
                    {room}
                    </Button>
                </WrapItem>
                );
            })}

            <Box w="100%" />

            {ROOMS.slice(4).map((room) => {
                const isSelected = selectedRooms.includes(room);
                return (
                <WrapItem key={room}>
                    <Button
                    onClick={() => toggleRoom(room)}
                    border="1px"
                    borderColor="#0C727E"
                    borderRadius="8px"
                    height="fit-content"
                    paddingX="8px"
                    paddingY="4px"
                    bg={isSelected ? "#0C727E" : "white"}
                    color={isSelected ? "white" : "#0C727E"}
                    _hover={{
                        bg: "#0C727E",
                        color: "white",
                    }}
                    _active={{
                        bg: "#0C727E",
                        color: "white",
                    }}
                    >
                    {room}
                    </Button>
                </WrapItem>
                );
            })}
            </Flex>

          <FormControl mb={5}>
            <FormLabel>Priority Level:</FormLabel>
            <RadioGroup value={priority} onChange={setPriority}>
            <Stack direction="column" spacing={2}>
                <Radio sx={{
                    borderColor: "#0C727E",
                    _checked: { bg: "#0C727E" },
                }} value="Normal"
                >
                    Normal
                </Radio>
                <Radio sx={{
                    borderColor: "#0C727E",
                    _checked: { bg: "#0C727E" },
                }} value="High">
                  High <ReportIcon htmlColor="#EC3131" fontSize="small" style={{ marginLeft: 4 }} />
                </Radio>
                <Radio sx={{
                    borderColor: "#0C727E",
                    _checked: { bg: "#0C727E" },
                }} value="Critical">
                  Critical <ReportIcon htmlColor="#EC3131" fontSize="small" style={{ marginLeft: 4 }} /> <ReportIcon htmlColor="#EC3131" fontSize="small" style={{ marginLeft: 2 }} />
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Message</FormLabel>
            <Textarea
              placeholder="Enter announcement here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              minH="150px"
            />
          </FormControl>

          <Flex justify="flex-end" gap={3} mt={6}>
            <Button  size="sm" px="25px" py="5px" variant="outline" onClick={onClose}>Cancel</Button>
            <Button  size="sm" px="30px" py="5px" colorScheme="orange" onClick={handleSend}>Send</Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateAnnouncementModal;