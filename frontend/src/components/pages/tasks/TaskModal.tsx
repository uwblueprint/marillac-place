import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  Flex,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import colors from "../../../theme/colors";
import ModalContainer from "../../common/ModalContainer";
import FormField from "../../common/FormField";
import {
  TaskType,
  Task,
  CustomTask,
  ChoreTask,
} from "../../../types/TaskTypes";
import {
  TaskRequest,
  TaskTypeEnum,
  RecurrenceFrequency,
  DaysOfWeek,
} from "../../../APIClients/Types/TaskType";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task: Task | null;
  handleDeleteTask?: (taskId: string) => Promise<void>;
  handleSaveClick: (taskId: string, task: TaskRequest) => Promise<void>;
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

const TaskModal = ({
  isOpen,
  setIsOpen,
  task,
  handleDeleteTask,
  handleSaveClick,
}: Props): React.ReactElement => {
  const [taskType, setTaskType] = useState("OPTIONAL");
  const [recurrence, setRecurrence] = useState("Does Not Repeat");
  const [marillacBucks, setMarillacBucks] = useState<number | undefined>(
    undefined,
  );
  // const [comments, setComments] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const days = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [completedOn, setCompletedOn] = useState("every");
  const [endsOn, setEndsOn] = useState("never");
  const [endsOnDate, setEndsOnDate] = useState("");
  // const [isAllDay, setIsAllDay] = useState(false);
  // const [recurrenceFrequency, setRecurrenceFrequency] = useState("");

  const [submitPressed, setSubmitPressed] = useState(false);
  const [errorSubmitting, setError] = useState("");
  const isEditMode = !!task;

  const dayIdMap = [
    { key: "MONDAY", short: "M" },
    { key: "TUESDAY", short: "Tu" },
    { key: "WEDNESDAY", short: "W" },
    { key: "THURSDAY", short: "Th" },
    { key: "FRIDAY", short: "F" },
    { key: "SATURDAY", short: "Sa" },
    { key: "SUNDAY", short: "Su" },
  ];

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (task) {
      setTaskType(task.type);
      setRecurrence(
        task.recurrenceFrequency === "ONE_TIME" ? "Does Not Repeat" : "Repeats",
      );
      setMarillacBucks(task.creditValue);

      if (task.recurrenceFrequency === "ONE_TIME") {
        const day = dayIdMap.find(
          (dayMp) => dayMp.key === task.specificDay,
        )?.short;
        if (day) {
          setSelectedDays([day]);
        }
      } else {
        setSelectedDays(
          task.repeatDays
            .map((day) => dayIdMap.find((dayMp) => dayMp.key === day)?.short)
            .filter((day): day is string => day !== undefined),
        );
      }

      setTitle(task.title);
      setDueDate(task.endDate ? task.endDate.toString() : "");
      setDueTime("");
    } else {
      setTaskType("OPTIONAL");
      setRecurrence("Does Not Repeat");
      setMarillacBucks(undefined);
      setSelectedDays([]);
      setTitle("");
      setDueDate("");
      setDueTime("");
    }
  }, [task, isOpen]);

  const handleSubmit = () => {
    setSubmitPressed(true);
    if (title === "") {
      console.log("Title is required");
      return;
    }

    // TODO: API call to add task
    let recurrenceFrequency = "ONE_TIME";
    if (recurrence === "Repeats") {
      if (completedOn === "every") {
        recurrenceFrequency = "REPEATS_PER_WEEK_SELECTED";
      } else {
        recurrenceFrequency = "REPEATS_PER_WEEK_ONCE";
      }

      if (selectedDays.length === 0) {
        console.log("Days are required");
        return;
      }
    }

    const taskRequest: TaskRequest = {
      type: taskType as TaskTypeEnum,
      title,
      description: task?.description || "No field in modal",
      creditValue: marillacBucks || 0,
      locationId: task?.locationId || 1234, // no field in modal
      endDate: endsOn === "never" ? undefined : new Date(endsOnDate),
      recurrenceFrequency: recurrenceFrequency as RecurrenceFrequency,
      repeatDays:
        recurrenceFrequency === "ONE_TIME"
          ? []
          : selectedDays.map(
              (day) =>
                dayIdMap.find((dayMp) => dayMp.short === day)
                  ?.key as DaysOfWeek,
            ),
    };
    handleSaveClick(task?.id || "", taskRequest);
    setIsOpen(false);
  };

  const resetFormState = () => {
    setTitle("");
    setLocation("");
    setDueDate("");
    setDueTime("");
    // setIsAllDay(false);
    // setRecurrenceFrequency("");
    setMarillacBucks(undefined);

    setSubmitPressed(false);
  };

  const handleMoneyInput = () => {
    // const inputValue = marillacBucks.replace(/[^0-9.]/g, ""); // Remove non-numeric and non-period characters
    // if (inputValue) {
    //   const numberValue = parseFloat(inputValue).toFixed(2);
    //   setMarillacBucks(numberValue);
    // }
  };

  // delete task api stuff
  const handleDelete = () => {
    if (handleDeleteTask && task) {
      handleDeleteTask(task.id);
      setIsOpen(false);
      resetFormState();
    }
  };

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
            <option value="OPTIONAL">Optional</option>
            <option value="REQUIRED">Required</option>
            {/* <option value="CUSTOM">Custom</option> */}
            <option value="CHORE">Chores</option>
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

              <RadioGroup
                variant="outline"
                value={completedOn}
                onChange={(value) => setCompletedOn(value)}
                colorScheme="purple"
                style={{ flexDirection: "column", display: "flex" }}
              >
                <Radio value="every"> Every Selected Day </Radio>
                <Radio value="once">One of the selected days</Radio>
              </RadioGroup>
            </Flex>

            <Flex flexDir="column">
              <h6 style={{ marginBottom: "8px" }}>Ends On</h6>
              <RadioGroup
                variant="outline"
                value={endsOn}
                onChange={(value) => setEndsOn(value)}
                colorScheme="purple"
                style={{ flexDirection: "column", display: "flex" }}
              >
                <Radio value="never" margin="0">
                  Never
                </Radio>
                <Radio value="endsOn">
                  <Flex alignItems="center" gap="12px">
                    On
                    <FormField
                      label=""
                      value={endsOnDate}
                      type="date"
                      onChange={(e) => {
                        setEndsOnDate(e.target.value);
                      }}
                      submitPressed={submitPressed}
                    />
                  </Flex>
                </Radio>
              </RadioGroup>
            </Flex>
          </>
        )}
        <FormField
          label="Marillac Bucks"
          value={marillacBucks || ""}
          type="number"
          onChange={(e) => {
            if (e.target.value) {
              setMarillacBucks(parseInt(e.target.value, 10));
            } else if (e.target.value === "") {
              setMarillacBucks(undefined);
            }
          }}
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
