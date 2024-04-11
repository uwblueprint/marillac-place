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

import authAPIClient from "../../APIClients/AuthAPIClient";
import {
  HOME_PAGE,
  SIGNUP_PAGE,
  RESET_PASSWORD_PAGE,
} from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";
import { ReactComponent as Logo } from "../../assets/marillacPlaceLogo.svg";

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
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [login] = useMutation<{ login: AuthenticatedUser }>(LOGIN);

  const onLogInClick = async () => {
    try {
      const user: AuthenticatedUser = await authAPIClient.login(
        email,
        password,
        "STAFF",
        login,
      );
      setAuthenticatedUser(user);
      setError("");
    } catch (e: unknown) {
      setError("Wrong email or password. Try again.");
    }
  };

  if (authenticatedUser) {
    return <Navigate to={HOME_PAGE} />;
  }

  return (
    <Flex
      width="100vw"
      height="100vh"
      flexDirection="column"
      alignContent="center"
      justifyContent="center"
    >
      <Flex position="absolute" top="10px" left="10px">
        <Logo />
      </Flex>

      <Flex
        maxWidth="514px"
        maxHeight="480px"
        mx="auto"
        padding="48px"
        borderRadius="8px"
        boxShadow="lg"
        flexDirection="column"
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
            height="49px"
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
            height="49px"
            borderColor="black"
            fontSize="18px"
          />

          <FormErrorMessage fontSize="18px">{error}</FormErrorMessage>
          <Text
            onClick={() => navigate(RESET_PASSWORD_PAGE)}
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
            paddingTop="15px"
            width="100%"
            height="60px"
            borderRadius="48px"
            onClick={onLogInClick}
          >
            <Text fontSize="24px">Sign In</Text>
          </Button>
        </FormControl>
      </Flex>
      <Flex mx="auto" mt="24px">
        <Text as="span" fontSize="18px">
          Don&apos;t have an account?&nbsp;
        </Text>
        <Text
          as="span"
          fontWeight="bold"
          textDecoration="underline"
          textColor="purple.main"
          fontSize="18px"
          onClick={() => navigate(SIGNUP_PAGE)}
          cursor="pointer"
        >
          Join Now
        </Text>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
