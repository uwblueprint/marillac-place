import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useReducer } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import PrivateRoute from "./components/auth/PrivateRoute";
import CreatePage from "./components/pages/CreatePage";
import Default from "./components/pages/Default";
import DisplayPage from "./components/pages/DisplayPage";
import SimpleEntityCreatePage from "./components/pages/SimpleEntityCreatePage";
import SimpleEntityDisplayPage from "./components/pages/SimpleEntityDisplayPage";
import NotFound from "./components/pages/NotFound";
import UpdatePage from "./components/pages/UpdatePage";
import SimpleEntityUpdatePage from "./components/pages/SimpleEntityUpdatePage";
import AnnouncementsPage from "./components/pages/announcements/AnnouncementsPage"
import * as Routes from "./constants/Routes";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import { AuthenticatedUser } from "./types/AuthTypes";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
import AuthContext from "./contexts/AuthContext";
import SampleContext, {
  DEFAULT_SAMPLE_CONTEXT,
} from "./contexts/SampleContext";
import SampleContextDispatcherContext from "./contexts/SampleContextDispatcherContext";
import sampleContextReducer from "./reducers/SampleContextReducer";

import colors from "./theme/colors";
import modalTheme from "./theme/modals";
import buttonTheme from "./theme/buttons";
import { inputTheme, textareaTheme } from "./theme/inputs";

import PrivateRoute from "./components/auth/PrivateRoute";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import AnnouncementsPage from "./components/pages/announcements/AnnouncementsPage";
import ApprovalsPage from "./components/pages/approvals/ApprovalsPage";
import InsightsPage from "./components/pages/insights/InsightsPage";
import ParticipantsPage from "./components/pages/participants/ParticipantsPage";
import SchedulePage from "./components/pages/schedule/SchedulePage";
import TasksPage from "./components/pages/tasks/TasksPage";
import NotFoundPage from "./components/pages/NotFoundPage";

const App = (): React.ReactElement => {
  const currentUser: AuthenticatedUser = getLocalStorageObj<AuthenticatedUser>(
    AUTHENTICATED_USER_KEY,
  );

  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser>(currentUser);

  // Some sort of global state. Context API replaces redux.
  // Split related states into different contexts as necessary.
  // Split dispatcher and state into separate contexts as necessary.
  const [sampleContext, dispatchSampleContextUpdate] = useReducer(
    sampleContextReducer,
    DEFAULT_SAMPLE_CONTEXT,
  );

  const theme = extendTheme({
    colors: {
      purple: "#57469D",
      grey: "#C5C8D8",
      lightPurple: "#F9F7FF"
    },
    components: {
      Modal: modalTheme,
      Button: buttonTheme,
      Input: inputTheme,
      Textarea: textareaTheme,
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <SampleContext.Provider value={sampleContext}>
        <SampleContextDispatcherContext.Provider
          value={dispatchSampleContextUpdate}
        >
          <AuthContext.Provider
            value={{ authenticatedUser, setAuthenticatedUser }}
          >
            <Router>
              <Switch>
                <Route path={Routes.LOGIN_PAGE} element={<LoginPage />} />
                <Route path={Routes.SIGNUP_PAGE} element={<SignupPage />} />
                <Route
                  path={Routes.HOME_PAGE}
                  element={
                    <PrivateRoute>
                      <AnnouncementsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={Routes.TASKS_PAGE}
                  element={
                    <PrivateRoute>
                      <TasksPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={Routes.APPROVALS_PAGE}
                  element={
                    <PrivateRoute>
                      <ApprovalsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={Routes.SCHEDULE_PAGE}
                  element={
                    <PrivateRoute>
                      <SchedulePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={Routes.PARTICIPANTS_PAGE}
                  element={
                    <PrivateRoute>
                      <ParticipantsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={Routes.INSIGHTS_PAGE}
                  element={
                    <PrivateRoute>
                      <InsightsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={Routes.EDIT_TEAM_PAGE}
                  element={
                    <PrivateRoute>
                      <EditTeamInfoPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={Routes.HOOKS_PAGE}
                  element={
                    <SideBar>
                      <HooksDemo />
                    </SideBar>
                  }
                />
                <Route
                  path={Routes.ANNOUNCEMENTS_PAGE}
                  element={
                    // <PrivateRoute>
                      <AnnouncementsPage />
                    // </PrivateRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
                <Route path="*" element={<NotFoundPage />} />
              </Switch>
            </Router>
          </AuthContext.Provider>
        </SampleContextDispatcherContext.Provider>
      </SampleContext.Provider>
    </ChakraProvider>
  );
};

export default App;
