import React, { useState, useEffect } from "react";
import {Navigate, useNavigate } from "react-router-dom";
import {
  Button,
  Flex,
  Text,
  Input,
  FormControl,
} from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import hasRole from "../../../utils/hasRole";
import { PARTICIPANT_LOGIN } from "../../../gql/mutations";
import * as ROUTES from "../../../constants/routes";
import Loading from "../../../components/Loading";

const ParticipantsLoginPage = (): React.ReactElement => {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [checkLoggedIn, setCheckLoggedIn] = useState(false);

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [login, { loading }] = useMutation(PARTICIPANT_LOGIN, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.participantLogin.token);
      navigate(ROUTES.PARTICIPANTS_HOME_PAGE);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    const tokenCheck = async () => {
      const isParticipant = await hasRole("participant");
      if (isParticipant) {
        setLoggedIn(true);
      }
      setCheckLoggedIn(true);
    };
    tokenCheck();
  }, []);

  const handleSubmit = () => {
    setError("");

    if (!id || !password) {
      setError("Missing fields");
    } else {
      login({ variables: { id, password } });
    }
  };

  if (!checkLoggedIn) {
    return <Loading />
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
        padding="45px 15px"
      >
        <Flex width="75%">
          <img
            width="100%"
            src={ process.env.REACT_APP_FRONTEND_URL + "/assets/logo.png" }
            alt="Marillac Place Logo"
          />
        </Flex>
        <Flex
          width="100%"
          flexDir="column"
          gap="10px"
          bg="neutral.0"
          padding="25px 15px"
          borderRadius="8px"
          border="1px"
          borderColor="neutral.300"
        >
          <Flex flexDir="column">
            <Text textStyle="mobile.h1">
              Sign in
            </Text>

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

          { error && <Text textStyle="mobile.b2" fontWeight="600" color="#E30000">{error}</Text> }

          <Button
            variant="primaryFilled"
            borderRadius="full"
            fontWeight="700"
            fontSize="16px"
            onClick={handleSubmit}
            isLoading={false}
          >
            Sign in
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ParticipantsLoginPage;