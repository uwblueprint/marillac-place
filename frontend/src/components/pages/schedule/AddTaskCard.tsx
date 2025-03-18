import React, { useState, useEffect } from "react";
import {
  Text,
  Button,
  Input,
  Select,
  Flex,
  FormControl,
  FormLabel,
  Checkbox,
} from "@chakra-ui/react";

import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { CREATE_TASK } from "../../../gql/mutations";

import ModalContainer from "../../common/ModalContainer";
import FormInputField from "../../common/form/FormInputField";


type AddTaskCardProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddTaskCard = ({
  isOpen,
  setIsOpen,
}: AddTaskCardProps): React.ReactElement => {

  const [participantId, setParticipantId] = useState(""); // Remove the participant references when possible
  const [participantIdError, setParticipantIdError] = useState("");

  const [taskType, setTaskType] = useState("");
  const [taskName, setTaskName] = useState("");
  const [recurrence, setRecurrence] = useState("");
  const [marillacBucks, setMarillacBucks] = useState(""); // use for credit field
  const [comment, setComment] = useState("");

  const [createTask] = useMutation(CREATE_TASK);

  const handleSubmit = async () => {
    try {
      await createTask({
        variables: {
          roomNumber: 1,
          type: "REQUIRED",
          status: "ASSIGNED",
          name: "test",
          isRecurring: true,
          

          credit: 10,
          comment: "this is a test"
        },
      });
      console.log("Successfully added task");
    } catch (err) {
      console.error(err);
    }
  }

  const reset = () => {
    
  }

  return (
    <ModalContainer
      title="Assign Task"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Flex flexDir="column" gap="20px">

        <FormLabel mb="-15px" color="gray.main" fontWeight="700">
          Task Type
        </FormLabel>
        <Select
          variant="primary"
          border="solid"
          borderWidth="2px"
          borderColor="gray.300"
          height="34px"
        >
          <option> Custom </option>
          <option> Required </option>
          <option> Optional </option>
          <option> Chore </option>
        </Select>

        <FormInputField
          label="Task Name"
          value={participantId}
          type="text"
          onChange={(e) => {
            setParticipantId(e.target.value);
          }}
          required
        />

        <Flex flexDir="column">
          <FormInputField
            label="Date"
            value={participantId}
            type="text"
            onChange={(e) => {
              setParticipantId(e.target.value);
            }}
            required
          />
          <Checkbox>All Day</Checkbox>
        </Flex>
        <FormLabel mb="-15px" color="gray.main" fontWeight="700">
          Recurrence
        </FormLabel>
        <Select
          variant="primary"
          border="solid"
          borderWidth="2px"
          borderColor="gray.300"
          height="34px"
        >
          <option> Does Not Repeat </option>
          <option> Repeats </option>
        </Select>

        <FormInputField
          label="Marillac Bucks"
          value={participantId}
          type="text"
          onChange={(e) => {
            setParticipantId(e.target.value);
          }}
          required
          error={participantIdError}
        />
        <Flex flexDir="column">
          <FormLabel>
            Comments
          </FormLabel>
          <Button
            variant="comment"
            mr="8px"
          >
          + Create Comment
          </Button>
        </Flex>
        <Flex justifyContent="flex-end">
          <Button
            variant="cancel"
            mr="8px"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Assign
          </Button>
        </Flex>
      </Flex>
    </ModalContainer>
  );
};

export default AddTaskCard;
