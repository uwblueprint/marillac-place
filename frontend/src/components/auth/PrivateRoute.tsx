import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";
import { LOGIN_PAGE } from "../../constants/Routes";

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { authenticatedUser } = useContext(AuthContext);
  return authenticatedUser ? children : <Navigate to={LOGIN_PAGE} />;
};

export default PrivateRoute;
