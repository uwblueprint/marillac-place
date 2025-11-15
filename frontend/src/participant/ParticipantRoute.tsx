import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { verifyRole } from "../helpers/verifyRole";
import { PARTICIPANT } from "../constants/roles";
import Loading from "../ui/screens/LoadingScreen";
import { PARTICIPANTS_LOGIN_PAGE } from "../constants/routes";
import { useContext } from "react";
import { useLazyQuery } from "@apollo/client";
import { ParticipantContext } from "./ParticipantContext";
import { GET_PARTICIPANT_BY_PID } from "../gql/participantRequests";
import Error from "../ui/screens/ErrorScreen";
// import ParticipantPageHeader from "../(ignore) refactor-in-progress/participant/common/PageHeader";

type ParticipantRouteProps = {
  children: React.ReactElement;
};

export default function ParticipantRoute({ children }: ParticipantRouteProps) {
  const participantContext = useContext(ParticipantContext);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [getParticipantByPid] = useLazyQuery(GET_PARTICIPANT_BY_PID, {
    onCompleted: (data) => {
      if (!data || !data.getParticipantByPid || !participantContext) {
        setError("error fetching participant for context");
        return;
      }
      participantContext.setRoom(data.getParticipantByPid.room);
      participantContext.setBalance(data.getParticipantByPid.balance);
    },
    onError: (error) => {
      console.error("Error fetching participant:", error);
    },
  });
  
  useEffect(() => {
    const authorize = async () => {
      const isParticipant = await verifyRole([PARTICIPANT]);
      if (isParticipant) {
        setAuthorized(true);
      }
      setLoading(false);
    };
    authorize();
  }, []);

  useEffect(() => {
    const fetchParticipantData = async () => {
      if (authorized && participantContext) {
        setLoading(true);
        getParticipantByPid({ variables: { pid: participantContext.pid } });
        setLoading(false);
      }
    };
    fetchParticipantData();
  }, [authorized, participantContext]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  if (!authorized) {
    return <Navigate to={PARTICIPANTS_LOGIN_PAGE} replace />;
  }

  return (
    <Flex
      w="100vw"
      h="100vh"
      alignItems="flex-start"
      justifyContent="center"
      bg="neutral.100"
    >
      <Flex maxWidth="500px" width="100%" height="fit-content" flexDir="column">
        {/* <ParticipantPageHeader /> */}
        <Flex
          flexDir="column"
          width="100%"
          padding="20px"
          overflow="scroll"
          gap="8px"
        >
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
}
