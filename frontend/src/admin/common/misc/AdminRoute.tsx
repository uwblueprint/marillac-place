import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import SideBar from "./SideBar";
import Notification from "./Notification";
import * as ROUTES from "../../../constants/routes";
import { isAdmin, isRelief } from "../../../utils/checkRole";
import Loading from "../../../Loading";

type AdminRouteProps = {
  children: React.ReactElement;
};

export default function AdminRoute({ children }: AdminRouteProps) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(
    localStorage.getItem("notification")
  );

  useEffect(() => {
    const checkRole = async () => {
      const adminUser = await isAdmin();
      const reliefUser = await isRelief();
      if (adminUser || reliefUser) {
        setAuthorized(true);
      }
      setLoading(false);
    };
    checkRole();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!authorized) {
    return <Navigate to={ROUTES.ADMIN_LOGIN_PAGE} replace />;
  }

  if (notification) {
    setTimeout(() => {
      localStorage.setItem("notification", "");
      setNotification("");
    }, 3000);
  }

  return (
    <Flex alignItems="center" justifyContent="center">
      <Flex position="relative" width="100vw" maxWidth="1400px" height="100vh">
        {notification && <Notification message={notification} />}
        <SideBar />
        <Flex width="100%" height="100%" ml="250px" position="relative">
          <Flex
            position="absolute"
            top="0px"
            left="0px"
            width="100%"
            height="55px"
            bg="primary.100"
            borderBottom="1px solid"
            borderColor="neutral.300"
            zIndex={5}
          />
          <Flex width="100%" padding="20px" mt="55px" overflow="scroll">
            {children}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
