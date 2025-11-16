import React, { useMemo, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import DateTimeInput from "../../../../ui/inputs/DateTimeInput";
import useNotification from "../../../../hooks/useNotification";
import { formatDateInputValue } from "../../../../helpers/formatDateTime";
import { UPDATE_PARTICIPANT } from "../../../../gql/participantRequests";

type EditPastParticipantCardProps = {
  id: number;
  arrival: string;
  departure: string;
  onClose: () => void;
  onParticipantsUpdated: () => Promise<void>;
};

const EditPastParticipantCard = ({
  id,
  arrival,
  departure,
  onClose,
  onParticipantsUpdated,
}: EditPastParticipantCardProps): React.ReactElement => {
  const initialArrival = useMemo(() => new Date(arrival), [arrival]);
  const initialDeparture = useMemo(() => new Date(departure), [departure]);

  const [arrivalDate, setArrivalDate] = useState<Date>(initialArrival);
  const [departureDate, setDepartureDate] = useState<Date>(initialDeparture);
  const [error, setError] = useState("");

  const { sendNotification } = useNotification();
  const [updateParticipant, { loading }] = useMutation(UPDATE_PARTICIPANT);

  const handleSubmit = async () => {
    setError("");

    if (!arrivalDate || !departureDate) {
      setError("Please select both arrival and departure dates.");
      return;
    }

    if (arrivalDate >= departureDate) {
      setError("Arrival date must be before departure date.");
      return;
    }

    const today = new Date();
    if (arrivalDate > today) {
      setError("Arrival date cannot be in the future.");
      return;
    }

    if (departureDate > today) {
      setError("Departure date cannot be in the future.");
      return;
    }

    const arrivalChanged = arrivalDate.getTime() !== initialArrival.getTime();
    const departureChanged = departureDate.getTime() !== initialDeparture.getTime();

    if (!arrivalChanged && !departureChanged) {
      setError("No changes detected.");
      return;
    }

    try {
      await updateParticipant({
        variables: {
          pid: id,
          arrival: arrivalChanged ? formatDateInputValue(arrivalDate) : undefined,
          departure: departureChanged ? formatDateInputValue(departureDate) : undefined,
        },
      });

      await onParticipantsUpdated();
      sendNotification(`Participant #${id} updated.`);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update participant.");
    }
  };

  return (
    <PopupContainer
      title="Edit Past Participant"
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
          #{id}
        </Text>
      </Flex>

      <Flex gap="12px" flexWrap="wrap">
        <DateTimeInput
          label="Arrival Date"
          current_value={arrivalDate}
          update_action={setArrivalDate}
          size="large"
          type="date"
        />
        <DateTimeInput
          label="Departure Date"
          current_value={departureDate}
          update_action={setDepartureDate}
          size="large"
          type="date"
        />
      </Flex>
    </PopupContainer>
  );
};

export default EditPastParticipantCard;
