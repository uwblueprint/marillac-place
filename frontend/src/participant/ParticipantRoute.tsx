import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { useLazyQuery } from "@apollo/client";
import { getSession } from "../helpers/session";
import { PARTICIPANT } from "../constants/roles";
import LoadingScreen from "../ui/screens/LoadingScreen";
import { PARTICIPANTS_LOGIN_PAGE } from "../constants/routes";
import { ParticipantContext } from "./ParticipantContext";
import { GET_PARTICIPANT_BY_PID } from "../gql/participantRequests";
import ErrorScreen from "../ui/screens/ErrorScreen";
import useSessionExpiry from "../hooks/useSessionExpiry";
import ParticipantMenu from "./ParticipantMenu";

type ParticipantRouteProps = {
  children: React.ReactElement;
};

export default function ParticipantRoute({ children }: ParticipantRouteProps) {
  const participantContext = useContext(ParticipantContext);
  const [authorized, setAuthorized] = useState(false);
  const [authorizing, setAuthorizing] = useState(true);

  const [error, setError] = useState("");

  useSessionExpiry(authorized, PARTICIPANTS_LOGIN_PAGE);

  const [getParticipantByPid] = useLazyQuery(GET_PARTICIPANT_BY_PID, {
    onCompleted: (data) => {
      if (
        !data ||
        !data.getParticipantByPid ||
        !data.getParticipantByPid.room ||
        !data.getParticipantByPid.balance
      ) {
        setError("participant data is missing");
        return;
      }
      participantContext.setRoom(data.getParticipantByPid.room);
      participantContext.setBalance(data.getParticipantByPid.balance);
      participantContext.setTotalEarnings(
        data.getParticipantByPid.total_earnings
      );
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    const session = getSession();
    if (session?.role === PARTICIPANT) {
      participantContext.setPid(session.pid);
      getParticipantByPid({ variables: { pid: session.pid } });
      setAuthorized(true);
    }
    setAuthorizing(false);
  }, []);

  if (!authorizing && !authorized) {
    return <Navigate to={PARTICIPANTS_LOGIN_PAGE} replace />;
  }

  return (
    <Flex w="100vw" h="100vh" alignItems="flex-start" justifyContent="center">
      <Flex
        maxWidth="500px"
        width="100%"
        height="fit-content"
        flexDir="column"
        position="relative"
      >
        <ParticipantMenu
          room={participantContext.room}
          balance={participantContext.balance}
        />
        <Flex
          flexDir="column"
          mt="60px"
          width="100%"
          height="calc(100vh - 60px)"
          padding="20px"
          overflow="scroll"
          gap="8px"
          bg="background.participant"
        >
          {error ? (
            <ErrorScreen message={error} />
          ) : authorizing ? (
            <LoadingScreen />
          ) : (
            children
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
