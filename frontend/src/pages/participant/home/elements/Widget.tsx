import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import * as ROUTES from "../../../../constants/routes";

interface WidgetProps {
  title: string;
  linkTitle: string;
  navigateTo:
    | "home"
    | "schedule"
    | "announcements"
    | "participants"
    | "taskLibrary"
    | "badgeLibrary";
  children: React.ReactElement;
}
export default function Widget({
  title,
  linkTitle,
  navigateTo,
  children,
}: WidgetProps) {
  const navigate = useNavigate();

  const pages = {
    home: ROUTES.ADMIN_HOME_PAGE,
    schedule: ROUTES.ADMIN_SCHEDULE_PAGE,
    announcements: ROUTES.ADMIN_ANNOUNCEMENTS_PAGE,
    participants: ROUTES.ADMIN_PARTICIPANTS_PAGE,
    taskLibrary: ROUTES.ADMIN_TASKS_PAGE,
    badgeLibrary: ROUTES.ADMIN_BADGES_PAGE,
  };

  return (
    <Flex
      w="100%"
      border="1px solid"
      borderColor="neutral.300"
      borderRadius="10px"
      paddingY="20px"
      paddingX="16px"
      flexDir="column"
      position="relative"
    >
      <Flex flexDir="row" justifyContent="space-between" marginBottom="10px">
        <Text textStyle="mobile.h2">{title}</Text>{" "}
        <Text
          textStyle="mobile.b1"
          onClick={() => navigate(pages[navigateTo])}
          textDecoration="underline"
        >
          {linkTitle}
        </Text>
      </Flex>
      {children}
    </Flex>
  );
}
