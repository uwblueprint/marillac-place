import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useReducer } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";

import * as Routes from "./constants/Routes";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
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

import HomePage from "./components/pages/home/HomePage";
import AnnouncementsPage from "./components/pages/announcements/AnnouncementsPage";
import TasksPage from "./components/pages/tasks/TasksPage";
import SchedulePage from "./components/pages/schedule/SchedulePage";
import ResidentsPage from "./components/pages/residents/ResidentsPage";
import InsightsPage from "./components/pages/insights/InsightsPage";
import NotFoundPage from "./components/pages/NotFoundPage";

const App = (): React.ReactElement => {

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
            <Router>
              <Switch>
                <Route
                  path={Routes.HOME_PAGE}
                  element={
                      <HomePage />
                  }
                />
                <Route
                  path={Routes.ANNOUNCEMENTS_PAGE}
                  element={
                      <AnnouncementsPage />
                  }
                />
                <Route
                  path={Routes.TASKS_PAGE}
                  element={
                      <TasksPage />
                  }
                />
                <Route
                  path={Routes.SCHEDULE_PAGE}
                  element={
                      <SchedulePage />
                  }
                />
                <Route
                  path={Routes.PARTICIPANTS_PAGE}
                  element={
                      <ResidentsPage />
                  }
                />
                <Route
                  path={Routes.INSIGHTS_PAGE}
                  element={
                      <InsightsPage />
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Switch>
            </Router>
        </SampleContextDispatcherContext.Provider>
      </SampleContext.Provider>
    </ChakraProvider>
  );
};

export default App;
