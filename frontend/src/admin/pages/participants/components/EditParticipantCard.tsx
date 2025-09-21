import { Modal, Grid, ModalOverlay, ModalContent, ModalBody, Flex, FormControl, FormLabel, Input, InputRightElement, InputGroup, Text, Button } from "@chakra-ui/react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LogoutIcon from '@mui/icons-material/Logout';
import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import { UPDATE_PARTICIPANT } from "../../../../gql/mutations"
import ModalContainer from "../../../common/form/ModalContainer";

type EditParticipantCardProps = {
  roomNumber: number;
  participants: Record<number, any>;
  close: () => void;
};

export default function EditParticipantCard({
  roomNumber,
  participants,
  close,
}: EditParticipantCardProps) {
  const id: number = participants[roomNumber].participant_id;
  const today = new Date().toLocaleDateString("en-ca");
  const currentArrivalDate = participants[roomNumber].arrival_date;
  const currentPassword = participants[roomNumber].password;

  const [arrivalDate, setArrivalDate] = useState(currentArrivalDate);
  const [password, setPassword] = useState(currentPassword);
  const [departureDate, setDepartureDate] = useState("");

  const [swapParticipant, setSwapParticipant] = useState(false);
  const [endStay, setEndStay] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [selectedSwap, setSelectedSwap] = useState(-1);

  const [updateParticipant] = useMutation(UPDATE_PARTICIPANT);

  async function handleSubmit() {
    setError("");
    if (!arrivalDate || !password || (endStay && !departureDate) || (swapParticipant && selectedSwap === -1)) {
      setError("Missing fields")
    } else if (swapParticipant && selectedSwap === roomNumber) {
      setError("Invalid swap.");
    } else if (
      arrivalDate === currentArrivalDate &&
      password === currentPassword &&
      departureDate === "" &&
      !swapParticipant &&
      !endStay
    ) {
      setError("No changes made");
    } else if (departureDate && arrivalDate >= departureDate) {
      setError("Arrival date must be less than departure date");
    } else {
      console.log(arrivalDate);
      if (arrivalDate > today) {
        setError("Arrival is in the future");
      } else if (departureDate && departureDate > today) {
        setError("Departure is in the future");
      } else {
        try {
          await updateParticipant({
            variables: {
              participant_id: id,
              room_number: swapParticipant ? selectedSwap : undefined,
              arrival_date: arrivalDate,
              departure_date: endStay ? departureDate : undefined,
              account_removal_date: endStay ? today : undefined,
              password
            }
          });

          if (swapParticipant && selectedSwap in participants) {
            await updateParticipant({
              variables: {
                participant_id: participants[selectedSwap].participant_id,
                room_number: roomNumber,
              }
            });
          }

          if (swapParticipant) {
            let message = "Participant #" + id + " moved to Room " + selectedSwap;
            if (selectedSwap in participants) {
              message += ", Participant #" + participants[selectedSwap].participant_id + " moved to Room " + roomNumber;
            }
            localStorage.setItem("notification", message);
          } else if (endStay) {
            localStorage.setItem("notification", "Participant #" + id + " removed from Room " + roomNumber);
          } else {
            localStorage.setItem("notification", "Participant #" + id + " updated");
          }
          window.location.reload();
        } catch (err: any) {
          setError(err.message);
        }
      }
    }
  }

  return (
    <ModalContainer
      title={"Edit Participant in Room " + roomNumber}
      submit_text="Save Changes"
      submit_action={handleSubmit}
      cancel_action={close}
    >
          <Flex
            flexDir="column"
            gap="10px"
          >
            <FormControl>
              <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                <Text textStyle="web.s1" color="text.light.secondary">ID Number</Text>
              </FormLabel>
              <Input
                variant="primary"
                type="id"
                value={id}
                disabled
              />
            </FormControl>

            <FormControl>
              <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                <Text textStyle="web.s1" color="text.light.secondary">Arrival Date</Text>
              </FormLabel>
              <Input
                variant="primary"
                type="date"
                value={arrivalDate}
                onChange={(e: any) => setArrivalDate(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                <Text textStyle="web.s1" color="text.light.secondary">Password</Text>
              </FormLabel>
              <InputGroup>
                <Input
                  variant="primary"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                />
                <InputRightElement>
                  <Button
                    mr="12px"
                    onClick={() => setShowPassword(!showPassword)}
                    bg="transparent"
                    _hover={{ bg: "transparent" }}
                  >
                    { showPassword ? (
                      <VisibilityIcon fontSize="small" />
                    ) : (
                      <VisibilityOffIcon fontSize="small" />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Flex
              alignItems="center"
              justifyContent="flex-start"
              gap="15px"
              mt="15px"
            >
              <Button
                variant="secondaryOutline"
                onClick={() => {
                  setEndStay(false)
                  setDepartureDate("")
                  setError("")
                  setSwapParticipant(true)
                }}
                gap="8px"
                isActive={swapParticipant}
              >
                <SwapHorizIcon fontSize="small" />
                <Text textStyle="web.s1" color="inherit">Swap Participant</Text>
              </Button>

              <Button
                variant="red"
                onClick={() => {
                  setSwapParticipant(false)
                  setSelectedSwap(-1)
                  setError("")
                  setEndStay(true)
                }}
                gap="8px"
                isActive={endStay}
              >
                <LogoutIcon fontSize="small" />
                <Text textStyle="web.s1" color="inherit">End Stay</Text>
              </Button>
            </Flex>

            {(endStay || swapParticipant) && (
              <Flex
                w="100%"
                h="1px"
                bg="neutral.300"
                mt="10px"
              />
            )}

            { swapParticipant && (
              <Flex flexDir="column" gap="5px">
                <Text textStyle="web.s1" color="text.light.secondary">Available Rooms</Text>
                <Grid w="100%" templateColumns='repeat(4, 1fr)' gap="5px">
                  { ROOM_NUMBERS.map((num: number) => (
                    <Button
                      key={num}
                      onClick={() => setSelectedSwap(num)}
                      isActive={selectedSwap === num}
                      borderRadius="8px"
                      border="1px"
                      borderColor="#0C727E"
                      bg="#FFFFFF"
                      color="#0C727E"
                      cursor="pointer"
                      height="fit-content"
                      paddingY="8px"
                      _hover={{
                        color: "#FFFFFF",
                        bg: "#0C727E",
                      }}
                      _active={{
                        color: "#FFFFFF",
                        bg: "#0C727E",
                      }}
                      _disabled={{
                        opacity: 0.5,
                        border: "0px",
                        color: "#FFFFFF",
                        bg: "#0C727E",
                        cursor: "not-allowed",
                        pointerEvents: "none",
                      }}
                    >
                      <Text textStyle="web.s1" color="inherit">Room {num}</Text>
                    </Button>
                  ))}
                </Grid>
              </Flex>
            )}

            { selectedSwap !== -1 && (
              selectedSwap === roomNumber ? (
                <Text textStyle="web.b3">Participant #{participants[roomNumber].participant_id} is already in Room {roomNumber}.</Text>
              ) : (
                <Flex flexDir="column" gap="5px">
                  <Text textStyle="web.b3">Participant #{participants[roomNumber].participant_id} will be moved to Room {selectedSwap}.</Text>
                  { selectedSwap in participants && (
                    <Text textStyle="web.b3">Participant #{participants[selectedSwap].participant_id} will be moved to Room {roomNumber}.</Text>
                  )}
                </Flex>
              )
            )}

            { endStay && (
              <FormControl mt="10px">
                <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                  <Text textStyle="web.s1" color="text.light.secondary">Departure Date</Text>
                </FormLabel>
                <Input
                  variant="primary"
                  type="date"
                  value={departureDate}
                  onChange={(e: any) => setDepartureDate(e.target.value)}
                />
              </FormControl>
            )}

            { error && <Text textStyle="web.b2" fontWeight="600" color="#E30000">{error}</Text> }
          </Flex>
    </ModalContainer>
  );
};
