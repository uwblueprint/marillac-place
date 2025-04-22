import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
  Navigate,
} from "react-router-dom";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";

import "bootstrap/dist/css/bootstrap.min.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import colors from "./theme/colors";
import { Text, textStyles } from "./theme/typography";
import Button from "./theme/buttons";
import { Select, Input } from "./theme/form";

import * as ROUTES from "./constants/routes";
// import HomePage from "./components/pages/home/HomePage";
// import SchedulePage from "./components/pages/schedule/SchedulePage";
// import AnnouncementsPage from "./components/pages/announcements/AnnouncementsPage";
// import ParticipantsPage from "./components/pages/participants/ParticipantsPage";
// import TasksPage from "./components/pages/tasks/TasksPage";
// import NotFoundPage from "./components/common/NotFoundPage";
import SideBar from "./components/common/SideBar";
import LoginPage from "./components/pages/login/LoginPage";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute = ({
  children,
}: ProtectedRouteProps): React.ReactElement => {
  const token = localStorage.getItem("token");

  // Check if token exists
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Basic JWT expiration check
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("token"); // Clear expired token
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    // If token is malformed or can't be decoded
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

const App = (): React.ReactElement => {
  const theme = extendTheme({
    colors,
    textStyles,
    components: {
      Button,
      Text,
      Input,
      Select,
    },
  });

  const endpoint = createUploadLink({
    uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
    credentials: "include",
  });

  const header = setContext(async (_, { headers }) => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const apolloClient = new ApolloClient({
    link: header.concat(endpoint as any),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <Router>
          <Switch>
            <Route path={ROUTES.LOGIN_PAGE} element={<LoginPage />} />
            <Route path="*" element={<SideBar />} />
          </Switch>
        </Router>
      </ChakraProvider>
    </ApolloProvider>
  );
};

// eslint-disable-next-line
{/*<Route
              path={ROUTES.HOME_PAGE}
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.SCHEDULE_PAGE}
              element={
                <ProtectedRoute>
                  <SchedulePage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ANNOUNCEMENTS_PAGE}
              element={
                <ProtectedRoute>
                  <AnnouncementsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PARTICIPANTS_PAGE}
              element={
                <ProtectedRoute>
                  <ParticipantsPage />
                </ProtectedRoute>
              }
            />
            <Route
                path={ROUTES.TASKS_PAGE}
                element={
                    <ProtectedRoute>
                        <TasksPage />
                    </ProtectedRoute>
                }
            />
            <Route
              path="*"
              element={
                <NotFoundPage />
              }
            /> */}

export default App;
