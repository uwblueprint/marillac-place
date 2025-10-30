import React, { useEffect, useState, createContext, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [authorized, setAuthorized] = useState(false);
  const [participantId, setParticipantId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Pages that need full-width layout (no padding on the wrapper)
  const isFullWidthPage =
    location.pathname === ROUTES.PARTICIPANTS_SCHEDULE_PAGE;

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
            padding={isFullWidthPage ? "0" : "20px"}
            overflow="scroll"
            gap={isFullWidthPage ? "0" : "8px"}
          >
            {children}
          </Flex>
        </ParticipantContext.Provider>
      </Flex>
    </Flex>
  );
}
