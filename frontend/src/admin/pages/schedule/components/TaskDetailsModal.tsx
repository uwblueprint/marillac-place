import { Text, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { AssignedTask } from "../../../../types/models";
import { TaskStatus } from "../../../../types/enums";
import {
  DELETE_ASSIGNED_TASK,
  UPDATE_ASSIGNED_TASK_STATUS,
} from "../../../../gql/assignedTaskRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import FixedInput from "../../../../ui/inputs/FixedInput";
import { toTitleCase } from "../../../../helpers/stringUtils";
import { formatDateV3 } from "../../../../helpers/formatDateTime";
import { formatCurrency } from "../../../../helpers/formatCurrency";
import BlackOutlineButton from "../../../../ui/buttons/BlackOutlineButton";
import {
  Assigned,
  Complete,
  Excused,
  Incomplete,
} from "../../../../ui/icons/StatusIcons";
import EditAssignedTaskModal from "./EditAssignedTaskModal";

interface TaskDetailsModalProps {
  task: AssignedTask;
  onClose: () => void;
  refetch: () => void;
}

export default function TaskDetailsModal({
  task,
  onClose,
  refetch,
}: TaskDetailsModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(task.status);
  const [editDetails, setEditDetails] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [deleteAssignedTask, { loading: deleteAssignedTaskLoading }] =
    useMutation(DELETE_ASSIGNED_TASK);
  const handleDelete = async () => {
    try {
      await deleteAssignedTask({
        variables: {
          aid: task.aid,
        },
      });
      refetch();
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const [updateTaskStatus, { loading: updateTaskStatusLoading }] = useMutation(
    UPDATE_ASSIGNED_TASK_STATUS
  );
  const handleSave = async () => {
    setError("");
    if (selectedStatus === task.status) {
      onClose();
      return;
    }
    if (task.status !== TaskStatus.ASSIGNED) {
      setError("Cannot update status of a non-assigned task");
      return;
    }
    try {
      await updateTaskStatus({
        variables: {
          aid: task.aid,
          status: selectedStatus,
        },
      });
      refetch();
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (editDetails) {
    return (
      <EditAssignedTaskModal task={task} onClose={onClose} refetch={refetch} />
    );
  }

  return (
    <PopupContainer
      title={task.name}
      edit_action={() => setEditDetails(true)}
      delete_action={handleDelete}
      submit_text="Save"
      submit_action={handleSave}
      cancel_action={onClose}
      error_message={error}
      loading={deleteAssignedTaskLoading || updateTaskStatusLoading}
    >
      <FixedInput
        label="Task Type"
        current_value={toTitleCase(String(task.type))}
        orientation="horizontal"
      />
      <FixedInput
        label="Start Date"
        current_value={formatDateV3(new Date(task.start_date))}
        orientation="horizontal"
      />
      <FixedInput
        label="End Date"
        current_value={formatDateV3(new Date(task.end_date))}
        orientation="horizontal"
      />
      <FixedInput
        label="Marillac Bucks"
        current_value={formatCurrency(task.value)}
        orientation="horizontal"
      />
      <FixedInput
        label="Marillac Bucks Deduction"
        current_value={
          task.penalty ? `-${formatCurrency(task.penalty)}` : "$0.00"
        }
        orientation="horizontal"
      />
      <Flex flexDir="column">
      <Flex width="350px" h="0px" />
        <Text textStyle="s2" mb="5px">
          Status
        </Text>
        <Flex gap="5px">
          {task.status === TaskStatus.ASSIGNED && (
            <BlackOutlineButton
              label="Assigned"
              action={() => setSelectedStatus(TaskStatus.ASSIGNED)}
              is_active={selectedStatus === TaskStatus.ASSIGNED}
              icon={<Assigned size={16} />}
            />
          )}
          {(task.status === TaskStatus.ASSIGNED ||
            task.status === TaskStatus.COMPLETE) && (
            <BlackOutlineButton
              label="Completed"
              action={() => setSelectedStatus(TaskStatus.COMPLETE)}
              is_active={selectedStatus === TaskStatus.COMPLETE}
              icon={<Complete size={16} />}
            />
          )}
          {(task.status === TaskStatus.ASSIGNED ||
            task.status === TaskStatus.EXCUSED) && (
            <BlackOutlineButton
              label="Excused"
              action={() => setSelectedStatus(TaskStatus.EXCUSED)}
              is_active={selectedStatus === TaskStatus.EXCUSED}
              icon={<Excused size={16} />}
            />
          )}
          {(task.status === TaskStatus.ASSIGNED ||
            task.status === TaskStatus.INCOMPLETE) && (
            <BlackOutlineButton
              label="Incomplete"
              action={() => setSelectedStatus(TaskStatus.INCOMPLETE)}
              is_active={selectedStatus === TaskStatus.INCOMPLETE}
              icon={<Incomplete size={16} />}
            />
          )}
        </Flex>
      </Flex>
      <FixedInput
        label="Comments"
        current_value={
          task.comment !== null && task.comment !== "" ? task.comment : "N/A"
        }
        orientation="vertical"
      />
    </PopupContainer>
  );
}
