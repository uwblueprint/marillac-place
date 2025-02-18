import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";

import "bootstrap/dist/css/bootstrap.min.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import colors from "./theme/colors";
import modalTheme from "./theme/modals";
import buttonTheme from "./theme/buttons";
import tabsTheme from "./theme/tabs";
import { inputTheme, textareaTheme } from "./theme/inputs";

import * as ROUTES from "./constants/routes";
// import HomePage from "./components/pages/home/HomePage";
// import SchedulePage from "./components/pages/schedule/SchedulePage";
// import AnnouncementsPage from "./components/pages/announcements/AnnouncementsPage";
import ParticipantsPage from "./components/pages/participants/ParticipantsPage";
// import TasksPage from "./components/pages/tasks/TasksPage";
import NotFoundPage from "./components/common/NotFoundPage";

const App = (): React.ReactElement => {
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

  const endpoint = createUploadLink({
    uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
    credentials: "include",
  });

  const header = setContext(async (_, { headers }) => {
    const token = null;
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const apolloClient = new ApolloClient({
    link: header.concat(endpoint as any),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <Router>
          <Switch>
            {/* <Route path={ROUTES.HOME_PAGE} element={<HomePage />} /> */}
            {/* <Route path={ROUTES.SCHEDULE_PAGE} element={<SchedulePage />} /> */}
            {/* <Route path={ROUTES.ANNOUNCEMENTS_PAGE} element={<AnnouncementsPage />} /> */}
            <Route path={ROUTES.PARTICIPANTS_PAGE} element={<ParticipantsPage />} />
            {/* <Route path={ROUTES.TASKS_PAGE} element={<TasksPage />} /> */}
            <Route path="*" element={<NotFoundPage />} />
          </Switch>
        </Router>
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default App;
