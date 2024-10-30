import React, { useState, useEffect } from "react";
import { Button, Select, Flex, FormControl, FormLabel } from "@chakra-ui/react";
import colors from "../../../theme/colors";
import ModalContainer from "../../common/ModalContainer";
import FormField from "../../common/FormField";
import {
  TaskType,
  Task,
  CustomTask,
  ChoreTask,
} from "../../../types/TaskTypes";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task: Task | null;
};

// returns an array of times in 30 minute increments
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

const TaskModal = ({ isOpen, setIsOpen, task }: Props): React.ReactElement => {
  const [taskType, setTaskType] = useState("");
  const [recurrence, setRecurrence] = useState("Does Not Repeat");
  const [marillacBucks, setMarillacBucks] = useState("");
  // const [comments, setComments] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const days = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  // const [isAllDay, setIsAllDay] = useState(false);
  // const [recurrenceFrequency, setRecurrenceFrequency] = useState("");

  const [submitPressed, setSubmitPressed] = useState(false);
  const isEditMode = !!task;

  const dayIdMap = new Map<string, string>([
    ["MONDAY", "M"],
    ["TUESDAY", "Tu"],
    ["WEDNESDAY", "W"],
    ["THURSDAY", "Th"],
    ["FRIDAY", "F"],
    ["SATURDAY", "Sa"],
    ["SUNDAY", "Su"],
  ])

  useEffect(() => {
    if(task) {
      setTaskType(task.type);
      setRecurrence(task.recurrenceFrequency==="ONE_TIME"? "Does Not Repeat": "Repeats");
      setMarillacBucks(task.creditValue.toString());

      if(task.specificDay) {
        const day = dayIdMap.get(task.specificDay);
        if(day) {
          setSelectedDays([day]);
        }
      } else {
        setSelectedDays(task.repeatDays.map(day => dayIdMap.get(day || "")).filter((day): day is string => day !== undefined));
      }

      setTitle(task.title);
      setDueDate(task.endDate? task.endDate.toString(): "");
      setDueTime("");
    } else {
      setTaskType("");
      setRecurrence("Does Not Repeat");
      setMarillacBucks("");
      setSelectedDays([]);
      setTitle("");
      setDueDate("");
      setDueTime("");
    }
  }, [task]);

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
    // setIsAllDay(false);
    // setRecurrenceFrequency("");
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

  const selectDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <ModalContainer
      title={title}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onDelete={isEditMode ? handleDelete : undefined}
    >
      <Flex flexDir="column" gap="20px">
        <FormControl>
          <FormLabel mb="5px" color="gray.main" fontWeight="700">
            Task Type
          </FormLabel>

          <Select
            variant="primary"
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
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
        />
        <FormControl>
          <FormLabel mb="5px" color="gray.main" fontWeight="700">
            Recurrence
          </FormLabel>

          <Select
            variant="primary"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            border="solid"
            borderWidth="2px"
            borderColor="gray.300"
            height="34px"
          >
            <option value="Repeats">Repeats</option>
            <option value="Does Not Repeat">Does Not Repeat</option>
          </Select>
        </FormControl>
        {recurrence === "Repeats" && (
          <>
            <Flex flexDir="row">
              <h6 style={{ marginTop: "10px" }}>Select Days:</h6>

              {days.map((day, i) => (
                <Button
                  key={i}
                  // text colour (based on if day is selected)
                  color={selectedDays.includes(day) ? "white" : "gray"}
                  backgroundColor={
                    selectedDays.includes(day)
                      ? colors.purple.main
                      : "transparent"
                  }
                  // if button is clicked, calls selectDay on day
                  onClick={() => selectDay(day)}
                  // hover style based on if day is selected
                  _hover={{
                    bg: selectedDays.includes(day)
                      ? colors.purple.main
                      : "#e2e2e2",
                    color: selectedDays.includes(day) ? "white" : "gray",
                  }}
                  // same styling as before
                  style={{
                    padding: "4px",
                    width: "30px",
                    borderRadius: "50%",
                    // left: `${(index + 1) * 10}px`
                    margin: "0 5px",
                  }}
                >
                  {day}
                </Button>
              ))}
            </Flex>

            <Flex flexDir="column">
              <h6 style={{ marginBottom: "8px" }}>Completed On</h6>
              <label htmlFor="freqDays">
                <input
                  type="radio"
                  id="freqDays"
                  name="option"
                  style={{
                    marginRight: "8px",
                    accentColor: colors.purple.main,
                  }}
                />
                Every Selected Day
              </label>
              <label htmlFor="oneSelectedDay">
                <input
                  type="radio"
                  id="oneSelectedDay"
                  name="option"
                  style={{
                    marginRight: "8px",
                    accentColor: colors.purple.main,
                  }}
                />
                One of the selected days
              </label>
            </Flex>

            <Flex flexDir="column">
              <h6 style={{ marginBottom: "8px" }}>Ends On</h6>
              <label htmlFor="endsOn">
                <input
                  type="radio"
                  id="endsOn"
                  name="option2"
                  style={{
                    marginRight: "8px",
                    accentColor: colors.purple.main,
                  }}
                />
                Never
              </label>
              <Flex flexDir="row">
                <label htmlFor="endsOn2">
                  <input
                    type="radio"
                    id="endsOn2"
                    name="option2"
                    style={{
                      marginRight: "8px",
                      accentColor: colors.purple.main,
                    }}
                  />
                  On
                </label>
                <input
                  style={{
                    width: "90px",
                    height: "30px",
                    marginLeft: "10px",
                    border: "1px solid gray",
                    borderRadius: "10px",
                  }}
                />
              </Flex>
            </Flex>
          </>
        )}
        <FormField
          label="Marillac Bucks"
          value={marillacBucks}
          type="text"
          onChange={(e) => setMarillacBucks(e.target.value)}
          onBlur={handleMoneyInput}
          submitPressed={submitPressed}
          leftElement="$"
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
