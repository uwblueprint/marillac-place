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
  participants: Record<string, any>;
  close: () => void;
};

const EditParticipantCard = ({
  selectedRoomNumber,
  participants,
  close,
}: EditParticipantCardProps): React.ReactElement => {
  // eslint-disable-next-line prefer-template
  const title = "Edit Participant in Room " + selectedRoomNumber;
  const roomNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const [arrivalDate, setArrivalDate] = useState(participants[selectedRoomNumber].arrival);
  const [departureDate, setDepartureDate] = useState("");
  const [password, setPassword] = useState(participants[selectedRoomNumber].password);
  const [swappedRoom, setSwappedRoom] = useState("");

  const [endStay, setEndStay] = useState(false);
  const [swapParticipant, setSwapParticipant] = useState(false);
  const [error, setError] = useState("");

  const [updateParticipantById] = useMutation(UPDATE_PARTICIPANT_BY_ID);

  const reset = () => {
    setArrivalDate(participants[selectedRoomNumber].arrival);
    setDepartureDate("");
    setPassword(participants[selectedRoomNumber].password);
    setSwappedRoom("");
    setEndStay(false);
    setSwapParticipant(false);
    setError("");
  };

  const validate = () => {
    if (!arrivalDate || !password || (endStay && !departureDate) || (swapParticipant && !swappedRoom)) {
      setError("Missing fields.");
      return false;
    }
    if (swapParticipant && swappedRoom === selectedRoomNumber) {
      setError("Invalid swap.");
      return false;
    }
    if (
      arrivalDate === participants[selectedRoomNumber].arrival &&
      password === participants[selectedRoomNumber].password && 
      !endStay && !swapParticipant
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
      if (valid && (arrivalDate || departureDate || password)) {
        await updateParticipantById({
          variables: { 
            participantId: participants[selectedRoomNumber].participantId,
            arrival: arrivalDate,
            departure: departureDate,
            password,
          },
        });
        if (swapParticipant) {
          if (swappedRoom in participants) {
            await updateParticipantById({
              variables: { 
                participantId: participants[swappedRoom].participantId,
                roomNumber: parseInt(selectedRoomNumber, 10)
              },
            });
          } 
          await updateParticipantById({
            variables: { 
              participantId: participants[selectedRoomNumber].participantId,
              roomNumber: parseInt(swappedRoom, 10)
            },
          });
        }
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
          <Flex>{participants[selectedRoomNumber].participantId}</Flex>
        </Flex>

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

        <Button onClick={() => { setEndStay(!endStay); setSwapParticipant(false); }}>End Stay</Button>
        <Button onClick={() => { setSwapParticipant(!swapParticipant); setEndStay(false); }}>Swap Participant</Button>

        { endStay && 
          <FormInputField
            label="Departure Date"
            value={departureDate}
            type="date"
            onChange={(e) => {
              setDepartureDate(e.target.value);
            }}
          />
        }

        { swapParticipant && 
          <div>
            <div>Available Rooms</div>
            <Flex>
              {roomNumbers.map((num: string) => 
                <Button key={num} onClick={() => setSwappedRoom(num)}>
                  {num}
                </Button>
              )}
            </Flex>
            { swappedRoom !== "" && (
              swappedRoom === selectedRoomNumber ? (
                <div>Participant #{participants[selectedRoomNumber].participantId} is already in Room {selectedRoomNumber}</div>
              ) : (
                <div>
                  <div>
                    Participant #{participants[selectedRoomNumber].participantId} in Room {selectedRoomNumber} will be moved to Room {swappedRoom}
                  </div>
                  { swappedRoom in participants && 
                    <div>
                      Participant #{participants[swappedRoom].participantId} in Room {swappedRoom} will be moved to Room {selectedRoomNumber}
                    </div>
                  }
                </div>
              )
            )}
          </div>
        }

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
