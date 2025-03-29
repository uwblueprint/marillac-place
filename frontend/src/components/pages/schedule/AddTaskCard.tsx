import React, { useState } from "react";
import {
  Text,
  Button,
  Input,
  Select,
  Flex,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { CREATE_TASK } from "../../../gql/mutations";

import ModalContainer from "../../common/ModalContainer";
import FormInputField from "../../common/form/FormInputField";

enum TaskType {
  "REQUIRED",
  "OPTIONAL",
}

enum TaskStatus {
  "UNASSIGNED",
  "ASSIGNED",
  "INCOMPLETE",
  "PENDING",
  "COMPLETE",
  "EXCUSED",
}

type AddTaskCardProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddTaskCard = ({
  isOpen,
  setIsOpen,
}: AddTaskCardProps): React.ReactElement => {
  const [taskDate, setTaskDate] = useState("");
  const [startTime, setStartTime] = useState("11:59 PM"); // Default to 11:59 PM
  const [endTime, setEndTime] = useState("11:59 PM"); // Default to 11:59 PM
  const [taskType, setTaskType] = useState("");
  const [taskName, setTaskName] = useState("");
  const [recurrence, setRecurrence] = useState(""); 
  const [marillacBucks, setMarillacBucks] = useState(""); 
  const [comment, setComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false); // State to show comment input

  const [createTask] = useMutation(CREATE_TASK);

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [completedOn, setCompletedOn] = useState("every"); // Tracks which radio button is selected
  const [ends, setEnds] = useState("never"); // Tracks ends radio button selection
  const [endsOnDate, setEndsOnDate] = useState(""); // State for "On" date input

  const handleSubmit = async () => {
    try {
      await createTask({
        variables: {
          roomNumber: 1,
          type: "REQUIRED",
          status: "COMPLETE",
          name: taskName,
          isRecurring: recurrence === "Repeats",
          recurrenceDays: selectedDays, // Pass the selected days as recurrence days
          start: new Date().toISOString(),
          end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          credit: parseInt(marillacBucks, 10) || 0,
          comment: comment || "No comment" // Pass the comment if provided
        },
      });
      console.log("Successfully added task");
    } catch (err) {
      console.error(err);
    }
  }

  // Generate time options for 12-hour format (AM/PM)
  const timeOptions = [
    "12:00 AM", "12:30 AM", "01:00 AM", "01:30 AM", "02:00 AM", "02:30 AM", 
    "03:00 AM", "03:30 AM", "04:00 AM", "04:30 AM", "05:00 AM", "05:30 AM", 
    "06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", "08:00 AM", "08:30 AM", 
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", 
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", 
    "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", 
    "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM", 
    "11:59 PM"
  ];

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <ModalContainer
      title="Assign Task"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Flex flexDir="column" gap="20px">
        <FormLabel mb="-15px" color="gray.main" fontWeight="700">
          Task Type
        </FormLabel>
        <Select
          variant="primary"
          border="solid"
          borderWidth="2px"
          borderColor="gray.300"
          height="34px"
          onChange={(e) => setTaskType(e.target.value)}
        >
          <option> Custom </option>
          <option> Required </option>
          <option> Optional </option>
          <option> Chore </option>
        </Select>

        <FormInputField
          label="Task Name"
          value={taskName}
          type="text"
          onChange={(e) => setTaskName(e.target.value)}
          required
        />

        {/* Date and Time Inputs */}
        <Flex flexDir="row" alignItems="center" gap="20px">
          <FormControl width="150px">
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={taskDate}
              placeholder="2025-01-29"
              onChange={(e) => setTaskDate(e.target.value)}
            />
          </FormControl>

          <Flex flexDir="row" gap="10px" alignItems="center" mt="40px">
            <Text mt="5px">From</Text>
            <Flex mb="10px">
              <FormControl width="150px">
                <Select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="11:59 PM"
                >
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
          </Flex>

          <Flex flexDir="row" gap="10px" alignItems="center" mt="40px">
            <Text mt="5px">To</Text>
            <Flex mb="10px">
              <FormControl width="150px">
                <Select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="11:59 PM"
                >
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
          </Flex>
        </Flex>

        <FormLabel mb="-15px" color="gray.main" fontWeight="700">
          Recurrence
        </FormLabel>
        <Select
          variant="primary"
          border="solid"
          borderWidth="2px"
          borderColor="gray.300"
          height="34px"
          onChange={(e) => setRecurrence(e.target.value)}
        >
          <option> Does Not Repeat </option>
          <option> Repeats </option>
        </Select>

        {/* Select Days section */}
        {recurrence === "Repeats" && (
          <Flex gap="10px" mt="30px" ml="10px"> {/* Increased top margin */}
            <Flex mt = "5px">
            <Text>Select Days:</Text>
            </Flex>
            {["M", "T", "W", "Th", "F", "S"].map((day) => (
              <Button
                key={day}
                onClick={() => handleDayToggle(day)}
                variant={selectedDays.includes(day) ? "solid" : "outline"}
                colorScheme="blue"
                borderRadius="50%" // Make the buttons circular
                width="35px"
                height="35px"
                padding="0"
              >
                {day}
              </Button>
            ))}
          </Flex>
        )}

        {/* Completed on section */}
        {recurrence === "Repeats" && (
          <Flex flexDir="column" gap="5px" mt="10px"> {/* Reduced gap */}
            <Text>Completed on:</Text>
            <RadioGroup onChange={setCompletedOn} value={completedOn}>
              <Stack direction="column"> {/* Stack direction changed to column */}
                <Radio value="every">Every Selected Day</Radio>
                <Radio value="one">One of the selected days</Radio>
              </Stack>
            </RadioGroup>
          </Flex>
        )}

        {/* Ends section */}
        {recurrence === "Repeats" && (
          <Flex flexDir="column" gap="5px" mt="10px"> {/* Reduced gap */}
            <Text>Ends:</Text>
            <RadioGroup onChange={setEnds} value={ends}>
              <Stack direction="column"> {/* Stack direction changed to column */}
                <Radio value="never">Never</Radio>
                <Flex alignItems="center">
                  <Radio value="on">On</Radio>
                  <Input
                    value={endsOnDate}
                    onChange={(e) => setEndsOnDate(e.target.value)}
                    placeholder="MM/DD/YYYY"
                    size="sm"
                    ml="10px"
                    width="150px"
                  />
                </Flex>
              </Stack>
            </RadioGroup>
          </Flex>
        )}

        <FormInputField
          label="Marillac Bucks"
          value={marillacBucks}
          type="text"
          onChange={(e) => setMarillacBucks(e.target.value)}
          required
        />

        <Flex flexDir="column">
          <FormLabel>Comments</FormLabel>
          <Button variant="comment" mr="8px" onClick={() => setShowCommentInput(true)}>
            + Create Comment
          </Button>
          {showCommentInput && (
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
              mt="10px"
            />
          )}
        </Flex>

        <Flex justifyContent="flex-end">
          <Button variant="cancel" mr="8px" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Assign
          </Button>
        </Flex>
      </Flex>
    </ModalContainer>
  );
};

export default AddTaskCard;
