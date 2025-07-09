import React from "react";
import {
  Box,
  Text,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
} from "@chakra-ui/react";
import CommentIcon from "@mui/icons-material/ModeCommentOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { CalendarEvent } from "../../types/ScheduleTypes";
import {
  getTaskStatusColor,
  getTaskStatusBgColor,
  getTaskStatusText,
  formatEventTime,
} from "../../utils/scheduleUtils";

interface TaskTableProps {
  tasks: CalendarEvent[];
  onTaskSelect: (event: CalendarEvent) => void;
}

export default function TaskTableTop({
  tasks,
  onTaskSelect
}: TaskTableProps) {
  return (
    <Box overflow="hidden">
      <TableContainer
        border="2px solid"
        borderColor="gray.200"
        borderRadius="lg"
        overflow="hidden"
      >
        <Table
          variant="simple"
          size="md"
          sx={{ tableLayout: "fixed", width: "100%" }}
        >
          <Thead bg="gray.50">
            <Tr
              borderBottom={tasks.length > 0 ? "2px solid" : "none"}
              borderColor="gray.200"
            >
              <Th
                fontSize="md"
                fontWeight="600"
                color="black"
                textTransform="none"
                width="23%"
                py={4}
              >
                Name
              </Th>
              <Th
                fontSize="md"
                fontWeight="600"
                color="black"
                textTransform="none"
                width="23%"
                py={4}
              >
                Status
              </Th>
              <Th
                fontSize="md"
                fontWeight="600"
                color="black"
                textTransform="none"
                width="23%"
                py={4}
              >
                Time
              </Th>
              <Th
                fontSize="md"
                fontWeight="600"
                color="black"
                textTransform="none"
                width="31%"
                py={4}
              >
                Marillac Bucks
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {tasks.map((event, index) => (
              <Tr
                key={event.id}
                _hover={{ bg: "gray.50" }}
                cursor="pointer"
                borderBottom={index !== tasks.length - 1 ? "2px solid" : "none"}
                borderColor="gray.200"
              >
                <Td position="relative">
                  <Text fontSize="md" fontWeight="600" pr={6}>
                    {event.title}
                  </Text>
                  {event.comment && (
                    <Box
                      position="absolute"
                      top="50%"
                      right="0"
                      transform="translateY(-50%)"
                      color={getTaskStatusColor(event.task_status)}
                    >
                      <CommentIcon fontSize="small" color="action" />
                    </Box>
                  )}
                </Td>
                <Td>
                  <Text
                    fontSize="md"
                    px={8}
                    py={3}
                    borderRadius="md"
                    bg={getTaskStatusBgColor(event.task_status)}
                    color={getTaskStatusColor(event.task_status)}
                    fontWeight="700"
                    minW="200px"
                    maxW="200px"
                    textAlign="center"
                    display="inline-block"
                  >
                    {getTaskStatusText(event.task_status)}
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="md" fontWeight="600">
                    {event.allDay
                      ? "Anytime"
                      : formatEventTime(event.start, event.end)}
                  </Text>
                </Td>
                <Td>
                  <HStack justify="space-between" align="center">
                    <Text fontSize="md" fontWeight="600">
                      ${event.marillacBucksAddition.toFixed(2)}
                    </Text>
                    <IconButton
                      aria-label="More options"
                      icon={<MoreHorizIcon fontSize="large" />}
                      size="md"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        onTaskSelect(event); // Only open modal from here
                      }}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
