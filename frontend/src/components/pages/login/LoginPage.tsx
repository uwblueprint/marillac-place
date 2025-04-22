import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";

import {
  Select,
  Button,
  Flex,
  Text,
  Input,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";

import { LOGIN } from "../../../gql/mutations";

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  const payload = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
  const currentTime = Date.now() / 1000; // Current time in seconds
  return payload.exp > currentTime; // Check if the token is expired
};

const LoginPage = (): React.ReactElement => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  const [roleError, setRoleError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      // Handle successful login, e.g., store token and navigate

      localStorage.setItem("type", data.login.type);
      localStorage.setItem("token", data.login.accessToken);
      navigate("/");
    },
    onError: (err) => {
      // Handle login error
      setPasswordError(err.message);
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isTokenValid(token)) {
      navigate("/");
    } else {
      const tokenType = localStorage.getItem("type");
      // default role dropdown based on last login type
      if (tokenType === "admin_staff") {
        setRole("admin_staff");
      } else if (tokenType === "release_staff") {
        setRole("release_staff");
      }
    }
    setRole(""); // delete this line
  }, [navigate]);

  const handleSubmit = () => {
    setRoleError("");
    setPasswordError("");

    if (!role) {
      setRoleError("Please fill in role.");
    } else if (!password) {
      setPasswordError("Please fill in password");
    } else {
      login({ variables: { role, encryptedPassword: password } });
    }
  };

  return (
    <Flex
      w="100vw"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      bg="neutral.0"
    >
      <Flex
        w="65%"
        h="60%"
        bg="primary.100"
        borderRadius="8px"
        boxShadow="lg"
        flexDir="row"
        alignItems="center"
        justifyContent="space-around"
      >
        <Flex width="25%" marginLeft="3vw">
          <img
            width="100%"
            src={ process.env.REACT_APP_FRONTEND_URL + "/assets/logo.png" }
            alt="Marillac Place Logo"
          />
        </Flex>

        <Flex
          width="45%"
          p="40px"
          borderRadius="8px"
          border="1px"
          borderColor="neutral.300"
          bg="neutral.0"
          flexDir="column"
          alignItems="left"
          justifyContent="center"
          gap="20px"
        >
          <Flex flexDir="column">
            <Text textStyle="web.h1">
              Sign in
            </Text>

            <Text textStyle="web.b1">
              Please enter your login information.
            </Text>
          </Flex>

          <Flex flexDir="column" gap="10px">
            <FormControl isInvalid={roleError !== ""}>
              <Select
                variant="primary"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role"
              >
                <option value="admin_staff">Administrative Staff</option>
                <option value="release_staff">Release Staff</option>
              </Select>
              <FormErrorMessage>{roleError}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={passwordError !== ""}>
              <Input
                variant="primary"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <FormErrorMessage>{passwordError}</FormErrorMessage>
            </FormControl>
          </Flex>

          <Button
            variant="primaryFilled"
            borderRadius="full"
            fontWeight="700"
            fontSize="16px"
            onClick={handleSubmit}
            isLoading={loading}
          >
            Sign in
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
