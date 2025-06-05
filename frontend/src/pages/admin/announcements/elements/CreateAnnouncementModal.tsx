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
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";

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
        <ModalHeader><Text textStyle="web.h3">Create Announcement</Text></ModalHeader>
        <ModalBody>
        <Flex gap="5px" mb={4} wrap="wrap" alignItems="center">
          <Text textStyle="web.s1" color="text.light.secondary" mr={1}>
            Send To:
          </Text>
            {[["All Rooms"], ...ROOMS.slice(0, 5)].flat().map((room) => {
                const isSelected =
                room === "All Rooms"
                    ? selectedRooms.length === ROOMS.length
                    : selectedRooms.includes(room);

                return (
                <WrapItem key={room}>
                  <Button
                    key={room}
                    onClick={() => toggleRoom(room)}
                    isActive={isSelected}
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
                      {room}
                    </Text>
                  </Button>
                </WrapItem>
                );
            })}

            <Box w="100%" />

            {ROOMS.slice(5).map((room) => {
                const isSelected = selectedRooms.includes(room);
                return (
                <WrapItem key={room}>
                  <Button
                    key={room}
                    onClick={() => toggleRoom(room)}
                    isActive={isSelected}
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
                      {room}
                    </Text>
                  </Button>
                </WrapItem>
                );
            })}
            </Flex>

          <FormControl mb={4}>
            <FormLabel>
              <Text textStyle="web.s1" color="text.light.secondary">Priority Level:</Text>
            </FormLabel>
            <RadioGroup
              onChange={setPriority}
              value={priority}
              fontSize="md"
              color="gray.700"
              fontFamily="body"
            >
              <Stack direction="column" spacing={3}>
                <Radio value="NORMAL">
                  <Text textStyle="web.b1" fontSize="12px">Normal</Text>
                </Radio>

                <Radio value="HIGH">
                  <Flex align="center" fontFamily="body" gap="5px">
                    <Text textStyle="web.b1" fontSize="12px">High</Text>
                    <PriorityHighOutlinedIcon
                      sx={{
                        fontSize: "12px",
                        color: "#d34c5c",
                      }}
                    />
                  </Flex>
                </Radio>

                <Radio value="CRITICAL">
                  <Flex align="center" fontFamily="body" gap="5px">
                    <Text textStyle="web.b1" fontSize="12px">Critical</Text>
                    <PriorityHighOutlinedIcon
                      sx={{
                        fontSize: "12px",
                        color: "#d34c5c",
                      }}
                    />
                    <PriorityHighOutlinedIcon
                      sx={{
                        fontSize: "12px",
                        color: "#d34c5c",
                      }}
                    />
                  </Flex>
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel>
              <Text textStyle="web.s1" color="text.light.secondary">Message</Text>
            </FormLabel>
            <Textarea
              value={message}
              variant="primary"
              onChange={(e) => setMessage(e.target.value)}
              minHeight="120px"
              fontSize="12px"
            />
          </FormControl>

          <Flex alignItems="center" justify="flex-end" gap={3} mt={4}>
            <Button variant="white" onClick={onClose}><Text textStyle="web.s1">Cancel</Text></Button>
            <Button variant="primaryFilled" onClick={handleSend}><Text textStyle="web.s1" color="white">Send</Text></Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateAnnouncementModal;