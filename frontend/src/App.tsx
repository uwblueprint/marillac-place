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
import modalTheme from "./theme/modals";
import buttonTheme from "./theme/buttons";
import tabsTheme from "./theme/tabs";
import { inputTheme, textareaTheme } from "./theme/inputs";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as ROUTES from "./constants/Routes";
import HomePage from "./components/pages/home/HomePage";
// import SchedulePage from "./components/pages/schedule/SchedulePage";
// import AnnouncementsPage from "./components/pages/announcements/AnnouncementsPage";
import ParticipantsPage from "./components/pages/participants/ParticipantsPage";
import TasksPage from "./components/pages/tasks/TasksPage";
import AdminLoginPage from "./components/pages/auth/AdminLoginPage";
import NotFoundPage from "./components/common/NotFoundPage";

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
    components: {
      Modal: modalTheme,
      Button: buttonTheme,
      Input: inputTheme,
      Textarea: textareaTheme,
      Tabs: tabsTheme,
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
            <Route path={ROUTES.LOGIN_PAGE} element={<AdminLoginPage />} />
            {/* <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path={ROUTES.HOME_PAGE}
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path={ROUTES.SCHEDULE_PAGE}
              element={
                <ProtectedRoute>
                  <SchedulePage />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path={ROUTES.ANNOUNCEMENTS_PAGE}
              element={
                <ProtectedRoute>
                  <AnnouncementsPage />
                </ProtectedRoute>
              }
            /> */}
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
            <Route path="*" element={<NotFoundPage />} />
          </Switch>
        </Router>
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default App;
