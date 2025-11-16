import React, { useMemo, useState } from "react";
import { Flex, Text, Button } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import { Participant } from "../../../../types/models";
import { UPDATE_PARTICIPANT } from "../../../../gql/participantRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import DateTimeInput from "../../../../ui/inputs/DateTimeInput";
import PasswordInput from "../../../../ui/inputs/PasswordInput";
import GreenOutlineButton from "../../../../ui/buttons/GreenOutlineButton";
import useNotification from "../../../../hooks/useNotification";
import { formatDateInputValue } from "../../../../helpers/formatDateTime";

type ParticipantByRoom = Record<number, Participant>;

type EditParticipantCardProps = {
  roomNumber: number;
  participant: Participant;
  participantsByRoom: ParticipantByRoom;
  onClose: () => void;
  onParticipantsUpdated: () => Promise<void>;
};

const EditParticipantCard = ({
  roomNumber,
  participant,
  participantsByRoom,
  onClose,
  onParticipantsUpdated,
}: EditParticipantCardProps): React.ReactElement => {
  const initialArrival = useMemo(() => new Date(participant.arrival), [participant.arrival]);
  const initialDeparture = useMemo(
    () => (participant.departure ? new Date(participant.departure) : undefined),
    [participant.departure],
  );

  const [arrivalDate, setArrivalDate] = useState<Date>(initialArrival);
  const [password, setPassword] = useState(participant.password);
  const [departureDate, setDepartureDate] = useState<Date | undefined>(initialDeparture);

  const [isSwapping, setIsSwapping] = useState(false);
  const [isEndingStay, setIsEndingStay] = useState(false);
  const [selectedSwapRoom, setSelectedSwapRoom] = useState<number | null>(null);
  const [error, setError] = useState("");

  const { sendNotification } = useNotification();
  const [updateParticipant, { loading }] = useMutation(UPDATE_PARTICIPANT);

  const handleToggleSwap = () => {
    setIsSwapping((prev) => {
      const next = !prev;
      if (next) {
        setIsEndingStay(false);
        setDepartureDate(initialDeparture);
      } else {
        setSelectedSwapRoom(null);
      }
      setError("");
      return next;
    });
  };

  const handleToggleEndStay = () => {
    setIsEndingStay((prev) => {
      const next = !prev;
      if (next) {
        setIsSwapping(false);
        setSelectedSwapRoom(null);
        setDepartureDate(initialDeparture ?? new Date());
      } else {
        setDepartureDate(initialDeparture);
      }
      setError("");
      return next;
    });
  };

  const handleSubmit = async () => {
    setError("");

    if (!password || !arrivalDate) {
      setError("Please fill out all required fields.");
      return;
    }

    if (isSwapping && (selectedSwapRoom === null || selectedSwapRoom === roomNumber)) {
      setError("Select a different room to complete the swap.");
      return;
    }

    if (isEndingStay && !departureDate) {
      setError("Select a departure date to end the stay.");
      return;
    }

    if (departureDate && arrivalDate >= departureDate) {
      setError("Arrival date must be before departure date.");
      return;
    }

    const today = new Date();
    if (arrivalDate > today) {
      setError("Arrival date cannot be in the future.");
      return;
    }

    if (departureDate && departureDate > today) {
      setError("Departure date cannot be in the future.");
      return;
    }

    const updates: {
      pid: number;
      password?: string;
      room?: number;
      arrival?: string;
      departure?: string;
    } = { pid: participant.pid };

    if (password !== participant.password) {
      updates.password = password;
    }

    if (arrivalDate.getTime() !== initialArrival.getTime()) {
      updates.arrival = formatDateInputValue(arrivalDate);
    }

    if (isEndingStay && departureDate) {
      updates.departure = formatDateInputValue(departureDate);
    }

    if (isSwapping && selectedSwapRoom !== null) {
      updates.room = selectedSwapRoom;
    }

    const hasUpdates = Boolean(
      updates.password || updates.room !== undefined || updates.arrival || updates.departure,
    );

    if (!hasUpdates) {
      setError("No changes detected.");
      return;
    }

    try {
      await updateParticipant({ variables: updates });

      if (isSwapping && selectedSwapRoom !== null) {
        const swapTarget = participantsByRoom[selectedSwapRoom];
        if (swapTarget) {
          await updateParticipant({
            variables: {
              pid: swapTarget.pid,
              room: roomNumber,
            },
          });
        }
      }

      await onParticipantsUpdated();

      if (isSwapping && selectedSwapRoom !== null) {
        const swapTarget = participantsByRoom[selectedSwapRoom];
        if (swapTarget) {
          sendNotification(
            `Participant #${participant.pid} moved to Room ${selectedSwapRoom}, Participant #${swapTarget.pid} moved to Room ${roomNumber}.`,
          );
        } else {
          sendNotification(`Participant #${participant.pid} moved to Room ${selectedSwapRoom}.`);
        }
      } else if (isEndingStay && departureDate) {
        sendNotification(`Participant #${participant.pid} stay ended.`);
      } else {
        sendNotification(`Participant #${participant.pid} updated.`);
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update participant.");
    }
  };

  return (
    <PopupContainer
      title={`Edit Participant in Room ${roomNumber}`}
      submit_text="Save Changes"
      submit_action={handleSubmit}
      cancel_action={onClose}
      error_message={error}
      loading={loading}
    >
      <Flex flexDir="column">
        <Text textStyle="web.s1" color="text.light.secondary">
          ID Number
        </Text>
        <Text textStyle="web.b3" color="#000000">
          #{participant.pid}
        </Text>
      </Flex>

      <DateTimeInput
        label="Arrival Date"
        current_value={arrivalDate}
        update_action={setArrivalDate}
        size="large"
        type="date"
      />

      <PasswordInput
        label="Password"
        current_value={password}
        update_action={setPassword}
        size="large"
      />

      <Flex alignItems="center" justifyContent="flex-start" gap="8px">
        <GreenOutlineButton
          label="Swap Participant"
          action={handleToggleSwap}
          is_active={isSwapping}
        />
        <Button
          onClick={handleToggleEndStay}
          isActive={isEndingStay}
          cursor="pointer"
          borderRadius="8px"
          border="1px"
          borderColor="#E30000"
          width="fit-content"
          height="fit-content"
          paddingX="12px"
          paddingY="6px"
          bg={isEndingStay ? "#E30000" : "#FFFFFF"}
          color={isEndingStay ? "#FFFFFF" : "#E30000"}
          _hover={{
            color: "#FFFFFF",
            bg: "#E30000",
          }}
          _active={{
            color: "#FFFFFF",
            bg: "#E30000",
          }}
        >
          <Text textStyle="web.s1" color="inherit">
            End Stay
          </Text>
        </Button>
      </Flex>

      {(isEndingStay || isSwapping) && <Flex w="100%" h="1px" bg="neutral.300" mt="8px" />}

      {isSwapping && (
        <Flex flexDir="column" gap="8px">
          <Text textStyle="web.s1" color="text.light.secondary">
            Available Rooms
          </Text>
          <Flex wrap="wrap" gap="6px" width="100%">
            {ROOM_NUMBERS.map((num) => (
              <GreenOutlineButton
                key={num}
                label={`Room ${num}`}
                action={() => setSelectedSwapRoom(num)}
                is_active={selectedSwapRoom === num}
              />
            ))}
          </Flex>
          {selectedSwapRoom !== null && (
            <Flex flexDir="column" gap="4px">
              {selectedSwapRoom === roomNumber ? (
                <Text textStyle="web.b3" color="text.light.secondary">
                  Participant #{participant.pid} is already in Room {roomNumber}.
                </Text>
              ) : (
                <>
                  <Text textStyle="web.b3" color="text.light.secondary">
                    Participant #{participant.pid} will move to Room {selectedSwapRoom}.
                  </Text>
                  {participantsByRoom[selectedSwapRoom] ? (
                    <Text textStyle="web.b3" color="text.light.secondary">
                      Participant #{participantsByRoom[selectedSwapRoom].pid} will move to Room{" "}
                      {roomNumber}.
                    </Text>
                  ) : (
                    <Text textStyle="web.b3" color="text.light.secondary">
                      Room {selectedSwapRoom} is currently empty.
                    </Text>
                  )}
                </>
              )}
            </Flex>
          )}
        </Flex>
      )}

      {isEndingStay && departureDate && (
        <DateTimeInput
          label="Departure Date"
          current_value={departureDate}
          update_action={setDepartureDate}
          size="large"
          type="date"
        />
      )}
    </PopupContainer>
  );
};

export default EditParticipantCard;
