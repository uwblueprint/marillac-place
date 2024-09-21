import React, { useState } from "react";
import {
  Button,
  Textarea,
  Flex,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

import ModalContainer from "../../common/ModalContainer";
import FormField from "../../common/FormField";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ResidentModal = ({ isOpen, setIsOpen }: Props): React.ReactElement => {
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
    }
    // TODO: API call to add resident
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
    <ModalContainer title="New Resident" isOpen={isOpen} setIsOpen={setIsOpen}>
      <Flex flexDir="column" gap="20px">
        <Flex gap="20px">
          <FormField
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            submitPressed={submitPressed}
            required
          />
          <FormField
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            submitPressed={submitPressed}
            required
          />
        </Flex>
        <Flex gap="20px">
          <FormField
            label="Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            submitPressed={submitPressed}
            required
          />
          <FormField
            label="Phone Number"
            value={phoneNumber}
            type="tel"
            onChange={(e) => setPhoneNumber(e.target.value)}
            submitPressed={submitPressed}
            required
          />
        </Flex>
        <FormField
          label="ID"
          value={residentId}
          type="number"
          onChange={(e) => setResidentId(e.target.value)}
          submitPressed={submitPressed}
          required
        />
        <FormField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          submitPressed={submitPressed}
          required
          isPassword
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
        <Flex gap="20px">
          <FormField
            label="Arrival Date"
            value={arrivalDate}
            type="date"
            onChange={(e) => setArrivalDate(e.target.value)}
            submitPressed={submitPressed}
            required
          />
          <FormField
            label="Departure Date"
            value={departureDate}
            type="date"
            onChange={(e) => setDepartureDate(e.target.value)}
            submitPressed={submitPressed}
          />
        </Flex>
        <Flex>
          <FormControl>
            <FormLabel mb="5px" color="gray.main" fontWeight="700">
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
            variant="cancel"
            mr="8px"
            onClick={() => {
              resetFormState();
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add Resident
          </Button>
        </Flex>
      </Flex>
    </ModalContainer>
  );
};

export default ResidentModal;
