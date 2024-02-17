import React, { useContext } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";
import { LOGIN_PAGE } from "../../constants/Routes";

/* eslint-disable @typescript-eslint/no-explicit-any */

const PrivateRoute: React.FC = () => {
  const { authenticatedUser } = useContext(AuthContext);

  return authenticatedUser ? <Outlet /> : <Navigate to={LOGIN_PAGE} />;
};

export default PrivateRoute;

/* eslint-enable @typescript-eslint/no-explicit-any */
