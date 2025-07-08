import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  RadioGroup,
  Stack,
  Radio,
  Divider,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useQuery } from "@apollo/client";
import { GET_TASKS_BY_TYPE } from "../../../../gql/queries";

type AssignTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AssignTaskModal({
  isOpen,
  onClose,
}: AssignTaskModalProps) {
  const weekdays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [fields, setFields] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(true);
  const [isIndividualGoal, setIsIndividualGoal] = useState(false);

  // Fetch optional tasks
  const {
    loading,
    error: queryError,
    data,
  } = useQuery(GET_TASKS_BY_TYPE, {
    variables: { type: "OPTIONAL" },
  });

  // When a task is selected, populate fields
  useEffect(() => {
    if (selectedTaskId === "individual_goal") {
      setIsIndividualGoal(true);
      setFields({
        taskName: "Individual Goal",
        goalName: "",
        goalDescription: "",
        comments: "",
        recurrence: "DAILY",
        days: [],
        time: "ANYTIME",
        startTime: "",
        endTime: "",
        addition: 0,
        deduction: 0,
        assignComment: "",
      });
      setShowDropdown(false);
    } else if (selectedTaskId && data) {
      setIsIndividualGoal(false);
      const task = data.getTasksByType.find(
        (t: any) => t.task_id === parseInt(selectedTaskId, 10)
      );
      if (task) {
        setFields({
          taskName: task.task_name,
          comments: task.comment || "",
          recurrence: task.recurrence_preference,
          days: task.repeat_days || [],
          time: task.time_preference,
          startTime: task.start_time || "",
          endTime: task.end_time || "",
          addition: task.marillac_bucks_addition || 0,
          deduction: task.marillac_bucks_deduction || 0,
          assignComment: "",
        });
        setShowDropdown(false);
      }
    } else {
      setFields(null);
      setIsIndividualGoal(false);
    }
  }, [selectedTaskId, data]);

  // Handle field changes
  const handleFieldChange = (field: string, value: any) => {
    setFields((prev: any) => ({ ...prev, [field]: value }));
  };

  // Save handler (implement mutation as needed)
  const handleSave = () => {
    if (!fields) {
      setError("Please select a task.");
      return;
    }
    // TODO: Add mutation to assign the task to a participant
    onClose();
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
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
            Assign Task
          </Text>
          <Flex flexDir="column" gap="5px">
            {showDropdown ? (
              <FormControl>
                <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                  <Text textStyle="web.s1" color="text.light.secondary">
                    Task Name
                  </Text>
                </FormLabel>
                <Select
                  placeholder="Select a task"
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  isDisabled={loading || !!queryError}
                >
                  <option value="individual_goal">Individual Goal</option>
                  {data?.getTasksByType?.map((task: any) => (
                    <option key={task.task_id} value={task.task_id}>
                      {task.task_name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <>
                <FormControl>
                  <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                    <Text textStyle="web.s1" color="text.light.secondary">
                      Task Name
                    </Text>
                  </FormLabel>
                  {isIndividualGoal ? (
                    <Text textStyle="web.b2" color="#626262" mb="5px">
                      Individual Goal
                    </Text>
                  ) : (
                    <Text textStyle="web.b2" color="#626262" mb="5px">
                      {fields?.taskName}
                    </Text>
                  )}
                </FormControl>
                <Divider my={2} />
                {isIndividualGoal && (
                  <>
                    <FormControl>
                      <FormLabel
                        mb="5px"
                        color="text.secondary"
                        fontWeight="500"
                      >
                        <Text textStyle="web.s1" color="text.light.secondary">
                          Goal Name
                        </Text>
                      </FormLabel>
                      <Input
                        variant="primary"
                        value={fields?.goalName}
                        onChange={(e) =>
                          handleFieldChange("goalName", e.target.value)
                        }
                        placeholder="Name..."
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel
                        mb="5px"
                        color="text.secondary"
                        fontWeight="500"
                      >
                        <Text textStyle="web.s1" color="text.light.secondary">
                          Goal Description
                        </Text>
                      </FormLabel>
                      <Textarea
                        variant="primary"
                        value={fields?.goalDescription}
                        onChange={(e) =>
                          handleFieldChange("goalDescription", e.target.value)
                        }
                        placeholder="Participant has to..."
                      />
                    </FormControl>
                  </>
                )}
                {!isIndividualGoal && (
                  <>
                    <FormControl>
                      <FormLabel
                        mb="5px"
                        color="text.secondary"
                        fontWeight="500"
                      >
                        <Text textStyle="web.s1" color="text.light.secondary">
                          Comments
                        </Text>
                      </FormLabel>
                      <Text color="#626262" fontSize="sm" mb={1}>
                        {fields?.comments || "No comment"}
                      </Text>
                    </FormControl>
                    <Divider my={2} />
                  </>
                )}

                {fields && !showDropdown && (
                  <>
                    <FormControl>
                      <FormLabel
                        mb="5px"
                        color="text.secondary"
                        fontWeight="500"
                      >
                        <Text textStyle="web.s1" color="text.light.secondary">
                          Select Days
                        </Text>
                      </FormLabel>
                      <RadioGroup
                        value={fields.recurrence}
                        onChange={(val) => handleFieldChange("recurrence", val)}
                      >
                        <Stack direction="column">
                          <Radio value="DAILY" size="sm">
                            <Text textStyle="web.b3" color="#000000">
                              Daily
                            </Text>
                          </Radio>
                          <Radio value="EVERY_SELECTED_DAYS" size="sm">
                            <Text textStyle="web.b3" color="#000000">
                              Every selected day
                            </Text>
                          </Radio>
                          <Radio value="ANY_SELECTED_DAYS" size="sm">
                            <Text textStyle="web.b3" color="#000000">
                              Any selected day{" "}
                              <span
                                style={{
                                  fontWeight: 400,
                                  color: "#888",
                                  fontSize: "12px",
                                }}
                              >
                                Days must be consecutive
                              </span>
                            </Text>
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                    <Flex gap="5px">
                      {weekdays.map((day: string) => (
                        <Button
                          key={day}
                          onClick={() => {
                            const newDays = fields.days.includes(day)
                              ? fields.days.filter((d: string) => d !== day)
                              : [...fields.days, day];
                            handleFieldChange("days", newDays);
                          }}
                          isActive={fields.days.includes(day)}
                          borderRadius="8px"
                          border="1px"
                          borderColor="#0C727E"
                          bg={fields.days.includes(day) ? "#0C727E" : "#FFFFFF"}
                          color={
                            fields.days.includes(day) ? "#FFFFFF" : "#0C727E"
                          }
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
                      <FormLabel
                        mb="5px"
                        color="text.secondary"
                        fontWeight="500"
                      >
                        <Text textStyle="web.s1" color="text.light.secondary">
                          Select Time
                        </Text>
                      </FormLabel>
                      <RadioGroup
                        value={fields.time}
                        onChange={(val) => handleFieldChange("time", val)}
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
                    {fields.time === "SPECIFIC" && (
                      <Flex gap="10px" mt={2}>
                        <FormControl>
                          <FormLabel
                            mb="5px"
                            color="text.secondary"
                            fontWeight="500"
                          >
                            <Text
                              textStyle="web.s1"
                              color="text.light.secondary"
                            >
                              Start Time
                            </Text>
                          </FormLabel>
                          <Input
                            variant="primary"
                            type="time"
                            value={fields.startTime}
                            onChange={(e) =>
                              handleFieldChange("startTime", e.target.value)
                            }
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel
                            mb="5px"
                            color="text.secondary"
                            fontWeight="500"
                          >
                            <Text
                              textStyle="web.s1"
                              color="text.light.secondary"
                            >
                              End Time
                            </Text>
                          </FormLabel>
                          <Input
                            variant="primary"
                            type="time"
                            value={fields.endTime}
                            onChange={(e) =>
                              handleFieldChange("endTime", e.target.value)
                            }
                          />
                        </FormControl>
                      </Flex>
                    )}
                    <Flex
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormControl>
                        <FormLabel
                          mb="5px"
                          color="text.secondary"
                          fontWeight="500"
                        >
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
                            value={fields.addition}
                            onChange={(e) =>
                              handleFieldChange("addition", e.target.value)
                            }
                            width="80%"
                            pl="30px"
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel
                          mb="5px"
                          color="text.secondary"
                          fontWeight="500"
                        >
                          <Text textStyle="web.s1" color="text.light.secondary">
                            Marillac Bucks Deductions
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
                            value={fields.deduction}
                            onChange={(e) =>
                              handleFieldChange("deduction", e.target.value)
                            }
                            width="80%"
                            pl="30px"
                          />
                        </InputGroup>
                      </FormControl>
                    </Flex>
                    <FormControl>
                      <FormLabel
                        mb="5px"
                        color="text.secondary"
                        fontWeight="500"
                      >
                        <Text textStyle="web.s1" color="text.light.secondary">
                          Comments
                        </Text>
                      </FormLabel>
                      <Textarea
                        variant="primary"
                        value={fields.assignComment}
                        onChange={(e) =>
                          handleFieldChange("assignComment", e.target.value)
                        }
                        placeholder="Add comment here..."
                      />
                    </FormControl>
                  </>
                )}
                {error && (
                  <Text textStyle="web.b2" fontWeight={600} color="#E30000">
                    {error}
                  </Text>
                )}
              </>
            )}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Flex
            alignItems="center"
            justifyContent="flex-end"
            gap="15px"
            mt="15px"
          >
            <Button variant="white" onClick={onClose}>
              <Text textStyle="web.s1">Cancel</Text>
            </Button>
            <Button
              variant="primaryFilled"
              onClick={handleSave}
              isDisabled={!fields}
              isLoading={false}
            >
              <Text textStyle="web.s1" color="white">
                Save
              </Text>
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
