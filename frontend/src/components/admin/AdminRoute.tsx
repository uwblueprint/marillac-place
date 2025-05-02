import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import SideBar from "./SideBar";
import Notification from "./Notification";
import * as ROUTES from "../../constants/routes";
import hasRole from "../../utils/hasRole";
import Loading from "../Loading";

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
      const isAdmin = await hasRole("admin");
      const isRelief = await hasRole("relief");
      if (isAdmin || isRelief) {
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
          width="100%"
          ml="250px"
        >
          { children }
        </Flex>
      </Flex>
    </Flex>
  )
}