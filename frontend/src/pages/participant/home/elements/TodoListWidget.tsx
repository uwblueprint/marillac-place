import React, { useContext } from "react";
import {
  Box,
  Text,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { ParticipantContext } from "../../../../components/participant/ParticipantContext";
import { GET_ASSIGNED_TASKS_BY_PARTICIPANT_ID_AND_DATE } from "../../../../gql/queries";

// simplified visual indicator map

const taskVisualMap: Record<string, { label: string; bg: string; color: string }> = {
  "House Meeting": { label: "🏠", bg: "green.100", color: "green.600" },
  "Counselling Appointment": { label: "💬", bg: "blue.100", color: "blue.600" },
  "Curfew": { label: "⏰", bg: "yellow.100", color: "yellow.600" },
  "Chore": { label: "🧹", bg: "red.100", color: "red.600" },
  "Personal Development Goal": { label: "🧠", bg: "purple.100", color: "purple.600" },
  DEFAULT: { label: "•", bg: "gray.100", color: "gray.600" },
};

function getTodayDateString() {
  const now = new Date(); 
  const date = now.toLocaleDateString("en-CA"); // "YYYY-MM-DD"
  return `${date}`;
}

function formattedSchedule(start: string, end: string): string {
  if (!start || !end) return "Anytime";
  const to12Hour = (str: string) => {
    const [hour, minute] = str.split(":");
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? "pm" : "am";
    const formattedHour = ((h + 11) % 12 + 1).toString();
    return `${formattedHour}:${minute} ${suffix}`;
  };
  const [, startTime] = start.split(", ");
  const [, endTime] = end.split(", ");
  return `${to12Hour(startTime)} – ${to12Hour(endTime)}`;
}

const TodoListWidget = () => {
  const participant = useContext(ParticipantContext) as { id: number } | undefined;
  const participantId = participant?.id;
  const date = getTodayDateString();

  const { data, loading, error } = useQuery(GET_ASSIGNED_TASKS_BY_PARTICIPANT_ID_AND_DATE, {
    variables: { participantId, date },
    skip: !participantId,
  });
  console.log("participantId:", participantId);
  console.log(date);
  console.log(data);
  return  (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      p={5}
      mt={6}
      w="100%"
      maxW="500px"
    >
    <Flex direction="row" justify="space-between" align="center" mb={4}>
      <Text fontSize="xl" fontWeight="bold">
        To-Do List
      </Text>

      <Text textDecoration="underline" textUnderlineOffset="2px">
        Schedule
      </Text>
    </Flex>
      

      {loading && <Spinner />}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          Error loading tasks.
        </Alert>
      )}

      {!loading && !error && data && (
        <VStack spacing={4} align="stretch">
          {data.getAssignedTasksByParticipantIdAndDate.length === 0 ? (
            <Text color="gray.500">No tasks assigned for today.</Text>
          ) : (
            data.getAssignedTasksByParticipantIdAndDate.map((task: any) => {
              const visual = taskVisualMap[task.task_name] || taskVisualMap.DEFAULT;

              return (
                <Flex
                  key={task.assigned_task_id}
                  justify="space-between"
                  align="center"
                >
                  <Flex align="center" gap={3}>
                    <Box
                      bg={visual.bg}
                      color={visual.color}
                      borderRadius="full"
                      boxSize="36px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      {visual.label}
                    </Box>
                    <Box>
                      <Text fontWeight="semibold">{task.task_name}</Text>
                    </Box>
                  </Flex>
                  <Text fontSize="sm" color="gray.500">
                    {formattedSchedule(task.start_date, task.end_date)}
                  </Text>
                </Flex>
              );
            })
          )}
        </VStack>
      )}
    </Box>
  );
};

export default TodoListWidget;
