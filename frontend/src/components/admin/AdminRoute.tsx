import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import SideBar from "./SideBar";
import Notification from "./Notification";
import * as ROUTES from "../../constants/routes";
import { isAdmin, isRelief } from "../../utils/checkRole";
import Loading from "../../pages/Loading";

type AdminRouteProps = {
  children: React.ReactElement;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(
    localStorage.getItem("notification"),
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
    return <Loading />
  }

  if (!authorized) {
    return <Navigate to={ROUTES.ADMIN_LOGIN_PAGE} replace />
  }

  if (notification) {
    setTimeout(() => {
      localStorage.setItem("notification", "");
      setNotification("");
    }, 3000);
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        position="relative"
        width="1400px"
        height="fit-content"
      >
        { notification && <Notification message={notification} /> }
        <SideBar />
        <Flex
          position="absolute"
          top="0px"
          left="250px"
          width="1150px"
          height="50px"
          bg="primary.100"
          borderBottom="1px"
          borderColor="neutral.300"
        />
        <Flex
          width="100%"
          height="calc(100vh - 50px)"
          ml="250px"
          mt="50px"
          padding="15px 25px"
          overflow="scroll"
        >
          { children }
        </Flex>
      </Flex>
    </Flex>
  )
}