import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { Assigned, Complete, Excused, Incomplete } from "../icons/StatusIcons";
import { TaskStatus } from "../../types/enums";

type TaskStatusDisplayProps = {
  status: TaskStatus;
  size?: string;
};

const TaskStatusConfig = {
  [TaskStatus.ASSIGNED]: {
    icon: Assigned,
    bgColor: "#C5DCF8",
    textColor: "#255B9A",
    text: "Assigned",
  },
  [TaskStatus.COMPLETE]: {
    icon: Complete,
    bgColor: "#CDEECE",
    textColor: "#0D8312",
    text: "Complete",
  },
  [TaskStatus.EXCUSED]: {
    icon: Excused,
    bgColor: "#FFE5B2",
    textColor: "#B07D18",
    text: "Excused",
  },
  [TaskStatus.INCOMPLETE]: {
    icon: Incomplete,
    bgColor: "#F8D7DB",
    textColor: "#B21D2F",
    text: "Incomplete",
  },
};

export default function TaskStatusDisplay({
  status,
  size = "150px",
}: TaskStatusDisplayProps) {
  const Icon = TaskStatusConfig[status].icon;
  return (
    <Flex
      align="center"
      justify="center"
      gap={1}
      bg={TaskStatusConfig[status].bgColor}
      color={TaskStatusConfig[status].textColor}
      borderRadius="lg"
      width={size}
      height="35px"
    >
      <Icon size={20} />
      <Text textStyle="web.s1" color={TaskStatusConfig[status].textColor}>
        {TaskStatusConfig[status].text}
      </Text>
    </Flex>
  );
}
