import React, { useState } from "react";
import { Button, Flex, Spinner } from "@chakra-ui/react";

import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import {
  GET_AVAILABLE_ROOMS,
  GET_PARTICIPANT_BY_ID,
} from "../../../gql/queries";
import { CREATE_PARTICIPANT } from "../../../gql/mutations";

import ModalContainer from "../../common/ModalContainer";
import FormInputField from "../../common/FormInputField";
import FormSelectField from "../../common/FormSelectField";

type AddParticipantCardProps = {
  close: () => void;
};

const AddParticipantCard = ({
  close,
}: AddParticipantCardProps): React.ReactElement => {
  const [participantId, setParticipantId] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const {
    loading: getAvailableRoomsLoading,
    error: getAvailableRoomsError,
    data: getAvailableRoomsData,
  } = useQuery(GET_AVAILABLE_ROOMS);
  const [getParticipantById] = useLazyQuery(GET_PARTICIPANT_BY_ID);
  const [createParticipant] = useMutation(CREATE_PARTICIPANT);

  const reset = () => {
    setParticipantId("");
    setRoomNumber("");
    setArrivalDate("");
    setPassword("");
    setError("");
  };

  const validate = async () => {
    if (!participantId || !roomNumber || !arrivalDate || !password) {
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
    <ModalContainer title="Add Participant">
      <Flex flexDir="column" gap="20px">
        {error && <Flex textColor="red.500">{error}</Flex>}

        <FormInputField
          label="ID Number"
          value={participantId}
          type="text"
          onChange={(e) => {
            setParticipantId(e.target.value);
          }}
          required
        />

        {getAvailableRoomsLoading ? (
          <Spinner />
        ) : getAvailableRoomsError || !getAvailableRoomsData ? (
          <Flex p="10px">Error getting rooms.</Flex>
        ) : (
          <FormSelectField
            label="Room Number"
            placeholder="Please select a room"
            value={roomNumber}
            options={getAvailableRoomsData.getAvailableRooms.map(
              (room: number) => ({
                key: room,
                value: room,
                display: `Room ${room}`,
              }),
            )}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          />
        )}

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
