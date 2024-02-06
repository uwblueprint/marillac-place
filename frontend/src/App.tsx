import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useReducer } from "react";
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

import { AuthenticatedUser } from "./types/AuthTypes";

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

  return (
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
                element={<CreatePage />}
              />
              <Route
                path={Routes.UPDATE_ENTITY_PAGE}
                element={<UpdatePage />}
              />
              <Route
                path={Routes.DISPLAY_ENTITY_PAGE}
                element={<DisplayPage />}
              />
              <Route
                path={Routes.CREATE_SIMPLE_ENTITY_PAGE}
                element={<SimpleEntityCreatePage />}
              />
              <Route
                path={Routes.UPDATE_SIMPLE_ENTITY_PAGE}
                element={<SimpleEntityUpdatePage />}
              />
              <Route
                path={Routes.DISPLAY_SIMPLE_ENTITY_PAGE}
                element={<SimpleEntityDisplayPage />}
              />
              <Route
                path={Routes.EDIT_TEAM_PAGE}
                element={<EditTeamInfoPage />}
              />
              <Route path={Routes.HOOKS_PAGE} element={<HooksDemo />} />
              <Route path="*" element={<NotFound />} />
            </Switch>
          </Router>
        </AuthContext.Provider>
      </SampleContextDispatcherContext.Provider>
    </SampleContext.Provider>
  );
};

export default App;
