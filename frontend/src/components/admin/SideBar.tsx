import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabList,
  Tab,
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
} from "@chakra-ui/react";
import * as ROUTES from "../../constants/Routes";

type SideBarTabProps = {
  label: string;
  handleClick: () => void;
};

function SideBarTab({ label, handleClick }: SideBarTabProps) {
  return (
    <Tab
      mb="12px"
      width="100%"
      padding="8px 16px"
      borderRadius="8px"
      justifyContent="left"
      fontWeight={500}
      fontSize="16px"
      fontFamily="Nunito"
      color="#000000"
      onClick={handleClick}
      _selected={{
        fontWeight: 700,
        color: "neutral.0",
        bg: "secondary.700",
      }}
    >
      {label}
    </Tab>
  );
}

type SignOutPopUpProps = {
  cancel: () => void;
};

function SignOutPopUp({ cancel }: SignOutPopUpProps) {
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem("admin_token");
    return navigate(ROUTES.ADMIN_LOGIN_PAGE);
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen onClose={cancel} isCentered>
      <ModalOverlay />
      <ModalContent boxShadow="xl" borderRadius="16px" width="388px">
        <ModalBody padding="30px">
          <Text textStyle="web.h2" mb="20px">
            Sign Out
          </Text>
          <Text textStyle="web.b1" mb="20px">
            Are you sure you want to sign out?
          </Text>
          <Flex alignItems="center" justifyContent="flex-end" gap="15px">
            <Button variant="white" onClick={cancel}>
              <Text fontWeight={700} fontSize="14px">
                Cancel
              </Text>
            </Button>
            <Button variant="primaryFilled" onClick={handleSignOut}>
              <Text fontWeight={700} fontSize="14px" color="white">
                Sign Out
              </Text>
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default function SideBar() {
  const navigate = useNavigate();
  const [signOut, setSignOut] = useState(false);

  const pages = [
    { label: "Home", route: ROUTES.ADMIN_HOME_PAGE },
    { label: "Schedule", route: ROUTES.ADMIN_SCHEDULE_PAGE },
    { label: "Announcements", route: ROUTES.ADMIN_ANNOUNCEMENTS_PAGE },
    { label: "Participants", route: ROUTES.ADMIN_PARTICIPANTS_PAGE },
    { label: "Task Library", route: ROUTES.ADMIN_TASKS_PAGE },
    { label: "Badge Library", route: ROUTES.ADMIN_BADGES_PAGE },
  ];

  const currentPage = pages.findIndex(
    (page) => page.route === window.location.pathname
  );

  return (
    <Box
      w="250px"
      h="100vh"
      position="absolute"
      top={0}
      left={0}
      borderRight="1px"
      borderRightColor="neutral.300"
      bg="neutral.0"
      padding="25px 20px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="left"
    >
      <Flex width="100%" flexDir="column" gap="40px" alignItems="left">
        <img
          src={process.env.REACT_APP_FRONTEND_URL + "/assets/logo.png"}
          alt="Marillac Place Logo"
          width="85%"
        />

        <Tabs
          index={currentPage}
          orientation="vertical"
          variant="unstyled"
          width="100%"
        >
          <TabList w="100%">
            {pages.map((page) => (
              <SideBarTab
                key={page.label}
                label={page.label}
                handleClick={() => navigate(page.route)}
              />
            ))}
          </TabList>
        </Tabs>
      </Flex>

      <Button
        variant="white"
        color="danger.900"
        fontWeight={700}
        fontSize="14px"
        onClick={() => setSignOut(true)}
      >
        Sign out
      </Button>

      {signOut && <SignOutPopUp cancel={() => setSignOut(false)} />}
    </Box>
  );
}
