import { Flex, FormControl, Input, Text } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { addDays } from "date-fns";
import { UPDATE_PARTICIPANT } from "../../../../gql/participantRequests";
import ModalContainer from "../../../../ui/containers/PopupContainer";
import DateInput from "../../../../ui/inputs/DateInput";
import {
  formatDateInputValue,
} from "../../../../helpers/formatDateTime";

type EditPastParticipantCardProps = {
  id: number;
  arrival: string;
  departure: string;
  close: () => void;
};

export default function EditPastParticipantCard({
  id,
  arrival,
  departure,
  close,
}: EditPastParticipantCardProps) {
  const [arrivalDate, setArrivalDate] = useState(new Date(arrival));
  const [departureDate, setDepartureDate] = useState(new Date(departure));
  const [error, setError] = useState("");

  const [updateParticipant] = useMutation(UPDATE_PARTICIPANT);

  async function handleSubmit() {
    setError("");
    if (!arrivalDate || !departureDate) {
      setError("Missing fields");
    } else if (
      arrivalDate.getTime() === new Date(arrival).getTime() &&
      departureDate.getTime() === new Date(departure).getTime()
    ) {
      setError("No changes made");
    } else if (departureDate && arrivalDate >= departureDate) {
      setError("Arrival date must be less than departure date");
    } else {
      const today = new Date();
      if (arrivalDate.getTime() > today.getTime()) {
        setError("Arrival is in the future");
      } else if (departureDate && departureDate.getTime() > today.getTime()) {
        setError("Departure is in the future");
      } else {
        try {
          await updateParticipant({
            variables: {
              pid: id,
              arrival: formatDateInputValue(addDays(arrivalDate, 1)),
              departure: formatDateInputValue(addDays(departureDate, 1)),
            },
          });
          localStorage.setItem(
            "notification",
            "Participant #" + id + " updated"
          );
          window.location.reload();
        } catch (err: any) {
          setError(err.message);
        }
      }
    }
  }

  return (
    <ModalContainer
      title="Edit Past Participant"
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
          width="350px"
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

      <Flex gap="8px">
        <DateInput
          label="Arrival Date"
          current_value={arrivalDate}
          update_action={(date: Date) => setArrivalDate(date)}
          size="medium"
        />
        <DateInput
          label="Departure Date"
          current_value={departureDate}
          update_action={(date: Date) => setDepartureDate(date)}
          size="medium"
        />
      </Flex>
    </ModalContainer>
  );
}
