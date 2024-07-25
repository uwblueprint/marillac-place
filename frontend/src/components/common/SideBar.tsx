import React, { useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import {
  Tabs,
  TabList,
  Tab,
  Box,
  Button,
  Avatar,
  Text,
  Flex,
  Heading,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import * as Routes from "../../constants/Routes";
import { ReactComponent as Logo } from "../../assets/marillacPlaceLogo.svg";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const mockAuthenticatedUser = {
  id: "1",
  type: "STAFF",
  email: "janedoe@gmail.com",
  firstName: "Jane",
  lastName: "Doe",
};

const LOGOUT = gql`
  mutation Logout($userId: ID!) {
    logout(userId: $userId)
  }
`;

const SideBarTab: React.FC<{ label: string; handleClick: () => void }> = ({
  label,
  handleClick,
}) => {
  return (
    <Tab
      borderRadius="8px"
      textAlign="left"
      justifyContent="stretch"
      onClick={handleClick}
      pt={1}
      pb={1}
      mt={5}
      _selected={{ bg: "purple.main", color: "white" }}
      _hover={{ bg: "purple.100", color: "purple.main" }}
    >
      {label}
    </Tab>
  );
};

const SideBar: React.FC = () => {
  const navigate = useNavigate();
  // const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const { setAuthenticatedUser } = useContext(AuthContext); // Temp
  const authenticatedUser = mockAuthenticatedUser; // Temp
  const [logout] = useMutation<{ logout: null }>(LOGOUT);

  const onLogOutClick = async () => {
    const success = await authAPIClient.logout(
      String(authenticatedUser?.id),
      logout,
    );
    if (success) {
      setAuthenticatedUser(null);
    }
  };

  const pages = [
    { label: "Home", route: Routes.HOME_PAGE }, // NEED NEW HOME PAGE
    { label: "Schedule", route: Routes.SCHEDULE_PAGE },
    { label: "Announcements", route: Routes.ANNOUNCEMENTS_PAGE }, // NEED NEW NAME
    { label: "Approvals", route: Routes.APPROVALS_PAGE },
    { label: "Participants", route: Routes.RESIDENTS_PAGE }, // RESIDENTS/PARTICIPANTS
    { label: "Task List", route: Routes.TASKS_PAGE },
    // { label: "Insights", route: Routes.INSIGHTS_PAGE },
  ];

  const currentPage = pages.findIndex(
    (page) => page.route === window.location.pathname,
  );

  const sidebarWidth = useBreakpointValue({
    base: "100%",
    md: "50%",
    lg: "30%",
    xl: "18.5%",
  });

  return (
    <Flex flexDir="column" w={sidebarWidth}>
      <Box
        h="100vh"
        borderRight="solid"
        borderRightColor="gray.300"
        pt={10}
        pr={4}
        pl={4}
      >
        <Flex flexDir="column" alignItems="space-between" h="100%">
          <Flex flexDir="column" h="100%">
            <Flex flexDir="column" alignItems="flex-start" w="100%">
              <Box
                border="solid"
                borderColor="gray.300"
                borderRadius="8px"
                pl={2}
                pr={2}
                w="100%"
              >
                <Flex align="center">
                  {/* <Avatar name="Jane Doe" src="https://bit.ly/2k1H1t6" /> */}
                  <Flex flexDir="column" ml={4}>
                    <Heading size="sm" mt={4}>
                      {authenticatedUser?.firstName}{" "}
                      {authenticatedUser?.lastName}
                    </Heading>
                    <Text>Administrative Staff</Text>
                  </Flex>
                </Flex>
              </Box>
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

          <Flex alignItems="center">
            <Logo width="75%" />
            <Button variant="primary" ml={3} onClick={onLogOutClick}>
              Logout
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SideBar;
