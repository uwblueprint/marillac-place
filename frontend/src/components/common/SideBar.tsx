import React, {useState} from "react";
import {
  Tabs,
  TabList,
  Tab,
  Box,
  Button,
  Modal,
  Flex,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

import * as ROUTES from "../../constants/routes";

const SignOutPopUp: React.FC<{
  cancel: () => void
}> = ({
  cancel
}) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    navigate(ROUTES.LOGIN_PAGE);
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen onClose={cancel} isCentered>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>
          <Text textStyle="web.h2">Sign Out</Text>
        </ModalHeader>
        <ModalBody>
          <Text textStyle="web.b1">Are you sure you want to sign out?</Text>
          <Flex>
            <Button
              variant="white"
              onClick={cancel}
            >
              <Text fontWeight={700} fontSize="14px">Cancel</Text>
            </Button>
            <Button
              variant="primaryFilled"
              onClick={handleSignOut}
            >
              <Text fontWeight={700} fontSize="14px" color="white">Sign Out</Text>
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
};

const SideBarTab: React.FC<{
  label: string;
  handleClick: () => void
}> = ({
  label,
  handleClick,
}) => {
  return (
    <Tab
      marginTop="15px"
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
        bg: "secondary.700"
      }}
    >
      {label}
    </Tab>
  );
};

const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const [signOut, setSignOut] = useState(false);

  const pages = [
    {label: "Home", route: ROUTES.HOME_PAGE},
    {label: "Schedule", route: ROUTES.SCHEDULE_PAGE},
    {label: "Announcements", route: ROUTES.ANNOUNCEMENTS_PAGE},
    {label: "Participants", route: ROUTES.PARTICIPANTS_PAGE},
    {label: "Task Library", route: ROUTES.TASKS_PAGE},
    {label: "Badge Library", route: ROUTES.BADGES_PAGE},
  ];

  const currentPage = pages.findIndex(
    (page) => page.route === window.location.pathname,
  );

  return (
    <Box
      w="17vw"
      h="100vh"
      position="fixed"
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
      <Flex flexDir="column" h="65%" gap="20px">
        <img src={process.env.REACT_APP_FRONTEND_URL + "/assets/logo.png"} alt="Marillac Place Logo" width="90%"/>

        <Tabs
          defaultIndex={currentPage}
          orientation="vertical"
          variant="unstyled"
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
        width="fit-content"
        onClick={() => setSignOut(true)}
      >
        Sign out
      </Button>

      {signOut && <SignOutPopUp cancel={() => setSignOut(false)}/>}
    </Box>
  );
};

export default SideBar;
