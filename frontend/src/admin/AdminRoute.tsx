import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { verifyRole } from "../helpers/verifyRole";
import { ADMIN, RELIEF } from "../constants/roles";
import Loading from "../ui/screens/LoadingScreen";
import { ADMIN_LOGIN_PAGE } from "../constants/routes";
import SideBar from "../(ignore) refactor-in-progress/admin/common/misc/SideBar";
import Notification from "../(ignore) refactor-in-progress/admin/common/misc/Notification";

type AdminRouteProps = {
  children: React.ReactElement;
};

export default function AdminRoute({ children }: AdminRouteProps) {
  // TODO: 
  // call api to get current participants
  // update roomToParticipant propety in admin context 
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(
    localStorage.getItem("notification")
  );

  useEffect(() => {
    const authorize = async () => {
      const isStaff = await verifyRole([ADMIN, RELIEF]);
      if (isStaff) {
        setAuthorized(true);
      }
      setLoading(false);
    };
    authorize();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!authorized) {
    return <Navigate to={ADMIN_LOGIN_PAGE} replace />;
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
