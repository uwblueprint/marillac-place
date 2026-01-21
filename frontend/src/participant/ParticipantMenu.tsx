import { Flex, Text, Image, Tab, TabList, Tabs } from "@chakra-ui/react";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import { MarillacCoin } from "../ui/icons/MiscIcons";
import { Cross, Menu } from "../ui/icons/ActionIcons";

type Page = {
  label: string;
  route: string;
};

type ExpandedParticipantMenuProps = {
  room: number;
  currentPageIndex: number;
  pages: Page[];
  collapseMenu: () => void;
};

function ExpandedParticipantMenu({
  room,
  currentPageIndex,
  pages,
  collapseMenu,
}: ExpandedParticipantMenuProps) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    return navigate(ROUTES.PARTICIPANTS_LOGIN_PAGE);
  };

  return (
    <Flex
      position="absolute"
      top="60px"
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
        Room {room}
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
                collapseMenu();
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
        mt="10px"
      >
        Sign Out
      </Text>
    </Flex>
  );
}

type ParticipantMenuProps = {
  room: number;
  balance: number;
};

export default function ParticipantMenu({ room, balance }: ParticipantMenuProps) {
  const pages = [
    { label: "Home", route: ROUTES.PARTICIPANTS_HOME_PAGE },
    { label: "Schedule", route: ROUTES.PARTICIPANTS_SCHEDULE_PAGE },
    { label: "Announcements", route: ROUTES.PARTICIPANTS_ANNOUNCEMENTS_PAGE },
    { label: "Progress", route: ROUTES.PARTICIPANTS_PROGRESS_PAGE },
  ];

  const [expandMenu, setExpandMenu] = useState(false);
  const currentPageIndex = pages.findIndex(
    (page) => page.route === window.location.pathname
  );

  return (
    <Flex
      width="100%"
      height="60px"
      bg="primary.100"
      alignItems="center"
      justifyContent="center"
      position="absolute"
      top="0px"
      left="0px"
      zIndex={100}
    >
      {!expandMenu && (
        <Flex onClick={() => setExpandMenu(true)} cursor="pointer" position="absolute" left="20px" top="20px" zIndex={100}>
          <Menu size={24} />
        </Flex>
      )}

      {expandMenu && (
        <>
          <Flex onClick={() => setExpandMenu(false)} cursor="pointer" position="absolute" left="20px" top="20px" zIndex={100}>
            <Cross size={24} />
          </Flex>
          <ExpandedParticipantMenu
            room={room}
            currentPageIndex={currentPageIndex}
            pages={pages}
            collapseMenu={() => setExpandMenu(false)}
          />
        </>
      )}

      <Text textStyle="mobile.h1" pt="5px">{pages[currentPageIndex].label}</Text>

      <Flex gap="7px" alignItems="center" justifyContent="center" position="absolute" right="20px" top="20px" zIndex={100}>
        <MarillacCoin size={24} />
        <Text textStyle="mobile.h2">{balance}</Text>
      </Flex>
    </Flex>
  );
}
