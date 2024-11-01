import React, { useState } from "react";
import {
  Button,
  Textarea,
  Flex,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";

import { useMutation } from "@apollo/client";
import ModalContainer from "../../common/ModalContainer";
import FormField from "../../common/FormField";
import {
  ADD_RESIDENT,
  UPDATE_RESIDENT,
} from "../../../APIClients/Mutations/ResidentsMutations";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ResidentModal = ({ isOpen, setIsOpen }: Props): React.ReactElement => {
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [residentId, setResidentId] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  // const [departureDate, setDepartureDate] = useState("");
  // const [notes, setNotes] = useState("");
  const [rooms, setRooms] = useState([1, 2, 3]);
  const [roomNumber, setRoomNumber] = useState(Number);

  const [showPassword, setShowPassword] = useState(false);
  const [submitPressed, setSubmitPressed] = useState(false);

  const [addResident] = useMutation(ADD_RESIDENT);

  const resetFormState = () => {
    // setFirstName("");
    // setLastName("");
    // setEmail("");
    // setPhoneNumber("");
    setResidentId(null);
    setPassword("");
    setArrivalDate("");
    // setDepartureDate("");
    // setNotes("");

    setShowPassword(false);
    setSubmitPressed(false);
  };

  const handleAddResident = async () => {
    const newResident = {
      // email,
      password,
      // firstName,
      // lastName,
      residentId,
      // birthDate: "1990-01-01", // TODO: Update fields to what they should be
      dateJoined: arrivalDate,
      roomNumber,
    };

    try {
      const response = await addResident({
        variables: { resident: newResident },
      });
      console.log("Resident added:", response.data.addResident);

      setIsOpen(false);
      resetFormState();
      window.location.reload();
    } catch (error) {
      console.log(newResident);
      console.error("Error adding resident:", error);
    }
  };

  const handleSubmit = () => {
    setSubmitPressed(true);
    if (
      // !firstName ||
      // !lastName ||
      // !email ||
      // !phoneNumber ||
      !residentId ||
      !password ||
      !arrivalDate
    ) {
      console.error("Missing field");
    }

    handleAddResident();
  };

  return (
    <ModalContainer title="New Resident" isOpen={isOpen} setIsOpen={setIsOpen}>
      <Flex flexDir="column" gap="20px">
        <FormField
          label="ID Number"
          value={residentId !== null ? residentId.toString() : ""}
          type="number"
          onChange={(e) =>
            setResidentId(e.target.value ? Number(e.target.value) : null)
          }
          submitPressed={submitPressed}
          required
        />
        <FormControl isRequired>
          <FormLabel mb="5px" color="gray.main" fontWeight="700">
            Room Number
          </FormLabel>
          <Select
            placeholder="Please select a room"
            borderWidth="2px"
            borderRadius="8px"
            borderColor="gray.300"
          >
            {rooms.map((room) => (
              <option key={room} value={room}>
                Room {room}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormField
          label="Arrival Date"
          value={arrivalDate}
          type="date"
          onChange={(e) => setArrivalDate(e.target.value)}
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
