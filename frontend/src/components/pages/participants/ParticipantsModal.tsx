import React, { useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Flex,
  FormControl,
  FormLabel,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ParticipantsModal = ({ setOpen }: Props): React.ReactElement => {
  const [participant, setParticipant] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    ID: "",
    password: "",
    arrivalDate: "",
    departureDate: "",
    notes: "",
  });

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParticipant({ ...participant, firstName: e.target.value });
  };
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParticipant({ ...participant, lastName: e.target.value });
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParticipant({ ...participant, email: e.target.value });
  };
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParticipant({ ...participant, phoneNumber: e.target.value });
  };
  const handleIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParticipant({ ...participant, ID: e.target.value });
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParticipant({ ...participant, password: e.target.value });
  };
  const handleArrivalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParticipant({ ...participant, arrivalDate: e.target.value });
  };
  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParticipant({ ...participant, departureDate: e.target.value });
  };
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setParticipant({ ...participant, notes: e.target.value });
  };

  const [submitPressed, setSubmitPressed] = useState(false);
  const onSubmit = () => {
    setSubmitPressed(true);
    if (
      !participant.firstName ||
      !participant.lastName ||
      !participant.email ||
      !participant.phoneNumber ||
      !participant.ID ||
      !participant.password ||
      !participant.arrivalDate
    ) {
      console.log("some field is missing");
    } else {
      console.log(participant);
    }
  };

  return (
    <>
      <Flex flexDirection="column" gap="20px">
        <Flex gap="20px">
          <Flex flexDir="column" flex="1">
            <FormControl isRequired>
              <FormLabel marginBottom="5px" color="#626262" fontWeight="700">
                First name
              </FormLabel>
              <Input
                variant="primary"
                borderColor={
                  submitPressed && !participant.firstName
                    ? "#E30000BB"
                    : "#C5C8D8"
                }
                boxShadow={
                  submitPressed && !participant.firstName
                    ? "0 0 2px #E30000BB"
                    : "none"
                }
                value={participant.firstName}
                onChange={handleFirstNameChange}
              />
            </FormControl>
          </Flex>

          <Flex flexDir="column" flex="1">
            <FormControl isRequired>
              <FormLabel marginBottom="5px" color="#626262" fontWeight="700">
                Last name
              </FormLabel>
              <Input
                variant="primary"
                borderColor={
                  submitPressed && !participant.lastName
                    ? "#E30000BB"
                    : "#C5C8D8"
                }
                boxShadow={
                  submitPressed && !participant.lastName
                    ? "0 0 2px #E30000BB"
                    : "none"
                }
                value={participant.lastName}
                onChange={handleLastNameChange}
              />
            </FormControl>
          </Flex>
        </Flex>

        <Flex gap="20px">
          <Flex flexDir="column" flex="1">
            <FormControl isRequired>
              <FormLabel marginBottom="5px" color="#626262" fontWeight="700">
                Email
              </FormLabel>
              <Input
                variant="primary"
                borderColor={
                  submitPressed && !participant.email ? "#E30000BB" : "#C5C8D8"
                }
                boxShadow={
                  submitPressed && !participant.email
                    ? "0 0 2px #E30000BB"
                    : "none"
                }
                type="email"
                value={participant.email}
                onChange={handleEmailChange}
              />
            </FormControl>
          </Flex>

          <Flex flexDir="column" flex="1">
            <FormControl isRequired>
              <FormLabel marginBottom="5px" color="#626262" fontWeight="700">
                Phone Number
              </FormLabel>
              <Input
                variant="primary"
                borderColor={
                  submitPressed && !participant.phoneNumber
                    ? "#E30000BB"
                    : "#C5C8D8"
                }
                boxShadow={
                  submitPressed && !participant.phoneNumber
                    ? "0 0 2px #E30000BB"
                    : "none"
                }
                type="tel"
                value={participant.phoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </FormControl>
          </Flex>
        </Flex>

        <Flex>
          <FormControl isRequired>
            <FormLabel marginBottom="5px" color="#626262" fontWeight="700">
              ID
            </FormLabel>
            <Input
              variant="primary"
              borderColor={
                submitPressed && !participant.ID ? "#E30000BB" : "#C5C8D8"
              }
              boxShadow={
                submitPressed && !participant.ID ? "0 0 2px #E30000BB" : "none"
              }
              value={participant.ID}
              onChange={handleIDChange}
            />
          </FormControl>
        </Flex>

        <Flex>
          <FormControl isRequired>
            <FormLabel marginBottom="5px" color="#626262" fontWeight="700">
              Password
            </FormLabel>
            <InputGroup>
              <Input
                variant="primary"
                borderColor={
                  submitPressed && !participant.password
                    ? "#E30000BB"
                    : "#C5C8D8"
                }
                boxShadow={
                  submitPressed && !participant.password
                    ? "0 0 2px #E30000BB"
                    : "none"
                }
                type={show ? "text" : "password"}
                value={participant.password}
                onChange={handlePasswordChange}
              />
              <InputRightElement height="34px">
                <Button onClick={handleClick} variant="icon">
                  {show ? (
                    <VisibilityIcon fontSize="small" />
                  ) : (
                    <VisibilityOffIcon fontSize="small" />
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </Flex>

        <Flex gap="20px">
          <Flex flexDir="column" flex="1">
            <FormControl isRequired>
              <FormLabel marginBottom="5px" color="#626262" fontWeight="700">
                Arrival Date
              </FormLabel>
              <Input
                variant="primary"
                borderColor={
                  submitPressed && !participant.arrivalDate
                    ? "#E30000BB"
                    : "#C5C8D8"
                }
                boxShadow={
                  submitPressed && !participant.arrivalDate
                    ? "0 0 2px #E30000BB"
                    : "none"
                }
                value={participant.arrivalDate}
                type="date"
                onChange={handleArrivalChange}
              />
            </FormControl>
          </Flex>

          <Flex flexDir="column" flex="1">
            <FormControl>
              <FormLabel marginBottom="5px" color="#626262" fontWeight="700">
                Departure Date
              </FormLabel>
              <Input
                variant="primary"
                value={participant.departureDate}
                type="date"
                onChange={handleDepartureChange}
              />
            </FormControl>
          </Flex>
        </Flex>

        <Flex>
          <FormControl>
            <FormLabel marginBottom="5px" color="#626262" fontWeight="700">
              Notes
            </FormLabel>
            <Textarea
              variant="primary"
              value={participant.notes}
              onChange={handleNotesChange}
            />
          </FormControl>
        </Flex>

        <Flex justifyContent="flex-end">
          <Button
            variant="clear"
            marginRight="8px"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Add Participant
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default ParticipantsModal;
