/* Demo Component to show how to run new apis */


import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";

import { Button } from "@chakra-ui/react";

type Role = "User" | "Admin";

type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role
};

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
    console.log(data)
  } 
  if (loading) return <h1>Loading</h1>
  if (error) return <h1>{`Error! ${error.message}`}</h1>

  console.log(data)
  return <Button onClick={sendApi}></Button>

  

};

export default TestApi;
