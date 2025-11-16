import React, { useMemo, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { CREATE_ANNOUNCEMENT } from "../../../../gql/announcementRequests";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import GreenOutlineButton from "../../../../ui/buttons/GreenOutlineButton";
import SelectInput from "../../../../ui/inputs/SelectInput";
import TextAreaInput from "../../../../ui/inputs/TextAreaInput";
import useNotification from "../../../../hooks/useNotification";
import { Participant } from "../../../../types/models";
import { Priority } from "../../../../types/enums";

type CreateAnnouncementModalProps = {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  onAnnouncementCreated: () => Promise<void>;
};

const getRoomLabel = (rooms: number[]) => {
  if (rooms.length === 1) return `Room ${rooms[0]}`;
  if (rooms.length === ROOM_NUMBERS.length) return "All Rooms";
  if (rooms.length === 0) return "No Rooms";
  return `Rooms ${rooms.join(", ")}`;
};

const CreateAnnouncementModal = ({
  isOpen,
  onClose,
  participants,
  onAnnouncementCreated,
}: CreateAnnouncementModalProps): React.ReactElement | null => {
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [priority, setPriority] = useState<Priority>(Priority.NORMAL);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { sendNotification } = useNotification();

  const participantsByRoom = useMemo(() => {
    const mapping: Record<number, Participant> = {};
    participants.forEach((participant) => {
      if (participant.room !== undefined && participant.room !== null) {
        mapping[participant.room] = participant;
      }
    });
    return mapping;
  }, [participants]);

  const isAllSelected = selectedRooms.length === ROOM_NUMBERS.length;
  const isNoneSelected = selectedRooms.length === 0;
  const treatAsAll = isAllSelected || isNoneSelected;

  const [createAnnouncement, { loading }] = useMutation(CREATE_ANNOUNCEMENT, {
    onError: (err) => {
      setError(err.message ?? "Failed to create announcement.");
    },
  });

  if (!isOpen) {
    return null;
  }

  const toggleRoom = (room: number) => {
    setSelectedRooms((prev) => {
      const next = new Set(prev);
      if (next.has(room)) {
        next.delete(room);
      } else {
        next.add(room);
      }
      return Array.from(next).sort((a, b) => a - b);
    });
  };

  const toggleAllRooms = () => {
    if (isAllSelected) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms([...ROOM_NUMBERS]);
    }
  };

  const handleClose = () => {
    setError("");
    setSelectedRooms([]);
    setPriority(Priority.NORMAL);
    setMessage("");
    onClose();
  };

  const handleSend = async () => {
    setError("");
    const roomsToSend = treatAsAll ? ROOM_NUMBERS : selectedRooms;

    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }

    const participantIds = roomsToSend
      .map((room) => participantsByRoom[room]?.pid)
      .filter((pid): pid is number => typeof pid === "number");

    if (participantIds.length === 0) {
      setError("Selected rooms currently have no participants.");
      return;
    }

    try {
      await createAnnouncement({
        variables: {
          priority,
          pids: participantIds,
          message: message.trim(),
        },
      });
      await onAnnouncementCreated();
      sendNotification(`Announcement sent to ${getRoomLabel(roomsToSend)}`);
      handleClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to create announcement.");
      }
    }
  };

  return (
    <PopupContainer
      title="Create Announcement"
      submit_text="Send"
      submit_action={handleSend}
      cancel_action={handleClose}
      error_message={error}
      loading={loading}
    >
      <Flex flexDir="column" gap="8px">
        <Text textStyle="web.s1" color="text.light.secondary">
          Send To
        </Text>
        <Flex gap="6px" flexWrap="wrap">
          <GreenOutlineButton
            label="All Rooms"
            action={toggleAllRooms}
            is_active={treatAsAll}
          />
          {ROOM_NUMBERS.map((room) => {
            const isActive = treatAsAll || selectedRooms.includes(room);
            return (
              <GreenOutlineButton
                key={room}
                label={`Room ${room}`}
                action={() => toggleRoom(room)}
                is_active={isActive}
              />
            );
          })}
        </Flex>
      </Flex>

      <SelectInput
        label="Priority Level"
        current_value={priority}
        update_action={(value: Priority) => setPriority(value)}
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
