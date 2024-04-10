import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { gql, useMutation } from "@apollo/client";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";
import { UserType } from "../../types/UserTypes";

type GoogleResponse = GoogleLoginResponse | GoogleLoginResponseOffline;

type GoogleErrorResponse = {
  error: string;
  details: string;
};

const LOGIN = gql`
  mutation Login($email: String!, $password: String!, $userType: UserType!) {
    login(email: $email, password: $password, userType: $userType) {
      id
      firstName
      lastName
      email
      role
      accessToken
    }
  }
`;

const LOGIN_WITH_GOOGLE = gql`
  mutation LoginWithGoogle($idToken: String!) {
    loginWithGoogle(idToken: $idToken) {
      id
      firstName
      lastName
      email
      role
      accessToken
    }
  }
`;

const LoginPage = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [login] = useMutation<{ login: AuthenticatedUser }>(LOGIN);
  const [loginWithGoogle] = useMutation<{ loginWithGoogle: AuthenticatedUser }>(
    LOGIN_WITH_GOOGLE,
  );

  const onLogInClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.login(
      email,
      password,
      UserType.Staff,
      login,
    );
    setAuthenticatedUser(user);
  };

  const onSignUpClick = () => {
    navigate(SIGNUP_PAGE);
  };

  const onGoogleLoginSuccess = async (idToken: string) => {
    const user: AuthenticatedUser = await authAPIClient.loginWithGoogle(
      idToken,
      loginWithGoogle,
    );
    setAuthenticatedUser(user);
  };

  if (authenticatedUser) {
    return <Navigate to={HOME_PAGE} />;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Login</h1>
      <form>
        <div>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="username@domain.com"
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="password"
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onLogInClick}
          >
            Log In
          </button>
        </div>
        <GoogleLogin
          clientId={process.env.REACT_APP_OAUTH_CLIENT_ID || ""}
          buttonText="Login with Google"
          onSuccess={(response: GoogleResponse): void => {
            if ("tokenId" in response) {
              onGoogleLoginSuccess(response.tokenId);
            } else {
              // eslint-disable-next-line no-alert
              window.alert(response);
            }
          }}
          onFailure={(error: GoogleErrorResponse) =>
            // eslint-disable-next-line no-alert
            window.alert(JSON.stringify(error))
          }
        />
      </form>
      <div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={onSignUpClick}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
