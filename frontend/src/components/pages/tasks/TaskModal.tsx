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
  IconButton,
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



const TaskModal = ({ isOpen, setIsOpen }: Props): React.ReactElement => {
  const [taskType, setTaskType] = useState("");
  const [recurrence, setRecurrence] = useState("");
  const [marillacBucks, setMarillacBucks] = useState("");

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState("");
  

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
      <FormControl isRequired mt={0} pt={0}>
          <FormLabel mb="5px" color="gray.main" fontWeight="700">
            Task Type
          </FormLabel>

          <Select
            variant="primary"
            value={taskType}
            onChange={(e) => setLocation(e.target.value)}
            border="solid"
            borderWidth="2px"
            borderColor="gray.300"
            height="34px"
          >
            <option value="optional">Optional</option>
            <option value="required">Required</option>
          </Select>
        </FormControl>

        <FormField
          label="Task Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          submitPressed={submitPressed}
          required
        />
       <FormControl isRequired mt={0} pt={0}>
          <FormLabel mb="5px" color="gray.main" fontWeight="700">
            Recurrence
          </FormLabel>

          <Select
            variant="primary"
            value={recurrence}
            onChange={(e) => setLocation(e.target.value)}
            border="solid"
            borderWidth="2px"
            borderColor="gray.300"
            height="34px"
          >
            <option value="Repeats">Repeats</option>
            <option value="Single">Single</option>
          </Select>
        </FormControl>
       
       
       <Flex flexDir="row">
          <h6>Select Days:</h6>
          
          <Button
          style={{
            padding: "4px",
            width: "20px",               
            borderRadius: "50%",
          }}
          >S</Button>
          <Button
          style={{
            padding: "4px",
            width: "20px",               
            borderRadius: "50%",
          }}
          >M</Button>
          <Button
          style={{
            padding: "4px",
            width: "20px",               
            borderRadius: "50%",
          }}
          >T</Button>
          <Button
          style={{
            padding: "4px",
            width: "20px",               
            borderRadius: "50%",
          }}
          >W</Button>
          <Button
          style={{
            padding: "4px",
            width: "20px",               
            borderRadius: "50%",
          }}
          >T</Button>
          <Button
          style={{
            padding: "4px",
            width: "20px",               
            borderRadius: "50%",
          }}
          >F</Button>
          <Button
          style={{
            padding: "4px",
            width: "20px",               
            borderRadius: "50%",
          }}
          >S</Button>
        </Flex>

        <Flex flexDir='column'>
            <h6 style={{ marginBottom: '8px' }}>Completed On</h6>
            <label htmlFor="freqDays">
              <input
                type="radio"
                id="freqDays"
                style={{ marginRight: '8px' }}
              />
              Every Selected Day
            </label>
            <label htmlFor="freqDays">
              <input
                type="radio"
                id="freqDays"
                style={{ marginRight: '8px' }}
              />
              One of the selected days
            </label>
        </Flex>

        <Flex flexDir='column'>
            <h6 style={{ marginBottom: '8px' }}>Ends On</h6>
            <label htmlFor="freqDays">
              <input
                type="radio"
                id="freqDays"
                style={{ marginRight: '8px' }}
              />
              Never
            </label>
        <Flex flexDir='row'>
            <label htmlFor="freqDays">
              <input
                type="radio"
                id="freqDays"
                style={{ marginRight: '8px' }}
              />
              On
            </label>
              <input 
               style={{
                width: "70px", 
                height: "30px",
                marginLeft: "10px",
                border: "1px solid black",
                borderRadius: "10px"
              }}
              />
            </Flex>
        </Flex>

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
