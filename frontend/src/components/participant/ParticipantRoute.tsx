import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import * as ROUTES from "../../constants/Routes";
import { isParticipant } from "../../utils/checkRole";
import Loading from "../../pages/Loading";

type ParticipantRouteProps = {
  children: React.ReactElement;
}

export default function ParticipantRoute({ children }: ParticipantRouteProps) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const participantUser = await isParticipant();
      if (participantUser) {
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
    return <Navigate to={ROUTES.PARTICIPANTS_LOGIN_PAGE} replace />
  }

  return (
    <Flex
      w="100vw"
      h="100vh"
      alignItems="flex-start"
      justifyContent="center"
      bg="primary.100"
    >
      <Flex
        width="350px"
        height="fit-content"
        padding="10px"
      >
        { children }
      </Flex>
    </Flex>
  );
}