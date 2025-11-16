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
import OrangeButton from "../../../ui/buttons/OrangeButton";
import DropdownInput from "../../../ui/inputs/DropdownInput";
import PasswordInput from "../../../ui/inputs/PasswordInput";
import WidgetContainer from "../../../ui/containers/WidgetContainer";

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
      // TODO: get role from token and store it in admin context
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
      bg="neutral.0"
    >
      <Flex
        width="850px"
        h="400px"
        bg="primary.100"
        borderRadius="8px"
        boxShadow="lg"
        flexDir="row"
        alignItems="center"
        justifyContent="space-around"
        paddingX="16px"
      >
        <img width="30%" src="/assets/logo.png" alt="Marillac Place Logo" />

        <WidgetContainer
          paddingX="24px"
          paddingY="28px"
        >
          <Flex flexDir="column">
            <Text textStyle="web.h2">Sign in</Text>
            <Text textStyle="web.b2">Please enter your login information.</Text>
          </Flex>

          <Flex flexDir="column" gap="8px" marginY="16px">
            <DropdownInput
              current_value={role}
              update_action={setRole}
              size="large"
              placeholder="Role"
              value_options={{
                "Administrative Staff": ADMIN,
                "Relief Staff": RELIEF,
              }}
            />

            <PasswordInput
              current_value={password}
              update_action={setPassword}
              size="large"
              placeholder="Password"
            />

            {error && (
              <Text textStyle="web.b2" fontWeight="600" color="#E30000">
                {error}
              </Text>
            )}
          </Flex>

          <OrangeButton
            label="Sign in"
            action={handleSubmit}
            is_active={false}
          />
        </WidgetContainer>
      </Flex>
    </Flex>
  );
}
