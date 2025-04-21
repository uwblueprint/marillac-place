import React, { useState } from "react";
import { Button, Flex, Input, Spinner, Text } from "@chakra-ui/react";

import { useMutation, useQuery } from "@apollo/client";

import { GET_AVAILABLE_ROOMS } from "../../../gql/queries";
import { UPDATE_PARTICIPANT_BY_ID } from "../../../gql/mutations";

import ModalContainer from "../../common/ModalContainer";
import FormInputField from "../../common/FormInputField";

import SwapSvg from "../../../assets/svg/SwapSvg";
import EndStaySvg from "../../../assets/svg/EndStaySvg";

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

  const [arrivalDate, setArrivalDate] = useState(
    participants[selectedRoomNumber].arrival,
  );
  const [departureDate, setDepartureDate] = useState("");
  const [password, setPassword] = useState(
    participants[selectedRoomNumber].password,
  );
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
    if (
      !arrivalDate ||
      !password ||
      (endStay && !departureDate) ||
      (swapParticipant && !swappedRoom)
    ) {
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
      !endStay &&
      !swapParticipant
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
            departure: endStay ? departureDate : "",
            password,
          },
        });
        if (swapParticipant) {
          if (swappedRoom in participants) {
            await updateParticipantById({
              variables: {
                participantId: participants[swappedRoom].participantId,
                roomNumber: parseInt(selectedRoomNumber, 10),
              },
            });
          }
          await updateParticipantById({
            variables: {
              participantId: participants[selectedRoomNumber].participantId,
              roomNumber: parseInt(swappedRoom, 10),
            },
          });
        }
        if (endStay) {
          localStorage.setItem("notification", "Removed participant.");
        } else if (swapParticipant) {
          localStorage.setItem("notification", "Swapped.");
        } else {
          localStorage.setItem("notification", "Changes saved.");
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
        {error && <Flex textColor="red.800">{error}</Flex>}

        <Flex flexDir="column">
          <Flex mb="5px" color="neutral.300" fontWeight="700">
            ID Number
          </Flex>
          <Input
            variant="outline"
            type="text"
            isDisabled
            value={participants[selectedRoomNumber].participantId}
            borderWidth="2px"
            borderColor="neutral.300"
          />
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

        <Flex justifyContent="flex-start">
          <Button
            variant="greenOutline"
            _hover={{ bg: "#E3ECEB" }}
            bg={swapParticipant ? "#E3ECEB" : ""}
            mr="8px"
            onClick={() => {
              setSwapParticipant(!swapParticipant);
              setSwappedRoom("");
              setEndStay(false);
            }}
          >
            <SwapSvg />
            <Flex ml="7px">Swap Participant</Flex>
          </Button>

          <Button
            _hover={{ bg: "danger.100" }}
            bg={endStay ? "danger.100" : ""}
            variant="redOutline"
            onClick={() => {
              setEndStay(!endStay);
              setDepartureDate("");
              setSwapParticipant(false);
            }}
          >
            <EndStaySvg />
            <Flex ml="7px">End Stay</Flex>
          </Button>
        </Flex>

        {(endStay || swapParticipant) && (
          <Flex
            w="100%"
            h="0px"
            borderTop="2px solid"
            borderColor="neutral.200"
          />
        )}

        {endStay && (
          <FormInputField
            label="Departure Date"
            value={departureDate}
            type="date"
            onChange={(e) => {
              setDepartureDate(e.target.value);
            }}
          />
        )}

        {swapParticipant && (
          <div>
            <Text mb="5px" color="neutral.300" fontWeight="700">
              Available Rooms
            </Text>
            <Flex gap="5px" wrap="wrap" mb="10px">
              {roomNumbers.map((num: string) => (
                <Button
                  key={num}
                  onClick={() => setSwappedRoom(num)}
                  variant="greenOutline"
                  bg={swappedRoom === num ? "primary.700" : "white"}
                  color={swappedRoom === num ? "white" : "primary.700"}
                >
                  Room {num}
                </Button>
              ))}
            </Flex>
            {swappedRoom !== "" &&
              (swappedRoom === selectedRoomNumber ? (
                <Flex>
                  Participant #{participants[selectedRoomNumber].participantId}{" "}
                  is already in Room {selectedRoomNumber}.
                </Flex>
              ) : (
                <Flex flexDir="column" gap="5px">
                  <div>
                    Participant #
                    {participants[selectedRoomNumber].participantId} in Room{" "}
                    {selectedRoomNumber} will be moved to Room {swappedRoom}.
                  </div>
                  {swappedRoom in participants && (
                    <div>
                      Participant #{participants[swappedRoom].participantId} in
                      Room {swappedRoom} will be moved to Room{" "}
                      {selectedRoomNumber}.
                    </div>
                  )}
                </Flex>
              ))}
          </div>
        )}

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
