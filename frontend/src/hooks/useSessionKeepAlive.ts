import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ApolloError, useMutation } from "@apollo/client";
import { REFRESH_SESSION } from "../gql/loginRequests";
import { RefreshResult, startSessionKeepAlive } from "../helpers/session";

// The backend marks "this session is over" errors as UNAUTHENTICATED; anything
// else (network trouble, server errors) is worth retrying later.
export function classifyRefreshError(err: unknown): RefreshResult {
  if (!(err instanceof ApolloError)) throw err;
  const unauthenticated = err.graphQLErrors.some(
    (graphQLError) => graphQLError.extensions?.code === "UNAUTHENTICATED"
  );
  return unauthenticated ? { status: "rejected" } : { status: "failed" };
}

// Keeps the user signed in while they're active, and sends them to the login
// page once their session expires. Only runs while `enabled`.
export default function useSessionKeepAlive(
  enabled: boolean,
  loginPage: string
): void {
  const navigate = useNavigate();
  const [refreshSession] = useMutation(REFRESH_SESSION);

  useEffect(() => {
    if (!enabled) return undefined;

    const refreshToken = async (): Promise<RefreshResult> => {
      try {
        const { data } = await refreshSession();
        return { status: "refreshed", token: data.refreshSession.token };
      } catch (err) {
        return classifyRefreshError(err);
      }
    };

    return startSessionKeepAlive({
      refreshToken,
      onSessionEnded: () => navigate(loginPage, { replace: true }),
    });
  }, [enabled, loginPage, navigate, refreshSession]);
}
