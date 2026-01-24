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
    bgColor: "schedule.assignedLight",
    textColor: "schedule.assignedDark",
    text: "Assigned",
  },
  [TaskStatus.COMPLETE]: {
    icon: Complete,
    bgColor: "schedule.completeLight",
    textColor: "schedule.completeDark",
    text: "Complete",
  },
  [TaskStatus.EXCUSED]: {
    icon: Excused,
    bgColor: "schedule.excusedLight",
    textColor: "schedule.excusedDark",
    text: "Excused",
  },
  [TaskStatus.INCOMPLETE]: {
    icon: Incomplete,
    bgColor: "schedule.incompleteLight",
    textColor: "schedule.incompleteDark",
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
      bg={TaskStatusConfig[status].bgColor}
      color={TaskStatusConfig[status].textColor}
      borderRadius="lg"
      width={size}
      height="32px"
      gap="4px"
    >
      <Icon size={20} />
      <Text textStyle="s2" color={TaskStatusConfig[status].textColor}>
        {TaskStatusConfig[status].text}
      </Text>
    </Flex>
  );
}
