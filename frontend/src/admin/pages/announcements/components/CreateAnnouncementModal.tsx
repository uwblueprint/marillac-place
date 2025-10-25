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
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_ANNOUNCEMENT } from "../../../../gql/mutations";
import { GET_CURRENT_PARTICIPANTS } from "../../../../gql/queries";
import { ROOM_NUMBERS } from "../../../../constants/misc";
import ModalContainer from "../../../common/form/ModalContainer";
import GreenButton from "../../../common/buttons/GreenButton";
import SelectionInput from "../../../common/form/SelectionInput";
import TextInput from "../../../common/form/TextInput";

const CreateAnnouncementModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
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
        listOfRooms = `Rooms ${selectedRooms.join(", ")}`;
      }
      localStorage.setItem(
        "notification",
        "Announcement sent to " + listOfRooms
      );
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
        roomToParticipantMap[participant.room_number] =
          participant.participant_id;
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

      createAnnouncement({
        variables: {
          priority,
          participants: participantIds,
          message,
        },
      });
    } catch (err: any) {
      console.log(err);
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
      setSelectedRooms((prev) => {
        const next = [...prev];
        if (next.includes(room)) {
          return next.filter((r) => r !== room);
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
      error={error}
    >
      <Flex gap="5px" wrap="wrap" alignItems="center" maxWidth="450px">
        <Text textStyle="web.s1" color="text.light.secondary">
          Send To:
        </Text>
        {[[0], ...ROOM_NUMBERS].flat().map((room: number) => {
          const isSelected =
            selectedRooms.length === ROOM_NUMBERS.length ||
            selectedRooms.includes(room);
          return (
            <GreenButton
              key={room}
              text={room === 0 ? "All Rooms" : `Room ${room}`}
              action={() => toggleRoom(room)}
              is_active={isSelected}
            />
          );
        })}
      </Flex>

      <SelectionInput
        label="Priority Level"
        current_value={priority}
        action={(opt: string) => setPriority(opt)}
        mode="radio"
        value_options={{
          Normal: "NORMAL",
          High: "HIGH",
          Critical: "CRITICAL",
        }}
      />

      <TextInput
        label="Message"
        current_value={message}
        action={(e: any) => setMessage(e.target.value)}
      />
    </ModalContainer>
  );
};

export default CreateAnnouncementModal;
