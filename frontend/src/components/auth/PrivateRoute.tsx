import React, { useContext } from "react";
<<<<<<< Updated upstream
import { Navigate } from "react-router-dom";
=======
<<<<<<< Updated upstream
import { Route, Navigate } from "react-router-dom";
=======
import { Navigate } from "react-router-dom";
import SideBar from "../common/SideBar";
>>>>>>> Stashed changes
>>>>>>> Stashed changes

import AuthContext from "../../contexts/AuthContext";
import { LOGIN_PAGE } from "../../constants/Routes";

<<<<<<< Updated upstream
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { authenticatedUser } = useContext(AuthContext);
  return authenticatedUser ? children : <Navigate to={LOGIN_PAGE} />;
=======
<<<<<<< Updated upstream
type PrivateRouteProps = {
  component: React.ReactNode;
  path: string;
  exact: boolean;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component,
  exact,
  path,
}: PrivateRouteProps) => {
  const { authenticatedUser } = useContext(AuthContext);

  return authenticatedUser ? (
    <Route path={path} element={component} />
  ) : (
    <Navigate to={LOGIN_PAGE} />
  );
=======
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { authenticatedUser } = useContext(AuthContext);
  return authenticatedUser ? <SideBar>{children}</SideBar> : <Navigate to={LOGIN_PAGE} />;
>>>>>>> Stashed changes
>>>>>>> Stashed changes
};

export default PrivateRoute;
