import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import TasksCompletedWidget from "./TasksCompletedWidget";

export default function HomeContent() {
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

      {/* Tasks Completed Widget */}
      <TasksCompletedWidget />
    </Flex>
  );
}
