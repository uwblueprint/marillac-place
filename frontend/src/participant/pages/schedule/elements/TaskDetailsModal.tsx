import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  Box,
} from "@chakra-ui/react";
import {
  CalendarEvent,
  TaskStatus,
} from "../../../../admin/pages/schedule/components/ScheduleTypes";
import {
  getTaskStatusBgColor,
  getTaskStatusColor,
  getTaskStatusText,
  formatTime,
} from "../../../../utils/scheduleUtils";
import {
  AssignedIcon,
  CompletedIcon,
  ExcusedIcon,
} from "../../../../components/icons/StatusIcons";
import colors from "../../../../theme/colors";

interface ParticipantTaskDetailsModalProps {
  task: CalendarEvent;
  onClose: () => void;
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDisplayTime(start: Date, end: Date, isAllDay?: boolean): string {
  if (isAllDay) return "Anytime";
  if (start.getTime() === end.getTime()) {
    return formatTime(start, { showMeridiem: true });
  }

  // Check if start and end times have different meridiems
  const startHour = start.getHours();
  const endHour = end.getHours();
  const startMeridiem = startHour < 12 ? "AM" : "PM";
  const endMeridiem = endHour < 12 ? "AM" : "PM";
  const differentMeridiems = startMeridiem !== endMeridiem;

  const lhs = formatTime(start, { showMeridiem: differentMeridiems });
  const rhs = formatTime(end, { showMeridiem: true });
  return `${lhs} to ${rhs}`;
}

const LabelRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <Flex align="baseline" justify="space-between">
    <Text fontWeight={700} color={colors.text.light.secondary}>
      {label}
    </Text>
    <Box ml={6} flex={1} textAlign="right">
      <Text color={colors.text.light.secondary}>{value}</Text>
    </Box>
  </Flex>
);

export default function ParticipantTaskDetailsModal({
  task,
  onClose,
}: ParticipantTaskDetailsModalProps) {
  const statusBg = getTaskStatusBgColor(task.task_status);
  const statusColor = getTaskStatusColor(task.task_status);
  const statusText = getTaskStatusText(task.task_status);
  const hasComment = !!(task.comment && task.comment.trim());

  return (
    <Modal isOpen onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent maxW="420px" borderRadius="20px" p={4} mx="50px">
        <ModalHeader p={0} mb={4}>
          <Text fontSize="24px" fontWeight={800} color="black">
            {task.title}
          </Text>
        </ModalHeader>

        <ModalBody p={0}>
          <VStack spacing={5} align="stretch">
            <VStack spacing={4} align="stretch">
              <LabelRow
                label="Time:"
                value={formatDisplayTime(task.start, task.end, task.allDay)}
              />
              <LabelRow label="Date:" value={formatDisplayDate(task.start)} />
              <LabelRow
                label="Marillac Bucks:"
                value={`$${task.marillacBucksAddition}`}
              />
              {task.marillacBucksDeduction > 0 && (
                <LabelRow
                  label="Marillac Bucks Deductions:"
                  value={`-$${task.marillacBucksDeduction}`}
                />
              )}
              {hasComment && (
                <VStack spacing={2} align="stretch">
                  <Text fontWeight={700} color={colors.text.light.secondary}>
                    Comments:
                  </Text>
                  <Text
                    color={colors.text.light.secondary}
                    whiteSpace="pre-wrap"
                  >
                    {task.comment}
                  </Text>
                </VStack>
              )}
            </VStack>

            <HStack>
              <HStack
                spacing={3}
                bg={statusBg}
                color={statusColor}
                borderRadius="10px"
                px={6}
                py={3}
                w="100%"
                justify="center"
              >
                {task.task_status === TaskStatus.COMPLETE && (
                  <CompletedIcon width={19} height={18} />
                )}
                {task.task_status === TaskStatus.ASSIGNED && (
                  <AssignedIcon width={16} height={18} />
                )}
                {task.task_status === TaskStatus.EXCUSED && (
                  <ExcusedIcon width={16} height={16} />
                )}
                <Text fontWeight={700}>{statusText}</Text>
              </HStack>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter px={0} py={0} pt="22px">
          <Button variant="outline" onClick={onClose} px={6} py={3} w="120px">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
