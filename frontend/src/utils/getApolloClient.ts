import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";

export default function getApolloClient() {
  const endpoint = createUploadLink({
    uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
    credentials: "include",
  });

  const header = setContext(async (_, { headers }) => {
    const token = localStorage.getItem("token");
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

  return apolloClient;
};