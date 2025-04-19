import React, { useState } from "react";
import { Button, Flex } from "@chakra-ui/react";

import { useMutation, useLazyQuery } from "@apollo/client";
import { GET_PARTICIPANT_BY_ID } from "../../../gql/queries";
import { CREATE_PARTICIPANT } from "../../../gql/mutations";

import ModalContainer from "../../common/ModalContainer";
import FormInputField from "../../common/FormInputField";

type AddParticipantCardProps = {
  roomNumber: string;
  close: () => void;
};

const AddParticipantCard = ({
  roomNumber,
  close,
}: AddParticipantCardProps): React.ReactElement => {
  // eslint-disable-next-line prefer-template
  const title = "Add Participant to Room " + roomNumber;
  const [participantId, setParticipantId] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [getParticipantById] = useLazyQuery(GET_PARTICIPANT_BY_ID);
  const [createParticipant] = useMutation(CREATE_PARTICIPANT);

  const reset = () => {
    setParticipantId("");
    setArrivalDate("");
    setPassword("");
    setError("");
  };

  const validate = async () => {
    if (!participantId || !arrivalDate || !password) {
      setError("Missing fields.");
      return false;
    }
    try {
      const { data } = await getParticipantById({
        variables: { participantId },
      });
      if (data && data.getParticipantById) {
        setError("ID already exists.");
        return false;
      }
      return true;
    } catch (err) {
      setError("Unknown error has occurred.");
      console.log(err);
      return false;
    }
  };

  const handleSubmit = async () => {
    setError("");
    try {
      const valid: boolean = await validate();
      if (valid) {
        const room = parseInt(roomNumber, 10);
        await createParticipant({
          variables: {
            participantId,
            roomNumber: room,
            arrival: arrivalDate,
            password,
          },
        });
        localStorage.setItem("notification", "Added participant.");
        reset();
        close();
        window.location.reload();
      }
    } catch (err) {
      setError("Unable to create participant.");
      console.log(err);
    }
  };

  return (
    <ModalContainer title={title}>
      <Flex flexDir="column" gap="20px">
        {error && <Flex textColor="red.800">{error}</Flex>}

        <FormInputField
          label="ID Number"
          value={participantId}
          type="text"
          onChange={(e) => {
            setParticipantId(e.target.value);
          }}
          required
        />

        <FormInputField
          label="Arrival Date"
          value={arrivalDate}
          type="date"
          onChange={(e) => {
            setArrivalDate(e.target.value);
          }}
          required
        />

        <FormInputField
          label="Password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Flex justifyContent="flex-end">
          <Button
            variant="cancel"
            mr="8px"
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

export default AddParticipantCard;
