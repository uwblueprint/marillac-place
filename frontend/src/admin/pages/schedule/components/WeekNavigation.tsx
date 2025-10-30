import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import moment from "moment";
import { ChevronLeftIcon, ChevronRightIcon } from "./CustomIcons";

interface WeekNavigationProps {
  currentDate: Date;
  onNavigate: (date: Date) => void;
}

export default function WeekNavigation({
  currentDate,
  onNavigate,
}: WeekNavigationProps) {
  const goToPreviousWeek = () => {
    const newDate = moment(currentDate).subtract(1, "week").toDate();
    onNavigate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = moment(currentDate).add(1, "week").toDate();
    onNavigate(newDate);
  };

  const getWeekRange = (date: Date) => {
    const startOfWeek = moment(date).startOf("week");
    const endOfWeek = moment(date).endOf("week");
    return `${startOfWeek.format("MMM D")} - ${endOfWeek.format("D")}`;
  };

  return (
    <Flex
      alignItems="center"
      bg="neutral.0"
      borderRadius="8px"
      border="1px solid"
      borderColor="neutral.300"
      padding="6px 12px"
      gap="8px"
    >
      <Button
        onClick={goToPreviousWeek}
        variant="ghost"
        size="sm"
        padding="0"
        minW="auto"
        h="auto"
        _hover={{ bg: "transparent" }}
        _active={{ bg: "transparent" }}
      >
        <ChevronLeftIcon size={8} color="#0C727E" />
      </Button>

      <Text
        textStyle="web.b1"
        color="primary.700"
        fontWeight={700}
        textAlign="center"
        fontFamily="Nunito"
        fontSize="16px"
        lineHeight="normal"
      >
        {getWeekRange(currentDate)}
      </Text>

      <Button
        onClick={goToNextWeek}
        variant="ghost"
        size="sm"
        padding="0"
        minW="auto"
        h="auto"
        _hover={{ bg: "transparent" }}
        _active={{ bg: "transparent" }}
      >
        <ChevronRightIcon size={8} color="#0C727E" />
      </Button>
    </Flex>
  );
}
