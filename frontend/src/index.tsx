import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";

import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import { AuthenticatedUser, DecodedJWT } from "./types/AuthTypes";
import {
  getLocalStorageObjProperty,
  setLocalStorageObjProperty,
} from "./utils/LocalStorageUtils";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const REFRESH_MUTATION = `
  mutation Index_Refresh {
    refresh
  }
`;

const link = createUploadLink({
  uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
  credentials: "include",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token: string | null = getLocalStorageObjProperty<
    NonNullable<AuthenticatedUser>,
    string
  >(AUTHENTICATED_USER_KEY, "accessToken");

  if (token) {
    const decodedToken = "" as DecodedJWT; // TODO: JWT token needs to be decoded

    // refresh if decodedToken has expired
    if (
      decodedToken &&
      (typeof decodedToken === "string" ||
        decodedToken.exp <= Math.round(new Date().getTime() / 1000))
    ) {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/graphql`,
        { query: REFRESH_MUTATION },
        { withCredentials: true },
      );

      const accessToken: string = data.data.refresh;
      setLocalStorageObjProperty(
        AUTHENTICATED_USER_KEY,
        "accessToken",
        accessToken,
      );
      token = accessToken;
    }
  }
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const apolloClient = new ApolloClient({
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  link: authLink.concat(link as any),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
