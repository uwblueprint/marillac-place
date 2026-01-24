import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_PARTICIPANT } from "../../../../gql/participantRequests";
import ModalContainer from "../../../../ui/containers/PopupContainer";
import NumberInput from "../../../../ui/inputs/NumberInput";
import TextInput from "../../../../ui/inputs/TextInput";
import DateInput from "../../../../ui/inputs/DateInput";
import PasswordInput from "../../../../ui/inputs/PasswordInput";

type AddParticipantCardProps = {
  roomNumber: number;
  close: () => void;
  refetch: () => void;
};

const AddParticipantCard = ({
  roomNumber,
  close,
  refetch,
}: AddParticipantCardProps): React.ReactElement => {
  const [id, setId] = useState<number | null>(null);
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState("");

  const [createParticipant, { loading }] = useMutation(CREATE_PARTICIPANT, {
    onError: (err) => {
      setError(err.message);
    },
    onCompleted: () => {
      refetch();
      close();
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
          pid: id,
          room: roomNumber,
          arrival: arrivalDate.toISOString(),
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
      loading={loading}
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
      <PasswordInput
        label="Password"
        current_value={password}
        update_action={(value: any) => setPassword(value)}
        size="large"
      />
    </ModalContainer>
  );
};

export default AddParticipantCard;