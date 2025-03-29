import React, { useState } from "react";
import { Button, Flex, Input, Spinner } from "@chakra-ui/react";

import { useMutation, useQuery } from "@apollo/client";

import { GET_AVAILABLE_ROOMS } from "../../../gql/queries";
import { UPDATE_PARTICIPANT_BY_ID } from "../../../gql/mutations";

import ModalContainer from "../../common/ModalContainer";
import FormInputField from "../../common/FormInputField";
import { TableData } from "../../common/CommonTable";

type EditParticipantCardProps = {
  selected: TableData;
  close: () => void;
};

const EditPastParticipantCard = ({
  selected,
  close
}: EditParticipantCardProps): React.ReactElement => {
  const [arrivalDate, setArrivalDate] = useState(selected.arrival);
  const [departureDate, setDepartureDate] = useState(selected.departure);
  const [error, setError] = useState("");

  const [updateParticipantById] = useMutation(UPDATE_PARTICIPANT_BY_ID);

  const reset = () => {
    setArrivalDate(selected.arrival);
    setDepartureDate(selected.departure);
    setError("");
  };

  const validate = () => {
    if (!arrivalDate || !departureDate) {
      setError("Missing fields.");
      return false;
    }
    if (arrivalDate === selected.arrival && departureDate === selected.departure) {
      setError("No changes made.");
      return false;
    }
    const start = new Date(arrivalDate);
    const end = new Date(departureDate);
    if (start > end) {
        setError("Invalid update.")
        return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError("");
    try {
      const valid: boolean = validate();
      if (valid) {
        await updateParticipantById({
          variables: {
            participantId: selected.participantId,
            arrival: arrivalDate,
            departure: departureDate
          },
        });
        reset();
        close();
        localStorage.setItem("notification", "Changes saved.");
        window.location.reload();
      }
    } catch (err) {
      setError("Unable to update participant.");
      console.log(err);
    }
  };

  return (
    <ModalContainer title="Edit Past Participant">
      <Flex flexDir="column" gap="10px">
        {error && <Flex textColor="red.500">{error}</Flex>}

        <Flex flexDir="column">
          <Flex mb="5px" color="gray.main" fontWeight="700">
            ID Number
          </Flex>
          <Input
            variant="outline"
            type="text"
            isDisabled
            value={selected.participantId}
            borderWidth="2px"
            borderColor="gray.300"
          />
        </Flex>

        <Flex gap="15px">
          <FormInputField
              label="Arrival Date"
              value={arrivalDate}
              type="date"
              onChange={(e) => {
                  setArrivalDate(e.target.value);
              }}
          />

          <FormInputField
              label="Departure Date"
              value={departureDate}
              type="date"
              onChange={(e) => {
                  setDepartureDate(e.target.value);
              }}
          />
        </Flex>

        <Flex justifyContent="flex-end" mt="10px">
          <Button
            variant="cancel"
            mr="10px"
            onClick={() => {
              reset();
              close();
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Flex>
      </Flex>
    </ModalContainer>
  );
};

export default EditPastParticipantCard;