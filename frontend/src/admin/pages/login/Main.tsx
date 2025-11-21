import React, { useState, useEffect, useContext } from "react";
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
import { verifyRole } from "../../../helpers/verifyRole";
import * as ROUTES from "../../../constants/routes";
import Error from "../../../ui/screens/ErrorScreen";
import Loading from "../../../ui/screens/LoadingScreen";
import { ADMIN, RELIEF } from "../../../constants/roles";
import { AdminContext } from "../../AdminContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const adminContext = useContext(AdminContext);

  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  const [adminLogin, { loading: adminLoginLoading }] = useMutation(ADMIN_LOGIN, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.adminLogin.token);
      if (!adminContext) {
        setError("admin context not found");
        return;
      }
      adminContext.setRole(role);
      navigate(ROUTES.ADMIN_HOME_PAGE);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    const authenticate = async () => {
      const isAuthenticated = await verifyRole([ADMIN, RELIEF]);
      if (isAuthenticated) {
        setLoggedIn(true);
      }
      setLoading(false);
    };
    authenticate();
  }, []);

  const handleSubmit = () => {
    setError("");
    if (!role || !password) {
      setError("missing required fields");
    } else {
      adminLogin({ variables: { role, password } });
    }
  };

  if (loading || adminLoginLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (loggedIn) {
    return <Navigate to={ROUTES.ADMIN_HOME_PAGE} replace />;
  }

  return (
    <Flex
      w="100vw"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      bg="neutral.0"
    >
      <Flex
        width="900px"
        h="450px"
        bg="primary.100"
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
          borderColor="neutral.300"
          bg="neutral.0"
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
                <option value="admin">Administrative Staff</option>
                <option value="relief">Relief Staff</option>
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
