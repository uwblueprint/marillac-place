import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

import {
  Select,
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

  const [role, setRole] = useState("");
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
          <Select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
            h="49px"
            borderColor="black"
            mb="24px"
            fontSize="18px"
            color="black"
          >
            <option value="" disabled selected hidden style={{ color: "gray" }}>
              Role
            </option>
            <option value="admin_staff">Administrative Staff</option>
            <option value="release_staff">Release Staff</option>
          </Select>
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
