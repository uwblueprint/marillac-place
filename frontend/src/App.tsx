import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useReducer } from "react";
import {
  ChakraProvider,
  extendTheme,  
} from "@chakra-ui/react";
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
import * as Routes from "./constants/Routes";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext from "./contexts/AuthContext";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
import SampleContext, {
  DEFAULT_SAMPLE_CONTEXT,
} from "./contexts/SampleContext";
import sampleContextReducer from "./reducers/SampleContextReducer";
import SampleContextDispatcherContext from "./contexts/SampleContextDispatcherContext";
import EditTeamInfoPage from "./components/pages/EditTeamPage";
import HooksDemo from "./components/pages/HooksDemo";
import ModalContainer from "./components/common/ModalContainer";

import { AuthenticatedUser } from "./types/AuthTypes";
import modalTheme from "./themes/ModalTheme";

import SideBar from "./components/common/SideBar";

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
    },
    components: {
      Modal: modalTheme,
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
            <ModalContainer/>
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
                    <SideBar>
                      <HooksDemo />
                    </SideBar>
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
