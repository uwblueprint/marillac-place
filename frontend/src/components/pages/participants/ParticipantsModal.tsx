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

import ModalContainer from "../../common/ModalContainer";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ParticipantsModal = ({
  isOpen,
  setIsOpen,
}: Props): React.ReactElement => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [residentId, setResidentId] = useState("");
  const [password, setPassword] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [notes, setNotes] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [submitPressed, setSubmitPressed] = useState(false);

  const handleSubmit = () => {
    setSubmitPressed(true);
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !residentId ||
      !password ||
      !arrivalDate
    ) {
      // TODO: Add error handling
    } else {
      // TODO: Add API call
    }
  };

  const resetFormState = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setResidentId("");
    setPassword("");
    setArrivalDate("");
    setDepartureDate("");
    setNotes("");

    setShowPassword(false);
    setSubmitPressed(false);
  };

  return (
    <ModalContainer
      title="New Participant"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Flex flexDirection="column" gap="20px">
        <Flex gap="20px">
          <Flex flexDir="column" flex="1">
            <FormControl isRequired>
              <FormLabel marginBottom="5px" color="gray.main" fontWeight="700">
                First name
              </FormLabel>
              <Input
                variant="primary"
                borderColor={
                  submitPressed && !firstName ? "red.error" : "gray.300"
                }
                boxShadow={
                  submitPressed && !firstName ? "0 0 2px red.error" : "none"
                }
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormControl>
          </Flex>

          <Flex flexDir="column" flex="1">
            <FormControl isRequired>
              <FormLabel marginBottom="5px" color="gray.main" fontWeight="700">
                Last name
              </FormLabel>
              <Input
                variant="primary"
                borderColor={
                  submitPressed && !lastName ? "red.error" : "gray.300"
                }
                boxShadow={
                  submitPressed && !lastName ? "0 0 2px red.error" : "none"
                }
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FormControl>
          </Flex>
        </Flex>

        <Flex gap="20px">
          <Flex flexDir="column" flex="1">
            <FormControl isRequired>
              <FormLabel marginBottom="5px" color="gray.main" fontWeight="700">
                Email
              </FormLabel>
              <Input
                variant="primary"
                borderColor={submitPressed && !email ? "red.error" : "gray.300"}
                boxShadow={
                  submitPressed && !email ? "0 0 2px red.error" : "none"
                }
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
          </Flex>

          <Flex flexDir="column" flex="1">
            <FormControl isRequired>
              <FormLabel marginBottom="5px" color="gray.main" fontWeight="700">
                Phone Number
              </FormLabel>
              <Input
                variant="primary"
                borderColor={
                  submitPressed && !phoneNumber ? "red.error" : "gray.300"
                }
                boxShadow={
                  submitPressed && !phoneNumber ? "0 0 2px red.error" : "none"
                }
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </FormControl>
          </Flex>
        </Flex>

        <Flex>
          <FormControl isRequired>
            <FormLabel marginBottom="5px" color="gray.main" fontWeight="700">
              ID
            </FormLabel>
            <Input
              variant="primary"
              borderColor={
                submitPressed && !residentId ? "red.error" : "gray.300"
              }
              boxShadow={
                submitPressed && !residentId ? "0 0 2px red.error" : "none"
              }
              value={residentId}
              onChange={(e) => setResidentId(e.target.value)}
            />
          </FormControl>
        </Flex>

        <Flex>
          <FormControl isRequired>
            <FormLabel marginBottom="5px" color="gray.main" fontWeight="700">
              Password
            </FormLabel>
            <InputGroup>
              <Input
                variant="primary"
                borderColor={
                  submitPressed && !password ? "red.error" : "gray.300"
                }
                boxShadow={
                  submitPressed && !password ? "0 0 2px red.error" : "none"
                }
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement height="34px">
                <Button
                  onClick={() => setShowPassword(!showPassword)}
                  variant="icon"
                >
                  {!showPassword ? (
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
              <FormLabel marginBottom="5px" color="gray.main" fontWeight="700">
                Arrival Date
              </FormLabel>
              <Input
                variant="primary"
                borderColor={
                  submitPressed && !arrivalDate ? "red.error" : "gray.300"
                }
                boxShadow={
                  submitPressed && !arrivalDate ? "0 0 2px red.error" : "none"
                }
                value={arrivalDate}
                type="date"
                onChange={(e) => setArrivalDate(e.target.value)}
              />
            </FormControl>
          </Flex>

          <Flex flexDir="column" flex="1">
            <FormControl>
              <FormLabel marginBottom="5px" color="gray.main" fontWeight="700">
                Departure Date
              </FormLabel>
              <Input
                variant="primary"
                value={departureDate}
                type="date"
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </FormControl>
          </Flex>
        </Flex>

        <Flex>
          <FormControl>
            <FormLabel marginBottom="5px" color="gray.main" fontWeight="700">
              Notes
            </FormLabel>
            <Textarea
              variant="primary"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </FormControl>
        </Flex>

        <Flex justifyContent="flex-end">
          <Button
            variant="clear"
            marginRight="8px"
            onClick={() => {
              resetFormState();
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add Participant
          </Button>
        </Flex>
      </Flex>
    </ModalContainer>
  );
};

export default ParticipantsModal;
