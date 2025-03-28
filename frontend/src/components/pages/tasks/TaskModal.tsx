import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  Flex,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Box,
  InputGroup,
  InputRightElement,
  Textarea,
} from "@chakra-ui/react";
import { FilePresent } from "@mui/icons-material";
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
  TimeOption,
} from "../../../types/TaskTypes";
import NumberInput from "./NumberInput";
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
  handleDeleteTask?: (taskId: number) => Promise<void>;
  handleSaveClick: (taskId: string, task: TaskRequest) => Promise<void>;
  type: TaskType;
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
  type,
}: Props): React.ReactElement => {
  const [taskType, setTaskType] = useState<TaskTypeEnum>(TaskTypeEnum.OPTIONAL);
  const [recurrence, setRecurrence] = useState<RecurrenceFrequency>(
    RecurrenceFrequency.EVERY_SELECTED_DAYS,
  );
  const [timePreference, setTimePreference] = useState<TimeOption>(
    TimeOption.ANYTIME,
  );
  const [credit, setCredit] = useState<number>(0);
  const [deduction, setDeduction] = useState<number>(0);
  const [comment, setComment] = useState<string | undefined>();
  const [selectedDays, setSelectedDays] = useState<(string | undefined)[]>([]);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [title, setTitle] = useState("");
  const [start, setStart] = useState<string | undefined>();
  const [end, setEnd] = useState<string | undefined>();
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<
    DaysOfWeek[] | undefined[]
  >([]);
  const [errorSubmitting, setError] = useState("");
  const isEditMode = !!task;

  const dayIdMap = [
    { key: DaysOfWeek.MONDAY, short: "Mon" },
    { key: DaysOfWeek.TUESDAY, short: "Tue" },
    { key: DaysOfWeek.WEDNESDAY, short: "Wed" },
    { key: DaysOfWeek.THURSDAY, short: "Thu" },
    { key: DaysOfWeek.FRIDAY, short: "Fri" },
    { key: DaysOfWeek.SATURDAY, short: "Sat" },
    { key: DaysOfWeek.SUNDAY, short: "Sun" },
  ];

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (task) {
      console.log("Current Task: ", task)
      setTaskType(task.type);
      setRecurrence(task.recurrencePreference);
      setCredit(task.credit);
      setDeduction(task.deduction);
      setComment(task.comment);
      if(task.end) {
        setEnd(task.end);
      }
      if (task.recurrencePreference !== RecurrenceFrequency.DAILY) {
        const daysShort = task.repeatDays
          .map(
            (day) => dayIdMap.find((dayShort) => dayShort.key === day)?.short,
          )
          .filter((short) => short !== undefined);

        setRecurrenceFrequency(task.repeatDays || []);
        setSelectedDays(daysShort || []);
      } else {
        setSelectedDays(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
      }
      setTitle(task.name);
      setStart(task.start);
    } else {
      setTaskType(type as TaskTypeEnum);
      setRecurrence(RecurrenceFrequency.EVERY_SELECTED_DAYS);
      setCredit(0);
      setDeduction(0);
      setStart(undefined);
      setEnd(undefined);
      setSelectedDays([]);
      setTitle("");
      setComment(undefined);
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
      credit,
      deduction,
      start,
      end,
      recurrencePreference: recurrence,
      repeatDays: selectedDays.map(
        (day) =>
          dayIdMap.find((dayMp) => dayMp.short === day)?.key as DaysOfWeek,
      ),
      comment,
      timePreference,
    };
    handleSaveClick(task?.taskId.toString() || "", taskRequest);
    setIsOpen(false);
  };

  const resetFormState = () => {
    setTaskType(type as TaskTypeEnum);
    setRecurrence(RecurrenceFrequency.EVERY_SELECTED_DAYS);
    setCredit(0);
    setDeduction(0);
    setStart(undefined);
    setEnd(undefined);
    setSelectedDays([]);
    setTitle("");
    setComment(undefined);
  };

  const selectDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  useEffect(() => {
    if (recurrence === RecurrenceFrequency.DAILY)
      setSelectedDays(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
    else setSelectedDays([]);
  }, [recurrence]);

  return (
    <ModalContainer
      title={task ? task.name : "Assign Task"}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onDelete={() =>
        handleDeleteTask && task ? handleDeleteTask(task.taskId) : null
      }
    >
      <Flex flexDir="column" gap="20px">
        {/* Task Type Selection */}
        <FormControl>
          <FormLabel mb="5px" color="gray.main" fontWeight="700">
            Task Type
          </FormLabel>
          {type === "REQUIRED" ? (
            <FormLabel>Required</FormLabel>
          ) : (
            <RadioGroup
              variant="primary"
              value={taskType}
              onChange={(value) => setTaskType(value as TaskTypeEnum)}
              style={{ flexDirection: "column", display: "flex" }}
            >
              <Radio value="OPTIONAL">Optional</Radio>
              <Radio value="CUSTOM">Participant Preference</Radio>
            </RadioGroup>
          )}
        </FormControl>

        {/* Task Name Input */}
        <FormInputField
          label="Task Name"
          value={title}
          type="text"
          onChange={(e: any) => setTitle(e.target.value)}
        />

        {/* Recurrence Frequency Selection */}
        {taskType !== TaskTypeEnum.CUSTOM && (
          <FormControl>
            <FormLabel mb="5px" color="gray.main" fontWeight="700">
              Select Days
            </FormLabel>

            <RadioGroup
              variant="primary"
              value={recurrence}
              onChange={(value) => setRecurrence(value as RecurrenceFrequency)}
              style={{ flexDirection: "column", display: "flex" }}
            >
              <Radio value="DAILY">Daily</Radio>
              <Radio value="EVERY_SELECTED_DAYS">Every Selected Days</Radio>
              <Radio value="ANY_SELECTED_DAYS">Any Selected Days</Radio>
            </RadioGroup>

            <Flex flexDir="row" gap={2}>
              {days.map((day, i) => (
                <Button
                  isDisabled={recurrence === RecurrenceFrequency.DAILY}
                  key={i}
                  // text colour (based on if day is selected)
                  color={
                    selectedDays.includes(day) ? "white" : colors.purple.main
                  }
                  backgroundColor={
                    selectedDays.includes(day)
                      ? colors.purple.main
                      : "transparent"
                  }
                  // if button is clicked, calls selectDay on day
                  onClick={() => selectDay(day)}
                  _hover={{
                    bg: selectedDays.includes(day)
                      ? colors.purple.main
                      : "#e2e2e2",
                    color: selectedDays.includes(day) ? "white" : "gray",
                  }}
                  style={{
                    borderRadius: "5px",
                    width: "55px",
                    height: "35px",
                    border: `1px solid ${colors.purple.main}`,
                  }}
                >
                  {day}
                </Button>
              ))}
            </Flex>
          </FormControl>
        )}

        {/* Time Option Selection */}
        {taskType !== TaskTypeEnum.CUSTOM && (
          <FormControl>
            <FormLabel mb="5px" color="gray.main" fontWeight="700">
              Select Time
            </FormLabel>

            <RadioGroup
              variant="primary"
              value={timePreference}
              onChange={(value) => setTimePreference(value as TimeOption)}
              style={{ flexDirection: "column", display: "flex" }}
            >
              <Radio value="ANYTIME">Anytime</Radio>
              <Radio value="SPECIFIC">Select Time</Radio>
            </RadioGroup>
          </FormControl>
        )}

        {timePreference === TimeOption.SPECIFIC && (
          <Flex flexDir="row" gap={2}>
            <Box w="50%" flexDir="column" gap="5px">
              <FormInputField
                label="Start"
                type="text"
                value={start}
                onChange={(e: any) => setStart(e.target.value)}
              />
            </Box>
            <Box w="50%" flexDir="column" gap="5px">
              <FormInputField
                label="End"
                type="text"
                value={end}
                onChange={(e: any) => setEnd(e.target.value)}
              />
            </Box>
          </Flex>
        )}

        {/* Marillac Bucks */}
        <Flex flexDir="row">
          <FormControl>
            <FormLabel mb="5px" color="gray.main" fontWeight="700">
              Marillac Bucks
            </FormLabel>
            <NumberInput value={credit} setValue={setCredit} />
          </FormControl>

          <FormControl>
            <FormLabel mb="5px" color="gray.main" fontWeight="700">
              Marillac Bucks Deduction
            </FormLabel>
            <NumberInput value={deduction} setValue={setDeduction} />
          </FormControl>
        </Flex>

        {/* Comments */}
        <FormControl>
          <FormLabel>Comments</FormLabel>
          <Textarea
            variant="outline"
            placeholder="Add comments here"
            borderWidth="2px"
            borderColor="gray.300"
            errorBorderColor="red.300"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </FormControl>

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
