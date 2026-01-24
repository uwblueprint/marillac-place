import { Flex, Text, Button } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { endOfDay } from "date-fns";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import { UPDATE_PARTICIPANT } from "../../../../gql/participantRequests";
import ModalContainer from "../../../../ui/containers/PopupContainer";
import DateInput from "../../../../ui/inputs/DateInput";
import TextInput from "../../../../ui/inputs/TextInput";
import GreenButton from "../../../../ui/buttons/GreenOutlineButton";
import { Participant } from "../../../../types/models";
import FixedInput from "../../../../ui/inputs/FixedInput";

type EditParticipantCardProps = {
  roomNumber: number;
  participants: Record<number, Participant>;
  close: () => void;
  refetchCurrent: () => void;
  refetchPast: () => void;
};

export default function EditParticipantCard({
  roomNumber,
  participants,
  close,
  refetchCurrent,
  refetchPast,
}: EditParticipantCardProps) {
  const participant: Participant = participants[roomNumber];
  const id: number = participant.pid;
  const currentArrivalDate = new Date(participant.arrival);
  const currentDepartureDate = participant.departure ? new Date(participant.departure) : null;
  const currentPassword = participant.password;

  const [arrivalDate, setArrivalDate] = useState<Date>(currentArrivalDate);
  const [password, setPassword] = useState<string>(currentPassword);
  const [departureDate, setDepartureDate] = useState<Date | null>(currentDepartureDate);

  const [swapParticipant, setSwapParticipant] = useState(false);
  const [endStay, setEndStay] = useState(false);

  const [error, setError] = useState("");
  const [selectedSwap, setSelectedSwap] = useState(-1);

  const [updateParticipant, { loading }] = useMutation(UPDATE_PARTICIPANT);

  async function handleSubmit() {
    setError("");
    const today = endOfDay(new Date());

    if (
      !arrivalDate ||
      !password ||
      (endStay && !departureDate) ||
      (swapParticipant && selectedSwap === -1)
    ) {
      setError("Missing fields");
    } else if (swapParticipant && selectedSwap === roomNumber) {
      setError("Invalid swap.");
    }

    if (
      arrivalDate.getTime() === currentArrivalDate.getTime() &&
      password === currentPassword &&
      !endStay &&
      !swapParticipant
    ) {
      setError("No changes made");
      return;
    }

    if (departureDate && arrivalDate.getTime() >= departureDate.getTime()) {
      setError("Arrival date must be less than departure date");
      return;
    }

    if (arrivalDate.getTime() > today.getTime()) {
      setError("Arrival is in the future");
      return;
    }

    if (departureDate && departureDate.getTime() > today.getTime()) {
      setError("Departure is in the future");
      return;
    }

    try {
      await updateParticipant({
        variables: {
          pid: id,
          room: swapParticipant ? selectedSwap : undefined,
          arrival: arrivalDate.toISOString(),
          departure:
            endStay && departureDate
              ? departureDate.toISOString()
              : undefined,
          password,
        },
      });

      if (swapParticipant && selectedSwap in participants) {
        await updateParticipant({
          variables: {
            pid: participants[selectedSwap].pid,
            room: roomNumber,
          },
        });
      }

      refetchCurrent();
      refetchPast();
      close();
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (!participant) {
    return null;
  }

  return (
    <ModalContainer
      title={"Edit Participant in Room " + roomNumber}
      submit_text="Save Changes"
      submit_action={handleSubmit}
      cancel_action={close}
      error_message={error}
      loading={loading}
    >
      <FixedInput
        label="Participant ID"
        current_value={"#" + id}
        orientation="horizontal"
      />

      <DateInput
        label="Arrival Date"
        current_value={arrivalDate}
        update_action={setArrivalDate}
        size="large"
      />

      <TextInput
        label="Password"
        current_value={password}
        update_action={setPassword}
        size="large"
      />

      <Flex alignItems="center" justifyContent="flex-start" gap="8px" mt="10px">
        <GreenButton
          label="Swap Rooms"
          action={() => {
            if (!swapParticipant) { 
              setEndStay(false);
              setDepartureDate(null);
            }
            setError("");
            setSwapParticipant(!swapParticipant);
          }}
          is_active={swapParticipant}
        />
        <Button
          onClick={() => {
            if (!endStay) { 
              setSwapParticipant(false);
              setSelectedSwap(-1);
            }
            setError("");
            setEndStay(!endStay);
          }}
          isActive={endStay}
          cursor="pointer"
          borderRadius="8px"
          border="1px"
          borderColor="indicate.brightRed"
          width="fit-content"
          height="fit-content"
          paddingX="12px"
          paddingY="6px"
          bg="white"
          color="indicate.brightRed"
          _hover={{
            color: "white",
            bg: "indicate.brightRed",
          }}
          _active={{
            color: "white",
            bg: "indicate.brightRed",
          }}
        >
          <Text textStyle="s2" color="inherit">
            End Stay
          </Text>
        </Button>
      </Flex>

      {(endStay || swapParticipant) && (
        <Flex w="100%" h="1px" bg="background.border" mt="6px" />
      )}

      {swapParticipant && (
        <Flex flexDir="column">
          <Text textStyle="s2" mb="5px">
            Available Rooms
          </Text>
          <Flex wrap="wrap" gap="5px" width="400px">
            {ROOM_NUMBERS.map((num: number) => (
              <GreenButton
                key={num}
                label={"Room " + num}
                action={() => setSelectedSwap(num)}
                is_active={selectedSwap === num}
              />
            ))}
          </Flex>
        </Flex>
      )}

      {selectedSwap !== -1 &&
        (selectedSwap === roomNumber ? (
          <Text textStyle="b2">
            Participant #{participants[roomNumber].pid} is already in Room{" "}
            {roomNumber}.
          </Text>
        ) : (
          <Flex flexDir="column" gap="5px">
            <Text textStyle="b2">
              Participant #{participants[roomNumber].pid} will be moved to Room{" "}
              {selectedSwap}.
            </Text>
            {selectedSwap in participants && (
              <Text textStyle="b2">
                Participant #{participants[selectedSwap].pid} will be moved to
                Room {roomNumber}.
              </Text>
            )}
          </Flex>
        ))}

      {endStay && (
        <DateInput
          label="Departure Date"
          current_value={departureDate}
          update_action={setDepartureDate}
          size="large"
        />
      )}
    </ModalContainer>
  );
}
