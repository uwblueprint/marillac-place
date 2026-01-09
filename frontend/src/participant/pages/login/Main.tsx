import React, { useState, useEffect, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Flex, Text } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { verifyRole } from "../../../helpers/verifyRole";
import { PARTICIPANT } from "../../../constants/roles";
import { PARTICIPANT_LOGIN } from "../../../gql/loginRequests";
import * as ROUTES from "../../../constants/routes";
import LoadingScreen from "../../../ui/screens/LoadingScreen";
import { ParticipantContext } from "../../ParticipantContext";
import WidgetContainer from "../../../ui/containers/WidgetContainer";
import NumberInput from "../../../ui/inputs/NumberInput";
import PasswordInput from "../../../ui/inputs/PasswordInput";
import OrangeButton from "../../../ui/buttons/OrangeButton";

export default function ParticipantsLoginPage() {
  const navigate = useNavigate();
  const participantContext = useContext(ParticipantContext);

  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [id, setId] = useState<number | null>(null);
  const [password, setPassword] = useState("");

  const [participantLogin, { loading: participantLoginLoading }] = useMutation(
    PARTICIPANT_LOGIN,
    {
      onCompleted: (data) => {
        if (!participantContext) {
          setError("participant context not found");
        } else if (!id) {
          setError("id is missing");
        } else {
          localStorage.setItem("token", data.participantLogin.token);
          navigate(ROUTES.PARTICIPANTS_HOME_PAGE);
        }
      },
      onError: (err: Error) => {
        setError(err.message);
      },
    }
  );

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
      participantLogin({ variables: { pid: id, password } });
    }
  };

  if (loading || participantLoginLoading) {
    return <LoadingScreen />;
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
        paddingTop="50px"
      >
        <Flex width="65%">
          <img width="100%" src="/assets/logo.png" alt="Marillac Place Logo" />
        </Flex>
        <WidgetContainer
          width="fit-content"
          height="fit-content"
          paddingX="25px"
          paddingY="25px"
        >
          <Flex flexDir="column">
            <Text textStyle="mobile.h1">Sign in</Text>
            <Text textStyle="mobile.b1">
              Please enter your login information.
            </Text>
          </Flex>

          <Flex flexDir="column" gap="10px" mt="15px" mb="10px">
            <NumberInput
              placeholder="ID #"
              current_value={id}
              update_action={setId}
              size="medium"
            />

            <PasswordInput
              placeholder="Password"
              current_value={password}
              update_action={setPassword}
              size="medium"
            />
          </Flex>

          {error && (
            <Text textStyle="mobile.b1" fontWeight="500" color="#E30000" mt="5px">
              {error}
            </Text>
          )}

          <Flex mt="15px">  
            <OrangeButton
              label="Sign in"
              action={handleSubmit}
              is_active={false}
            />
          </Flex>
        </WidgetContainer>
      </Flex>
    </Flex>
  );
}
