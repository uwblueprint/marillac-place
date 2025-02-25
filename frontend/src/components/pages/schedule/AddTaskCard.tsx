import React, { useState, useEffect } from "react";
import {
  Button,
  Text,
  Flex,
  Select,
  FormLabel,
  Spinner,
} from "@chakra-ui/react";

import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import {
  GET_AVAILABLE_ROOMS,
  GET_PARTICIPANT_BY_ID,
} from "../../../gql/queries";
import { CREATE_PARTICIPANT } from "../../../gql/mutations";

import ModalContainer from "../../common/ModalContainer";
import FormInputField from "../../common/form/FormInputField";
import FormSelectField from "../../common/form/FormSelectField";

type AddParticipantCardProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddTaskCard = ({
  isOpen,
  setIsOpen,
}: AddParticipantCardProps): React.ReactElement => {
  const [participantId, setParticipantId] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [password, setPassword] = useState("");

  const [participantIdError, setParticipantIdError] = useState("");
  const [roomNumberError, setRoomNumberError] = useState("");
  const [arrivalDateError, setArrivalDateError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const {
    loading: getAvailableRoomsLoading,
    error: getAvailableRoomsError,
    data: getAvailableRoomsData,
  } = useQuery(GET_AVAILABLE_ROOMS);

  const [
    getParticipantById,
    {
      loading: getParticipantByIdLoading,
      error: getParticipantByIdError,
      data: getParticipantByIdData,
    },
  ] = useLazyQuery(GET_PARTICIPANT_BY_ID, {
    variables: { participantId },
  });

  const [createParticipant] = useMutation(CREATE_PARTICIPANT);

  const validate = async () => {
    const errors = {
      participantId: "",
      roomNumber: "",
      arrivalDate: "",
      password: "",
    };

    if (participantId) {
      await getParticipantById({ variables: { participantId } });
      if (getParticipantByIdError) {
        errors.participantId = "Unknown error has occurred.";
      } else if (
        getParticipantByIdData &&
        getParticipantByIdData.getParticipantById != null
      ) {
        errors.participantId = "ID already exists";
      } else {
        errors.participantId = "";
      }
    } else {
      errors.participantId = "ID Number is missing";
    }

    errors.roomNumber = roomNumber ? "" : "Room Number is missing";
    errors.arrivalDate = arrivalDate ? "" : "Arrival Date is missing";
    errors.password = password ? "" : "Password is missing";

    return errors;
  };

  const handleSubmit = async () => {
    const errors = await validate();
    if (
      !errors.participantId &&
      !errors.roomNumber &&
      !errors.arrivalDate &&
      !errors.password
    ) {
      try {
        const room = parseInt(roomNumber, 10);
        await createParticipant({
          variables: {
            participantId,
            roomNumber: room,
            arrival: arrivalDate,
            password,
          },
        });
        setIsOpen(false);
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    } else {
      setParticipantIdError(errors.participantId);
      setRoomNumberError(errors.roomNumber);
      setArrivalDateError(errors.arrivalDate);
      setPasswordError(errors.password);
    }
  };

  const reset = () => {
    setParticipantId("");
    setRoomNumber("");
    setArrivalDate("");
    setPassword("");
    setParticipantIdError("");
    setRoomNumberError("");
    setArrivalDateError("");
    setPasswordError("");
  };

  return (
    <ModalContainer
      title="Assign Task"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Flex flexDir="column" gap="20px">
      {getAvailableRoomsLoading ? (
          <Spinner />
        ) : getAvailableRoomsError ? (
          <Flex p="10px">Error getting rooms.</Flex>
        ) : getAvailableRoomsData && getAvailableRoomsData.getAvailableRooms ? (
          <FormSelectField
            label="Task Type"
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
            error={roomNumberError}
          />
        ) : (
          <Flex p="10px">No available rooms.</Flex>
        )}

        <FormInputField
          label="Task Name"
          value={participantId}
          type="text"
          onChange={(e) => {
            setParticipantId(e.target.value);
          }}
          required
          error={participantIdError}
        />
        

{getAvailableRoomsLoading ? (
          <Spinner />
        ) : getAvailableRoomsError ? (
          <Flex p="10px">Error getting rooms.</Flex>
        ) : getAvailableRoomsData && getAvailableRoomsData.getAvailableRooms ? (
          <FormSelectField
            label="Recurrence"
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
            error={roomNumberError}
          />
        ) : (
          <Flex p="10px">No available rooms.</Flex>
        )}        

    <FormInputField
          label="Marillac Bucks"
          value={participantId}
          type="text"
          onChange={(e) => {
            setParticipantId(e.target.value);
          }}
          required
          error={participantIdError}
        />

        <Flex justifyContent="flex-end">
          <Button
            variant="cancel"
            mr="8px"
            onClick={() => {
              setIsOpen(false);
              reset();
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Assign
          </Button>
        </Flex>
      </Flex>
    </ModalContainer>
  );
};

export default AddTaskCard;
