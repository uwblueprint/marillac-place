import React, { useState } from "react";
import { Button, Flex, Spinner } from "@chakra-ui/react";

import { useMutation, useQuery } from "@apollo/client";

import { GET_AVAILABLE_ROOMS } from "../../../gql/queries";
import { UPDATE_PARTICIPANT_BY_ID } from "../../../gql/mutations";

import ModalContainer from "../../common/ModalContainer";
import FormInputField from "../../common/FormInputField";
import FormSelectField from "../../common/FormSelectField";
import { TableData } from "../../common/CommonTable";

type EditParticipantCardProps = {
  selected: TableData;
  close: () => void;
};

const EditParticipantCard = ({
  selected,
  close,
}: EditParticipantCardProps): React.ReactElement => {
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
  const [updateParticipantById] = useMutation(UPDATE_PARTICIPANT_BY_ID);

  const reset = () => {
    setRoomNumber(selected.roomNumber);
    setArrivalDate(selected.arrival);
    setDepartureDate(selected.departure);
    setPassword(selected.password);
    setError("");
  };

  const validate = async () => {
    if (!roomNumber || !arrivalDate || !password) {
      setError("Missing fields.");
      return false;
    }
    if (
      roomNumber === selected.roomNumber &&
      arrivalDate === selected.arrival &&
      departureDate === selected.departure &&
      password === selected.password
    ) {
      setError("No changes made.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError("");
    try {
      const valid: boolean = await validate();
      if (valid) {
        const room = parseInt(roomNumber, 10);
        await updateParticipantById({
          variables: {
            participantId: selected.participantId,
            roomNumber: room,
            arrival: arrivalDate,
            departure: departureDate,
            password,
          },
        });
        reset();
        close();
        window.location.reload();
      }
    } catch (err) {
      setError("Unable to update participant.");
      console.log(err);
    }
  };

  return (
    <ModalContainer title="Edit Participant">
      <Flex flexDir="column" gap="20px">
        {error && <Flex textColor="red.500">{error}</Flex>}

        <Flex flexDir="column">
          <Flex mb="5px" color="gray.main" fontWeight="700">
            ID Number
          </Flex>
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
            onChange={(e) =>
              setRoomNumber(e.target.value || selected.roomNumber)
            }
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

export default EditParticipantCard;
