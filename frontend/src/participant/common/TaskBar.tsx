import { Flex, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

type Page = {
  label: string;
  route: string;
};

type TaskBarProps = {
  participantId: number | undefined;
  currentPageIndex: number;
  pages: Page[];
  closeTaskBar: () => void;
};

export default function TaskBar({
  participantId,
  currentPageIndex,
  pages,
  closeTaskBar,
}: TaskBarProps) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("participant_token");
    return navigate(ROUTES.PARTICIPANTS_LOGIN_PAGE);
  };

  return (
    <Flex
      position="absolute"
      top="75px"
      left="0px"
      width="100%"
      padding="20px"
      alignItems="center"
      justifyContent="center"
      gap="10px"
      bg="neutral.0"
      borderBottom="1px solid"
      borderColor="neutral.300"
      flexDir="column"
      zIndex={100}
    >
      <Text textStyle="mobile.h2" color="primary.700">
        ID #{participantId}
      </Text>
      <Tabs
        index={currentPageIndex}
        orientation="vertical"
        variant="unstyled"
        width="100%"
      >
        <TabList w="100%" gap="10px">
          {pages.map((page) => (
            <Tab
              key={page.label}
              width="100%"
              padding="8px 16px"
              borderRadius="8px"
              justifyContent="center"
              fontWeight={500}
              fontSize="16px"
              fontFamily="Nunito"
              color="#000000"
              onClick={() => {
                navigate(page.route);
                closeTaskBar();
              }}
              _selected={{
                fontWeight: 700,
                color: "neutral.0",
                bg: "secondary.700",
              }}
            >
              {page.label}
            </Tab>
          ))}
        </TabList>
      </Tabs>
      <Flex w="100%" h="1px" bg="neutral.300" />
      <Text
        textStyle="mobile.h2"
        color="danger.900"
        cursor="pointer"
        onClick={() => handleSignOut()}
      >
        Sign Out
      </Text>
    </Flex>
  );
}
