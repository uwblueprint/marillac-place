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
  Flex,
} from "@chakra-ui/react";
import CommentIcon from "@mui/icons-material/ModeCommentOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { CalendarEvent } from "./ScheduleTypes";
import {
  getTaskStatusColor,
  getTaskStatusBgColor,
  getTaskStatusText,
  formatEventTime,
} from "../../../../utils/scheduleUtils";

interface TaskTableProps {
  tasks: CalendarEvent[];
  onTaskSelect: (event: CalendarEvent) => void;
}

export default function TaskTableBottom({
  tasks,
  onTaskSelect,
}: TaskTableProps) {
  return (
    <Box overflow="hidden">
      <TableContainer
        border="1px solid"
        borderColor="neutral.300"
        borderRadius="8px"
        mb="15px"
        w="100%"
      >
        <Table>
          <Thead>
            <Tr backgroundColor="neutral.200" w="100%">
              <Th width="30%">
                <Text textStyle="web.s1" color="#000000" textTransform="none">
                  Name
                </Text>
              </Th>
              <Th width="20%">
                <Text textStyle="web.s1" color="#000000" textTransform="none">
                  Status
                </Text>
              </Th>
              <Th width="10%">
                <Text textStyle="web.s1" color="#000000" textTransform="none">
                  Marillac Bucks
                </Text>
              </Th>
              <Th width="40%" />
            </Tr>
          </Thead>
          <Tbody>
            {tasks.map((event: any, index: number) => (
              <Tr
                key={event.id}
                outline={index % 2 ? "0px solid" : "1px solid"}
                outlineColor="neutral.300"
              >
                <Td position="relative">
                  <Text textStyle="web.b3" color="#000000">
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
                      <CommentIcon
                        sx={{ width: "15px", height: "15px" }}
                        color="action"
                      />
                    </Box>
                  )}
                </Td>
                <Td>
                  <Text
                    py={1}
                    borderRadius="md"
                    bg={getTaskStatusBgColor(event.task_status)}
                    color={getTaskStatusColor(event.task_status)}
                    textStyle="web.b3"
                    fontWeight="700"
                    width="150px"
                    textAlign="center"
                  >
                    {getTaskStatusText(event.task_status)}
                  </Text>
                </Td>
                <Td>
                  <Text textStyle="web.b3" color="#000000">
                    ${event.marillacBucksAddition.toFixed(2)}
                  </Text>
                </Td>
                <Td>
                  <Flex
                    justifyContent="flex-end"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      onTaskSelect(event); // Only open modal from here
                    }}
                    cursor="pointer"
                  >
                    <MoreHorizIcon fontSize="small" />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
