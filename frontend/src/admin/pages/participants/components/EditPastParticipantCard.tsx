import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { UPDATE_PARTICIPANT } from "../../../../gql/participantRequests";
import ModalContainer from "../../../../ui/containers/PopupContainer";
import DateInput from "../../../../ui/inputs/DateInput";
import FixedInput from "../../../../ui/inputs/FixedInput";
import useNotification from "../../../../hooks/useNotification";

type EditPastParticipantCardProps = {
  id: number;
  arrival: Date;
  departure: Date;
  close: () => void;
  refetch: () => void;
};

export default function EditPastParticipantCard({
  id,
  arrival,
  departure,
  close,
  refetch,
}: EditPastParticipantCardProps) {
  const [arrivalDate, setArrivalDate] = useState<Date>(arrival);
  const [departureDate, setDepartureDate] = useState<Date>(departure);
  const [error, setError] = useState("");
  const { sendNotification } = useNotification();
  const [updateParticipant, { loading }] = useMutation(UPDATE_PARTICIPANT);

  async function handleSubmit() {
    setError("");
    if (!arrivalDate || !departureDate) {
      setError("Missing fields");
    } else if (
      arrivalDate.getTime() === arrival.getTime() &&
      departureDate.getTime() === departure.getTime()
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
              arrival: arrivalDate.toISOString(),
              departure: departureDate.toISOString(),
            },
          });
          refetch();
          close();
          sendNotification("Past participant updated successfully");
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
        size="medium"
      />

      <DateInput
        label="Departure Date"
        current_value={departureDate}
        update_action={setDepartureDate}
        size="medium"
      />
    </ModalContainer>
  );
}
