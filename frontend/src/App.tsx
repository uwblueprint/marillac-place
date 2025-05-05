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

import "./styles/index.css";
import "./styles/svg.css";

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

import * as ROUTES from "./constants/routes";
import AdminRoute from "./components/admin/AdminRoute";
import ParticipantRoute from "./components/participant/ParticipantRoute";

import NotFound from "./components/NotFound";
import Loading from "./components/Loading";

const App = (): React.ReactElement => {
  const theme =  getChakraTheme();
  const apolloClient = getApolloClient();

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
                <Loading />
              </ParticipantRoute>
            }/>

            <Route path="*" element={<NotFound />} />
          </Switch>
        </Router>
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default App;
