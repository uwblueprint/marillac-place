import { RadioGroup, Stack, Radio, Modal, ModalOverlay, ModalContent, ModalBody, Text, Textarea, Flex, FormControl, FormLabel, Input, Button, InputLeftElement, InputGroup, Checkbox } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useMutation } from "@apollo/client";
import { EDIT_ASSIGNED_TASK } from "../../../../gql/mutations";


type EditAssignedTaskModalType = {
    selected: any,
    close: () => void
}

const EditAssignedTaskModal = ({selected, close}: EditAssignedTaskModalType) => {
    // temp data
    const tempData = {
        task_id: 1,
        task_type: "REQUIRED",
        task_name: "Sample Task",
        recurrence_preference: "DAILY",
        repeat_days: ["MONDAY", "TUESDAY"],
        time_preference: "ANYTIME",
        start_time: "",
        end_time: "",
        marillac_bucks_addition: 10,
        marillac_bucks_deduction: 5,
        comment: "This is a sample comment",
    };

    const taskData = selected || tempData;

    const weekdays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
    
      const taskType = taskData.task_type.charAt(0) + taskData.task_type.slice(1).toLowerCase();
      const [taskName, setTaskName] = useState(taskData.task_name);
      const [participantPreference, setParticipantPreference] = useState(taskData.recurrence_preference === "PARTICIPANT_PREFERENCE");
      const [recurrencePreference, setRecurrencePreference] = useState(taskData.recurrence_preference);
      const [repeatDays, setRepeatDays] = useState<string[]>(taskData.repeat_days);
      const [timePreference, setTimePreference] = useState(taskData.time_preference);
      const [startTime, setStartTime] = useState(taskData.start_time ?? "");
      const [endTime, setEndTime] = useState(taskData.end_time ?? "");
      const [marillacBucksAddition, setMarillacBucksAddition] = useState(taskData.marillac_bucks_addition);
      const [marillacBucksDeduction, setMarillacBucksDeduction] = useState(taskData.marillac_bucks_deduction);
      const [comments, setComments] = useState(taskData.comment ?? "");
      const [error, setError] = useState("");
    
      // gql mutation
      const [editAssignedTask, { loading }] = useMutation(EDIT_ASSIGNED_TASK, {
        onCompleted: () => {
          localStorage.setItem("notification", "Success: " + taskType + " Task \"" + taskName + "\" updated.");
          window.location.reload();
        },
        onError: (err) => {
          setError(err.message);
        },
      });
    
      useEffect(() => {
        setRepeatDays(taskData.repeat_days);
        if (recurrencePreference === "DAILY") {
          setRepeatDays(weekdays);
        }
      }, [recurrencePreference]);
    
      useEffect(() => {
        if (repeatDays.length === 7) {
          setRecurrencePreference("DAILY");
        }
      }, [repeatDays]);
    
      function handleSelectDay(day: string) {
        if (recurrencePreference === "EVERY_SELECTED_DAYS") {
          if (!repeatDays.includes(day)) {
            setRepeatDays([...repeatDays, day])
          } else {
            setRepeatDays(repeatDays.filter(d => d !== day));
          }
        } else if (recurrencePreference === "ANY_SELECTED_DAYS") {
          if (repeatDays.length === 0) {
            setRepeatDays([day])
          } else if (!repeatDays.includes(day)) {
            const a = weekdays.indexOf(day);
            const b = weekdays.indexOf(repeatDays[0]);
            const c = weekdays.indexOf(repeatDays[repeatDays.length - 1]);
            if (a < b) {
              setRepeatDays([...weekdays.slice(a, b), ...repeatDays]);
            } else {
              setRepeatDays([...repeatDays, ...weekdays.slice(c + 1, a + 1)]);
            }
          } else if (repeatDays.length === 1) {
            setRepeatDays([])
          } else {
            setRepeatDays([day]);
          }
        }
      }
    
      function handleSubmit() {
        if (!taskName || !marillacBucksAddition || !marillacBucksDeduction) {
          setError("Missing fields");
        } else if (!participantPreference && (
          recurrencePreference === "" ||
          repeatDays.length === 0 ||
          timePreference === "" ||
          (timePreference === "SPECIFIC" && (startTime === "" || endTime === "")))) {
          setError("Missing fields");
        } else if (Number(marillacBucksAddition) < 0 || Number(marillacBucksDeduction) < 0) {
          setError("Invalid values for marillac bucks");
        } else if (timePreference === "SPECIFIC" && startTime >= endTime) {
          setError("Start time should be earlier than end time");
        } else if (recurrencePreference === "ANY_SELECTED_DAYS" && repeatDays.length <= 1) {
          setError("If the task can only be completed on a specific day, please choose 'Every selected day'");
        } else {
          editAssignedTask({ variables: {
            id: taskData.task_id,
            type: taskData.task_type,
            name: taskName,
            recurrencePreference,
            repeatDays,
            timePreference,
            marillacBucks: Number(marillacBucksAddition),
            deduction: Number(marillacBucksDeduction),
            startTime: startTime || undefined,
            endTime: endTime || undefined,
            comment: comments || undefined,
          }});
        }
      }
    return (
        <Modal closeOnOverlayClick={false} isOpen onClose={close} isCentered>
              <ModalOverlay/>
              <ModalContent
                boxShadow="xl"
                borderRadius="16px"
                width="550px"
                maxWidth="550px"
                padding="20px"
              >
                <ModalBody>
                  <Text textStyle="web.h3" mb="15px">Edit Task</Text>
                  <Flex
                    flexDir="column"
                    gap="10px"
                  >
                    <Flex gap="5px" alignItems="flex-end">
                      <Text textStyle="web.s1" color="text.light.secondary">Task Type</Text>
                      <Text textStyle="web.b3" color="text.light.secondary">{taskType}</Text>
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
        
                    { taskData.task_type !== "REQUIRED" &&  (
                      <Checkbox
                        isChecked={participantPreference}
                        onChange={(e: any) => {
                          setRecurrencePreference("PARTICIPANT_PREFERENCE");
                          setRepeatDays([]);
                          setTimePreference("PARTICIPANT_PREFERENCE");
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
                          <RadioGroup value={recurrencePreference} onChange={(opt: string) => setRecurrencePreference(opt)}>
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
                              isActive={repeatDays.includes(day)}
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
                          <RadioGroup value={timePreference} onChange={(opt: string) => {
                            if (opt === "ANYTIME") {
                              setStartTime("");
                              setEndTime("");
                            };
                            setTimePreference(opt);
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
        
                        { timePreference === "SPECIFIC" &&
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
                            value={marillacBucksAddition}
                            onChange={(e: any) => setMarillacBucksAddition(e.target.value)}
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
                            value={marillacBucksDeduction}
                            onChange={(e: any) => setMarillacBucksDeduction(e.target.value)}
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
        
                    <Flex
                      alignItems="center"
                      justifyContent="flex-end"
                      gap="15px"
                      mt="15px"
                    >
                      <Button
                        variant="white"
                        onClick={close}
                      >
                        <Text textStyle="web.s1">Cancel</Text>
                      </Button>
        
                      <Button
                        variant="primaryFilled"
                        onClick={ handleSubmit }
                        isLoading={loading}
                      >
                        <Text textStyle="web.s1" color="white">Save</Text>
                      </Button>
                    </Flex>
                  </Flex>
                </ModalBody>
              </ModalContent>
            </Modal>
    )
}

export default EditAssignedTaskModal;