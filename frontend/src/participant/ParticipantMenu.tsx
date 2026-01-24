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
      bg="white"
      borderBottom="1px solid"
      borderColor="background.border"
      flexDir="column"
      zIndex={100}
    >
      <Text textStyle="s1" color="brand.primaryDark">
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
              fontWeight={400}
              fontSize="14px"
              fontFamily="Nunito"
              color="text.dark"
              onClick={() => {
                navigate(page.route);
                collapseMenu();
              }}
              _selected={{
                fontWeight: 650,
                color: "white",
                bg: "brand.secondaryDark",
              }}
            >
              {page.label}
            </Tab>
          ))}
        </TabList>
      </Tabs>
      <Flex w="100%" h="1px" bg="background.border" />
      <Text
        textStyle="s1"
        color="indicate.brightRed"
        cursor="pointer"
        onClick={() => handleSignOut()}
        mt="8px"
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

export default function ParticipantMenu({
  room,
  balance,
}: ParticipantMenuProps) {
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
      bg="brand.primaryLight"
      alignItems="center"
      justifyContent="center"
      position="absolute"
      top="0px"
      left="0px"
      zIndex={100}
    >
      {!expandMenu && (
        <Flex
          onClick={() => setExpandMenu(true)}
          cursor="pointer"
          position="absolute"
          left="20px"
          top="24px"
          zIndex={100}
        >
          <Menu size={18} />
        </Flex>
      )}

      {expandMenu && (
        <>
          <Flex
            onClick={() => setExpandMenu(false)}
            cursor="pointer"
            position="absolute"
            left="21px"
            top="26px"
            zIndex={100}
          >
            <Cross size={16} />
          </Flex>
          <ExpandedParticipantMenu
            room={room}
            currentPageIndex={currentPageIndex}
            pages={pages}
            collapseMenu={() => setExpandMenu(false)}
          />
        </>
      )}

      <Text textStyle="h4" pt="5px">
        {pages[currentPageIndex].label}
      </Text>

      <Flex
        gap="7px"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        right="20px"
        top="22px"
        zIndex={100}
      >
        <MarillacCoin size={18} />
        <Text textStyle="s1">{balance}</Text>
      </Flex>
    </Flex>
  );
}
