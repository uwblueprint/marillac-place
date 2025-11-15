import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Flex, Text, Input, FormControl } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import * as ROUTES from "../../../constants/routes";
import Loading from "../../../ui/screens/LoadingScreen";
import { PARTICIPANT_LOGIN } from "../../../gql/loginRequests";
import Error from "../../../ui/screens/ErrorScreen";
import { verifyRole } from "../../../helpers/verifyRole";
import { PARTICIPANT } from "../../../constants/roles";
import WidgetContainer from "../../../ui/containers/WidgetContainer";
import PasswordInput from "../../../ui/inputs/PasswordInput";
import NumberInput from "../../../ui/inputs/NumberInput";
import OrangeButton from "../../../ui/buttons/OrangeButton";

export default function ParticipantsLoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [pid, setPid] = useState<number | undefined>(undefined);
  const [password, setPassword] = useState("");

  const [login, { loading: loginLoading }] = useMutation(PARTICIPANT_LOGIN, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.participantLogin.token);
      // TODO: get pid from token and store it in participant context
      navigate(ROUTES.PARTICIPANTS_HOME_PAGE);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    const authorize = async () => {
      const isParticipant = await verifyRole([PARTICIPANT]);
      if (isParticipant) {
        setLoggedIn(true);
      }
      setLoading(false);
    };
    authorize();
  }, []);

  const handleSubmit = () => {
    setError("");
    if (!pid || !password) {
      setError("missing fields");
    } else {
      login({ variables: { pid: Number(pid), password } });
    }
  };

  if (loading || loginLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  if (loggedIn) {
    return <Navigate to={ROUTES.PARTICIPANTS_HOME_PAGE} replace />;
  }

  return (
    <Flex
      w="100vw"
      h="100vh"
      alignItems="flex-start"
      justifyContent="center"
      bg="primary.100"
    >
      <Flex
        width="350px"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        gap="25px"
        paddingTop="50px"
      >
        <img width="50%" src="/assets/logo.png" alt="Marillac Place Logo" />
        <WidgetContainer
          paddingX="20px"
          paddingY="20px"
        >
          <Flex flexDir="column">
            <Text textStyle="mobile.h2">Sign in</Text>
            <Text textStyle="mobile.b2">
              Please enter your login information.
            </Text>
          </Flex>

          <Flex flexDir="column" gap="4px" marginY="8px">
            <NumberInput
              placeholder="ID #"
              current_value={pid}
              update_action={setPid}
              size="medium"
            />

            <PasswordInput
              current_value={password}
              update_action={setPassword}
              size="medium"
              placeholder="Password"
            />

            {/* TODO: move error message closer to sign in button */}
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
};
