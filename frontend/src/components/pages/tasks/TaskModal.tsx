import React, { useState } from "react";
import {
  Text,
  Button,
  Input,
  Select,
  Flex,
  FormControl,
  FormLabel,
  Checkbox,
} from "@chakra-ui/react";

import ModalContainer from "../../common/ModalContainer";
import FormField from "../../common/FormField";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const generateOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += 30) {
      let formattedHour;
      if (hour === 0) {
        formattedHour = "12";
      } else if (hour > 12) {
        formattedHour = `${hour - 12}`;
      } else {
        formattedHour = `${hour}`;
      }
      const ampm = hour < 12 ? "am" : "pm";
      const formattedMinute = minute.toString().padStart(2, "0");
      options.push(`${formattedHour}:${formattedMinute}${ampm}`);
    }
  }
  return options;
};

const options = generateOptions();

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
              borderColor={submitPressed && !dueTime ? "red.error" : "gray.300"}
              boxShadow={
                submitPressed && !dueTime ? "0 0 2px red.error" : "none"
              }
              type="date"
              value={dueDate}
              width="200px"
              onChange={(e) => setDueDate(e.target.value)}
            />
            <Text paddingX="10px" paddingY="4px">
              at
            </Text>
            <Select
              variant="primary"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              border="solid"
              borderColor={submitPressed && !dueTime ? "red.error" : "gray.300"}
              boxShadow={
                submitPressed && !dueTime ? "0 0 2px red.error" : "none"
              }
              borderWidth="2px"
              height="34px"
              width="200px"
            >
              <option value="">Select...</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Flex>
          <Flex alignItems="center">
            <Checkbox
              w="200px"
              isChecked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              m={0}
            >
              All Day
            </Checkbox>
            <Select
              variant="primary"
              value={recurrenceFrequency}
              onChange={(e) => setRecurrenceFrequency(e.target.value)}
              border="solid"
              borderColor="gray.300"
              borderWidth="2px"
              height="34px"
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
  const [marillacBucks, setMarillacBucks] = useState("");

  const [submitPressed, setSubmitPressed] = useState(false);

  const handleSubmit = () => {
    setSubmitPressed(true);
    if (!title || !location || !dueDate || !dueTime || !marillacBucks) {
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
    setMarillacBucks("");

    setSubmitPressed(false);
  };

  const handleMoneyInput = () => {
    const inputValue = marillacBucks.replace(/[^0-9.]/g, ""); // Remove non-numeric and non-period characters

    if (inputValue) {
      const numberValue = parseFloat(inputValue).toFixed(2);
      setMarillacBucks(numberValue);
    }
  };

  // delete task api stuff
  const handleDelete = () => {};

  return (
    <ModalContainer
      title="Edit Chore"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onDelete={handleDelete}
    >
      <Flex flexDir="column" gap="20px">
        <FormField
          label="Task Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          submitPressed={submitPressed}
          required
        />

        <FormControl isRequired mt={0} pt={0}>
          <FormLabel mb="5px" color="gray.main" fontWeight="700">
            Location
          </FormLabel>

          <Select
            variant="primary"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            border="solid"
            borderWidth="2px"
            borderColor="gray.300"
            height="34px"
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
          value={marillacBucks}
          type="text"
          onChange={(e) => setMarillacBucks(e.target.value)}
          onBlur={handleMoneyInput}
          submitPressed={submitPressed}
          leftElement="$"
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
          <Button
            variant="primary"
            onClick={() => {
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
