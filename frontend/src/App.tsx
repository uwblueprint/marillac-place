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
import EditTeamInfoPage from "./components/pages/EditTeamPage";
import HooksDemo from "./components/pages/HooksDemo";
import ParticipantsPage from "./components/pages/participants/ParticipantsPage";
import * as Routes from "./constants/Routes";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext from "./contexts/AuthContext";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
import SampleContext, {
  DEFAULT_SAMPLE_CONTEXT,
} from "./contexts/SampleContext";
import sampleContextReducer from "./reducers/SampleContextReducer";
import SampleContextDispatcherContext from "./contexts/SampleContextDispatcherContext";

import { AuthenticatedUser } from "./types/AuthTypes";
import modalTheme from "./themes/ModalTheme";
import buttonTheme from "./themes/ButtonTheme";
import { inputTheme, textareaTheme } from "./themes/InputTheme";

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
      black: "#000",
      white: "#fff",
      gray: {
        main: "#808080",
        100: "#E3E4EA",
        300: "#C5C8D8",
      },
      purple: {
        main: "#57469D",
        100: "#F1ECFF",
        300: "#B1A7D7",
        500: "#382584",
      },
      red: {
        main: "#D34C5C",
        error: "#E30000",
      },
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
                <Route path={Routes.LOGIN_PAGE} element={<Login />} />
                <Route path={Routes.SIGNUP_PAGE} element={<Signup />} />
                <Route path={Routes.HOME_PAGE} element={<Default />} />
                <Route
                  path={Routes.CREATE_ENTITY_PAGE}
                  element={
                    <PrivateRoute>
                      <CreatePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={Routes.UPDATE_ENTITY_PAGE}
                  element={
                    <PrivateRoute>
                      <UpdatePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={Routes.DISPLAY_ENTITY_PAGE}
                  element={
                    <PrivateRoute>
                      <DisplayPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={Routes.CREATE_SIMPLE_ENTITY_PAGE}
                  element={
                    <PrivateRoute>
                      <SimpleEntityCreatePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={Routes.UPDATE_SIMPLE_ENTITY_PAGE}
                  element={
                    <PrivateRoute>
                      <SimpleEntityUpdatePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={Routes.DISPLAY_SIMPLE_ENTITY_PAGE}
                  element={
                    <PrivateRoute>
                      <SimpleEntityDisplayPage />
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
                    <PrivateRoute>
                      <HooksDemo />
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
                <Route path="*" element={<NotFound />} />
              </Switch>
            </Router>
          </AuthContext.Provider>
        </SampleContextDispatcherContext.Provider>
      </SampleContext.Provider>
    </ChakraProvider>
  );
};

export default App;
