import React, { useState } from "react";
import {
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
  dueDateTime,
  setDueDateTime,
  isAllDay,
  setIsAllDay,
  recurrenceFrequency,
  setRecurrenceFrequency,
  submitPressed,
}: {
  dueDateTime: string;
  setDueDateTime: React.Dispatch<React.SetStateAction<string>>;
  isAllDay: boolean;
  setIsAllDay: React.Dispatch<React.SetStateAction<boolean>>;
  recurrenceFrequency: string;
  setRecurrenceFrequency: React.Dispatch<React.SetStateAction<string>>;
  submitPressed: boolean;
}) => (
  <Flex flexDir="column" flex="1">
    <FormControl isRequired>
      <FormLabel mb="5px" color="gray.main" fontWeight="700">
        Due Date
      </FormLabel>
      <Flex flexDir="column">
        <Input
          variant="primary"
          mb={3}
          borderColor={submitPressed && !dueDateTime ? "red.error" : "gray.300"}
          boxShadow={
            submitPressed && !dueDateTime ? "0 0 2px red.error" : "none"
          }
          type="datetime-local"
          value={dueDateTime}
          onChange={(e) => setDueDateTime(e.target.value)}
        />
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

const TaskModal = ({ isOpen, setIsOpen }: Props): React.ReactElement => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [dueDateTime, setDueDateTime] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState("");
  const [marillacBucks, setMarillacBucks] = useState("");

  const [submitPressed, setSubmitPressed] = useState(false);

  const handleSubmit = () => {
    setSubmitPressed(true);
    if (!title || !location || !dueDateTime || !marillacBucks) {
      // TODO: Add error handling
    }
    // TODO: API call to add task
  };

  const resetFormState = () => {
    setTitle("");
    setLocation("");
    setDueDateTime("");
    setIsAllDay(false);
    setRecurrenceFrequency("");
    setMarillacBucks("");

    setSubmitPressed(false);
  };

  return (
    <ModalContainer title="New Chore" isOpen={isOpen} setIsOpen={setIsOpen}>
      <Flex flexDir="column" gap="20px">
        <FormField
          label="Task Title"
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
          dueDateTime={dueDateTime}
          setDueDateTime={setDueDateTime}
          isAllDay={isAllDay}
          setIsAllDay={setIsAllDay}
          recurrenceFrequency={recurrenceFrequency}
          setRecurrenceFrequency={setRecurrenceFrequency}
          submitPressed={submitPressed}
        />
        <FormField
          label="Marillac Bucks"
          value={marillacBucks}
          type="number"
          onChange={(e) => setMarillacBucks(e.target.value)}
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
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Flex>
      </Flex>
    </ModalContainer>
  );
};

export default TaskModal;
