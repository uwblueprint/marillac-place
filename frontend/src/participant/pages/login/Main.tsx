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

export default function ParticipantsLoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [pid, setPid] = useState("");
  const [password, setPassword] = useState("");

  const [login, { loading: loginLoading }] = useMutation(PARTICIPANT_LOGIN, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.participantLogin.token);
      // TODO: update pid property in participant context
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
        gap="45px"
        padding="35px 15px"
      >
        <Flex width="75%">
          <img width="100%" src="/assets/logo.png" alt="Marillac Place Logo" />
        </Flex>
        <Flex
          width="100%"
          flexDir="column"
          gap="15px"
          bg="neutral.0"
          padding="25px 15px"
          borderRadius="8px"
          border="1px"
          borderColor="neutral.300"
        >
          <Flex flexDir="column">
            <Text textStyle="mobile.h1">Sign in</Text>

            <Text textStyle="mobile.b1">
              Please enter your login information.
            </Text>
          </Flex>

          <FormControl>
            <Input
              variant="primary"
              type="id"
              value={pid}
              onChange={(e) => setPid(e.target.value)}
              placeholder="ID #"
            />
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
            <Text textStyle="mobile.b2" fontWeight="600" color="#E30000">
              {error}
            </Text>
          )}

          <Button
            width="full"
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
