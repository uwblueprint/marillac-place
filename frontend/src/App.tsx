import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";

import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import getApolloClient from "./utils/getApolloClient";
import getChakraTheme from "./utils/getChakraTheme";

import AdminLoginPage from "./admin/pages/login/Main";
import AdminHomePage from "./admin/pages/home/Main";
import AdminSchedulePage from "./admin/pages/schedule/Main";
import AdminAnnouncementsPage from "./admin/pages/announcements/Main";
import AdminParticipantsPage from "./admin/pages/participants/Main";
import AdminTasksPage from "./admin/pages/tasks/Main";
import AdminBadgesPage from "./admin/pages/badges/Main";

import ParticipantLoginPage from "./participant/pages/login/Main";
import ParticipantHomePage from "./participant/pages/home/Main";
import ParticipantSchedulePage from "./participant/pages/schedule/Main";
import ParticipantAnnouncementsPage from "./participant/pages/announcements/Main";
import ParticipantProgressPage from "./participant/pages/progress/Main";

import NotFound from "./NotFound";

import * as ROUTES from "./constants/routes";
import AdminRoute from "./admin/common/misc/AdminRoute";
import ParticipantRoute from "./participant/common/ParticipantRoute";

const App = (): React.ReactElement => {
  const theme = getChakraTheme();
  const apolloClient = getApolloClient();

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <Router>
          <Switch>
            <Route
              path={ROUTES.ADMIN_LOGIN_PAGE}
              element={<AdminLoginPage />}
            />
            <Route
              path={ROUTES.ADMIN_HOME_PAGE}
              element={
                <AdminRoute>
                  <AdminHomePage />
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN_SCHEDULE_PAGE}
              element={
                <AdminRoute>
                  <AdminSchedulePage />
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN_ANNOUNCEMENTS_PAGE}
              element={
                <AdminRoute>
                  <AdminAnnouncementsPage />
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN_PARTICIPANTS_PAGE}
              element={
                <AdminRoute>
                  <AdminParticipantsPage />
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN_TASKS_PAGE}
              element={
                <AdminRoute>
                  <AdminTasksPage />
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN_BADGES_PAGE}
              element={
                <AdminRoute>
                  <AdminBadgesPage />
                </AdminRoute>
              }
            />

            <Route
              path={ROUTES.PARTICIPANTS_LOGIN_PAGE}
              element={<ParticipantLoginPage />}
            />
            <Route
              path={ROUTES.PARTICIPANTS_HOME_PAGE}
              element={
                <ParticipantRoute>
                  <ParticipantHomePage />
                </ParticipantRoute>
              }
            />
            <Route
              path={ROUTES.PARTICIPANTS_SCHEDULE_PAGE}
              element={
                <ParticipantRoute>
                  <ParticipantSchedulePage />
                </ParticipantRoute>
              }
            />
            <Route
              path={ROUTES.PARTICIPANTS_ANNOUNCEMENTS_PAGE}
              element={
                <ParticipantRoute>
                  <ParticipantAnnouncementsPage />
                </ParticipantRoute>
              }
            />
            <Route
              path={ROUTES.PARTICIPANTS_PROGRESS_PAGE}
              element={
                <ParticipantRoute>
                  <ParticipantProgressPage />
                </ParticipantRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Switch>
        </Router>
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default App;
