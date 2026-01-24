import React, { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { AssignedTask } from "../../../../types/models";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import TextInput from "../../../../ui/inputs/TextInput";
import NumberInput from "../../../../ui/inputs/NumberInput";
import TextAreaInput from "../../../../ui/inputs/TextAreaInput";
import { UPDATE_ASSIGNED_TASK } from "../../../../gql/assignedTaskRequests";
import useNotification from "../../../../hooks/useNotification";

type EditAssignedTaskModalProps = {
  task: AssignedTask;
  onClose: () => void;
  refetch: () => void;
};

export default function EditAssignedTaskModal({
  task,
  onClose,
  refetch,
}: EditAssignedTaskModalProps) {
  const { sendNotification } = useNotification();
  const [taskName, setTaskName] = useState(task.name);
  const [addition, setAddition] = useState(task.value);
  const [deduction, setDeduction] = useState(task.penalty);
  const [comments, setComments] = useState(task.comment ?? "");
  const [error, setError] = useState("");

  const [updateAssignedTask, { loading: updateAssignedTaskLoading }] =
    useMutation(UPDATE_ASSIGNED_TASK);
  async function handleSubmit() {
    setError("");
    if (taskName === "") {
      setError("Task name is required");
      return;
    }
    if (addition < 0 || deduction < 0) {
      setError("Marillac bucks require positive values");
      return;
    }

    try {
      await updateAssignedTask({
        variables: {
          aid: task.aid,
          name: taskName,
          value: addition,
          penalty: deduction,
          comment: comments,
        },
      });
      refetch();
      onClose();
      sendNotification("Assigned task updated successfully");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <PopupContainer
      title="Edit Assigned Task"
      submit_text="Save"
      submit_action={handleSubmit}
      cancel_action={onClose}
      loading={updateAssignedTaskLoading}
      error_message={error}
    >
      <TextInput
        label="Task Name"
        current_value={taskName}
        update_action={setTaskName}
        size="large"
      />

      <Flex alignItems="center" gap="8px">
        <NumberInput
          size="small"
          label="Marillac Bucks"
          current_value={addition}
          update_action={setAddition}
        />
        <NumberInput
          size="small"
          label="Marillac Bucks Deduction"
          current_value={deduction}
          update_action={setDeduction}
        />
      </Flex>

      <TextAreaInput
        label="Comments"
        current_value={comments}
        update_action={setComments}
        size="large"
      />
    </PopupContainer>
  );
}
