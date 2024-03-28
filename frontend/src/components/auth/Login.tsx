import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

import {
  Button,
  Box,
  Text,
  Input,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";
import { ReactComponent as Logo } from "../../assets/Marillac_Place_Logo.svg";
import { UserType } from "../../types/UserTypes";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!, $userType: UserType!) {
    login(email: $email, password: $password, userType: $userType) {
      id
      firstName
      lastName
      email
      role
      accessToken
    }
  }
`;

const Login = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [login] = useMutation<{ login: AuthenticatedUser }>(LOGIN);

  const onLogInClick = async () => {
    try {
      const user: AuthenticatedUser = await authAPIClient.login(
        email,
        password,
        UserType.Staff,
        login,
      );
      setAuthenticatedUser(user);
      setError("");
    } catch (e: unknown) {
      setError("Wrong email or password. Try again.");
    }
  };

  const onSignUpClick = () => {
    navigate(SIGNUP_PAGE);
  };

  // CHANGE TO RESET_PASSWORD_PAGE
  const onForgotPasswordClick = () => {
    navigate(SIGNUP_PAGE);
  };

  if (authenticatedUser) {
    return <Navigate to={HOME_PAGE} />;
  }

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignContent="center"
      minH="100vh"
    >
      <Box paddingLeft="38px" paddingTop="34px">
        <Logo />
      </Box>

      <Box
        maxWidth="514px"
        height="480px"
        mt="8vh"
        mx="auto"
        padding="48px"
        borderRadius="8px"
        boxShadow="0 5px 15px 1px rgba(0, 0, 0, 0.09)"
      >
        <Text fontSize="38px" fontWeight="bold" mb="8px">
          Sign In
        </Text>
        <Text fontSize="18px" mb="48px">
          Please enter your login information
        </Text>
        <FormControl isInvalid={!!error} alignItems="center">
          <Input
            id="email"
            type="email"
            value={email}
            height="49px"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email or Phone Number"
            borderColor="black"
            borderWidth="2px"
            mb="32px"
            fontSize="18px"
            paddingTop={email ? "14px" : "0"}
          />
          {email !== "" && (
            <Box
              position="absolute"
              top="0"
              left="0"
              paddingLeft="17px"
              paddingTop="2px"
              fontSize="sm"
              color="black"
            >
              Email
            </Box>
          )}

          <Input
            id="password"
            type="password"
            value={password}
            height="49px"
            onChange={(event) => setPassword(event.target.value)}
            borderColor="black"
            borderWidth="2px"
            fontSize="18px"
            placeholder="Password"
          />

          <FormErrorMessage fontSize="18px">{error}</FormErrorMessage>
          <Text
            onClick={onForgotPasswordClick}
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
            onClick={onLogInClick}
            mt="10px"
            paddingTop="15px"
            width="418px"
            height="60px"
            backgroundColor="purple"
            color="white"
            borderRadius="48px"
          >
            <Text fontSize="24px">Sign In</Text>
          </Button>
        </FormControl>
      </Box>
      <Box mx="auto" mt="24px">
        <Text as="span" fontSize="18px">
          Don&apos;t have an account?&nbsp;
        </Text>
        <Text
          as="span"
          fontWeight="bold"
          textDecoration="underline"
          textColor="purple"
          fontSize="18px"
          onClick={onSignUpClick}
          cursor="pointer"
        >
          Join Now
        </Text>
      </Box>
    </Box>
  );
};

export default Login;
