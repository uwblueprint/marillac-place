import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { addDays } from "date-fns";
import { CREATE_PARTICIPANT } from "../../../../gql/participantRequests";
import ModalContainer from "../../../../ui/containers/PopupContainer";
import NumberInput from "../../../../ui/inputs/NumberInput";
import TextInput from "../../../../ui/inputs/TextInput";
import DateInput from "../../../../ui/inputs/DateInput";
import { formatDateInputValue } from "../../../../helpers/formatDateTime";

type AddParticipantCardProps = {
  roomNumber: number;
  close: () => void;
};

const AddParticipantCard = ({
  roomNumber,
  close,
}: AddParticipantCardProps): React.ReactElement => {
  const [id, setId] = useState("");
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [createParticipant, { loading }] = useMutation(CREATE_PARTICIPANT, {
    onCompleted: () => {
      localStorage.setItem(
        "notification",
        "Participant #" + id + " added to Room " + roomNumber
      );
      window.location.reload();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  function handleSubmit() {
    setError("");

    if (!id || !arrivalDate || !password) {
      setError("Missing fields");
    } else {
      const today = new Date();
      if (arrivalDate > today) {
        setError("Arrival is in the future");
        return;
      }

      createParticipant({
        variables: {
          pid: Number(id),
          room: roomNumber,
          arrival: formatDateInputValue(addDays(arrivalDate, 1)),
          password,
        },
      });
    }
  }

  return (
    <ModalContainer
      title={"Add Participant to Room " + roomNumber}
      submit_text="Save Changes"
      submit_action={handleSubmit}
      cancel_action={close}
      error_message={error}
    >
      <NumberInput
        label="ID Number"
        current_value={id}
        update_action={(value: any) => setId(value)}
        size="large"
      />
      <DateInput
        label="Arrival Date"
        current_value={arrivalDate}
        update_action={(value: Date) => setArrivalDate(value)}
        size="large"
      />
      <TextInput
        label="Password"
        current_value={password}
        update_action={(value: any) => setPassword(value)}
        size="large"
      />
    </ModalContainer>
  );
};

export default AddParticipantCard;