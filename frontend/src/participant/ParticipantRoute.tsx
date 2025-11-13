import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { verifyRole } from "../utils/verifyRole";
import { PARTICIPANT } from "../constants/roles";
import Loading from "../status/Loading";
import { PARTICIPANTS_LOGIN_PAGE } from "../constants/routes";
import ParticipantPageHeader from "./common/PageHeader";

type ParticipantRouteProps = {
  children: React.ReactElement;
};

export default function ParticipantRoute({ children }: ParticipantRouteProps) {
  // TODO: 
  // call api to get participant by id
  // update room and balance properties in participant context 
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <Loading />;
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
      </Flex>
    </Flex>
  );
}
