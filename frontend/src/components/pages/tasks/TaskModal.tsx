import React, { useState } from "react";
import {
  Text,
  Button,
  Input,
  Select,
  Flex,
  FormControl,
  FormLabel,
  InputRightElement,
  InputGroup,
  Checkbox,
} from "@chakra-ui/react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { TbTrash } from "react-icons/tb";
import { format } from 'date-fns';

import ModalContainer from "../../common/ModalContainer";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const FormField = ({
  label,
  value,
  type = "text",
  onChange,
  onBlur,
  submitPressed,
  required = false,
  isPassword = false,
  showPassword,
  setShowPassword,
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  submitPressed: boolean;
  required?: boolean;
  isPassword?: boolean;
  showPassword?: boolean;
  setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <Flex flexDir="column" flex="1">
    <FormControl isRequired={required}>
      <FormLabel mb="5px" color="gray.main" fontWeight="700">
        {label}
      </FormLabel>
      <InputGroup>
        <Input
          variant="primary"
          borderColor={submitPressed && !value ? "red.error" : "gray.300"}
          boxShadow={submitPressed && !value ? "0 0 2px red.error" : "none"}
          type={
            isPassword && setShowPassword && !showPassword ? "password" : type
          }
          value={value}
          onChange={onChange}
        />
        {isPassword && setShowPassword && (
          <InputRightElement h="34px">
            <Button
              onClick={() => setShowPassword(!showPassword)}
              bg="transparent"
              _hover={{ bg: "transparent" }}
            >
              {!showPassword ? (
                <VisibilityIcon fontSize="small" />
              ) : (
                <VisibilityOffIcon fontSize="small" />
              )}
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  </Flex>
);

const DateInput = ({
  dueDate,
  setDueDate,
  dueTime,
  setDueTime,
  isAllDay,
  setIsAllDay,
  recurrenceFrequency,
  setRecurrenceFrequency,
  submitPressed,
}: {
  dueDate: string;
  setDueDate: React.Dispatch<React.SetStateAction<string>>;
  dueTime: string;
  setDueTime: React.Dispatch<React.SetStateAction<string>>;
  isAllDay: boolean;
  setIsAllDay: React.Dispatch<React.SetStateAction<boolean>>;
  recurrenceFrequency: string;
  setRecurrenceFrequency: React.Dispatch<React.SetStateAction<string>>;
  submitPressed: boolean;
}) => {
    const formatDate = (inputDate: Date) => {
      return format(inputDate, 'yyyy-MM-dd');
    };
  
    return (
  <Flex flexDir="column" flex="1">
    <FormControl isRequired>
      <FormLabel mb="5px" color="gray.main" fontWeight="700">
        Due Date
      </FormLabel>
      <Flex flexDir="column">
        <Flex flexDir="row">
          <Input
            variant="primary"
            mb={3}
            borderColor={submitPressed && !dueDate ? "red.error" : "gray.300"}
            boxShadow={
              submitPressed && !dueDate ? "0 0 2px red.error" : "none"
            }
            type="date"
            value={dueDate ? formatDate(new Date(dueDate)) : ''}
            width="200px"
            onChange={(e) => setDueDate(e.target.value)}
          />
          <Text paddingX="10px" paddingY="4px">at</Text>
          <Input
            variant="primary"
            mb={3}
            borderColor={submitPressed && !dueTime ? "red.error" : "gray.300"}
            boxShadow={
              submitPressed && !dueTime ? "0 0 2px red.error" : "none"
            }
            type="time"
            value={dueTime}
            width="200px"
            onChange={(e) => setDueTime(e.target.value)}
          />
        </Flex>
        <Flex alignItems="center">
          <Checkbox
            w="200px"
            isChecked={isAllDay}
            onChange={(e) => setIsAllDay(e.target.checked)}
          >
            All Day
          </Checkbox>
          <Select
            variant="primary"
            value={recurrenceFrequency}
            onChange={(e) => setRecurrenceFrequency(e.target.value)}
            border="solid"
            borderColor="gray.300"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biWeekly">Bi-Weekly</option>
          </Select>
        </Flex>
      </Flex>
    </FormControl>
  </Flex>
);
};

const TaskModal = ({ isOpen, setIsOpen }: Props): React.ReactElement => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState("");
  const [unformattedMarillacBucks, setUnformattedMarillacBucks] = useState('');
  const [formattedMarillacBucks, setFormattedMarillacBucks] = useState('$');

  const [submitPressed, setSubmitPressed] = useState(false);

  const handleSubmit = () => {
    setSubmitPressed(true);
    if (!title || !location || !dueDate || !dueTime || !formattedMarillacBucks) {
      // TODO: Add error handling
    }
    // TODO: API call to add task
  };

  const resetFormState = () => {
    setTitle("");
    setLocation("");
    setDueDate("");
    setDueTime("");
    setIsAllDay(false);
    setRecurrenceFrequency("");
    setUnformattedMarillacBucks("");
    setFormattedMarillacBucks("$");

    setSubmitPressed(false);
  };

  const handleMoneyInput = () => {
    console.log("Marillac bucks field blurred. unformattedMarillacBucks: ", unformattedMarillacBucks);
    let inputValue = unformattedMarillacBucks.replace(/[^0-9.]/g, ''); // Remove non-numeric and non-period characters
    
    if (inputValue) {
      let numberValue = parseFloat(inputValue).toFixed(2);
      console.log("rounded numberValue", numberValue);
      setFormattedMarillacBucks(`$${numberValue}`);
      console.log("formattedMarillacBucks:", formattedMarillacBucks);
    }
  };
  

  return (
    <ModalContainer title="" isOpen={isOpen} setIsOpen={setIsOpen}>
      <Flex justifyContent="space-between" paddingTop="0px">
        <Text fontWeight="500" fontSize="20">Edit Chore</Text>
        <Button variant="cancel" onClick={() => {}}>
          <TbTrash style={{ color: "#E30000" }} /><span style={{ color: "#E30000" }}>&nbsp;Delete</span>
        </Button>
      </Flex>
      <Flex flexDir="column" gap="20px">
        <FormField
          label="Task Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          submitPressed={submitPressed}
          required
        />
        <FormLabel color="gray.main" fontWeight="700" mb={0}>
          Location
        </FormLabel>
        <FormControl isRequired mt={0}>
          <Select
            variant="primary"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            border="solid"
            borderColor="gray.300"
          >
            <option value="kitchen">Kitchen</option>
            <option value="livingRoom">Living Room</option>
            <option value="washroom">Washroom</option>
          </Select>
        </FormControl>
        <DateInput
          dueDate={dueDate}
          setDueDate={setDueDate}
          dueTime={dueTime}
          setDueTime={setDueTime}
          isAllDay={isAllDay}
          setIsAllDay={setIsAllDay}
          recurrenceFrequency={recurrenceFrequency}
          setRecurrenceFrequency={setRecurrenceFrequency}
          submitPressed={submitPressed}
        />
        <FormField
          label="Marillac Bucks"
          value={formattedMarillacBucks}
          type="text"
          onChange={(e) => setUnformattedMarillacBucks(e.target.value)}
          onBlur={handleMoneyInput}
          submitPressed={submitPressed}
          required
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
          <Button variant="primary" onClick={ () => {
                handleSubmit();
                setIsOpen(false);
            }}
            >
            Save
          </Button>
        </Flex>
      </Flex>
    </ModalContainer>
  );
};

export default TaskModal;