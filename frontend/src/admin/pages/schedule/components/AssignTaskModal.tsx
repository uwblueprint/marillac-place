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
import ModalContainer from "../../../common/form/ModalContainer";
import SelectionInput from "../../../common/form/SelectionInput";
import CoreInput from "../../../common/form/CoreInput";
import TextInput from "../../../common/form/TextInput";
import GreenButton from "../../../common/buttons/GreenButton";
import { toTitleCase } from "../../../../utils/string_helpers";

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
        <ModalContainer
            title="Assign Task"
            submit_text="Assign Task"
            submit_action={handleSave}
            cancel_action={onClose}
            error={error}
        >
            {showDropdown ? (
                <SelectionInput 
                    label="Task Name"
                    current_value={selectedTaskId}
                    action={(e: any) => setSelectedTaskId(e.target.value)}
                    mode="dropdown"
                    value_options={Object.fromEntries(
                        data?.getTasksByType?.map((task: any) => [task.task_name, task.task_id]) ?? []
                    )}
                />
            ) : (
              <>
                <Flex gap="5px" align="flex-end">
                    <Text textStyle="web.s1" color="text.light.secondary">Task Name</Text>
                    {isIndividualGoal ? (
                        <Text textStyle="web.b3" color="#000000">Individual Goal</Text>
                    ): (
                        <Text textStyle="web.b3" color="#000000">{fields?.taskName}</Text>
                    )}
                </Flex>

                <Flex w="100%" h="1px" bg="neutral.300" mt="3px" />

                {isIndividualGoal && (
                  <>
                    <CoreInput 
                        label="Goal Name"
                        current_value={fields?.goalName}
                        action={(e: any) => handleFieldChange("goalName", e.target.value)}
                        type="text"
                    />
                    <CoreInput 
                        label="Goal Description"
                        current_value={fields?.goalDescription}
                        action={(e: any) => handleFieldChange("goalDescription", e.target.value)}
                        type="text"
                    />
                  </>
                )}

                {fields && !showDropdown && (
                  <>
                    <SelectionInput 
                        label="Select Days"
                        current_value={fields.recurrence}
                        action={(val: string) => handleFieldChange("recurrence", val)}
                        mode="radio"
                        value_options={{
                            "Daily": "DAILY",
                            "Every selected day": "EVERY_SELECTED_DAYS",
                            "Any selected day": "ANY_SELECTED_DAYS"
                        }}
                    />

                    <Flex gap="5px">
                        { weekdays.map((day: string) => (
                            <GreenButton 
                                key={day}
                                text={toTitleCase(day).slice(0, 3)}
                                action={() => {
                                    const newDays = fields.days.includes(day)
                                    ? fields.days.filter((d: string) => d !== day)
                                    : [...fields.days, day];
                                    handleFieldChange("days", newDays);
                                }}
                                is_active={fields.days.includes(day)}
                            />
                        ))}
                    </Flex>

                    <SelectionInput 
                        label="Time"
                        current_value={fields.time}
                        action={(val: string) => handleFieldChange("time", val)}
                        mode="radio"
                        value_options={{
                            "Anytime": "ANYTIME",
                            "Select Time": "SPECIFIC",
                        }}
                    />

                    {fields.time === "SPECIFIC" && (
                        <Flex width="100%" alignItems="center" justifyContent="space-between">
                            <CoreInput 
                                label="Start Time"
                                current_value={fields.startTime}
                                action={(e: any) => handleFieldChange("startTime", e.target.value)}
                                type="time"
                                width="90%"
                            />
                            <CoreInput 
                                label="End Time"
                                current_value={fields.endTime}
                                action={(e: any) => handleFieldChange("endTime", e.target.value)}
                                type="time"
                                width="90%"
                            />
                        </Flex>
                    )}

                    <Flex width="100%" alignItems="center" justifyContent="space-between">
                        <CoreInput 
                            label="Marillac Bucks"
                            current_value={fields.addition}
                            action={(e: any) => handleFieldChange("addition", e.target.value)}
                            type="number"
                            width="50%"
                        />
                        <CoreInput 
                            label="Marillac Bucks Deduction"
                            current_value={fields.deduction}
                            action={(e: any) => handleFieldChange("deduction", e.target.value)}
                            type="number"
                            width="50%"
                        />
                    </Flex>

                    <TextInput 
                        label="Comments"
                        current_value={fields.comments}
                        action={(e: any) => handleFieldChange("comments", e.target.value)}
                    />
                  </>
                )}
              </>
            )}
        </ModalContainer>
    );
}