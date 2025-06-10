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

import AdminLoginPage from "./pages/admin/login/Main";
import AdminHomePage from "./pages/admin/home/Main";
import AdminSchedulePage from "./pages/admin/schedule/Main";
import AdminAnnouncementsPage from "./pages/admin/announcements/Main";
import AdminParticipantsPage from "./pages/admin/participants/Main";
import AdminTasksPage from "./pages/admin/tasks/Main";
// import AdminBadgesPage from "./pages/admin/badges/index";

import ParticipantLoginPage from "./pages/participant/login/Main";
// import ParticipantHomePage from "./pages/participant/home/index";
// import ParticipantSchedulePage from "./pages/participant/schedule/index";
// import ParticipantAnnouncementsPage from "./pages/participant/announcements/index";
// import ParticipantTasksPage from "./pages/participant/tasks/index";
// import ParticipantProgressPage from "./pages/participant/progress/index";

import NotFound from "./pages/NotFound";

import * as ROUTES from "./constants/routes";
import AdminRoute from "./components/admin/AdminRoute";
import ParticipantRoute from "./components/participant/ParticipantRoute";

const App = (): React.ReactElement => {
  const theme = getChakraTheme();
  const apolloClient = getApolloClient();

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <Router>
          <Switch>
            <Route path={ROUTES.ADMIN_LOGIN_PAGE} element={<AdminLoginPage />} />
            <Route path={ROUTES.ADMIN_HOME_PAGE} element={
              <AdminRoute>
                <AdminHomePage />
              </AdminRoute>
            }/>
            <Route path={ROUTES.ADMIN_SCHEDULE_PAGE} element={
              <AdminRoute>
                <AdminSchedulePage />
              </AdminRoute>
            }/>
            <Route path={ROUTES.ADMIN_ANNOUNCEMENTS_PAGE} element={
              <AdminRoute>
                <AdminAnnouncementsPage />
              </AdminRoute>
            }/>
            <Route path={ROUTES.ADMIN_PARTICIPANTS_PAGE} element={
              <AdminRoute>
                <AdminParticipantsPage />
              </AdminRoute>
            }/>
            <Route path={ROUTES.ADMIN_TASKS_PAGE} element={
              <AdminRoute>
                <AdminTasksPage />
              </AdminRoute>
            }/>

            <Route
              path={ROUTES.PARTICIPANTS_LOGIN_PAGE}
              element={<ParticipantLoginPage />}
            />

            <Route path="*" element={<NotFound />} />
          </Switch>
        </Router>
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default App;
