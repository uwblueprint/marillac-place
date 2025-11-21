import React, { useState, useEffect, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Flex, Text, Input, FormControl } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { verifyRole } from "../../../helpers/verifyRole";
import { PARTICIPANT } from "../../../constants/roles";
import { PARTICIPANT_LOGIN } from "../../../gql/loginRequests";
import * as ROUTES from "../../../constants/routes";
import Loading from "../../../ui/screens/LoadingScreen";
import Error from "../../../ui/screens/ErrorScreen";
import { ParticipantContext } from "../../ParticipantContext";

export default function ParticipantsLoginPage() {
  const navigate = useNavigate();
  const participantContext = useContext(ParticipantContext);

  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const [participantLogin, { loading: participantLoginLoading }] = useMutation(PARTICIPANT_LOGIN, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.participantLogin.token);
      if (!participantContext) {
        setError("participant context not found");
        return;
      }
      participantContext.setPid(Number(id));
      navigate(ROUTES.PARTICIPANTS_HOME_PAGE);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    const authenticate = async () => {
      const isAuthenticated = await verifyRole([PARTICIPANT]);
      if (isAuthenticated) {
        setLoggedIn(true);
      }
      setLoading(false);
    };
    authenticate();
  }, []);

  const handleSubmit = () => {
    setError("");
    if (!id || !password) {
      setError("missing required fields");
    } else {
      participantLogin({ variables: { id: Number(id), password } });
    }
  };

  if (loading || participantLoginLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
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
              value={id}
              onChange={(e) => setId(e.target.value)}
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
