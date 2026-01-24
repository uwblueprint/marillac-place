import React, { useState, useContext } from "react";
import { Flex, Grid, Text } from "@chakra-ui/react";
import { useMutation, useQuery } from "@apollo/client";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import { CREATE_EARNED_CUSTOM_BADGE } from "../../../../gql/earnedCustomBadgeRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import GreenOutlineButton from "../../../../ui/buttons/GreenOutlineButton";
import NumberInput from "../../../../ui/inputs/NumberInput";
import { AdminContext } from "../../../AdminContext";
import { toTitleCase } from "../../../../helpers/stringUtils";
import { CustomBadge } from "../../../../types/models";
import DropdownInput from "../../../../ui/inputs/DropdownInput";
import useNotification from "../../../../hooks/useNotification";

interface AssignCustomBadgeModalProps {
  onClose: () => void;
  customBadges: CustomBadge[];
}

const AssignCustomBadgeModal: React.FC<AssignCustomBadgeModalProps> = ({
  onClose,
  customBadges,
}) => {
  const { roomToParticipant } = useContext(AdminContext);
  const { sendNotification } = useNotification();
  const [selectedBadgeId, setSelectedBadgeId] = useState<string>("");
  const [badgeValue, setBadgeValue] = useState<number | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>(
    []
  );
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [error, setError] = useState("");

  const [assignCustomBadge, { loading: assignCustomBadgeLoading }] =
    useMutation(CREATE_EARNED_CUSTOM_BADGE);

  const toggleRoomSelection = (room: number) => {
    if (!roomToParticipant || !(room in roomToParticipant)) {
      setError("No participant assigned to this room");
    } else {
      const participantId = roomToParticipant[room];
      setSelectedParticipants((prev) =>
        prev.includes(participantId)
          ? prev.filter((p) => p !== participantId)
          : [...prev, participantId]
      );
      setSelectedRooms((prev) =>
        prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
      );
      setError("");
    }
  };

  const assignBadge = async () => {
    setError("");
    if (!selectedBadgeId || !badgeValue || selectedParticipants.length === 0) {
      setError("Missing fields");
    } else if (badgeValue < 0) {
      setError("Badge value must be greater than 0");
    } else {
      const selectedBadge =
        customBadges.find(
          (customBadge: CustomBadge) =>
            String(customBadge.cid) === selectedBadgeId
        ) ?? null;
      if (!selectedBadge) {
        setError("Invalid badge");
        return;
      }
      try {
        await Promise.all(
          selectedParticipants.map((pid) =>
            assignCustomBadge({
              variables: {
                pid,
                name: selectedBadge.name,
                icon: selectedBadge.icon,
                description: selectedBadge.description,
                value: badgeValue,
              },
            })
          )
        );
        onClose();
        sendNotification("Custom badge assigned successfully");
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <PopupContainer
      title="Assign Custom Badge"
      submit_text="Assign Badge"
      submit_action={assignBadge}
      cancel_action={() => {
        setBadgeValue(null);
        setError("");
        setSelectedParticipants([]);
        setSelectedRooms([]);
        setSelectedBadgeId("");
        onClose();
      }}
      loading={assignCustomBadgeLoading}
      error_message={error}
    >
      <DropdownInput
        label="Badge Name"
        current_value={selectedBadgeId}
        update_action={(badgeId: string) => {
          setSelectedBadgeId(badgeId);
        }}
        size="large"
        placeholder="Select Badge"
        value_options={Object.fromEntries(
          customBadges.map((customBadge: CustomBadge) => [
            toTitleCase(customBadge.name),
            String(customBadge.cid),
          ])
        )}
      />

      <NumberInput
        label="Badge Value"
        current_value={badgeValue}
        update_action={setBadgeValue}
        size="small"
      />

      <Flex w="100%" h="1px" bg="background.border" mt="6px" />

      <Text textStyle="s2">
        Choose Room(s)
      </Text>
      <Grid templateColumns="repeat(5, 1fr)" gap="5px">
        {ROOM_NUMBERS.map((num: number) => (
          <GreenOutlineButton
            key={num}
            label={"Room " + num}
            action={() => toggleRoomSelection(num)}
            is_active={selectedRooms.includes(num)}
          />
        ))}
      </Grid>
    </PopupContainer>
  );
};

export default AssignCustomBadgeModal;
