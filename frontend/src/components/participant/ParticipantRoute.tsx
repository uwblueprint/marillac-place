import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import hasRole from "../../utils/hasRole";
import Loading from "../Loading";

type ParticipantRouteProps = {
  children: React.ReactElement;
}

export default function ParticipantRoute({ children }: ParticipantRouteProps) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const isParticipant = await hasRole("participant");
      if (isParticipant) {
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

  return children;
}