import React, { useState, useContext } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_ANNOUNCEMENT } from "../../../../gql/announcementRequests";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import GreenOutlineButton from "../../../../ui/buttons/GreenOutlineButton";
import SelectInput from "../../../../ui/inputs/SelectInput";
import TextAreaInput from "../../../../ui/inputs/TextAreaInput";
import { AdminContext } from "../../../AdminContext";
import { Priority } from "../../../../types/enums";

const CreateAnnouncementModal = ({
  onClose,
  refetch
}: {
  onClose: () => void;
  refetch: () => void;
}) => {
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [createAnnouncement, { loading: createAnnouncementLoading }] = useMutation(CREATE_ANNOUNCEMENT);
  const { roomToParticipant } = useContext(AdminContext);

  const handleSend = async () => {
    if (selectedRooms.length === 0 || priority === null || message === "") {
      setError("Missing fields.");
      return;
    }

    try {
      if (!roomToParticipant) {
        setError("Failed to fetch participants in rooms.");
        return;
      }
      const participantIds: number[] = [];
      for (const room of selectedRooms) {
        if (!(room in roomToParticipant)) {
          setError(`Room ${room} is empty.`);
          return;
        }
        const participantId = roomToParticipant[room];
        participantIds.push(participantId);
      }

      createAnnouncement({
        variables: {
          priority,
          pids: participantIds,
          message,
        },
      });

      refetch();
      onClose();
    } catch (err: any) {
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
    <PopupContainer
      title="Create Announcement"
      submit_text="Send"
      submit_action={handleSend}
      cancel_action={onClose}
      loading={createAnnouncementLoading}
      error_message={error}
    >
      <Flex gap="5px" wrap="wrap" alignItems="center" maxWidth="400px">
        <Text textStyle="web.s1" color="text.light.secondary" mr="5px">
          Send To:
        </Text>
        {[[0], ...ROOM_NUMBERS].flat().map((room: number) => {
          const isSelected =
            selectedRooms.length === ROOM_NUMBERS.length ||
            selectedRooms.includes(room);
          return (
            <GreenOutlineButton
              key={room}
              label={room === 0 ? "All Rooms" : `Room ${room}`}
              action={() => toggleRoom(room)}
              is_active={isSelected}
            />
          );
        })}
      </Flex>

      <SelectInput
        label="Priority Level"
        current_value={priority}
        update_action={setPriority}
        value_options={{
          Normal: Priority.NORMAL,
          High: Priority.HIGH,
          Critical: Priority.CRITICAL,
        }}
      />

      <TextAreaInput
        label="Message"
        current_value={message}
        update_action={setMessage}
        size="large"
      />
    </PopupContainer>
  );
};

export default CreateAnnouncementModal;
