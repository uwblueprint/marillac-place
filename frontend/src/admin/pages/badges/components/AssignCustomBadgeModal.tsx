import React, { useState, useContext } from "react";
import { Flex, Grid, Text } from "@chakra-ui/react";
import { useMutation, useQuery } from "@apollo/client";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import { CREATE_EARNED_CUSTOM_BADGE } from "../../../../gql/earnedCustomBadgeRequests";
import { GET_CUSTOM_BADGES } from "../../../../gql/customBadgeRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import GreenOutlineButton from "../../../../ui/buttons/GreenOutlineButton";
import NumberInput from "../../../../ui/inputs/NumberInput";
import SelectInput from "../../../../ui/inputs/SelectInput";
import ErrorScreen from "../../../../ui/screens/ErrorScreen";
import { AdminContext } from "../../../AdminContext";
import { toTitleCase } from "../../../../helpers/stringUtils";
import LoadingScreen from "../../../../ui/screens/LoadingScreen";
import { CustomBadge } from "../../../../types/models";

interface AssignCustomBadgeModalProps {
  onClose: () => void;
}

const AssignCustomBadgeModal: React.FC<AssignCustomBadgeModalProps> = ({
  onClose,
}) => {
  const admin = useContext(AdminContext);
  const roomToParticipant = admin?.roomToParticipant;

  const [badge, setBadge] = useState<CustomBadge | null>(null);
  const [badgeValue, setBadgeValue] = useState<number | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>(
    []
  );
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [error, setError] = useState("");

  const {
    data: badgeData,
    loading: badgeLoading,
    error: badgeError,
  } = useQuery(GET_CUSTOM_BADGES);
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
    if (!badge || !badgeValue || selectedParticipants.length === 0) {
      setError("Missing fields");
    } else if (badgeValue < 0) {
      setError("Badge value must be greater than 0");
    } else {
      try {
        await Promise.all(
          selectedParticipants.map((pid) =>
            assignCustomBadge({
              variables: {
                pid,
                name: badge.name,
                icon: badge.icon,
                description: badge.description,
                value: badgeValue,
              },
            })
          )
        );
        onClose();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (!roomToParticipant || badgeError) {
    return <ErrorScreen />;
  }

  return (
    <PopupContainer
      title="Assign Custom Badge"
      submit_text="Assign Badge"
      submit_action={assignBadge}
      cancel_action={() => {
        setBadge(null);
        setBadgeValue(null);
        setError("");
        setSelectedParticipants([]);
        setSelectedRooms([]);
        onClose();
      }}
      loading={assignCustomBadgeLoading || badgeLoading}
      error_message={error}
    >
      <SelectInput
        label="Badge Name"
        current_value={badge ? toTitleCase(badge.name) : ""}
        update_action={setBadge}
        value_options={Object.fromEntries(
          badgeData?.getCustomBadges?.map((customBadge: CustomBadge) => [
            toTitleCase(customBadge.name),
            customBadge,
          ]) ?? []
        )}
      />

      <NumberInput
        label="Badge Value"
        current_value={badgeValue}
        update_action={setBadgeValue}
        size="small"
      />

      <Flex w="100%" h="1px" bg="neutral.300" mt="8px" />

      <Text textStyle="web.s1" color="text.light.secondary">
        Choose Room(s)
      </Text>
      <Grid w="100%" templateColumns="repeat(4, 1fr)" gap="5px">
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
