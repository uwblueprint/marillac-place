import { Flex, Text, Image, Tab, TabList, Tabs } from "@chakra-ui/react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ParticipantContext } from "./ParticipantContext";
import * as ROUTES from "../constants/routes";
import ErrorScreen from "../ui/screens/ErrorScreen";

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
      >
        Sign Out
      </Text>
    </Flex>
  );
}

export default function ParticipantMenu() {
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

  const participant = useContext(ParticipantContext);
  const room = participant?.room;
  const balance = participant?.balance;

  const error = !participant || !room || !balance;
  if (error) {
    return (
      <ErrorScreen message="Unable to retrieve participant information." />
    );
  }

  return (
    <Flex
      width="100%"
      height="75px"
      bg="primary.100"
      padding="20px"
      alignItems="flex-end"
      justifyContent="space-between"
      position="relative"
    >
      {!expandMenu && (
        <Flex onClick={() => setExpandMenu(true)} cursor="pointer">
          <MenuIcon fontSize="medium" />
        </Flex>
      )}
      {expandMenu && (
        <>
          <Flex onClick={() => setExpandMenu(false)} cursor="pointer">
            <CloseIcon fontSize="medium" />
          </Flex>
          <ExpandedParticipantMenu
            room={room}
            currentPageIndex={currentPageIndex}
            pages={pages}
            collapseMenu={() => setExpandMenu(false)}
          />
        </>
      )}
      <Text textStyle="mobile.h1">{pages[currentPageIndex].label}</Text>
      <Flex gap="7px" alignItems="center" justifyContent="center">
        <Image
          src="/assets/marillac_bucks.png"
          alt="$"
          width="25px"
          height="25px"
          objectFit="cover"
          borderRadius="100%"
        />
        <Text textStyle="mobile.h2">{balance}</Text>
      </Flex>
    </Flex>
  );
}
