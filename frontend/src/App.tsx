import React from "react";
import {
  BrowserRouter as Router,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import AdminLoginPage from "./admin/pages/login/Main";
import AdminHomePage from "./admin/pages/home/Main";
// import AdminSchedulePage from "./admin/pages/schedule/Main";
import AdminAnnouncementsPage from "./admin/pages/announcements/Main";
// import AdminParticipantsPage from "./admin/pages/participants/Main";
// import AdminTasksPage from "./admin/pages/tasks/Main";
import AdminBadgesPage from "./admin/pages/badges/Main";
import AdminReportsPage from "./admin/pages/reports/Main";

import ParticipantLoginPage from "./participant/pages/login/Main";
// import ParticipantHomePage from "./participant/pages/home/Main";
import ParticipantSchedulePage from "./participant/pages/schedule/Main";
import ParticipantAnnouncementsPage from "./participant/pages/announcements/Main";
import ParticipantProgressPage from "./participant/pages/progress/Main";

import * as ROUTES from "./constants/routes";
import AdminRoute from "./admin/AdminRoute";
import ParticipantRoute from "./participant/ParticipantRoute";
import { AdminProvider } from "./admin/AdminContext";
import { ParticipantProvider } from "./participant/ParticipantContext";

import NotFoundScreen from "./ui/screens/NotFoundScreen";
import UI from "./ui/UI";
import colors from "./theme/colors";
import { Text, textStyles } from "./theme/typography";
import ParticipantsHomePage from "./participant/pages/home/Main";

function initApolloClient() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const endpoint = createUploadLink({
    uri: `${backendUrl}/graphql`,
    credentials: "include",
  });

  const header = setContext(async (_, { headers }) => {
    let token = null;
    token = localStorage.getItem("token");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const apolloClient = new ApolloClient({
    link: header.concat(endpoint),
    cache: new InMemoryCache(),
  });

  return apolloClient;
}

const AdminLayout = (): React.ReactElement => (
  <AdminProvider>
    <Outlet />
  </AdminProvider>
);

const ParticipantLayout = (): React.ReactElement => (
  <ParticipantProvider>
    <Outlet />
  </ParticipantProvider>
);

const App = (): React.ReactElement => {
  const theme = extendTheme({
    colors,
    textStyles,
    components: { Text },
  });
  const apolloClient = initApolloClient();

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <Router>
          <Routes>
            <Route element={<AdminLayout />}>
              <Route
                path={ROUTES.ADMIN_LOGIN_PAGE}
                element={<AdminLoginPage />}
              />
            </Route>
            <Route element={<ParticipantLayout />}>
              <Route
                path={ROUTES.PARTICIPANTS_LOGIN_PAGE}
                element={<ParticipantLoginPage />}
              />
              <Route
                path={ROUTES.PARTICIPANTS_HOME_PAGE}
                element={
                  <ParticipantRoute>
                    <ParticipantsHomePage />
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
              <Route
                path={ROUTES.PARTICIPANTS_ANNOUNCEMENTS_PAGE}
                element={
                  <ParticipantRoute>
                    <ParticipantAnnouncementsPage />
                  </ParticipantRoute>
                }
              />
            </Route>
            {/* <Route element={<AdminLayout />}>
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
                path={ROUTES.ADMIN_ANNOUNCEMENTS_PAGE}
                element={
                  <AdminRoute>
                    <AdminAnnouncementsPage />
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
                path={ROUTES.ADMIN_REPORTS_PAGE}
                element={
                  <AdminRoute>
                    <AdminReportsPage />
                  </AdminRoute>
                }
              />
            </Route>
            
            <Route element={<ParticipantLayout />}>
              <Route
                path={ROUTES.PARTICIPANTS_LOGIN_PAGE}
                element={<ParticipantLoginPage />}
              />
            </Route>
            {/* 
              <Route
                path={ROUTES.ADMIN_PARTICIPANTS_PAGE}
                element={
                  <AdminRoute>
                    <AdminParticipantsPage />
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
                path={ROUTES.ADMIN_TASKS_PAGE}
                element={
                  <AdminRoute>
                    <AdminTasksPage />
                  </AdminRoute>
                }
              />
            </Route>
            <Route element={<ParticipantLayout />}>
              <Route
                path={ROUTES.PARTICIPANTS_LOGIN_PAGE}
                element={<ParticipantLoginPage />}
              />
              */}
              {/*
              <Route
                path={ROUTES.PARTICIPANTS_SCHEDULE_PAGE}
                element={
                  <ParticipantRoute>
                    <ParticipantSchedulePage />
                  </ParticipantRoute>
                }
              /> */}

            <Route path="/ui" element={<UI />} />
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default App;
