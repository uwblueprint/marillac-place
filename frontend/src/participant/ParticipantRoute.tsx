import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { useLazyQuery } from "@apollo/client";
import { verifyRole } from "../helpers/verifyRole";
import { PARTICIPANT } from "../constants/roles";
import LoadingScreen from "../ui/screens/LoadingScreen";
import { PARTICIPANTS_LOGIN_PAGE } from "../constants/routes";
import { ParticipantContext } from "./ParticipantContext";
import { GET_PARTICIPANT_BY_PID } from "../gql/participantRequests";
import ErrorScreen from "../ui/screens/ErrorScreen";
import ParticipantMenu from "./ParticipantMenu";

type ParticipantRouteProps = {
  children: React.ReactElement;
};

export default function ParticipantRoute({ children }: ParticipantRouteProps) {
  const participantContext = useContext(ParticipantContext);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [getParticipantByPid] = useLazyQuery(GET_PARTICIPANT_BY_PID, {
    onCompleted: (data) => {
      if (
        !data ||
        !data.getParticipantByPid.room ||
        !data.getParticipantByPid.balance ||
        !participantContext
      ) {
        setError("error fetching participant for context");
        return;
      }
      participantContext.setRoom(data.getParticipantByPid.room);
      participantContext.setBalance(data.getParticipantByPid.balance);
    },
    onError: (err: Error) => {
      setError(err.message);
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
      if (authorized && participantContext && participantContext.pid) {
        getParticipantByPid({
          variables: { pid: participantContext.pid },
        });
      }
    };
    fetchParticipantData();
  }, [authorized, participantContext]);

  if (loading || !participantContext || !participantContext.pid || !participantContext.room || !participantContext.balance) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
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
    >
      <Flex maxWidth="500px" width="100%" height="fit-content" flexDir="column" position="relative">
        <ParticipantMenu room={participantContext.room} balance={participantContext.balance} />
        <Flex
          flexDir="column"
          mt="60px"
          width="100%"
          height="calc(100vh - 60px)"
          padding="20px"
          overflow="scroll"
          gap="8px"
        >
          {error ? <ErrorScreen message={error} /> : loading ? <LoadingScreen /> : children}
        </Flex>
      </Flex>
    </Flex>
  );
}
