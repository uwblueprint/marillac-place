import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  HStack,
  VStack,
  Box,
  Flex,
  Textarea,
  Circle,
} from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import {
  CalendarEvent,
  TaskStatus,
  TaskStatuses,
} from "../../../../types/ScheduleTypes";
import OrangeButton from "../../../common/buttons/OrangeButton";
import SimpleButton from "../../../common/buttons/SimpleButton";
import TextInput from "../../../common/form/TextInput";
import { toTitleCase } from "../../../../utils/string_helpers";

interface TaskDetailsModalProps {
  task: CalendarEvent;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskDetailsModal({
  task,
  onClose,
  onEdit,
  onDelete,
}: TaskDetailsModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(
    task.task_status
  );
  const [comment, setComment] = useState(task.comment || "");

  const handleSave = () => {
    // TODO: Implement save mutation with status and comment updates
    console.log(
      `Saving task ${task.id} with status ${selectedStatus} and comment: ${comment}`
    );
    onClose();
  };

  const formatTaskType = (type: string): string => {
    return type.charAt(0) + type.slice(1).toLowerCase().replace("_", " ");
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRecurrenceText = (): string => {
    // This would need to be enhanced based on actual task recurrence data
    // For now, showing a placeholder as in the design
    return "Every Monday, Tuesday, Wednesday, and Thursday (ends never)";
  };

  const StatusButton = ({
    status,
    label,
    color,
  }: {
    status: TaskStatus;
    label: string;
    color: string;
  }) => (
    <Button
      variant="outline"
      size="md"
      borderColor="gray.300"
      bg={selectedStatus === status ? "gray.50" : "white"}
      borderWidth={selectedStatus === status ? "2px" : "1px"}
      _hover={{ bg: "gray.50" }}
      onClick={() => setSelectedStatus(status)}
      leftIcon={<Circle size="12px" bg={color} />}
      fontWeight="normal"
      color="gray.700"
      px={6}
      py={3}
    >
      {label}
    </Button>
  );

  return (
    <Modal isOpen isCentered onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent
        width="fit-content"
        minWidth="350px"
        maxWidth="550px"
        height="fit-content"
        boxShadow="xl"
        borderRadius="16px"
        paddingX="35px"
        paddingY="25px"
      >
        <Flex justify="space-between" align="center" mb="10px">
          <Text textStyle="web.h3">{task.title}</Text>
          <Flex alignItems="center" justifyContent="flex-end" gap="12px">
            <SimpleButton
              text="Edit"
              action={onEdit}
              is_active={false}
              text_color="#0C727E"
            />
            <SimpleButton
              text="Delete"
              action={onDelete}
              is_active={false}
              text_color="#D34C5C"
            />
          </Flex>
        </Flex>

        <Flex flexDir="column" gap="8px">
          <Flex gap="5px" align="flex-end">
            <Text textStyle="web.s1" color="text.light.secondary">
              Task Type
            </Text>
            <Text textStyle="web.b3" color="#000000">
              {formatTaskType(task.task_type)}
            </Text>
          </Flex>
          <Flex gap="5px" align="flex-end">
            <Text textStyle="web.s1" color="text.light.secondary">
              Date
            </Text>
            <Text textStyle="web.b3" color="#000000">
              {task.allDay ? "Anytime" : formatDate(task.start)}
            </Text>
          </Flex>
          <Flex gap="5px" align="flex-end">
            <Text textStyle="web.s1" color="text.light.secondary">
              Recurrence
            </Text>
            <Text textStyle="web.b3" color="#000000">
              {getRecurrenceText()}
            </Text>
          </Flex>
          <Flex gap="5px" align="flex-end">
            <Text textStyle="web.s1" color="text.light.secondary">
              Marillac Bucks
            </Text>
            <Text textStyle="web.b3" color="#000000">
              ${task.marillacBucksAddition}
            </Text>
          </Flex>
          <Flex gap="5px" align="flex-end">
            <Text textStyle="web.s1" color="text.light.secondary">
              Marillac Bucks Deduction
            </Text>
            <Text textStyle="web.b3" color="#000000">
              ${task.marillac_bucks_deduction}
            </Text>
          </Flex>

          <Flex flexDir="column">
            <Text textStyle="web.s1" color="text.light.secondary">
              Status
            </Text>
            <Flex flexDir="row" gap="8px">
              <SimpleButton
                text="Assigned"
                action={() => setSelectedStatus(TaskStatus.ASSIGNED)}
                is_active={selectedStatus === TaskStatus.ASSIGNED}
                text_color="#000000"
              />
              <SimpleButton
                text="Completed"
                action={() => setSelectedStatus(TaskStatus.COMPLETE)}
                is_active={selectedStatus === TaskStatus.COMPLETE}
                text_color="#000000"
              />
              <SimpleButton
                text="Excused"
                action={() => setSelectedStatus(TaskStatus.EXCUSED)}
                is_active={selectedStatus === TaskStatus.EXCUSED}
                text_color="#000000"
              />
              <SimpleButton
                text="Incomplete"
                action={() => setSelectedStatus(TaskStatus.INCOMPLETE)}
                is_active={selectedStatus === TaskStatus.INCOMPLETE}
                text_color="#000000"
              />
            </Flex>
          </Flex>

          <TextInput
            label="Comments"
            current_value={comment}
            action={(e: any) => setComment(e.target.value)}
          />
        </Flex>

        <Flex
          alignItems="center"
          justifyContent="flex-end"
          gap="12px"
          mt="15px"
        >
          <SimpleButton
            text="Cancel"
            action={onClose}
            is_active={false}
            text_color="#000000"
          />
          <OrangeButton
            text="Save Changes"
            action={handleSave}
            is_active={false}
          />
        </Flex>
      </ModalContent>
    </Modal>
  );
}
