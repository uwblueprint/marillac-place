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
import FormInputField from "../../common/FormInputField";
import FormSelectField from "../../common/FormSelectField";

type EditParticipantPreset = {
  participantId: string;
  roomNumber: number;
  arrival: string;
  departure: string;
};

type EditParticipantCardProps = {
  preset: EditParticipantPreset | null;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditParticipantCard = ({
  preset,
  isOpen,
  setIsOpen,
}: EditParticipantCardProps): React.ReactElement => {
  console.log(preset);
  const [participantId, setParticipantId] = useState(preset ? preset.participantId : "");
  const [roomNumber, setRoomNumber] = useState(preset ? preset.roomNumber.toString() : "");
  const [arrivalDate, setArrivalDate] = useState(preset ? preset.arrival : "");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
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
      title="Edit Participant"
    >
      <Flex flexDir="column" gap="20px">
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
        ) : getAvailableRoomsError ? (
          <Flex p="10px">Error getting rooms.</Flex>
        ) : getAvailableRoomsData && getAvailableRoomsData.getAvailableRooms ? (
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
        ) : (
          <Flex p="10px">No available rooms.</Flex>
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
              setIsOpen(false);
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