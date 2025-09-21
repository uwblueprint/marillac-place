import { RadioGroup, Stack, Radio, Modal, ModalOverlay, ModalContent, ModalBody, Text, Textarea, Flex, FormControl, FormLabel, Input, Button, InputLeftElement, InputGroup, Checkbox } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useMutation } from "@apollo/client";
import { CREATE_TASK } from "../../../../gql/mutations";
import ModalContainer from "../../../common/form/ModalContainer";

type AddTaskModalProps = {
  type: string;
  close: () => void;
}

export default function AddTaskModal({
  type,
  close
}: AddTaskModalProps) {
  const weekdays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

  const [taskName, setTaskName] = useState("");
  const [participantPreference, setParticipantPreference] = useState(false);
  const [recurrence, setRecurrence] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [addition, setAddition] = useState(""); // marillac bucks
  const [deduction, setDeduction] = useState("");
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");

  const [createTask, { loading }] = useMutation(CREATE_TASK, {
    onCompleted: () => {
      localStorage.setItem("notification", "Success: " + formattedType + " Task \"" + taskName + "\" added.");
      window.location.reload();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    setDays([]);
    if (recurrence === "DAILY") {
      setDays(weekdays);
    }
  }, [recurrence]);

  useEffect(() => {
    if (days.length === 7) {
      setRecurrence("DAILY");
    }
  }, [days]);

  function handleSelectDay(day: string) {
    if (recurrence === "EVERY_SELECTED_DAYS") {
      if (!days.includes(day)) {
        setDays([...days, day])
      } else {
        setDays(days.filter(d => d !== day));
      }
    } else if (recurrence === "ANY_SELECTED_DAYS") {
      if (days.length === 0) {
        setDays([day])
      } else if (!days.includes(day)) {
        const a = weekdays.indexOf(day);
        const b = weekdays.indexOf(days[0]);
        const c = weekdays.indexOf(days[days.length - 1]);
        if (a < b) {
          setDays([...weekdays.slice(a, b), ...days]);
        } else {
          setDays([...days, ...weekdays.slice(c + 1, a + 1)]);
        }
      } else if (days.length === 1) {
        setDays([])
      } else {
        setDays([day]);
      }
    }
  }

  function handleSubmit() {
    if (!taskName || !addition || !deduction) {
      setError("Missing fields");
    } else if (!participantPreference && (
      recurrence === "" ||
      days.length === 0 ||
      time === "" ||
      (time === "SPECIFIC" && (startTime === "" || endTime === "")))) {
      setError("Missing fields");
    } else if (Number(addition) < 0 || Number(deduction) < 0) {
      setError("Invalid values for marillac bucks");
    } else if (time === "SPECIFIC" && startTime >= endTime) {
      setError("Start time should be earlier than end time");
    } else if (recurrence === "ANY_SELECTED_DAYS" && days.length <= 1) {
      setError("If the task can only be completed on a specific day, please choose 'Every selected day'");
    } else {
      createTask({ variables: {
        type: type.toUpperCase(),
        name: taskName,
        recurrencePreference: recurrence,
        repeatDays: days,
        timePreference: time,
        marillacBucks: Number(addition),
        deduction: Number(deduction),
        startTime: startTime !== "" ? startTime : undefined,
        endTime: endTime !== "" ? endTime : undefined,
        comment: comments !== "" ? comments : undefined,
      }});
    }
  }

  return (
    <ModalContainer
      title="Add Task"
      submit_text="Save Task"
      submit_action={handleSubmit}
      cancel_action={close}
    >
          <Flex
            flexDir="column"
            gap="10px"
          >
            <Flex gap="5px" alignItems="flex-end">
              <Text textStyle="web.s1" color="text.light.secondary">Task Type</Text>
              <Text textStyle="web.b3" color="text.light.secondary">{formattedType}</Text>
            </Flex>

            <FormControl>
              <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                <Text textStyle="web.s1" color="text.light.secondary">Task Name</Text>
              </FormLabel>
              <Input
                variant="primary"
                type="text"
                value={taskName}
                onChange={(e: any) => setTaskName(e.target.value)}
              />
            </FormControl>

            { type !== "required" &&  (
              <Checkbox
                isChecked={participantPreference}
                onChange={(e: any) => {
                  setRecurrence("PARTICIPANT_PREFERENCE");
                  setDays([]);
                  setTime("PARTICIPANT_PREFERENCE");
                  setStartTime("");
                  setEndTime("");
                  setParticipantPreference(e.target.checked)
                }}
              >
                <Text textStyle="web.b3" color="#000000">Participant Preference?</Text>
              </Checkbox>
            )}

            { !participantPreference && (
              <>
                <FormControl>
                  <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                    <Text textStyle="web.s1" color="text.light.secondary">Select Days</Text>
                  </FormLabel>
                  <RadioGroup value={recurrence} onChange={(opt: string) => setRecurrence(opt)}>
                    <Stack direction='column'>
                      <Radio value='DAILY' size="sm">
                        <Text textStyle="web.b3" color="#000000">Daily</Text>
                      </Radio>
                      <Radio value='EVERY_SELECTED_DAYS' size="sm">
                        <Text textStyle="web.b3" color="#000000">Every selected day</Text>
                      </Radio>
                      <Radio value='ANY_SELECTED_DAYS' size="sm">
                        <Text textStyle="web.b3" color="#000000">Any selected day</Text>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <Flex gap="5px">
                  { weekdays.map((day: string) => (
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
                      <Text textStyle="web.s1" color="inherit">{day.charAt(0) + day.slice(1, 3).toLowerCase()}</Text>
                    </Button>
                  ))}
                </Flex>

                <FormControl>
                  <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                    <Text textStyle="web.s1" color="text.light.secondary">Select Time</Text>
                  </FormLabel>
                  <RadioGroup value={time} onChange={(opt: string) => {
                    if (opt === "ANYTIME") {
                      setStartTime("");
                      setEndTime("");
                    };
                    setTime(opt);
                  }}>
                    <Stack direction='column'>
                      <Radio value='ANYTIME' size="sm">
                        <Text textStyle="web.b3" color="#000000">Anytime</Text>
                      </Radio>
                      <Radio value='SPECIFIC' size="sm">
                        <Text textStyle="web.b3" color="#000000">Select time</Text>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                { time === "SPECIFIC" &&
                <Flex gap="10px">
                  <FormControl>
                    <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                      <Text textStyle="web.s1" color="text.light.secondary">Start Time</Text>
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
                      <Text textStyle="web.s1" color="text.light.secondary">End Time</Text>
                    </FormLabel>
                    <Input
                      variant="primary"
                      type="time"
                      value={endTime}
                      onChange={(e: any) => setEndTime(e.target.value)}
                    />
                  </FormControl>
                </Flex>
                }
              </>
            )}

            <Flex width="100%" alignItems="center" justifyContent="space-between">
              <FormControl>
                <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                  <Text textStyle="web.s1" color="text.light.secondary">Marillac Bucks</Text>
                </FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <AttachMoneyIcon style={{ color: 'inherit', fontSize: 15 }} />
                  </InputLeftElement>
                  <Input
                    variant="primary"
                    type="number"
                    value={addition}
                    onChange={(e: any) => setAddition(e.target.value)}
                    width="50%"
                    pl="30px"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                  <Text textStyle="web.s1" color="text.light.secondary">Marillac Bucks Deduction</Text>
                </FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <AttachMoneyIcon style={{ color: 'inherit', fontSize: 15 }} />
                  </InputLeftElement>
                  <Input
                    variant="primary"
                    type="number"
                    value={deduction}
                    onChange={(e: any) => setDeduction(e.target.value)}
                    width="50%"
                    pl="30px"
                  />
                </InputGroup>
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                <Text textStyle="web.s1" color="text.light.secondary">Comments</Text>
              </FormLabel>
              <Textarea
                variant="primary"
                value={comments}
                onChange={(e: any) => setComments(e.target.value)}
                placeholder="Add comment here..."
              />
            </FormControl>

            { error && <Text textStyle="web.b2" fontWeight="600" color="#E30000">{error}</Text> }
          </Flex>
    </ModalContainer>
  )
}