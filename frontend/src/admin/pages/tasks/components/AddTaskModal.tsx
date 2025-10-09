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
import { CREATE_TASK } from "../../../../gql/mutations";
import ModalContainer from "../../../common/form/ModalContainer";
import CoreInput from "../../../common/form/CoreInput";
import TextInput from "../../../common/form/TextInput";
import SelectionInput from "../../../common/form/SelectionInput";
import GreenButton from "../../../common/buttons/GreenButton";
import { toTitleCase } from "../../../../utils/string_helpers";

type AddTaskModalProps = {
  type: string;
  close: () => void;
};

export default function AddTaskModal({ type, close }: AddTaskModalProps) {
  const weekdays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
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
      localStorage.setItem(
        "notification",
        "Success: " + formattedType + ' Task "' + taskName + '" added.'
      );
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
        setDays([...days, day]);
      } else {
        setDays(days.filter((d) => d !== day));
      }
    } else if (recurrence === "ANY_SELECTED_DAYS") {
      if (days.length === 0) {
        setDays([day]);
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
        setDays([]);
      } else {
        setDays([day]);
      }
    }
  }

  function handleSubmit() {
    if (!taskName || !addition || !deduction) {
      setError("Missing fields");
    } else if (
      !participantPreference &&
      (recurrence === "" ||
        days.length === 0 ||
        time === "" ||
        (time === "SPECIFIC" && (startTime === "" || endTime === "")))
    ) {
      setError("Missing fields");
    } else if (Number(addition) < 0 || Number(deduction) < 0) {
      setError("Invalid values for marillac bucks");
    } else if (time === "SPECIFIC" && startTime >= endTime) {
      setError("Start time should be earlier than end time");
    } else if (recurrence === "ANY_SELECTED_DAYS" && days.length <= 1) {
      setError(
        "If the task can only be completed on a specific day, please choose 'Every selected day'"
      );
    } else {
      createTask({
        variables: {
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
        },
      });
    }
  }

  return (
    <ModalContainer
      title="Add Task"
      submit_text="Save Task"
      submit_action={handleSubmit}
      cancel_action={close}
      error={error}
    >
      <Flex gap="5px" alignItems="flex-end">
        <Text textStyle="web.s1" color="text.light.secondary">
          Task Type
        </Text>
        <Text textStyle="web.b3" color="text.light.secondary">
          {formattedType}
        </Text>
      </Flex>

      <CoreInput
        label="Task Name"
        current_value={taskName}
        action={(e: any) => setTaskName(e.target.value)}
        type="text"
      />

      {type !== "required" && (
        <Checkbox
          isChecked={participantPreference}
          onChange={(e: any) => {
            setRecurrence("PARTICIPANT_PREFERENCE");
            setDays([]);
            setTime("PARTICIPANT_PREFERENCE");
            setStartTime("");
            setEndTime("");
            setParticipantPreference(e.target.checked);
          }}
        >
          <Text textStyle="web.b3" color="#000000">
            Participant Preference?
          </Text>
        </Checkbox>
      )}

      {!participantPreference && (
        <>
          <SelectionInput
            label="Select Days"
            current_value={recurrence}
            action={(opt: string) => setRecurrence(opt)}
            mode="radio"
            value_options={{
              Daily: "DAILY",
              "Every selected day": "EVERY_SELECTED_DAYS",
              "Any selected day": "ANY_SELECTED_DAYS",
            }}
          />

          <Flex gap="5px">
            {weekdays.map((day: string) => (
              <GreenButton
                key={day}
                text={toTitleCase(day).slice(0, 3)}
                action={() => handleSelectDay(day)}
                is_active={days.includes(day)}
              />
            ))}
          </Flex>

          <SelectionInput
            label="Time"
            current_value={time}
            action={(opt: string) => {
              if (opt === "ANYTIME") {
                setStartTime("");
                setEndTime("");
              }
              setTime(opt);
            }}
            mode="radio"
            value_options={{
              Anytime: "ANYTIME",
              "Select Time": "SPECIFIC",
            }}
          />

          {time === "SPECIFIC" && (
            <Flex
              width="100%"
              alignItems="center"
              justifyContent="space-between"
            >
              <CoreInput
                label="Start Time"
                current_value={startTime}
                action={(e: any) => setStartTime(e.target.value)}
                type="time"
                width="90%"
              />
              <CoreInput
                label="End Time"
                current_value={endTime}
                action={(e: any) => setEndTime(e.target.value)}
                type="time"
                width="90%"
              />
            </Flex>
          )}
        </>
      )}

      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <CoreInput
          label="Marillac Bucks"
          current_value={addition}
          action={(e: any) => setAddition(e.target.value)}
          type="number"
          width="50%"
        />
        <CoreInput
          label="Marillac Bucks Deduction"
          current_value={deduction}
          action={(e: any) => setDeduction(e.target.value)}
          type="number"
          width="50%"
        />
      </Flex>

      <TextInput
        label="Comments"
        current_value={comments}
        action={(e: any) => setComments(e.target.value)}
      />
    </ModalContainer>
  );
}
