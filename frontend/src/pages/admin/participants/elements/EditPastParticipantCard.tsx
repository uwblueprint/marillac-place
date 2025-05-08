import { Modal, ModalOverlay, ModalContent, ModalBody, Flex, FormControl, FormLabel, Input, Text, Button } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { UPDATE_PARTICIPANT } from "../../../../gql/mutations"

type EditPastParticipantCardProps = {
  id: number,
  arrival: string,
  departure: string,
  close: () => void,
};

export default function EditPastParticipantCard({
  id,
  arrival,
  departure,
  close
}: EditPastParticipantCardProps) {
  const [arrivalDate, setArrivalDate] = useState(arrival);
  const [departureDate, setDepartureDate] = useState(departure);

  const [error, setError] = useState("");

  const [updateParticipant] = useMutation(UPDATE_PARTICIPANT);

  async function handleSubmit() {
    setError("");
    if (!arrivalDate || !departureDate) {
      setError("Missing fields")
    } else if (
      arrivalDate === arrival && departureDate === departure) {
      setError("No changes made");
    } else if (departureDate && arrivalDate >= departureDate) {
      setError("Arrival date must be less than departure date");
    } else {
      const today = new Date().toLocaleDateString("en-ca");
      if (arrivalDate > today) {
        setError("Arrival is in the future");
      } else if (departureDate && departureDate > today) {
        setError("Departure is in the future");
      } else {
        try {
          await updateParticipant({ variables: {
            participant_id: id,
            arrival_date: arrivalDate,
            departure_date: departureDate,
          }});
          localStorage.setItem("notification", "Participant #" + id + " updated");
          window.location.reload();
        } catch (err: any) {
          setError(err.message);
        }
      }
    }
  }

  return (
    <Modal closeOnOverlayClick={false} isOpen onClose={close} isCentered>
      <ModalOverlay/>
      <ModalContent
        boxShadow="xl"
        borderRadius="16px"
        width="450px"
        padding="20px"
      >
        <ModalBody>
          <Text textStyle="web.h3" mb="15px">Edit Past Participant</Text>
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

            <Flex gap="15px">
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
                  <Text textStyle="web.s1" color="text.light.secondary">Departure Date</Text>
                </FormLabel>
                <Input
                  variant="primary"
                  type="date"
                  value={departureDate}
                  onChange={(e: any) => setDepartureDate(e.target.value)}
                />
              </FormControl>
            </Flex>

            { error && <Text textStyle="web.b2" fontWeight="600" color="#E30000">{error}</Text> }

            <Flex
              alignItems="center"
              justifyContent="flex-end"
              gap="15px"
              mt="15px"
            >
              <Button
                variant="white"
                onClick={close}
              >
                <Text textStyle="web.s1">Cancel</Text>
              </Button>

              <Button
                variant="primaryFilled"
                onClick={ handleSubmit }
              >
                <Text textStyle="web.s1" color="white">Save Changes</Text>
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
};
