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
      fontWeight={500}
      color="black"
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
    <Flex flexDir="column" w="100%" maxW="240px">
      <Box
        h="100vh"
        borderRight="solid"
        borderRightColor="gray.300"
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

          <Flex flexDirection="column" alignItems="left">
            <Text whiteSpace="nowrap" fontWeight="bold" mb="3">
              Administrative Staff
            </Text>

            <Button
              variant="del"
              onClick={onLogOutClick}
              border="1px solid #C5C8D8"
              color="#B21D2F"
              fontWeight={400}
              fontSize="14px"
              width="fit-content"
            >
              Sign out
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SideBar;
