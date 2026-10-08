import { useEffect } from "react";
import { endSession, watchSessionExpiry } from "../helpers/session";

// Signs the user out as soon as their session expires. Only runs while
// `enabled`.
export default function useSessionExpiry(
  enabled: boolean,
  loginPage: string
): void {
  useEffect(() => {
    if (!enabled) return undefined;
    return watchSessionExpiry(() => endSession(loginPage));
  }, [enabled, loginPage]);
}
