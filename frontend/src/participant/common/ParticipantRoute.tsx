import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import * as ROUTES from "../../constants/routes";
import { isParticipant, getParticipantId } from "../../utils/checkRole";
import Loading from "../../Loading";
import { ParticipantContext } from "./ParticipantContext";
import ParticipantPageHeader from "./PageHeader";

type ParticipantRouteProps = {
  children: React.ReactElement;
};

export default function ParticipantRoute({ children }: ParticipantRouteProps) {
  const [authorized, setAuthorized] = useState(false);
  const [participantId, setParticipantId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const user = await isParticipant();
      if (user) {
        setAuthorized(true);
      }
      const id = await getParticipantId();
      setParticipantId(id);
      setLoading(false);
    };
    checkRole();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!authorized) {
    return <Navigate to={ROUTES.PARTICIPANTS_LOGIN_PAGE} replace />;
  }

  if (!participantId) {
    return <Flex>Something went wrong. ID # is missing.</Flex>;
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
        <ParticipantContext.Provider value={{ id: participantId }}>
          <ParticipantPageHeader />
          <Flex
            flexDir="column"
            width="100%"
            padding="20px"
            overflow="scroll"
            gap="8px"
          >
            {children}
          </Flex>
        </ParticipantContext.Provider>
      </Flex>
    </Flex>
  );
}
