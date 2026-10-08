import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession, watchSessionExpiry } from "../helpers/session";

// Sends the user to the login page as soon as their session expires. Only
// runs while `enabled`.
export default function useSessionExpiry(
  enabled: boolean,
  loginPage: string
): void {
  const navigate = useNavigate();

  useEffect(() => {
    if (!enabled) return undefined;
    return watchSessionExpiry(() => {
      clearSession();
      navigate(loginPage, { replace: true });
    });
  }, [enabled, loginPage, navigate]);
}
