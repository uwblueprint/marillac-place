// TODO: Refactor in progress - ignore for now
import React, { useEffect, useState } from "react";
import { Flex, Grid, Text } from "@chakra-ui/react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { ROOM_NUMBERS } from "../../../../../constants/rooms";
import {
  GET_PARTICIPANTS_BY_ROOMS,
  GET_CUSTOM_BADGES,
} from "../../../../gql/example";
import { ASSIGN_CUSTOM_BADGE } from "../../../../gql/mutations";
import ModalContainer from "../../../common/form/ModalContainer";
import GreenButton from "../../../common/buttons/GreenButton";
import CoreInput from "../../../common/form/CoreInput";
import SelectionInput from "../../../common/form/SelectionInput";

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

  const [getParticipantsByRooms] = useLazyQuery(GET_PARTICIPANTS_BY_ROOMS);
  const [assignCustomBadge] = useMutation(ASSIGN_CUSTOM_BADGE, {
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
      const res = await getParticipantsByRooms({
        variables: { room_numbers: selectedRooms },
      });
      const participants = res?.data?.getParticipantsByRooms;
      if (!participants || participants.length !== selectedRooms.length) {
        setError("No participants found for some selected rooms");
        return;
      }
      const participantIds = participants.map((p: any) => p.participant_id);
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
      setError(err.message);
    }
  };

  return (
    <ModalContainer
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
      error={error}
    >
      <SelectionInput
        label="Badge Name"
        current_value={badgeName}
        action={(e: any) => setBadgeName(e.target.value)}
        mode="dropdown"
        value_options={Object.fromEntries(
          badgeData?.getCustomBadges?.map((badge: any) => [
            badge.name,
            badge.name,
          ]) ?? []
        )}
        width="100%"
      />

      <CoreInput
        label="Badge Value"
        current_value={badgeValue}
        action={(e: any) => {
          const val = e.target.value;
          if (val === "") {
            setBadgeValue("");
          } else {
            const num = parseFloat(val);
            if (!Number.isNaN(num)) {
              setBadgeValue(val);
            }
          }
        }}
        type="number"
        width="100%"
      />

      <Flex w="100%" h="1px" bg="neutral.300" mt="8px" />

      <Text textStyle="web.s1" color="text.light.secondary">
        Choose Room(s)
      </Text>
      <Grid w="100%" templateColumns="repeat(4, 1fr)" gap="5px">
        {ROOM_NUMBERS.map((num: number) => (
          <GreenButton
            key={num}
            text={"Room " + num}
            action={() => toggleRoomSelection(num)}
            is_active={selectedRooms.includes(num)}
          />
        ))}
      </Grid>
    </ModalContainer>
  );
};

export default AssignCustomBadgeModal;
