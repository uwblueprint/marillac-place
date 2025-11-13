import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import AdminLoginPage from "./admin/pages/login/Main";
// import AdminHomePage from "./(ignore) refactor-in-progress/admin/pages/home/Main";
// import AdminSchedulePage from "./(ignore) refactor-in-progress/admin/pages/schedule/Main";
// import AdminAnnouncementsPage from "./(ignore) refactor-in-progress/admin/pages/announcements/Main";
// import AdminParticipantsPage from "./(ignore) refactor-in-progress/admin/pages/participants/Main";
// import AdminTasksPage from "./(ignore) refactor-in-progress/admin/pages/tasks/Main";
// import AdminBadgesPage from "./(ignore) refactor-in-progress/admin/pages/badges/Main";
// import AdminReportsPage from "./(ignore) refactor-in-progress/admin/pages/reports/Main";

import ParticipantLoginPage from "./participant/pages/login/Main";
// import ParticipantHomePage from "./(ignore) refactor-in-progress/participant/pages/home/Main";
// import ParticipantSchedulePage from "./(ignore) refactor-in-progress/participant/pages/schedule/Main";
// import ParticipantAnnouncementsPage from "./(ignore) refactor-in-progress/participant/pages/announcements/Main";
// import ParticipantProgressPage from "./(ignore) refactor-in-progress/participant/pages/progress/Main";

import * as ROUTES from "./constants/routes";
import AdminRoute from "./admin/AdminRoute";
import ParticipantRoute from "./participant/ParticipantRoute";
import { AdminProvider } from "./admin/AdminContext";
import { ParticipantProvider } from "./participant/ParticipantContext";
import NotFound from "./ui/screens/NotFoundScreen";

import colors from "./theme/colors";
import { Text, textStyles } from "./theme/typography";

function initApolloClient() {
  const endpoint = createUploadLink({
    uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
    credentials: "include",
  });

  const header = setContext(async (_, { headers }) => {
    const path = window.location.pathname.split("/");
    let token = null;
    if (path.length >= 2 && path[1] === "admin") {
      token = localStorage.getItem("admin_token");
    } else {
      token = localStorage.getItem("participant_token");
    }

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
          <AdminProvider>
            <Routes>
              <Route
                path={ROUTES.ADMIN_LOGIN_PAGE}
                element={<AdminLoginPage />}
              />
              {/* <Route
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
                path={ROUTES.ADMIN_REPORTS_PAGE}
                element={
                  <AdminRoute>
                    <AdminReportsPage />
                  </AdminRoute>
                }
              /> */}
            </Routes>
          </AdminProvider>

          <ParticipantProvider>
            <Routes>
              <Route
                path={ROUTES.PARTICIPANTS_LOGIN_PAGE}
                element={<ParticipantLoginPage />}
              />
              {/* <Route
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
              /> */}
            </Routes>
          </ParticipantProvider>

          <Routes>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default App;
