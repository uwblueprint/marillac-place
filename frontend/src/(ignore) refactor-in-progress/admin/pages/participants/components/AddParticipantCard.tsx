// TODO: Refactor in progress - ignore for now
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_PARTICIPANT } from "../../../../gql/mutations";
import ModalContainer from "../../../common/form/ModalContainer";
import CoreInput from "../../../common/form/CoreInput";

type AddParticipantCardProps = {
  roomNumber: number;
  close: () => void;
};

const AddParticipantCard = ({
  roomNumber,
  close,
}: AddParticipantCardProps): React.ReactElement => {
  const [id, setId] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
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
      const today = new Date().toLocaleDateString("en-ca");
      if (arrivalDate > today) {
        setError("Arrival is in the future");
        return;
      }

      createParticipant({
        variables: {
          participant_id: Number(id),
          room_number: roomNumber,
          arrival_date: arrivalDate,
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
      error={error}
    >
      <CoreInput
        label="ID Number"
        current_value={id}
        action={(e: any) => setId(e.target.value)}
        type="number"
        width="350px"
      />
      <CoreInput
        label="Arrival Date"
        current_value={arrivalDate}
        action={(e: any) => setArrivalDate(e.target.value)}
        type="date"
        width="350px"
      />
      <CoreInput
        label="Password"
        current_value={password}
        action={(e: any) => setPassword(e.target.value)}
        type="password"
        width="350px"
      />
    </ModalContainer>
  );
};

export default AddParticipantCard;
