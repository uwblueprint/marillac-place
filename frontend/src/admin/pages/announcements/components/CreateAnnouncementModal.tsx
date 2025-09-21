import React, {useState} from "react";
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
import {useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_ANNOUNCEMENT } from "../../../../gql/mutations";
import { GET_CURRENT_PARTICIPANTS } from "../../../../gql/queries";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import ModalContainer from "../../../common/form/ModalContainer";

const CreateAnnouncementModal = ({isOpen, onClose}: { isOpen: boolean, onClose: () => void }) => {
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [priority, setPriority] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [createAnnouncement] = useMutation(CREATE_ANNOUNCEMENT, {
    onCompleted: () => {
      let listOfRooms = "";
      if (selectedRooms.length === 1) {
        listOfRooms = `Room ${selectedRooms[0]}`;
      } else if (selectedRooms.length === ROOM_NUMBERS.length) {
        listOfRooms = "All Rooms";
      } else {
        listOfRooms = `Rooms ${selectedRooms.join(', ')}`;
      }
      localStorage.setItem("notification", "Announcement sent to " + listOfRooms);
      onClose();
      window.location.reload();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const [getCurrentParticipants] = useLazyQuery(GET_CURRENT_PARTICIPANTS);

  const handleSend = async () => {
    if (selectedRooms.length === 0 || priority === "" || message === "") {
      setError("Missing fields.");
      return;
    }

    try {
      const { data, error: dataError } = await getCurrentParticipants();

      if (dataError || !data || !data.getCurrentParticipants) {
        setError("Failed to fetch participants.");
        return;
      }

      const roomToParticipantMap: any = {};
      for (const participant of data.getCurrentParticipants) {
        roomToParticipantMap[participant.room_number] = participant.participant_id
      }

      const participantIds: number[] = [];
      for (const room of selectedRooms) {
        const participantId = roomToParticipantMap[room];
        if (!participantId) {
          setError(`Room ${room} is empty.`);
          return;
        }
        participantIds.push(participantId);
      }

      createAnnouncement({ variables: {
        priority,
        participants: participantIds,
        message,
      }});
    } catch(err: any) {
      console.log(err)
      setError("Unable to create announcement");
    }
  };

  const toggleRoom = (room: number) => {
    if (room === 0) {
      if (selectedRooms.length === ROOM_NUMBERS.length) {
        setSelectedRooms([]);
      } else {
        setSelectedRooms(ROOM_NUMBERS);
      }
    } else {
      setSelectedRooms(prev => {
        const next = [...prev]
        if (next.includes(room)) {
          return next.filter(r => r !== room);
        }
        return [...next, room];
      });
    }
  };

  return (
    <ModalContainer
      title="Create Announcement"
      submit_text="Send"
      submit_action={handleSend}
      cancel_action={onClose}
    >
          <Flex gap="5px" mb={4} wrap="wrap" alignItems="center">
            <Text textStyle="web.s1" color="text.light.secondary" mr={1}>
              Send To:
            </Text>
            {[[0], ...ROOM_NUMBERS.slice(0, 5)].flat().map((room: number) => {
              const isSelected = selectedRooms.length === ROOM_NUMBERS.length || selectedRooms.includes(room);
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
                      {room === 0 ? "All Rooms" : `Room ${room}`}
                    </Text>
                  </Button>
                </WrapItem>
              );
            })}

            <Box w="100%"/>

            {ROOM_NUMBERS.slice(5).map((room) => {
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
                      Room {room}
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

          { error && <Text textStyle="web.b2" fontWeight="600" color="#E30000" pt={2}>{error}</Text> }
    </ModalContainer>
  );
};

export default CreateAnnouncementModal;