/* Demo Component to show how to run new apis */

import React from "react";
import { gql, useQuery } from "@apollo/client";

import { Button } from "@chakra-ui/react";

const GET_USERS = gql`
  query AllResidents {
    allResidents {
      id
      firstName
      lastName
      email
      phoneNumber
      displayName
      profilePictureLink
      birthdate
      credits
      dateJoined
      dateLeft
    }
  }
`;

const TestApi = (): React.ReactElement => {
  const { loading, error, data } = useQuery(GET_USERS);

  const sendApi = async () => {
    // eslint-disable-next-line no-console
    console.log(data);
  };
  if (loading) return <h1>Loading</h1>;
  if (error) return <h1>{`Error! ${error.message}`}</h1>;

  return <Button onClick={sendApi} />;
};

export default TestApi;
