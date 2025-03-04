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
import FormInputField from "../../common/form/FormInputField";
import {
  TaskType,
  Task,
  ChoreTask,
  Status,
  RecurrenceFrequency,
  DaysOfWeek,
  TaskTypeEnum,
  TaskResponse,
  TaskRequest,
} from "../../../types/TaskTypes";
// import {
//   TaskRequest,
//   TaskTypeEnum,
//   RecurrenceFrequency,
//   DaysOfWeek,
// } from "../../../APIClients/Types/TaskType";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task: TaskResponse | null;
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
  const [recurrence, setRecurrence] = useState<boolean>(false);
  const [marillacBucks, setMarillacBucks] = useState<number | undefined>(
    undefined,
  );
  const [selectedDays, setSelectedDays] = useState<(string | undefined)[]>([]);
  const days = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];

  const [title, setTitle] = useState("");
  const [endsOn, setEndsOn] = useState("never");
  const [endsOnDate, setEndsOnDate] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<DaysOfWeek[]>(
    [],
  );
  const [errorSubmitting, setError] = useState("");
  const isEditMode = !!task;

  const dayIdMap = [
    { key: DaysOfWeek.MONDAY, short: "M" },
    { key: DaysOfWeek.TUESDAY, short: "Tu" },
    { key: DaysOfWeek.WEDNESDAY, short: "W" },
    { key: DaysOfWeek.THURSDAY, short: "Th" },
    { key: DaysOfWeek.FRIDAY, short: "F" },
    { key: DaysOfWeek.SATURDAY, short: "Sa" },
    { key: DaysOfWeek.SUNDAY, short: "Su" },
  ];

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (task) {
      setTaskType(task.type);
      setRecurrence(task.isReccuring);
      setMarillacBucks(task.credit);
      if (task.isReccuring) {
        const daysShort = task.repeatDays
          ?.map((day) => dayIdMap.find((item) => item.key === day)?.short)
          .filter((short) => short !== undefined);

        setRecurrenceFrequency(task.repeatDays || []);
        setSelectedDays(daysShort || []);
      }
      setTitle(task.name);
    } else {
      setTaskType("OPTIONAL");
      setRecurrence(false);
      setMarillacBucks(undefined);
      setSelectedDays([]);
      setTitle("");
    }
  }, [task, isOpen]);

  const handleSubmit = () => {
    if (title === "") {
      console.log("Title is required");
      return;
    }
    if (recurrence) {
      if (selectedDays.length === 0) {
        console.log("Days are required");
        return;
      }
    }
    const taskRequest: TaskRequest = {
      type: taskType as TaskTypeEnum,
      name: title,
      credit: marillacBucks || 0,
      start: new Date(),
      end: endsOn === "never" ? undefined : new Date(endsOnDate),
      isRecurring: recurrence,
      repeatDays: recurrence
        ? selectedDays.map(
            (day) =>
              dayIdMap.find((dayMp) => dayMp.short === day)?.key as DaysOfWeek,
          )
        : undefined,
    };
    handleSaveClick(task?.id.toString() || "", taskRequest);
    setIsOpen(false);
  };

  const resetFormState = () => {
    setTitle("");
    setRecurrenceFrequency([]);
    setMarillacBucks(undefined);
  };

  //   // delete task api stuff
  const handleDelete = () => {
    if (handleDeleteTask && task && isEditMode) {
      console.log(task.id.toString());
      // handleDeleteTask(task.id.toString());
      // setIsOpen(false);
      // resetFormState();
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
      title={task ? task.name : "Assign Task"}
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
            <option value="CHORE">Chores</option>
          </Select>
        </FormControl>

        <FormInputField
          label="Task Name"
          value={title}
          type="text"
          onChange={(e: any) => setTitle(e.target.value)}
        />
        <FormControl>
          <FormLabel mb="5px" color="gray.main" fontWeight="700">
            Recurrence
          </FormLabel>

          <Select
            variant="primary"
            value={recurrence ? "Repeats" : "Does Not Repeat"}
            onChange={(e) => setRecurrence(e.target.value === "Repeats")}
            border="solid"
            borderWidth="2px"
            borderColor="gray.300"
            height="34px"
          >
            <option value="Repeats">Repeats</option>
            <option value="Does Not Repeat">Does Not Repeat</option>
          </Select>
        </FormControl>
        {recurrence && (
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
                    left: `${(i + 1) * 10}px`,
                    margin: "0 5px",
                  }}
                >
                  {day}
                </Button>
              ))}
            </Flex>

            {/* <Flex flexDir="column">
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
            </Flex> */}

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
                    <FormInputField
                      label=""
                      value={endsOnDate}
                      type="date"
                      onChange={(e: any) => {
                        setEndsOnDate(e.target.value);
                      }}
                    />
                  </Flex>
                </Radio>
              </RadioGroup>
            </Flex>
          </>
        )}
        <FormInputField
          label="Marillac Bucks"
          value={marillacBucks || ""}
          type="number"
          onChange={(e: any) => {
            if (e.target.value) {
              setMarillacBucks(parseInt(e.target.value, 10));
            } else if (e.target.value === "") {
              setMarillacBucks(undefined);
            }
          }}
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
