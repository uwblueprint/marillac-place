import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { useLazyQuery } from "@apollo/client";
import { getParticipantId, verifyRole } from "../helpers/verifyRole";
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
  const [populatingContext, setPopulatingContext] = useState(true);

  const [authorized, setAuthorized] = useState(false);
  const [authorizing, setAuthorizing] = useState(true);

  const [error, setError] = useState("");

  const [getParticipantByPid] = useLazyQuery(GET_PARTICIPANT_BY_PID, {
    onCompleted: (data) => {
      if (!data || !data.getParticipantByPid || !data.getParticipantByPid.room || !data.getParticipantByPid.balance) {
        setError("participant data is missing");
        return;
      }
      participantContext.setRoom(data.getParticipantByPid.room);
      participantContext.setBalance(data.getParticipantByPid.balance);
      participantContext.setTotalEarnings(data.getParticipantByPid.total_earnings);
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
      setAuthorizing(false);
    };
    authorize();
  }, []);

  useEffect(() => {
    if (!authorizing && authorized) {
      const populateContext = async () => {
        const pid = await getParticipantId();
        if (pid === null) {
          setError("unable to retrieve participant id, please login again");
        } else {
          participantContext.setPid(pid);
          getParticipantByPid({ variables: { pid } });
        }
        setPopulatingContext(false);
      };
      populateContext();
    }
  }, [authorizing, authorized]);

  if (!authorizing && !authorized) {
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
          bg="neutral.100"
        >
          {error ? <ErrorScreen message={error} /> : (authorizing || populatingContext) ? <LoadingScreen /> : children}
        </Flex>
      </Flex>
    </Flex>
  );
}
