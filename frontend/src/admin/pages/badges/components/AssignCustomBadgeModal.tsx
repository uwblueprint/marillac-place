import React, { useEffect, useState } from "react";
import { Flex, Grid, Text } from "@chakra-ui/react";
import { useMutation, useQuery } from "@apollo/client";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import {
  GET_CUSTOM_BADGES,
  CREATE_CUSTOM_BADGE,
} from "../../../../gql/customBadgeRequests";
import { GET_CURRENT_PARTICIPANTS } from "../../../../gql/participantRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import GreenOutlineButton from "../../../../ui/buttons/GreenOutlineButton";
import NumberInput from "../../../../ui/inputs/NumberInput";
import SelectInput from "../../../../ui/inputs/SelectInput";
import { AdminContext } from "../../../AdminContext";

interface AssignCustomBadgeModalProps {
  onClose: () => void;
}

const AssignCustomBadgeModal: React.FC<AssignCustomBadgeModalProps> = ({
  onClose,
}) => {
  const [badgeName, setBadgeName] = useState("");
  const [badgeValue, setBadgeValue] = useState<string>("");
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [badges, setBadges] = useState<{ badge_id: number; name: string }[]>(
    []
  );
  const { data: badgeData } = useQuery(GET_CUSTOM_BADGES);

  useEffect(() => {
    if (badgeData?.getCustomBadges) {
      setBadges(badgeData.getCustomBadges);
    }
  }, [badgeData]);

  const { data: currentParticipantsData } = useQuery(GET_CURRENT_PARTICIPANTS);
  const [assignCustomBadge] = useMutation(CREATE_CUSTOM_BADGE, {
    onCompleted: () => {
      localStorage.setItem(
        "notification",
        `Assigned Custom Badge: ${badgeName}`
      );
      onClose();
      window.location.reload();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const toggleRoomSelection = (room: number) => {
    setSelectedRooms((prev) =>
      prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
    );
  };

  const assignBadge = async () => {
    setError("");
    if (!badgeName.trim() || !badgeValue.trim() || selectedRooms.length === 0) {
      setError("Missing fields");
      return;
    }
    try {
      const allParticipants =
        currentParticipantsData?.getCurrentParticipants ?? [];

      // filter participants by selected rooms
      const participants = allParticipants.filter((p: any) =>
        selectedRooms.includes(p.room)
      );

      if (participants.length === 0) {
        setError("No participants found for selected rooms");
        return;
      }

      const participantIds = participants.map((p: any) => p.pid);

      const selectedBadge = badges.find((badge) => badge.name === badgeName);
      const badgeId = selectedBadge?.badge_id;

      await assignCustomBadge({
        variables: {
          badge_id: badgeId,
          marillac_bucks: Number(badgeValue),
          participant_ids: participantIds,
        },
      });
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <PopupContainer
      title="Assign Custom Badge"
      submit_text="Assign Badge"
      submit_action={assignBadge}
      cancel_action={() => {
        setBadgeName("");
        setBadgeValue("");
        setSelectedRooms([]);
        setError("");
        setBadges([]);
        onClose();
      }}
      error_message={error}
    >
      <SelectInput
        label="Badge Name"
        current_value={badgeName}
        update_action={(e: any) => setBadgeName(e.target.value)}
        value_options={Object.fromEntries(
          badgeData?.getCustomBadges?.map((badge: any) => [
            badge.name,
            badge.name,
          ]) ?? []
        )}
      />

      <NumberInput
        label="Badge Value"
        current_value={badgeValue}
        update_action={(value: number | undefined) => {
          if (value === undefined) {
            setBadgeValue("");
          } else {
            setBadgeValue(String(value));
          }
        }}
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
