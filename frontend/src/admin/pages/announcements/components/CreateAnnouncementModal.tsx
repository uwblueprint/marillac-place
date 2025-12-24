// TODO: Refactor this component
import React, { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_ANNOUNCEMENT } from "../../../../gql/announcementRequests";
import { GET_CURRENT_PARTICIPANTS } from "../../../../gql/participantRequests";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import ModalContainer from "../../../../ui/containers/PopupContainer";
import GreenButton from "../../../../ui/buttons/GreenOutlineButton";
import SelectionInput from "../../../../ui/inputs/SelectInput";
import TextAreaInput from "../../../../ui/inputs/TextAreaInput";

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
        roomToParticipantMap[participant.room] = participant.pid;
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
          pids: participantIds,
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
      error_message={error}
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
              label={room === 0 ? "All Rooms" : `Room ${room}`}
              action={() => toggleRoom(room)}
              is_active={isSelected}
            />
          );
        })}
      </Flex>

      <SelectionInput
        label="Priority Level"
        current_value={priority}
        update_action={(opt: string) => setPriority(opt)}
        value_options={{
          Normal: "NORMAL",
          High: "HIGH",
          Critical: "CRITICAL",
        }}
      />

      <TextAreaInput
        label="Message"
        current_value={message}
        size="large"
        update_action={(value: any) => setMessage(value)}
      />
    </ModalContainer>
  );
};

export default CreateAnnouncementModal;
