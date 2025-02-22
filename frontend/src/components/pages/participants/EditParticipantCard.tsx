import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Spinner,
  Input
} from "@chakra-ui/react";

import { useMutation, useQuery, useLazyQuery } from "@apollo/client";

import {
  GET_AVAILABLE_ROOMS,
  GET_PARTICIPANT_BY_ID,
} from "../../../gql/queries";
import { CREATE_PARTICIPANT } from "../../../gql/mutations";

import ModalContainer from "../../common/ModalContainer";
import FormInputField from "../../common/FormInputField";
import FormSelectField from "../../common/FormSelectField";
import { TableData } from "../../common/CommonTable";

type EditParticipantCardProps = {
  selected: TableData;
  close: () => void;
};

const EditParticipantCard = ({selected, close}: EditParticipantCardProps): React.ReactElement => {
  const [roomNumber, setRoomNumber] = useState(selected.roomNumber);
  const [arrivalDate, setArrivalDate] = useState(selected.arrival);
  const [departureDate, setDepartureDate] = useState(selected.departure);
  const [password, setPassword] = useState(selected.password);

  const [error, setError] = useState("");

  const {
    loading: getAvailableRoomsLoading,
    error: getAvailableRoomsError,
    data: getAvailableRoomsData,
  } = useQuery(GET_AVAILABLE_ROOMS);

  const validate = async () => {
    if (!roomNumber || !arrivalDate || !password) {
      setError("Missing fields.");
      return false;
    } 
    if (roomNumber === selected.roomNumber && arrivalDate === selected.arrival && departureDate === selected.departure && password === selected.password) {
      setError("No changes made.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError("");
    const valid: boolean = await validate();
    if (valid) {
      try {
        const room = parseInt(roomNumber, 10);
        // await createParticipant({
        //   variables: {
        //     participantId,
        //     roomNumber: room,
        //     arrival: arrivalDate,
        //     password,
        //   },
        // });
        close();
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const reset = () => {
    setRoomNumber("");
    setArrivalDate("");
    setPassword("");
    setError("");
  };

  return (
    <ModalContainer title="Edit Participant">
      <Flex flexDir="column" gap="20px">
        {error && <Flex textColor="red.500">{error}</Flex>}

        <Flex flexDir="column">
          <Flex mb="5px" color="gray.main" fontWeight="700">ID Number</Flex>
          <Flex>{selected.participantId}</Flex>
        </Flex>

        {getAvailableRoomsLoading ? (
          <Spinner />
        ) : getAvailableRoomsError || !getAvailableRoomsData ? (
          <Flex p="10px">Error getting rooms.</Flex>
        ) : (
          <FormSelectField
            label="Room Number"
            placeholder={`Room ${selected.roomNumber}`}
            value={roomNumber}
            options={getAvailableRoomsData.getAvailableRooms.map(
              (room: number) => ({
                key: room,
                value: room,
                display: `Room ${room}`,
              }),
            )}
            onChange={(e) => setRoomNumber(e.target.value || selected.roomNumber)}
          />
        )}

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

        <FormInputField
          label="Password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Flex justifyContent="flex-end">
          <Button
            variant="cancel"
            mr="8px"
            onClick={() => {
              close();
              reset();
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

export default EditParticipantCard;