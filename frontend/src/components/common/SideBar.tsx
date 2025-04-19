import React from "react";
import { Tabs, TabList, Tab, Box, Button, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import * as Routes from "../../constants/Routes";
import { ReactComponent as Logo } from "../../assets/marillacPlaceLogo.svg";

const SideBarTab: React.FC<{ label: string; handleClick: () => void }> = ({
  label,
  handleClick,
}) => {
  return (
    <Tab
      borderRadius="8px"
      textAlign="left"
      fontWeight={500}
      color="black"
      justifyContent="stretch"
      onClick={handleClick}
      pt={1}
      pb={1}
      mt={5}
      _selected={{ bg: "secondary.500", color: "secondary.50" }}
    >
      {label}
    </Tab>
  );
};

const SideBar: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    // localStorage.removeItem("type");
    navigate(Routes.LOGIN_PAGE);
  };

  const pages = [
    { label: "Home", route: Routes.HOME_PAGE },
    // { label: "Approvals", route: Routes.APPROVALS_PAGE },
    { label: "Schedule", route: Routes.SCHEDULE_PAGE },
    { label: "Announcements", route: Routes.ANNOUNCEMENTS_PAGE },
    { label: "Participants", route: Routes.PARTICIPANTS_PAGE }, // RESIDENTS/PARTICIPANTS
    { label: "Task List", route: Routes.TASKS_PAGE },
    // { label: "Insights", route: Routes.INSIGHTS_PAGE },
  ];

  const currentPage = pages.findIndex(
    (page) => page.route === window.location.pathname,
  );

  // const sidebarWidth = useBreakpointValue({
  //   base: "100%",
  //   md: "100%",
  //   lg: "10%",
  //   xl: "10%",
  // });

  return (
    <Flex
      flexDir="column"
      w="100%"
      minW="240px"
      maxW="240px"
      position="relative"
    >
      <Box
        h="100%"
        w="240px"
        borderRight="solid"
        borderRightColor="neutral.200"
        background="white"
        position="fixed"
        pt={6}
        pb={6}
        pr={4}
        pl={4}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Flex flexDir="column" alignItems="space-between" h="100%">
          <Flex flexDir="column" h="100%">
            <Flex flexDir="column" alignItems="column" maxW="250px">
              <Logo width="85%" />
            </Flex>

            <Tabs
              defaultIndex={currentPage}
              orientation="vertical"
              variant="solid-rounded"
              size="md"
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
            variant="del"
            border="solid"
            borderColor="neutral.200"
            color="#B21D2F"
            fontWeight={600}
            fontSize="14px"
            width="fit-content"
            onClick={() => handleSignOut()}
          >
            Sign out
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SideBar;
