import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_PARTICIPANT } from "../../../../gql/participantRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import NumberInput from "../../../../ui/inputs/NumberInput";
import DateTimeInput from "../../../../ui/inputs/DateTimeInput";
import PasswordInput from "../../../../ui/inputs/PasswordInput";
import useNotification from "../../../../hooks/useNotification";
import { formatDateInputValue } from "../../../../helpers/formatDateTime";

type AddParticipantCardProps = {
  roomNumber: number;
  onClose: () => void;
  onParticipantsUpdated: () => Promise<void>;
};

const AddParticipantCard = ({
  roomNumber,
  onClose,
  onParticipantsUpdated,
}: AddParticipantCardProps): React.ReactElement => {
  const [pid, setPid] = useState<number | undefined>(undefined);
  const [arrivalDate, setArrivalDate] = useState<Date>(new Date());
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { sendNotification } = useNotification();

  const [createParticipant, { loading }] = useMutation(CREATE_PARTICIPANT);

  const resetForm = () => {
    setPid(undefined);
    setArrivalDate(new Date());
    setPassword("");
  };

  const handleSubmit = async () => {
    setError("");
    if (pid === undefined || !password || !arrivalDate) {
      setError("Please fill out all fields.");
      return;
    }

    const today = new Date();
    if (arrivalDate > today) {
      setError("Arrival date cannot be in the future.");
      return;
    }

    try {
      await createParticipant({
        variables: {
          pid,
          password,
          room: roomNumber,
          arrival: formatDateInputValue(arrivalDate),
        },
      });
      await onParticipantsUpdated();
      sendNotification(`Participant #${pid} added to Room ${roomNumber}.`);
      resetForm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add participant.");
    }
  };

  return (
    <PopupContainer
      title={`Add Participant to Room ${roomNumber}`}
      submit_text="Save Changes"
      submit_action={handleSubmit}
      cancel_action={onClose}
      error_message={error}
      loading={loading}
    >
      <NumberInput
        label="ID Number"
        current_value={pid}
        update_action={setPid}
        size="large"
      />
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
    </PopupContainer>
  );
};

export default AddParticipantCard;
