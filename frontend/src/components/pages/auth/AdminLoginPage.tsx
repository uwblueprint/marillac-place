import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

import {
  Button,
  Flex,
  Text,
  Input,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";

import { ReactComponent as Logo } from "../../../assets/marillacPlaceLogo.svg";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!, $userType: UserType!) {
    login(email: $email, password: $password, userType: $userType) {
      id
      type
      email
      firstName
      lastName
      accessToken
    }
  }
`;

const LoginPage = (): React.ReactElement => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <Flex
      w="100vw"
      h="100vh"
      flexDir="column"
      alignContent="center"
      justifyContent="center"
    >
      <Flex position="absolute" top="10px" left="10px">
        <Logo />
      </Flex>

      <Flex
        maxW="514px"
        maxH="480px"
        mx="auto"
        p="48px"
        borderRadius="8px"
        boxShadow="lg"
        flexDir="column"
      >
        <Text fontSize="38px" fontWeight="bold" mb="8px">
          Sign In
        </Text>
        <Text fontSize="18px" mb="30px">
          Please enter your login information
        </Text>

        <FormControl isInvalid={!!error} alignItems="center">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            h="49px"
            borderColor="black"
            mb="24px"
            fontSize="18px"
          />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            h="49px"
            borderColor="black"
            fontSize="18px"
          />

          <FormErrorMessage fontSize="18px">{error}</FormErrorMessage>
          <Text
            cursor="pointer"
            fontWeight="bold"
            fontSize="18px"
            textDecoration="underline"
            float="right"
            mt="8px"
          >
            Forgot Password?
          </Text>
          <Button
            variant="primary"
            mt="10px"
            pt="15px"
            w="100%"
            h="60px"
            borderRadius="48px"
          >
            <Text fontSize="24px">Sign In</Text>
          </Button>
        </FormControl>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
