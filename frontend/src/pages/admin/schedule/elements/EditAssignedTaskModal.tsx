import {
  RadioGroup,
  Stack,
  Radio,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
  Textarea,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  InputLeftElement,
  InputGroup,
  Checkbox,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useMutation } from "@apollo/client";
import { EDIT_ASSIGNED_TASK } from "../../../../gql/mutations";
import { formatDateTime } from "../../../../utils/formatDateTime";

type EditAssignedTaskModalType = {
  selected: any;
  close: () => void;
};

const EditAssignedTaskModal = ({
  selected,
  close,
}: EditAssignedTaskModalType) => {
  // const { data, loading, error } = useQuery(GET_ASSIGNED_TASK, {
  //   variables: { assignedTaskId: selected.assigned_task_id },
  // });

  // temp data
  const tempData = {
    assignedTaskId: 1,
    taskName: "Sample Task",
    taskStatus: "ASSIGNED",
    taskType: "INDIVIDUAL_GOAL",
    goalName: "Complete Assignment",
    goalDescription: "This is a sample goal description.",
    startDate: "2025-07-22T15:30:00",
    endDate: "2025-07-22T15:30:00",
    marillacBucksAddition: 10,
    marillacBucksDeduction: 5,
    comment: "This is a sample comment.",
  };

  const taskData = selected || tempData;

  const daysOfWeek = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  const weekdays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const [taskName, setTaskName] = useState<string>(taskData.taskName);
  const taskType: string =
    taskData.taskType.charAt(0) + taskData.taskType.slice(1).toLowerCase();
  const [goalName, setGoalName] = useState<string>(taskData.goalName || "");
  const [goalDescription, setGoalDescription] = useState<string>(
    taskData.goalDescription || ""
  );
  const [repeats, setRepeats] = useState<boolean>(taskData.repeats || false);
  const [startDate, setStartDate] = useState<Date>(
    new Date(taskData.startDate)
  );
  const [endDate, setEndDate] = useState<Date>(new Date(taskData.endDate));
  const [marillacBucksAddition, setMarillacBucksAddition] = useState<number>(
    taskData.marillacBucksAddition
  );
  const [marillacBucksDeduction, setMarillacBucksDeduction] = useState<number>(
    taskData.marillacBucksDeduction
  );
  const [comment, setComment] = useState<string>(taskData.comment || "");
  const [error, setError] = useState<string>("");

  const [days, setDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string>(
    startDate.toLocaleTimeString()
  );
  const [endTime, setEndTime] = useState<string>(endDate.toLocaleTimeString());

  // gql mutation
  const [editAssignedTask, { loading }] = useMutation(EDIT_ASSIGNED_TASK, {
    onCompleted: () => {
      localStorage.setItem(
        "notification",
        "Success: " + taskType + ' Task "' + taskName + '" updated.'
      );
      window.location.reload();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    if (!repeats) {
      const date = new Date(startDate);
      setDays([daysOfWeek[date.getDay()]]);
    } else {
      const start = new Date(startDate);
      const end = new Date(endDate);
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        setDays((prevDays) => [...prevDays, daysOfWeek[d.getDay()]]);
      }
    }
  }, []);

  function handleSelectDay(day: string) {
    const dayIndex = weekdays.indexOf(day); // Get the index of the selected day
    const selectedDayIndices = days.map((d) => weekdays.indexOf(d)); // Map current days to their indices

    if (!days.includes(day)) {
      // Add the day if it's not already selected
      if (selectedDayIndices.length === 0) {
        // If no days are selected, add the first day`
        setDays([day]);
      } else {
        const minIndex = Math.min(...selectedDayIndices);
        const maxIndex = Math.max(...selectedDayIndices);

        if (dayIndex === minIndex - 1 || dayIndex === maxIndex + 1) {
          // Add the day if it's consecutive to the current selection
          setDays(
            [...days, day].sort(
              (a, b) => weekdays.indexOf(a) - weekdays.indexOf(b)
            )
          );
        }
      }
    } else {
      // Remove the day if it's already selected
      const updatedDays = days.filter((d) => d !== day);
      setDays(updatedDays);
    }
  }
  // function handleSubmit() {
  //   if (!taskName || !marillacBucksAddition || !marillacBucksDeduction) {
  //     setError("Missing fields");
  //   } else if (
  //     !participantPreference &&
  //     (recurrencePreference === "" ||
  //       repeatDays.length === 0 ||
  //       timePreference === "" ||
  //       (timePreference === "SPECIFIC" && (startTime === "" || endTime === "")))
  //   ) {
  //     setError("Missing fields");
  //   } else if (
  //     Number(marillacBucksAddition) < 0 ||
  //     Number(marillacBucksDeduction) < 0
  //   ) {
  //     setError("Invalid values for marillac bucks");
  //   } else if (timePreference === "SPECIFIC" && startTime >= endTime) {
  //     setError("Start time should be earlier than end time");
  //   } else if (
  //     recurrencePreference === "ANY_SELECTED_DAYS" &&
  //     repeatDays.length <= 1
  //   ) {
  //     setError(
  //       "If the task can only be completed on a specific day, please choose 'Every selected day'"
  //     );
  //   } else {
  //     editAssignedTask({
  //       variables: {
  //         assignedTaskId: taskData.assigned_task_id,
  //         taskName: taskName,
  //         goalName: goalName,
  //         goalDescription: goalDescription,
  //         repeats: repeats,
  //         startDate: startDate,
  //         endDate: endDate,
  //         marillacBucksAddition: Number(marillacBucksAddition),
  //         marillacBucksDeduction: Number(marillacBucksDeduction),
  //         comment: comment,
  //       },
  //     });
  //   }
  // }

  return (
    <Modal closeOnOverlayClick={false} isOpen onClose={close} isCentered>
      <ModalOverlay />
      <ModalContent
        boxShadow="xl"
        borderRadius="16px"
        width="550px"
        maxWidth="550px"
        padding="20px"
      >
        <ModalBody>
          <Text textStyle="web.h3" mb="15px">
            Edit Task
          </Text>
          <Flex flexDir="column" gap="10px">
            <Flex gap="5px" alignItems="flex-end">
              <Text textStyle="web.s1" color="text.light.secondary">
                Task Type
              </Text>
              <Text textStyle="web.b3" color="text.light.secondary">
                {taskType}
              </Text>
            </Flex>

            <FormControl>
              <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                <Text textStyle="web.s1" color="text.light.secondary">
                  Task Name
                </Text>
              </FormLabel>
              <Input
                variant="primary"
                type="text"
                value={taskName}
                onChange={(e: any) => setTaskName(e.target.value)}
              />
            </FormControl>

            <>
              <Text textStyle="web.s1" color="text.light.secondary">
                Select Days
              </Text>

              <Flex gap="5px">
                {weekdays.map((day: string) => (
                  <Button
                    key={day}
                    onClick={() => handleSelectDay(day)}
                    isActive={days.includes(day)}
                    borderRadius="8px"
                    border="1px"
                    borderColor="#0C727E"
                    bg="#FFFFFF"
                    color="#0C727E"
                    cursor="pointer"
                    width="fit-content"
                    height="fit-content"
                    paddingY="5px"
                    _hover={{
                      color: "#FFFFFF",
                      bg: "#0C727E",
                    }}
                    _active={{
                      color: "#FFFFFF",
                      bg: "#0C727E",
                    }}
                    _disabled={{
                      opacity: 0.5,
                      border: "0px",
                      color: "#FFFFFF",
                      bg: "#0C727E",
                      cursor: "not-allowed",
                      pointerEvents: "none",
                    }}
                  >
                    <Text textStyle="web.s1" color="inherit">
                      {day.charAt(0) + day.slice(1, 3).toLowerCase()}
                    </Text>
                  </Button>
                ))}
              </Flex>

              <FormControl>
                <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                  <Text textStyle="web.s1" color="text.light.secondary">
                    Select Time
                  </Text>
                </FormLabel>
                <RadioGroup
                  value={repeats ? "ANYTIME" : "SPECIFIC"}
                  // onChange={(opt: string) => {
                  //   if (opt === "ANYTIME") {
                  //     setStartTime("");
                  //     setEndTime("");
                  //   }
                  //   setTimePreference(opt);
                  // }}
                >
                  <Stack direction="column">
                    <Radio value="ANYTIME" size="sm">
                      <Text textStyle="web.b3" color="#000000">
                        Anytime
                      </Text>
                    </Radio>
                    <Radio value="SPECIFIC" size="sm">
                      <Text textStyle="web.b3" color="#000000">
                        Select time
                      </Text>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              {!repeats && (
                <Flex gap="10px">
                  <FormControl>
                    <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                      <Text textStyle="web.s1" color="text.light.secondary">
                        Start Time
                      </Text>
                    </FormLabel>
                    <Input
                      variant="primary"
                      type="time"
                      value={startTime}
                      onChange={(e: any) => setStartTime(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                      <Text textStyle="web.s1" color="text.light.secondary">
                        End Time
                      </Text>
                    </FormLabel>
                    <Input
                      variant="primary"
                      type="time"
                      value={endTime}
                      onChange={(e: any) => setEndTime(e.target.value)}
                    />
                  </FormControl>
                </Flex>
              )}
            </>

            <Flex
              width="100%"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormControl>
                <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                  <Text textStyle="web.s1" color="text.light.secondary">
                    Marillac Bucks
                  </Text>
                </FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <AttachMoneyIcon
                      style={{ color: "inherit", fontSize: 15 }}
                    />
                  </InputLeftElement>
                  <Input
                    variant="primary"
                    type="number"
                    value={marillacBucksAddition}
                    onChange={(e: any) =>
                      setMarillacBucksAddition(e.target.value)
                    }
                    width="50%"
                    pl="30px"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                  <Text textStyle="web.s1" color="text.light.secondary">
                    Marillac Bucks Deduction
                  </Text>
                </FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <AttachMoneyIcon
                      style={{ color: "inherit", fontSize: 15 }}
                    />
                  </InputLeftElement>
                  <Input
                    variant="primary"
                    type="number"
                    value={marillacBucksDeduction}
                    onChange={(e: any) =>
                      setMarillacBucksDeduction(e.target.value)
                    }
                    width="50%"
                    pl="30px"
                  />
                </InputGroup>
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                <Text textStyle="web.s1" color="text.light.secondary">
                  Comments
                </Text>
              </FormLabel>
              <Textarea
                variant="primary"
                value={comment}
                onChange={(e: any) => setComment(e.target.value)}
                placeholder="Add comment here..."
              />
            </FormControl>

            {error && (
              <Text textStyle="web.b2" fontWeight="600" color="#E30000">
                {error}
              </Text>
            )}

            <Flex
              alignItems="center"
              justifyContent="flex-end"
              gap="15px"
              mt="15px"
            >
              <Button variant="white" onClick={close}>
                <Text textStyle="web.s1">Cancel</Text>
              </Button>

              <Button
                variant="primaryFilled"
                // onClick={handleSubmit}
                isLoading={loading}
              >
                <Text textStyle="web.s1" color="white">
                  Save
                </Text>
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditAssignedTaskModal;
