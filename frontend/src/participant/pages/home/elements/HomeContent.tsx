import React, { useContext } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { ParticipantContext } from "../../../../common/participant/ParticipantContext";
import TasksCompletedWidget from "./TasksCompletedWidget";
import { HAS_COMPLETED_ALL_REQUIRED_TASKS } from "../../../../gql/queries";

export default function HomeContent() {
  const participant = useContext(ParticipantContext);
  const participantId = participant?.id;

  // Get current date
  const currentDate = new Date();
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = dayNames[currentDate.getDay()];
  const monthName = monthNames[currentDate.getMonth()];
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();

  const formattedDate = `${dayName} - ${monthName} ${date}, ${year}`;

  // Query to check if participant has completed all required tasks
  const { data: tasksData, loading: tasksLoading } = useQuery(
    HAS_COMPLETED_ALL_REQUIRED_TASKS,
    {
      variables: { participantId },
      skip: !participantId,
    }
  );

  const hasCompletedAllTasks = tasksData?.hasCompletedAllRequiredTasks || false;

  return (
    <Flex w="100%" flexDir="column" gap="16px" padding="20px">
      {/* Welcome Section */}
      <Flex w="100%" flexDir="column" gap="4px">
        <Text
          fontFamily="Nunito"
          fontWeight="700"
          fontSize="24px"
          color="primary.700"
        >
          Welcome to Marillac Place
        </Text>
        <Text
          fontFamily="Nunito"
          fontWeight="400"
          fontSize="16px"
          color="text.light.secondary"
        >
          {formattedDate}
        </Text>
      </Flex>

      {/* Tasks Completed Widget - Only show if all required tasks are completed */}
      {!tasksLoading && hasCompletedAllTasks && <TasksCompletedWidget />}
    </Flex>
  );
}
