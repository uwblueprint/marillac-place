import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useReducer } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";

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
import tabsTheme from "./theme/tabs";
import { inputTheme, textareaTheme } from "./theme/inputs";

import PrivateRoute from "./components/auth/PrivateRoute";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import AnnouncementsPage from "./components/pages/announcements/AnnouncementsPage";
import TasksPage from "./components/pages/tasks/TasksPage";
import ApprovalsPage from "./components/pages/approvals/ApprovalsPage";
import SchedulePage from "./components/pages/schedule/SchedulePage";
import ResidentsPage from "./components/pages/residents/ResidentsPage";
import InsightsPage from "./components/pages/insights/InsightsPage";
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
    colors,
    components: {
      Modal: modalTheme,
      Button: buttonTheme,
      Input: inputTheme,
      Textarea: textareaTheme,
      Tabs: tabsTheme,
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
                  path={Routes.RESET_PASSWORD_PAGE}
                  element={<ResetPasswordPage />}
                />
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
                    // <PrivateRoute>
                      <TasksPage />
                    // </PrivateRoute>
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
                  path={Routes.RESIDENTS_PAGE}
                  element={
                    // <PrivateRoute>
                      <ResidentsPage />
                    // </PrivateRoute>
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
