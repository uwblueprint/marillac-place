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
import LoadingScreen from "../../../ui/screens/LoadingScreen";
import { ADMIN, RELIEF } from "../../../constants/roles";
import { AdminContext } from "../../AdminContext";
import WidgetContainer from "../../../ui/containers/WidgetContainer";
import DropdownInput from "../../../ui/inputs/DropdownInput";
import PasswordInput from "../../../ui/inputs/PasswordInput";
import OrangeButton from "../../../ui/buttons/OrangeButton";

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

  if (loading) {
    return <LoadingScreen />;
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
        width="700px"
        h="350px"
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

        <WidgetContainer
          loading={adminLoginLoading}
          error=""
          width="fit-content"
          height="fit-content"
          paddingX="25px"
          paddingY="25px"
        >
          <Flex flexDir="column">
            <Text textStyle="web.h2">Sign in</Text>
            <Text textStyle="web.b2">Please enter your login information.</Text>
          </Flex>

          <Flex flexDir="column" gap="10px" my="20px">
            <DropdownInput
              size="medium"
              placeholder="Select Role"
              current_value={role}
              update_action={setRole}
              value_options={{ "Administrative Staff": ADMIN, "Relief Staff": RELIEF }}
            />

            <PasswordInput
              size="medium"
              current_value={password}
              update_action={setPassword}
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
