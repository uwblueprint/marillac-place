import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import CryptoJS from "crypto-js";

import {
  Select,
  Button,
  Flex,
  Text,
  Input,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";

import logo from "../../../assets/Marillac-Place-Logo.webp";

const LOGIN = gql`
  mutation Login($encryptedPassword: String!, $role: String!) {
    login(encryptedPassword: $encryptedPassword, role: $role) {
      type
      accessToken
    }
  }
`;

const LoginPage = (): React.ReactElement => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      // Handle successful login, e.g., store token and navigate
      navigate("/dashboard");
    },
    onError: (err) => {
      // Handle login error
      setError(err.message);
    },
  });

  const handleSubmit = () => {
    if (!role || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Encrypt the password
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      "your-secret-key",
    ).toString();

    login({ variables: { role, encryptedPassword } });
  };

  return (
    <Flex
      w="100vw"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      bg="white"
    >
      <Flex
        w="67%"
        maxW="1200px"
        h="55%"
        bg="#E3ECEB"
        borderRadius="8px"
        boxShadow="lg"
        flexDir="row"
        alignItems="center"
        justifyContent="space-around"
        p="20px"
      >
        <Flex w="50%" justifyContent="center">
          <img src={logo} alt="Marillac Place Logo" width="265px" />
        </Flex>

        <Flex
          w="50%"
          maxW="400px"
          // h="65%"
          p="40px"
          borderRadius="8px"
          boxShadow="md"
          bg="white"
          flexDir="column"
        >
          <Text fontSize="32px" fontWeight="bold" mb="4">
            Sign in
          </Text>
          <Text fontSize="16px" mb="6">
            Please enter your login information.
          </Text>

          <FormControl isInvalid={!!error}>
            <Select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role"
              mb="4"
              h="48px"
              borderColor="gray.300"
            >
              <option value="admin_staff">Administrative Staff</option>
              <option value="release_staff">Release Staff</option>
            </Select>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              mb="4"
              h="48px"
              borderColor="gray.300"
            />

            <FormErrorMessage>{error}</FormErrorMessage>
            <Button
              variant="solid"
              colorScheme="orange"
              mt="4"
              w="100%"
              h="50px"
              borderRadius="52px"
              onClick={handleSubmit}
              isLoading={loading}
            >
              Sign in
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
