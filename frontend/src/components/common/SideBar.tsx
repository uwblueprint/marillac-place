import React, { FC, ReactNode } from "react";
import {
  Tabs,
  TabList,
  Tab,
  Box,
  Avatar,
  Text,
  Flex,
  Heading,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/Marillac_Place_Logo.svg";

const SideBar: FC<{ children: ReactNode }> = () => {
  const navigate = useNavigate();

  const pages = [
    { label: "Home", route: "/" },
    { label: "Tasks", route: "/tasks" },
    { label: "Approvals", route: "/approvals" },
    { label: "Schedule", route: "/schedule" },
    { label: "Participants", route: "/participants" },
    { label: "Insights", route: "/insights" },
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
    <Flex flexDir="column" w={sidebarWidth}>
      <Box
        h="calc(100vh)"
        borderRight="solid"
        borderRightColor="grey"
        pt={10}
        pr={4}
        pl={4}
      >
        <Flex flexDir="column" alignItems="space-between" h="100%">
          <Flex flexDir="column" h="100%">
            <Flex flexDir="column" alignItems="flex-start" w="100%" pb={20}>
              <Box
                border="solid"
                borderColor="grey"
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
              <TabList w="100%">
                {pages.map((page) => (
                  <Tab
                    key={page.route}
                    borderRadius="8px"
                    justifyContent="stretch"
                    textAlign="left"
                    onClick={() => navigate(page.route)}
                    _selected={{ bg: "purple", color: "white" }}
                  >
                    {page.label}
                  </Tab>
                ))}
              </TabList>
            </Tabs>
          </Flex>
          <Logo width="50%" />
        </Flex>
      </Box>
    </Flex>
  );
};

export default SideBar;
