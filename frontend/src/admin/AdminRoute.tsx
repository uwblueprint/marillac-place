import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { verifyRole } from "../helpers/verifyRole";
import { ADMIN, RELIEF } from "../constants/roles";
import Loading from "../ui/screens/LoadingScreen";
import { ADMIN_LOGIN_PAGE } from "../constants/routes";
import { GET_CURRENT_PARTICIPANTS } from "../gql/participantRequests";
import { useLazyQuery } from "@apollo/client";
import { AdminContext } from "./AdminContext";
import { useContext } from "react";
import Error from "../ui/screens/ErrorScreen";
import NotificationContainer from "../ui/containers/NotificationContainer";
import AdminMenu from "./AdminMenu";

type AdminRouteProps = {
  children: React.ReactElement;
};

export default function AdminRoute({ children }: AdminRouteProps) {
  const adminContext = useContext(AdminContext);

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(
    localStorage.getItem("notification")
  );
  
  const [getCurrentParticipants] = useLazyQuery(GET_CURRENT_PARTICIPANTS, {
    onCompleted: (data) => {
      if (!data || !data.getCurrentParticipants || !adminContext) {
        setError("error fetching participants for context");
        return;
      }
      const roomToParticipantMap: Record<number, number> = {};
      data.getCurrentParticipants.forEach((participant: any) => {
        roomToParticipantMap[participant.room] = participant.pid;
      });
      adminContext.setRoomToParticipant(roomToParticipantMap);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

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

  useEffect(() => {
    if (authorized) {
      setLoading(true);
      getCurrentParticipants();
      setLoading(false);
    }
  }, [authorized]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
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
        {notification && <NotificationContainer message={notification} />}
        <AdminMenu />
        <Flex width="calc(100% - 250px)" height="100%" ml="250px" position="relative">
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
          <Flex width="100%" height="calc(100% - 55px)" padding="20px" mt="55px" overflow="scroll">
            {children}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
