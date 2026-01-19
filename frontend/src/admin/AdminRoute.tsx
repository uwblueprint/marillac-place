import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { useLazyQuery } from "@apollo/client";
import { getRole, verifyRole } from "../helpers/verifyRole";
import { ADMIN, RELIEF } from "../constants/roles";
import LoadingScreen from "../ui/screens/LoadingScreen";
import { ADMIN_LOGIN_PAGE } from "../constants/routes";
import { GET_CURRENT_PARTICIPANTS } from "../gql/participantRequests";
import { AdminContext } from "./AdminContext";
import ErrorScreen from "../ui/screens/ErrorScreen";
import AdminMenu from "./AdminMenu";
import { Participant } from "../types/models";

type AdminRouteProps = {
  children: React.ReactElement;
};

export default function AdminRoute({ children }: AdminRouteProps) {
  const adminContext = useContext(AdminContext);
  const [populatingContext, setPopulatingContext] = useState(true);

  const [authorized, setAuthorized] = useState(false);
  const [authorizing, setAuthorizing] = useState(true);

  const [error, setError] = useState("");

  const [getCurrentParticipants] = useLazyQuery(GET_CURRENT_PARTICIPANTS, {
    onCompleted: (data) => {
      if (!data || !data.getCurrentParticipants) {
        setError("current participants data is missing");
        return;
      }
      const roomToParticipantMap: Record<number, number> = {};
      data.getCurrentParticipants.forEach((participant: Participant) => {
        roomToParticipantMap[participant.room] = participant.pid;
      });
      adminContext.setRoomToParticipant(roomToParticipantMap);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    const authorize = async () => {
      const isStaff = await verifyRole([ADMIN, RELIEF]);
      if (isStaff) {
        setAuthorized(true);
      }
      setAuthorizing(false);
    };
    authorize();
  }, []);

  useEffect(() => {
    if (!authorizing && authorized) {
      const populateContext = async () => {
        getCurrentParticipants();
        const role = await getRole();
        if (role === null) {
          setError("Unable to retrieve role, please login again");
        } else {
          adminContext.setRole(role);
        }
        setPopulatingContext(false);
      }
      populateContext();
    }
  }, [authorizing, authorized]);

  if (!authorizing && !authorized) {
    return <Navigate to={ADMIN_LOGIN_PAGE} replace />;
  }

  if (authorizing || populatingContext) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
  }

  return (
    <Flex alignItems="center" justifyContent="center">
      <Flex
        position="relative"
        width="100vw"
        height="100vh"
        maxWidth="1400px"
        overflow="hidden"
      >
        <AdminMenu />
        <Flex
          width="calc(100% - 250px)"
          height="100%"
          ml="250px"
          position="relative"
        >
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
          <Flex
            width="100%"
            height="calc(100% - 55px)"
            padding="20px"
            mt="55px"
            overflow="scroll"
          >
            {children}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
