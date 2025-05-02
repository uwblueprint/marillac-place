import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";

import "bootstrap/dist/css/bootstrap.min.css";
import { ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import colors from "./theme/colors";
import { Text, textStyles } from "./theme/typography";
import Button from "./theme/buttons";
import { Select, Input } from "./theme/form";

import * as ROUTES from "./constants/routes";

import AdminLoginPage from "./pages/admin/login/index";
// import AdminHomePage from "./pages/admin/home/index";
// import AdminSchedulePage from "./pages/admin/schedule/index";
// import AdminAnnouncementsPage from "./pages/admin/announcements/index";
// import AdminParticipantsPage from "./pages/admin/participants/index";
// import AdminTasksPage from "./pages/admin/tasks/index";
// import AdminBadgesPage from "./pages/admin/badges/index";

import ParticipantLoginPage from "./pages/participant/login/index";
// import ParticipantHomePage from "./pages/participant/home/index";
// import ParticipantSchedulePage from "./pages/participant/schedule/index";
// import ParticipantAnnouncementsPage from "./pages/participant/announcements/index";
// import ParticipantTasksPage from "./pages/participant/tasks/index";
// import ParticipantProgressPage from "./pages/participant/progress/index";

import AdminRoute from "./components/admin/AdminRoute";
import ParticipantRoute from "./components/participant/ParticipantRoute";
import NotFound from "./components/NotFound";

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
              <Route path={ROUTES.ADMIN_LOGIN_PAGE} element={<AdminLoginPage />} />
              <Route path={ROUTES.ADMIN_HOME_PAGE} element={
                <AdminRoute>
                  <NotFound />
                </AdminRoute>
              }/>

              <Route path={ROUTES.PARTICIPANTS_LOGIN_PAGE} element={<ParticipantLoginPage />} />
              <Route path={ROUTES.PARTICIPANTS_HOME_PAGE} element={
                <ParticipantRoute>
                  <NotFound />
                </ParticipantRoute>
              }/>
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
