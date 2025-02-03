import React, { useState } from "react";
import { Button, Text, Flex } from "@chakra-ui/react";
import ModalContainer from "../../common/ModalContainer";
import FormField from "../../common/FormField";

export type ResidentEditInfo = {
  residentId: number;
  roomNumber: number;
  arrivalDate: string;
  departureDate: string;
  password: string;
};

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  residentInfo: ResidentEditInfo;
  onCloseEditModal: any;
};

const ResidentEditModal = ({
  isOpen,
  setIsOpen,
  residentInfo,
  onCloseEditModal,
}: Props): React.ReactElement => {
  const [residentId, setResidentId] = useState(residentInfo.residentId);
  const [password, setPassword] = useState(residentInfo.password);
  const [arrivalDate, setArrivalDate] = useState(residentInfo.arrivalDate);
  const [departureDate, setDepartureDate] = useState(
    residentInfo.departureDate,
  );

  const [roomNumber, setRoomNumber] = useState(residentInfo.roomNumber);

  const [showPassword, setShowPassword] = useState(false);
  const [submitPressed, setSubmitPressed] = useState(false);

  const [roomList, setRoomList] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [residentIdList, setresidentIdList] = useState<Array<number>>([
    12345, 67890, 23456, 78901, 34567, 89012, 45678, 56789, 12346, 67891, 23457,
    78902, 34568, 89013, 45679, 90124, 56790, 12347, 67892,
  ]);

  const [invalidRoomNumber, setInvalidRoomNumber] = useState("");
  const [invalidResidentId, setInvalidResidentId] = useState("");
  // useEffect(() => {
  //   // TODO: get roomList, residentIdList
  // }, []);

  const handleSubmit = () => {
    setSubmitPressed(true);
    if (roomNumber !== residentInfo.roomNumber && roomNumber in roomList) {
      setInvalidRoomNumber(
        "This room number is already taken. Note: To set this field, please remove the room number from the Resident who occupies the room.",
      );
    } else {
      setInvalidRoomNumber("");
    }

    if (
      residentId !== residentInfo.residentId &&
      residentIdList.includes(residentId)
    ) {
      setInvalidResidentId("This ID number is already taken.");
    } else {
      setInvalidResidentId("");
    }

    if (invalidRoomNumber || invalidResidentId) {
      return;
    }

    // TODO: API POST to Residents/Participants

    if (!residentId || !password || !arrivalDate) {
      // TODO: Add error handling
    }
    // TODO: API call to add resident
  };

  const resetFormState = () => {
    onCloseEditModal();
  };

  return (
    <ModalContainer title="Edit Resident" isOpen={isOpen} setIsOpen={setIsOpen}>
      <Flex flexDir="column" gap="20px">
        <Flex flexDir="column">
          <FormField
            label="ID Number"
            value={residentId.toString()}
            type="number"
            onChange={(e) => setResidentId(parseInt(e.target.value, 10))}
            submitPressed={submitPressed}
            required
            error={invalidResidentId !== ""}
          />
          {invalidResidentId && (
            <Text mb="5px" mt="1px" color="red.error" fontWeight="700">
              {invalidResidentId}
            </Text>
          )}
        </Flex>

        <Flex flexDir="column">
          <FormField
            label="Room Number (Optional)"
            value={roomNumber.toString()}
            type="number"
            onChange={(e) => setRoomNumber(parseInt(e.target.value, 10))}
            submitPressed={submitPressed}
            error={invalidRoomNumber !== ""}
          />
          {invalidRoomNumber && (
            <Text mb="5px" color="red.error" fontWeight="700">
              {invalidRoomNumber}
            </Text>
          )}
        </Flex>

        <Flex gap="20px">
          <FormField
            label="Arrival Date"
            value={arrivalDate.toString()}
            type="date"
            onChange={() => {}}
            submitPressed={submitPressed}
            required
          />
          <FormField
            label="Departure Date (Optional)"
            value={departureDate.toString()}
            type="date"
            onChange={(e) => setDepartureDate(e.target.value)}
            submitPressed={submitPressed}
          />
        </Flex>
        <Flex>
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
            Save
          </Button>
        </Flex>
      </Flex>
    </ModalContainer>
  );
};

export default ResidentEditModal;
