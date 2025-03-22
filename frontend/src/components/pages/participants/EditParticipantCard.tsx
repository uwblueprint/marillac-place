import React, { useState } from "react";
import { Button, Flex, Spinner } from "@chakra-ui/react";

import { useMutation, useQuery } from "@apollo/client";

import { GET_AVAILABLE_ROOMS } from "../../../gql/queries";
import { UPDATE_PARTICIPANT_BY_ID } from "../../../gql/mutations";

import ModalContainer from "../../common/ModalContainer";
import FormInputField from "../../common/FormInputField";
import FormSelectField from "../../common/FormSelectField";

type EditParticipantCardProps = {
  selectedRoomNumber: string;
  selectedParticipantId: string;
  selectedArrival: string;
  selectedPassword: string;
  close: () => void;
};

const EditParticipantCard = ({
  selectedRoomNumber,
  selectedParticipantId,
  selectedArrival,
  selectedPassword,
  close,
}: EditParticipantCardProps): React.ReactElement => {
  // eslint-disable-next-line prefer-template
  const title = "Edit Participant in Room " + selectedRoomNumber;

  const [arrivalDate, setArrivalDate] = useState(selectedArrival);
  const [password, setPassword] = useState(selectedPassword);
  const [error, setError] = useState("");

  // const {
  //   loading: getAvailableRoomsLoading,
  //   error: getAvailableRoomsError,
  //   data: getAvailableRoomsData,
  // } = useQuery(GET_AVAILABLE_ROOMS);
  const [updateParticipantById] = useMutation(UPDATE_PARTICIPANT_BY_ID);

  const reset = () => {
    setArrivalDate(selectedArrival);
    setPassword(selectedPassword);
    setError("");
  };

  const validate = () => {
    if (!arrivalDate || !password) {
      setError("Missing fields.");
      return false;
    }
    if (
      arrivalDate === selectedArrival &&
      password === selectedPassword
    ) {
      setError("No changes made.");
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
            participantId: selectedParticipantId,
            arrival: arrivalDate,
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
    <ModalContainer title={title}>
      <Flex flexDir="column" gap="20px">
        {error && <Flex textColor="red.500">{error}</Flex>}

        <Flex flexDir="column">
          <Flex mb="5px" color="gray.main" fontWeight="700">
            ID Number
          </Flex>
          <Flex>{selectedParticipantId}</Flex>
        </Flex>

        {/* {getAvailableRoomsLoading ? (
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
        )} */}

        <FormInputField
          label="Arrival Date"
          value={arrivalDate}
          type="date"
          onChange={(e) => {
            setArrivalDate(e.target.value);
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
