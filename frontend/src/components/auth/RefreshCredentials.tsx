import React, { useContext } from "react";
import { gql, useMutation } from "@apollo/client";

import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const REFRESH = gql`
  mutation Refresh {
    refresh
  }
`;

const RefreshCredentials = (): React.ReactElement => {
  const { setAuthenticatedUser } = useContext(AuthContext);

  const [refresh] = useMutation<{ refresh: string }>(REFRESH);

  const onRefreshClick = async () => {
    const success = await authAPIClient.refresh(refresh);
    if (!success) {
      setAuthenticatedUser(null);
    }
  };

  return (
    <button type="button" className="btn btn-primary" onClick={onRefreshClick}>
      Refresh Credentials
    </button>
  );
};

export default RefreshCredentials;
