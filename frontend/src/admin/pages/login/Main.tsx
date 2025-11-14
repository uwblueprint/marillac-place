import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  Select,
  Button,
  Flex,
  Text,
  Input,
  FormControl,
} from "@chakra-ui/react";
import { ADMIN_LOGIN } from "../../../gql/loginRequests";
import { ADMIN_HOME_PAGE } from "../../../constants/routes";
import Loading from "../../../ui/screens/LoadingScreen";
import { ADMIN, RELIEF } from "../../../constants/roles";
import { verifyRole } from "../../../helpers/verifyRole";
import Error from "../../../ui/screens/ErrorScreen";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  const [login, { loading: loginLoading }] = useMutation(ADMIN_LOGIN, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.adminLogin.token);
      // TODO: set role property in admin context
      navigate(ADMIN_HOME_PAGE);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    const authorize = async () => {
      const isStaff = await verifyRole([ADMIN, RELIEF]);
      if (isStaff) {
        setLoggedIn(true);
      }
      setLoading(false);
    };
    authorize();
  }, []);

  function handleSubmit() {
    setError("");
    if (!role || !password) {
      setError("missing fields");
    } else {
      login({ variables: { role, password } });
    }
  }

  if (loading || loginLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  if (loggedIn) {
    return <Navigate to={ADMIN_HOME_PAGE} replace />;
  }

  return (
    <Flex
      w="100vw"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      bg="background.white"
    >
      <Flex
        width="900px"
        h="450px"
        bg="background.header"
        borderRadius="8px"
        boxShadow="lg"
        flexDir="row"
        alignItems="center"
        justifyContent="space-around"
      >
        <Flex width="30%" marginLeft="3vw">
          <img width="100%" src="/assets/logo.png" alt="Marillac Place Logo" />
        </Flex>

        <Flex
          width="400px"
          p="40px"
          borderRadius="8px"
          border="1px"
          borderColor="background.border"
          bg="background.white"
          flexDir="column"
          alignItems="left"
          justifyContent="center"
          gap="20px"
        >
          <Flex flexDir="column">
            <Text textStyle="web.h1">Sign in</Text>

            <Text textStyle="web.b1">Please enter your login information.</Text>
          </Flex>

          <Flex flexDir="column" gap="10px">
            <FormControl>
              <Select
                variant="primary"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role"
              >
                <option value={ADMIN}>Administrative Staff</option>
                <option value={RELIEF}>Relief Staff</option>
              </Select>
            </FormControl>

            <FormControl>
              <Input
                variant="primary"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </FormControl>

            {error && (
              <Text textStyle="web.b2" fontWeight="600" color="#E30000">
                {error}
              </Text>
            )}
          </Flex>

          <Button
            width="100%"
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
}
