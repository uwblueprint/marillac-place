import { Flex, FormControl, Input, Text, Button } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { addDays } from "date-fns";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import { UPDATE_PARTICIPANT } from "../../../../gql/participantRequests";
import ModalContainer from "../../../../ui/containers/PopupContainer";
import DateInput from "../../../../ui/inputs/DateInput";
import { formatDateInputValue } from "../../../../helpers/formatDateTime";
import TextInput from "../../../../ui/inputs/TextInput";
import GreenButton from "../../../../ui/buttons/GreenOutlineButton";

type EditParticipantCardProps = {
  roomNumber: number;
  participants: Record<number, any>;
  close: () => void;
};

export default function EditParticipantCard({
  roomNumber,
  participants,
  close,
}: EditParticipantCardProps) {
  const id: number = participants[roomNumber].pid;
  const today = new Date();
  const currentArrivalDate = participants[roomNumber].arrival
    ? new Date(participants[roomNumber].arrival)
    : new Date();

  const currentPassword = participants[roomNumber].password;

  const [arrivalDate, setArrivalDate] = useState<Date>(currentArrivalDate);
  const [password, setPassword] = useState(currentPassword);
  const [departureDate, setDepartureDate] = useState<Date | null>(
    participants[roomNumber].departure
      ? new Date(participants[roomNumber].departure)
      : null
  );

  const [swapParticipant, setSwapParticipant] = useState(false);
  const [endStay, setEndStay] = useState(false);

  const [error, setError] = useState("");
  const [selectedSwap, setSelectedSwap] = useState(-1);

  const [updateParticipant] = useMutation(UPDATE_PARTICIPANT);

  async function handleSubmit() {
    setError("");
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

    // no-op check
    if (
      arrivalDate.getTime() === currentArrivalDate.getTime() &&
      password === currentPassword &&
      (!endStay || (endStay && !departureDate)) &&
      !swapParticipant
    ) {
      setError("No changes made");
      return;
    }

    // arrival must be before departure
    if (departureDate && arrivalDate.getTime() >= departureDate.getTime()) {
      setError("Arrival date must be less than departure date");
      return;
    }

    // future dates check (compare to midnight today)
    if (arrivalDate.getTime() > today.getTime()) {
      setError("Arrival is in the future");
      return;
    }

    if (departureDate && departureDate.getTime() > today.getTime()) {
      setError("Departure is in the future");
      return;
    }

    try {
      // perform update for this participant
      await updateParticipant({
        variables: {
          pid: id,
          room: swapParticipant ? selectedSwap : undefined,
          arrival: formatDateInputValue(addDays(arrivalDate, 1)),
          departure:
            endStay && departureDate
              ? formatDateInputValue(addDays(departureDate, 1))
              : undefined,
          password,
        },
      });

      // if swapping, update the other participant as well
      if (swapParticipant && selectedSwap in participants) {
        await updateParticipant({
          variables: {
            pid: participants[selectedSwap].pid,
            room: roomNumber,
          },
        });
      }

      // set notification message
      if (swapParticipant) {
        let message = "Participant #" + id + " moved to Room " + selectedSwap;
        if (selectedSwap in participants) {
          message +=
            ", Participant #" +
            participants[selectedSwap].pid +
            " moved to Room " +
            roomNumber;
        }
        localStorage.setItem("notification", message);
      } else if (endStay) {
        localStorage.setItem(
          "notification",
          "Participant #" + id + " removed from Room " + roomNumber
        );
      } else {
        localStorage.setItem("notification", "Participant #" + id + " updated");
      }

      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <ModalContainer
      title={"Edit Participant in Room " + roomNumber}
      submit_text="Save Changes"
      submit_action={handleSubmit}
      cancel_action={close}
      error_message={error}
    >
      <FormControl>
        <Text textStyle="web.s1" color="text.light.secondary">
          ID Number
        </Text>
        <Input
          disabled
          type="number"
          value={id}
          width="100%"
          height="fit-content"
          paddingX="12px"
          paddingY="6px"
          border="1px"
          borderColor="#C5C8D8"
          borderRadius="8px"
          fontFamily="Nunito"
          fontWeight="400"
          fontSize="12px"
          color="#000000"
        />
      </FormControl>

      <DateInput
        label="Arrival Date"
        current_value={arrivalDate}
        update_action={(date: Date) => {
          setArrivalDate(date);
        }}
        size="large"
      />

      <TextInput
        label="Password"
        current_value={password}
        update_action={(value: any) => setPassword(value)}
        size="large"
      />

      <Flex alignItems="center" justifyContent="flex-start" gap="8px">
        <GreenButton
          label="Swap Participant"
          action={() => {
            setEndStay(false);
            setDepartureDate(null);
            setError("");
            setSwapParticipant(true);
          }}
          is_active={swapParticipant}
        />
        <Button
          onClick={() => {
            setSwapParticipant(false);
            setSelectedSwap(-1);
            setError("");
            setEndStay(true);
          }}
          isActive={endStay}
          cursor="pointer"
          borderRadius="8px"
          border="1px"
          borderColor="#E30000"
          width="fit-content"
          height="fit-content"
          paddingX="12px"
          paddingY="6px"
          bg="#FFFFFF"
          color="#E30000"
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

      {(endStay || swapParticipant) && (
        <Flex w="100%" h="1px" bg="neutral.300" mt="8px" />
      )}

      {swapParticipant && (
        <Flex flexDir="column">
          <Text textStyle="web.s1" color="text.light.secondary" mb="3px">
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
          <Text textStyle="web.b3">
            Participant #{participants[roomNumber].pid} is already in Room{" "}
            {roomNumber}.
          </Text>
        ) : (
          <Flex flexDir="column" gap="5px">
            <Text textStyle="web.b3">
              Participant #{participants[roomNumber].pid} will be moved to Room{" "}
              {selectedSwap}.
            </Text>
            {selectedSwap in participants && (
              <Text textStyle="web.b3">
                Participant #{participants[selectedSwap].pid} will be moved to
                Room {roomNumber}.
              </Text>
            )}
          </Flex>
        ))}

      {endStay && (
        <DateInput
          label="Departure Date"
          current_value={departureDate || ""}
          update_action={(date: Date) => setDepartureDate(date)}
          size="medium"
        />
      )}
    </ModalContainer>
  );
}
