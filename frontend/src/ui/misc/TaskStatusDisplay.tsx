import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { Assigned, Complete, Excused, Incomplete } from "../icons/StatusIcons";
import { TaskStatus } from "../../types/enums";

type TaskStatusDisplayProps = {
  status: TaskStatus;
};

// TODO: replace hardcoded colors w/ mappings
const TaskStatusConfig = {
  [TaskStatus.ASSIGNED]: {
    icon: Assigned,
    bgColor: "#C5DCF8",
    textColor: "#255B9A",
    text: "Assigned"
  },
  [TaskStatus.COMPLETE]: {
    icon: Complete,
    bgColor: "#CDEECE",
    textColor: "#0D8312",
    text: "Complete"
  },
  [TaskStatus.EXCUSED]: { 
    icon: Excused,
    bgColor: "#FFE5B2",
    textColor: "#B07D18",
    text: "Excused"
  },
  [TaskStatus.INCOMPLETE]: {
    icon: Incomplete,
    bgColor: "#F8D7DB",
    textColor: "#B21D2F",
    text: "Incomplete"
  },
  } 

export default function TaskStatusDisplay({ status }: TaskStatusDisplayProps) {
  // TODO:
  // Implement task status display
  // Takes in TaskStatus enum and displays the corresponding status, color, and icon
  // Figma Link: https://www.figma.com/design/Ts9QxCIXFe4l9h6GKOLOIq/Admin-Application?node-id=5531-22663&t=d0D0hBm1Lo6YUL70-4
  // Add to UI page
  
  const Icon = TaskStatusConfig[status].icon;

  return (
    <Flex 
      align="center"
      gap={1}
      bg={TaskStatusConfig[status].bgColor}
      color={TaskStatusConfig[status].textColor}
      px={8}
      py={1.5}
      borderRadius="lg"
      fontWeight="bold"
      fontSize="sm"
      width="fit-content"
    >
      <Icon size={26}/>
      <Text color={TaskStatusConfig[status].textColor}>{TaskStatusConfig[status].text}</Text>
    </Flex>
  );
}
