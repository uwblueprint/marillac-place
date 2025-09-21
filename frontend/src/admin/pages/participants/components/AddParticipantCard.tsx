import React, { useState } from "react";
import { Button, Flex, Input, InputGroup, FormLabel, FormControl, Text, Modal, ModalContent, ModalHeader, ModalBody, ModalOverlay, InputRightElement } from "@chakra-ui/react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useMutation } from "@apollo/client";
import { CREATE_PARTICIPANT } from "../../../../gql/mutations";
import ModalContainer from "../../../common/form/ModalContainer";

type AddParticipantCardProps = {
  roomNumber: number;
  close: () => void;
};

const AddParticipantCard = ({
  roomNumber,
  close,
}: AddParticipantCardProps): React.ReactElement => {
  const [id, setId] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [createParticipant, { loading }] = useMutation(CREATE_PARTICIPANT, {
    onCompleted: () => {
      localStorage.setItem("notification", "Participant #" + id + " added to Room " + roomNumber);
      window.location.reload();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  function handleSubmit() {
    setError("");

    if (!id || !arrivalDate || !password) {
      setError("Missing fields");
    } else {
      const today = new Date().toLocaleDateString("en-ca");
      if (arrivalDate > today) {
        setError("Arrival is in the future");
        return;
      }

      createParticipant({ variables: {
        participant_id: Number(id),
        room_number: roomNumber,
        arrival_date: arrivalDate,
        password
      }});
    }
  }

  return (
    <ModalContainer
      title={"Add Participant to Room " + roomNumber}
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
                onChange={(e: any) => setId(e.target.value)}
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

            { error && <Text textStyle="web.b2" fontWeight="600" color="#E30000">{error}</Text> }
          </Flex>
    </ModalContainer>
  );
};

export default AddParticipantCard;
