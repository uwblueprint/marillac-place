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
      justifyContent="stretch"
      textAlign="left"
      onClick={handleClick}
      _selected={{ bg: "purple.main", color: "white" }}
      _hover={{ bg: "purple.100", color: "purple.main" }}
    >
      {label}
    </Tab>
  );
};

const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
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
    { label: "Announcements", route: Routes.HOME_PAGE },
    { label: "Tasks", route: Routes.TASKS_PAGE },
    { label: "Approvals", route: Routes.APPROVALS_PAGE },
    { label: "Schedule", route: Routes.SCHEDULE_PAGE },
    { label: "Residents", route: Routes.RESIDENTS_PAGE },
    { label: "Insights", route: Routes.INSIGHTS_PAGE },
  ];

  const currentPage = pages.findIndex(
    (page) => page.route === window.location.pathname,
  );

  const sidebarWidth = useBreakpointValue({
    base: "100%",
    md: "50%",
    lg: "30%",
    xl: "20%",
  });

  return (
    <Flex flexDir="column" width={sidebarWidth} minWidth="300px">
      <Box
        h="calc(100vh)"
        borderRight="solid"
        borderRightColor="gray.300"
        pt={10}
        pr={3}
        pl={3}
      >
        <Flex flexDir="column" alignItems="space-between" h="100%">
          <Flex flexDir="column" h="100%">
            <Flex flexDir="column" alignItems="flex-start" w="100%" pb={20}>
              <Box
                border="solid"
                borderColor="gray.300"
                pl={2}
                pr={2}
                w="100%"
                borderRadius="8px"
              >
                <Flex align="center">
                  <Avatar name="Jane Doe" src="https://bit.ly/2k1H1t6" />
                  <Flex flexDir="column" ml={4}>
                    <Heading size="sm" mt={4}>
                      Jane Doe
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
              size="lg"
            >
              <TabList width="100%">
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

          <Flex alignItems="center" justifyContent="center">
            <Logo width="50%" />
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
