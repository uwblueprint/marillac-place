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
import { CalendarEvent, TaskStatus } from "../../../../types/ScheduleTypes";

interface TaskDetailsModalProps {
  task: CalendarEvent;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
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
    <Modal isOpen onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent maxW="600px" borderRadius="20px" p={4}>
        {/* Header */}
        <ModalHeader p={0} mb={6}>
          <Flex justify="space-between" align="center">
            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
              {task.title}
            </Text>
            <HStack spacing={3}>
              <Button
                variant="outline"
                leftIcon={<EditIcon />}
                colorScheme="blue"
                size="md"
                onClick={onEdit}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                leftIcon={<DeleteIcon />}
                colorScheme="red"
                size="md"
                onClick={onDelete}
              >
                Delete
              </Button>
            </HStack>
          </Flex>
        </ModalHeader>

        <ModalBody p={0}>
          <VStack spacing={6} align="stretch">
            {/* Task Details */}
            <VStack spacing={4} align="stretch">
              <Flex>
                <Text fontWeight="600" color="gray.600" minW="160px">
                  Task Type:
                </Text>
                <Text color="gray.700">{formatTaskType(task.task_type)}</Text>
              </Flex>

              <Flex>
                <Text fontWeight="600" color="gray.600" minW="160px">
                  Date:
                </Text>
                <Text color="gray.700">
                  {task.allDay ? "Anytime" : formatDate(task.start)}
                </Text>
              </Flex>

              <Flex>
                <Text fontWeight="600" color="gray.600" minW="160px">
                  Recurrence:
                </Text>
                <Text color="gray.700">{getRecurrenceText()}</Text>
              </Flex>

              <Flex>
                <Text fontWeight="600" color="gray.600" minW="160px">
                  Marillac Bucks:
                </Text>
                <Text color="gray.700">${task.marillacBucksAddition}</Text>
              </Flex>

              {task.marillac_bucks_deduction > 0 && (
                <Flex>
                  <Text fontWeight="600" color="gray.600" minW="160px">
                    Marillac Bucks Deductions:
                  </Text>
                  <Text color="gray.700">
                    - ${task.marillac_bucks_deduction}
                  </Text>
                </Flex>
              )}
            </VStack>

            {/* Status Section */}
            <VStack spacing={4} align="stretch">
              <Text fontSize="lg" fontWeight="600" color="gray.900">
                Status
              </Text>

              <HStack spacing={3} wrap="wrap">
                <StatusButton
                  status={TaskStatus.ASSIGNED}
                  label="Assigned"
                  color="#3B82F6"
                />
                <StatusButton
                  status={TaskStatus.COMPLETE}
                  label="Complete"
                  color="#22C55E"
                />
                <StatusButton
                  status={TaskStatus.INCOMPLETE}
                  label="Incomplete"
                  color="#EF4444"
                />
                <StatusButton
                  status={TaskStatus.EXCUSED}
                  label="Excused"
                  color="#F59E0B"
                />
              </HStack>
            </VStack>

            {/* Comments Section */}
            <VStack spacing={4} align="stretch">
              <Text fontSize="lg" fontWeight="600" color="gray.900">
                Comments
              </Text>

              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                resize="vertical"
                minH="100px"
                fontSize="14px"
                borderRadius="8px"
                borderColor="gray.300"
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182CE",
                }}
              />
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter p={0} pt={6}>
          <HStack spacing={3}>
            <Button variant="outline" onClick={onClose} px={6} py={3}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave} px={6} py={3}>
              Save Changes
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
